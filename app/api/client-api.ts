import { useClientAuthStore } from '~/features/auth/store/client-auth'
import type { SignInResponse } from '~/features/auth/types/auth'
import { extractApiError } from '~/utils/api-error'

const API_BASE = 'https://ecommerce-13d7.onrender.com/api/v1'

// Single-flight: aunque varias peticiones reciban 401 a la vez, solo se dispara
// UNA renovación. Si dispararamos varias con el mismo refresh, el backend lo
// detectaría como reuso (token ya rotado) y cerraría todas las sesiones.
let refreshPromise: Promise<boolean> | null = null

async function runRefresh(): Promise<boolean> {
  const auth = useClientAuthStore()
  if (!auth.refreshToken) return false
  try {
    const data = await $fetch<SignInResponse>(`${API_BASE}/auth/refresh`, {
      method: 'POST',
      body: { refreshToken: auth.refreshToken }
    })
    // Siempre reemplaza AMBOS tokens: el refresh viejo ya quedó revocado.
    auth.setSession(data.accessToken, data.refreshToken)
    return true
  } catch {
    // 401 en /refresh = sesión muerta. Limpia y no reintentes.
    auth.clearSession()
    return false
  }
}

export function refreshClientSession(): Promise<boolean> {
  if (!refreshPromise) {
    refreshPromise = runRefresh().finally(() => {
      refreshPromise = null
    })
  }
  return refreshPromise
}

export function createClientApi() {
  const auth = useClientAuthStore()
  const toast = useToast()

  const instance = $fetch.create({
    baseURL: API_BASE,
    onRequest({ options }) {
      if (auth.token) {
        options.headers = new Headers(options.headers)
        options.headers.set('Authorization', `Bearer ${auth.token}`)
      }
    }
  })

  return async function clientApi<T>(
    request: string,
    options?: Parameters<typeof instance>[1],
    config?: { silent?: boolean }
  ): Promise<T> {
    try {
      return await instance<T>(request, options)
    } catch (err) {
      const status = (err as { response?: { status?: number } })?.response?.status

      if (status === 401) {
        const refreshed = await refreshClientSession()
        // Reintenta el request original una sola vez con el access nuevo
        // (onRequest vuelve a leer auth.token, ya actualizado).
        if (refreshed) return await instance<T>(request, options)
        await navigateTo('/sign-in')
      } else if (!config?.silent) {
        toast.add({
          title: 'Error',
          description: extractApiError(err),
          color: 'error',
          icon: 'i-lucide-circle-alert'
        })
      }
      throw err
    }
  }
}
