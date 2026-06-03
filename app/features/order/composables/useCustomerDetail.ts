import { createAdminApi } from '~/api/admin-api'
import type { CustomerDetail } from '../types/customer'

export const useCustomerDetail = () => {
  const isLoading = ref(false)
  const customer = ref<CustomerDetail | null>(null)

  async function fetchCustomer(id: string) {
    isLoading.value = true
    customer.value = null
    try {
      const api = createAdminApi()
      customer.value = await api<CustomerDetail>(`/users/${id}`, { method: 'GET' })
    } catch (error) {
      console.error(error)
      customer.value = null
    } finally {
      isLoading.value = false
    }
  }

  return { isLoading, customer, fetchCustomer }
}
