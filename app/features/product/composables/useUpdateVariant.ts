import { createAdminApi } from '~/api/admin-api'
import type { ProductVariantDetail } from '../types/product-variant-detail'

export interface UpdateVariantData {
  sku: string
  priceAdjustment: number
  costPrice: number
  active: boolean
}

export const useUpdateVariant = () => {
  const isSaving = ref(false)
  const error = ref('')

  async function updateVariant(productId: string, variantId: string, data: UpdateVariantData, image?: Blob | null) {
    try {
      isSaving.value = true
      error.value = ''
      const api = createAdminApi()
      const formData = new FormData()
      formData.append('data', new Blob([JSON.stringify(data)], { type: 'application/json' }))
      if (image) formData.append('image', image, 'variant.jpg')
      return await api<ProductVariantDetail>(`/products/${productId}/variants/${variantId}`, {
        method: 'PATCH',
        body: formData
      })
    } catch (err) {
      error.value = extractApiError(err, 'Error al actualizar la variante')
      return null
    } finally {
      isSaving.value = false
    }
  }

  return {
    isSaving,
    error,
    updateVariant
  }
}
