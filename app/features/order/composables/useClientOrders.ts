import { createClientApi } from '~/api/client-api'
import type { MyOrder, MyOrdersPage } from '~/features/order/types/my-order'
import { MOCK_ORDERS } from '~/features/order/mocks/orders.mock'

// Datos dummy mientras no haya pedidos reales. Cambia a false para usar la API.
const USE_MOCK_ORDERS = true

const PAGE_SIZE = 10

// Estado compartido (singleton): pedidos del usuario autenticado, paginados.
const orders = ref<MyOrder[]>([])
const isLoading = ref(false)
const page = ref(1) // 1-based para UPagination; la API es 0-based.
const totalElements = ref(0)
const totalPages = ref(0)

export const useClientOrders = () => {
  async function fetchOrders(targetPage = page.value): Promise<void> {
    isLoading.value = true
    try {
      if (USE_MOCK_ORDERS) {
        await new Promise(resolve => setTimeout(resolve, 300))
        const start = (targetPage - 1) * PAGE_SIZE
        orders.value = MOCK_ORDERS.slice(start, start + PAGE_SIZE)
        totalElements.value = MOCK_ORDERS.length
        totalPages.value = Math.ceil(MOCK_ORDERS.length / PAGE_SIZE)
        page.value = targetPage
        return
      }
      const api = createClientApi()
      const data = await api<MyOrdersPage>('/orders/me', {
        params: { page: targetPage - 1, size: PAGE_SIZE, sort: 'createdAt,desc' }
      })
      orders.value = data.content
      totalElements.value = data.totalElements
      totalPages.value = data.totalPages
      page.value = targetPage
    } finally {
      isLoading.value = false
    }
  }

  return {
    orders,
    isLoading,
    page,
    totalElements,
    totalPages,
    pageSize: PAGE_SIZE,
    fetchOrders
  }
}
