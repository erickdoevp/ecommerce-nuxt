import { createAdminApi } from '~/api/admin-api'
import type { ProductVariantDetail } from '../types/product-variant-detail'

export const useProductVariantDetail = () => {
  const isLoading = ref(false)
  const error = ref('')
  const entity = ref<ProductVariantDetail | null>(null)

  async function getProductVariantDetail(variantId: string) {
    try {
      isLoading.value = true
      const api = createAdminApi()
      const data = await api<ProductVariantDetail>(`/products/admin/variants/${variantId}`)
      entity.value = data
    } catch (err) {
      error.value = extractApiError(err, 'Error al cargar la variante')
    } finally {
      isLoading.value = false
    }
  }

  return {
    isLoading,
    error,
    productVariantDetail: entity,
    getProductVariantDetail
  }
}
