import { createClientApi } from '~/api/client-api'
import type { MyOrder } from '~/features/order/types/my-order'
import { findMockOrder } from '~/features/order/mocks/orders.mock'

// Datos dummy mientras no haya pedidos reales. Cambia a false para usar la API.
const USE_MOCK_ORDERS = true

// Detalle de una orden propia: GET /orders/me/{id}. No es singleton; cada
// slideover mantiene su propio estado de carga.
export const useClientOrderDetail = () => {
  const order = ref<MyOrder | null>(null)
  const isLoading = ref(false)

  async function fetchOrder(id: string): Promise<void> {
    isLoading.value = true
    order.value = null
    try {
      if (USE_MOCK_ORDERS) {
        await new Promise(resolve => setTimeout(resolve, 300))
        order.value = findMockOrder(id)
        return
      }
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
