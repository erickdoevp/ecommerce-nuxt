import { createClientApi } from '~/api/client-api'
import type { AddressResponse } from '~/features/address/types/address'

// Estado compartido (singleton): la lista es plana, no paginada.
const addresses = ref<AddressResponse[]>([])
const isLoading = ref(false)

export const useClientAddresses = () => {
  async function fetchAddresses(): Promise<void> {
    const api = createClientApi()
    isLoading.value = true
    try {
      addresses.value = await api<AddressResponse[]>('/addresses')
    } finally {
      isLoading.value = false
    }
  }

  return {
    addresses,
    isLoading,
    fetchAddresses
  }
}
