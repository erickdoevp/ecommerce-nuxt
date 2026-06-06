import { createAdminApi } from '~/api/admin-api'
import type { InventoryMovementQuery, InventoryMovementResponse } from '../types/inventory-movement'

export const usePaginatedInventoryMovements = () => {
  const isLoading = ref(false)
  const error = ref('')
  const response = ref<InventoryMovementResponse | null>(null)

  async function searchMovements(query: InventoryMovementQuery) {
    try {
      isLoading.value = true
      const api = createAdminApi()
      response.value = await api<InventoryMovementResponse>('/inventory/movements', {
        method: 'GET',
        query: {
          page: query.page,
          size: query.size,
          ...(query.sort ? { sort: query.sort } : {}),
          ...(query.variantId ? { variantId: query.variantId } : {}),
          ...(query.type ? { type: query.type } : {}),
          ...(query.orderId ? { orderId: query.orderId } : {}),
          ...(query.dateFrom ? { dateFrom: query.dateFrom } : {}),
          ...(query.dateTo ? { dateTo: query.dateTo } : {})
        }
      })
    } catch (err) {
      error.value = extractApiError(err, 'Error al cargar los movimientos de inventario')
    } finally {
      isLoading.value = false
    }
  }

  return {
    searchMovements,
    isLoading,
    error,
    movements: computed(() => response.value?.content ?? []),
    totalElements: computed(() => response.value?.page.totalElements ?? 0),
    totalPages: computed(() => response.value?.page.totalPages ?? 0)
  }
}
