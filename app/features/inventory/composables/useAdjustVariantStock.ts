import { createAdminApi } from '~/api/admin-api'
import type { VariantInventoryDetail } from '../types/variant-inventory-detail'

export const useAdjustVariantStock = () => {
  const isSaving = ref(false)
  const error = ref('')

  async function adjustStockDelta(variantId: string, payload: { delta: number, reason?: string }) {
    try {
      isSaving.value = true
      error.value = ''
      const api = createAdminApi()
      return await api<VariantInventoryDetail>(`/inventory/variant/${variantId}/stock/adjust`, {
        method: 'PATCH',
        body: payload
      })
    } catch (err) {
      error.value = extractApiError(err, 'Error al ajustar el stock')
      return null
    } finally {
      isSaving.value = false
    }
  }

  async function setStockAbsolute(variantId: string, payload: { stock: number, lowStockThreshold?: number, reason?: string }) {
    try {
      isSaving.value = true
      error.value = ''
      const api = createAdminApi()
      return await api<VariantInventoryDetail>(`/inventory/variant/${variantId}/stock`, {
        method: 'PATCH',
        body: payload
      })
    } catch (err) {
      error.value = extractApiError(err, 'Error al actualizar el stock')
      return null
    } finally {
      isSaving.value = false
    }
  }

  return {
    isSaving,
    error,
    adjustStockDelta,
    setStockAbsolute
  }
}
