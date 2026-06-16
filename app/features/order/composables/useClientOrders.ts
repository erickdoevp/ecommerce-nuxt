import { createClientApi } from '~/api/client-api'
import type { MyOrder, MyOrdersPage } from '~/features/order/types/my-order'

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
