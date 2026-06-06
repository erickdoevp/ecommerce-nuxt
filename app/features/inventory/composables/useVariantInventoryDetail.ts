import { createAdminApi } from '~/api/admin-api'
import type { VariantInventoryDetail } from '../types/variant-inventory-detail'

export const useVariantInventoryDetail = () => {
  const isLoading = ref(false)
  const entity = ref<VariantInventoryDetail | null>(null)
  const error = ref('')

  async function getVariantInventoryDetail(variantId: string) {
    try {
      isLoading.value = true
      const api = createAdminApi()
      const data = await api<VariantInventoryDetail>(`/inventory/variant/${variantId}`, {
        method: 'GET'
      })
      entity.value = data
    } catch (err) {
      error.value = extractApiError(err, 'Error al cargar el inventario de la variante')
    } finally {
      isLoading.value = false
    }
  }

  return {
    isLoading,
    error,
    getVariantInventoryDetail,
    variantInventoryDetail: entity
  }
}
