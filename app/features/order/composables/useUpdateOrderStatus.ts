import { createAdminApi } from '~/api/admin-api'
import type { OrderContent, OrderStatus } from '../types/order-search'

export const useUpdateOrderStatus = () => {
  const isUpdating = ref(false)

  async function updateStatus(id: string, status: OrderStatus, adminNotes?: string) {
    isUpdating.value = true
    try {
      const api = createAdminApi()
      return await api<OrderContent>(`/orders/${id}/status`, {
        method: 'PATCH',
        body: {
          status,
          ...(adminNotes ? { adminNotes } : {})
        }
      })
    } finally {
      isUpdating.value = false
    }
  }

  return { isUpdating, updateStatus }
}
