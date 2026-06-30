import { createClientApi } from '~/api/client-api'
import { createPublicApi } from '~/api/public-api'
import { useClientAuthStore } from '~/features/auth/store/client-auth'
import { extractApiError } from '~/utils/api-error'
import type {
  CartItemAddRequest,
  CartItemUpdateRequest,
  CartResponse
} from '../types/cart'

// Clave del guestToken del invitado en localStorage.
const GUEST_TOKEN_KEY = 'cart_guest_token'

// Estado compartido (singleton a nivel de módulo): un único carrito para toda
// la app. El composable enruta cada operación a /cart (usuario con JWT) o a
// /public/cart/{guestToken} (invitado) según haya sesión, pero el estado
// expuesto es siempre el mismo CartResponseDto.
const cart = ref<CartResponse | null>(null)
const isLoading = ref(false)
const error = ref<string | null>(null)
// Apertura del slideover del carrito, compartida (el header lo abre, el
// CartSlideover lo consume con v-model).
const isOpen = ref(false)

// El guestToken solo vive en el cliente (localStorage). En SSR no existe.
function readGuestToken(): string | null {
  return import.meta.client ? localStorage.getItem(GUEST_TOKEN_KEY) : null
}
function writeGuestToken(token: string): void {
  if (import.meta.client) localStorage.setItem(GUEST_TOKEN_KEY, token)
}
function clearGuestToken(): void {
  if (import.meta.client) localStorage.removeItem(GUEST_TOKEN_KEY)
}

export const useCart = () => {
  const auth = useClientAuthStore()

  const items = computed(() => cart.value?.items ?? [])
  const itemCount = computed(() => cart.value?.itemCount ?? 0)
  const subtotal = computed(() => cart.value?.subtotal ?? 0)
  const isEmpty = computed(() => items.value.length === 0)

  // Envuelve una operación que devuelve el carrito: centraliza loading,
  // limpieza de error y la asignación del resultado al estado compartido.
  async function run(
    fn: () => Promise<CartResponse>
  ): Promise<CartResponse | undefined> {
    isLoading.value = true
    error.value = null
    try {
      cart.value = await fn()
      return cart.value
    } catch (err) {
      // El backend distingue casos en el código: 400 stock insuficiente,
      // 422 variante inactiva, 404 no encontrado, 403 no es de tu carrito.
      // El texto llega en `message`; lo exponemos en `error` para la UI.
      error.value = extractApiError(err)
      return undefined
    } finally {
      isLoading.value = false
    }
  }

  // Asegura que el invitado tenga un carrito creado y devuelve su guestToken.
  // Crea uno (POST /public/cart) la primera vez y lo persiste en localStorage.
  async function ensureGuestToken(): Promise<string> {
    const existing = readGuestToken()
    if (existing) return existing

    const api = createPublicApi()
    const created = await api<CartResponse>('/public/cart', { method: 'POST' })
    const token = created.guestToken!
    writeGuestToken(token)
    cart.value = created
    return token
  }

  // Carga el carrito actual. Usuario logueado: GET /cart (lo crea vacío si no
  // existe). Invitado: GET /public/cart/{token} solo si ya hay token; si el
  // token quedó inválido (p. ej. MERGED → 404) lo descarta.
  async function fetchCart(): Promise<CartResponse | undefined> {
    if (auth.isAuthenticated) {
      const api = createClientApi()
      return run(() => api<CartResponse>('/cart', { method: 'GET' }, { silent: true }))
    }

    const token = readGuestToken()
    if (!token) {
      cart.value = null
      return undefined
    }

    const api = createPublicApi()
    isLoading.value = true
    error.value = null
    try {
      cart.value = await api<CartResponse>(`/public/cart/${token}`, { method: 'GET' })
      return cart.value
    } catch (err) {
      // Token inexistente o ya no ACTIVE: lo limpiamos para empezar de cero.
      clearGuestToken()
      cart.value = null
      error.value = extractApiError(err)
      return undefined
    } finally {
      isLoading.value = false
    }
  }

  // Agrega un item por variante (talla+color). Si la variante ya estaba,
  // el backend suma a la cantidad existente.
  async function addItem(variantId: string, quantity = 1): Promise<CartResponse | undefined> {
    const body: CartItemAddRequest = { variantId, quantity }

    if (auth.isAuthenticated) {
      const api = createClientApi()
      return run(() => api<CartResponse>('/cart/items', { method: 'POST', body }, { silent: true }))
    }

    return run(async () => {
      const token = await ensureGuestToken()
      const api = createPublicApi()
      return api<CartResponse>(`/public/cart/${token}/items`, { method: 'POST', body })
    })
  }

  // Cambia la cantidad de un item. quantity = 0 lo elimina.
  async function updateItem(itemId: string, quantity: number): Promise<CartResponse | undefined> {
    const body: CartItemUpdateRequest = { quantity }

    if (auth.isAuthenticated) {
      const api = createClientApi()
      return run(() => api<CartResponse>(`/cart/items/${itemId}`, { method: 'PATCH', body }, { silent: true }))
    }

    const token = readGuestToken()
    if (!token) return undefined
    const api = createPublicApi()
    return run(() => api<CartResponse>(`/public/cart/${token}/items/${itemId}`, { method: 'PATCH', body }))
  }

  // Quita un item del carrito.
  async function removeItem(itemId: string): Promise<CartResponse | undefined> {
    if (auth.isAuthenticated) {
      const api = createClientApi()
      return run(() => api<CartResponse>(`/cart/items/${itemId}`, { method: 'DELETE' }, { silent: true }))
    }

    const token = readGuestToken()
    if (!token) return undefined
    const api = createPublicApi()
    return run(() => api<CartResponse>(`/public/cart/${token}/items/${itemId}`, { method: 'DELETE' }))
  }

  // Vacía el carrito (no lo borra). Devuelve el carrito sin items.
  async function clear(): Promise<CartResponse | undefined> {
    if (auth.isAuthenticated) {
      const api = createClientApi()
      return run(() => api<CartResponse>('/cart', { method: 'DELETE' }, { silent: true }))
    }

    const token = readGuestToken()
    if (!token) return undefined
    const api = createPublicApi()
    return run(() => api<CartResponse>(`/public/cart/${token}`, { method: 'DELETE' }))
  }

  // Fusiona el carrito de invitado en el del usuario. Llamar TRAS iniciar
  // sesión: POST /cart/merge?guestToken=XXX. El token local ya no se reutiliza
  // pase lo que pase; si no había token (o ya estaba MERGED → 404) cargamos
  // igual el carrito del usuario.
  async function mergeGuestCart(): Promise<CartResponse | undefined> {
    const token = readGuestToken()
    clearGuestToken()
    if (!token) return fetchCart()

    const api = createClientApi()
    isLoading.value = true
    error.value = null
    try {
      cart.value = await api<CartResponse>(
        '/cart/merge',
        { method: 'POST', params: { guestToken: token } },
        { silent: true }
      )
      return cart.value
    } catch (err) {
      error.value = extractApiError(err)
      return fetchCart()
    } finally {
      isLoading.value = false
    }
  }

  function openCart(): void {
    isOpen.value = true
  }
  function closeCart(): void {
    isOpen.value = false
  }

  return {
    // estado
    cart,
    items,
    itemCount,
    subtotal,
    isEmpty,
    isLoading,
    error,
    isOpen,
    // acciones
    fetchCart,
    addItem,
    updateItem,
    removeItem,
    clear,
    mergeGuestCart,
    openCart,
    closeCart
  }
}
