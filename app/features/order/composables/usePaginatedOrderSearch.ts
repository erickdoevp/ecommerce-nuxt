import { createAdminApi } from '~/api/admin-api'
import type { OrderSearchQuery, OrderSearchResponse } from '../types/order-search'

export const usePaginatedOrderSearch = () => {
  const isLoading = ref(false)
  const response = ref<OrderSearchResponse | null>(null)

  async function searchOrders(query: OrderSearchQuery) {
    try {
      isLoading.value = true
      const api = createAdminApi()
      const data = await api<OrderSearchResponse>('/orders', {
        method: 'GET',
        params: {
          page: query.page,
          size: query.size,
          ...(query.sort ? { sort: query.sort } : {}),
          ...(query.status ? { status: query.status } : {}),
          ...(query.orderNumber ? { orderNumber: query.orderNumber } : {}),
          ...(query.userId ? { userId: query.userId } : {}),
          ...(query.dateFrom ? { dateFrom: query.dateFrom } : {}),
          ...(query.dateTo ? { dateTo: query.dateTo } : {})
        }
      })
      response.value = data
    } catch (error) {
      console.error(error)
    } finally {
      isLoading.value = false
    }
  }

  return {
    searchOrders,
    isLoading,
    orders: computed(() => response.value?.content ?? []),
    totalElements: computed(() => response.value?.page.totalElements ?? 0),
    totalPages: computed(() => response.value?.page.totalPages ?? 0)
  }
}
