import { createClientApi } from '~/api/client-api'
import type { MyOrder } from '~/features/order/types/my-order'

// Detalle de una orden propia: GET /orders/me/{id}. No es singleton; cada
// slideover mantiene su propio estado de carga.
export const useClientOrderDetail = () => {
  const order = ref<MyOrder | null>(null)
  const isLoading = ref(false)

  async function fetchOrder(id: string): Promise<void> {
    isLoading.value = true
    order.value = null
    try {
      const api = createClientApi()
      order.value = await api<MyOrder>(`/orders/me/${id}`)
    } catch {
      // createClientApi ya muestra el toast (404 / 403).
      order.value = null
    } finally {
      isLoading.value = false
    }
  }

  return { order, isLoading, fetchOrder }
}
