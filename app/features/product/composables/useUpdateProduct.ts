import { createAdminApi } from '~/api/admin-api'
import type { ProductUpdateSchema } from '../schemas/product-update.schema'

export const useUpdateProduct = () => {
  const isSaving = ref(false)
  const error = ref('')

  async function updateProduct(id: string, data: ProductUpdateSchema) {
    try {
      isSaving.value = true
      error.value = ''
      const api = createAdminApi()
      return await api(`/products/${id}`, {
        method: 'PATCH',
        body: data
      })
    } catch (err) {
      error.value = extractApiError(err, 'Error al actualizar el producto')
      return null
    } finally {
      isSaving.value = false
    }
  }

  return {
    isSaving,
    error,
    updateProduct
  }
}
