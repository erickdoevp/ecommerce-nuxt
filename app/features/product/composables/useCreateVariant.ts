import { createAdminApi } from '~/api/admin-api'
import type { ProductVariantListItem } from '../types/product-variant-list'

export interface CreateVariantData {
  sizeId: string
  colorId: string
  costPrice?: number
  initialStock?: number
  priceAdjustment?: number
}

export const useCreateVariant = () => {
  const isSaving = ref(false)
  const error = ref('')

  async function createVariant(productId: string, data: CreateVariantData, image?: Blob | null) {
    try {
      isSaving.value = true
      error.value = ''
      const api = createAdminApi()
      const formData = new FormData()
      formData.append('data', new Blob([JSON.stringify(data)], { type: 'application/json' }))
      if (image) formData.append('image', image, 'variant.jpg')
      return await api<ProductVariantListItem>(`/products/${productId}/variants`, {
        method: 'POST',
        body: formData
      })
    } catch (err) {
      error.value = extractApiError(err, 'Error al agregar la variante')
      return null
    } finally {
      isSaving.value = false
    }
  }

  return {
    isSaving,
    error,
    createVariant
  }
}
