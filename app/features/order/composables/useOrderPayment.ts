import { createAdminApi } from '~/api/admin-api'
import type { PaymentDetail } from '../types/payment'

export const useOrderPayment = () => {
  const isLoading = ref(false)
  const payment = ref<PaymentDetail | null>(null)

  async function fetchPayment(orderId: string) {
    isLoading.value = true
    payment.value = null
    try {
      const api = createAdminApi()
      payment.value = await api<PaymentDetail>(`/payments/admin/order/${orderId}`, { method: 'GET' })
    } catch (error) {
      console.error(error)
      payment.value = null
    } finally {
      isLoading.value = false
    }
  }

  return { isLoading, payment, fetchPayment }
}
