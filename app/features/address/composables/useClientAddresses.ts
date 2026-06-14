import { createClientApi } from '~/api/client-api'
import type {
  AddressResponse,
  AddressRequest,
  PostalCodeResponse
} from '~/features/address/types/address'

// Estado compartido (singleton): la lista es plana, no paginada.
const addresses = ref<AddressResponse[]>([])
const isLoading = ref(false)
const isSaving = ref(false)
// Borrado / marcar principal (acciones desde la tarjeta + su modal de confirmación).
const isProcessing = ref(false)

export const useClientAddresses = () => {
  const toast = useToast()

  async function fetchAddresses(): Promise<void> {
    const api = createClientApi()
    isLoading.value = true
    try {
      addresses.value = await api<AddressResponse[]>('/addresses')
    } finally {
      isLoading.value = false
    }
  }

  async function createAddress(body: AddressRequest): Promise<boolean> {
    const api = createClientApi()
    isSaving.value = true
    try {
      await api<AddressResponse>('/addresses', { method: 'POST', body })
      // Re-fetch: si isDefault=true el backend desmarca las demás, así que la
      // lista local solo queda consistente recargándola.
      await fetchAddresses()
      toast.add({ title: 'Dirección guardada', color: 'success', icon: 'i-lucide-check-circle' })
      return true
    } catch {
      // createClientApi ya muestra el toast de error.
      return false
    } finally {
      isSaving.value = false
    }
  }

  async function updateAddress(id: string, body: AddressRequest): Promise<boolean> {
    const api = createClientApi()
    console.log('Updating address with ID:', id, 'and data:', JSON.parse(JSON.stringify(body)))
    isSaving.value = true
    try {
      await api<AddressResponse>(`/addresses/${id}`, { method: 'PUT', body })
      await fetchAddresses()
      toast.add({ title: 'Dirección actualizada', color: 'success', icon: 'i-lucide-check-circle' })
      return true
    } catch {
      return false
    } finally {
      isSaving.value = false
    }
  }

  // Best-effort: silenciamos el toast porque un 404 (CP no encontrado) es normal.
  async function lookupPostalCode(cp: string): Promise<PostalCodeResponse | null> {
    const api = createClientApi()
    try {
      return await api<PostalCodeResponse>(`/addresses/postal-codes/${cp}`, undefined, { silent: true })
    } catch {
      return null
    }
  }

  async function deleteAddress(id: string): Promise<boolean> {
    const api = createClientApi()
    isProcessing.value = true
    try {
      await api(`/addresses/${id}`, { method: 'DELETE' })
      await fetchAddresses()
      toast.add({ title: 'Dirección eliminada', color: 'success', icon: 'i-lucide-check-circle' })
      return true
    } catch {
      return false
    } finally {
      isProcessing.value = false
    }
  }

  async function setDefaultAddress(id: string): Promise<boolean> {
    const api = createClientApi()
    isProcessing.value = true
    try {
      await api(`/addresses/${id}/default`, { method: 'PATCH' })
      // Re-fetch: el backend desmarca la principal anterior.
      await fetchAddresses()
      toast.add({ title: 'Dirección principal actualizada', color: 'success', icon: 'i-lucide-check-circle' })
      return true
    } catch {
      return false
    } finally {
      isProcessing.value = false
    }
  }

  return {
    addresses,
    isLoading,
    isSaving,
    isProcessing,
    fetchAddresses,
    createAddress,
    updateAddress,
    lookupPostalCode,
    deleteAddress,
    setDefaultAddress
  }
}
