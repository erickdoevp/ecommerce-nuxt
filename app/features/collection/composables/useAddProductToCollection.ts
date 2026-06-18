import { createAdminApi } from '~/api/admin-api'

export const useAddProductToCollection = () => {
  const isLoading = ref(false)
  const error = ref<string | null>(null)

  async function addProductToCollection(collectionId: string, productId: string, position?: number) {
    try {
      isLoading.value = true
      const api = createAdminApi()
      const data = await api(`/collections/${collectionId}/products`, {
        method: 'POST',
        body: { productId, ...(position !== undefined ? { position } : {}) }
      })
      return data
    } catch (err) {
      error.value = extractApiError(err, 'Error al agregar el producto a la colección')
      return undefined
    } finally {
      isLoading.value = false
    }
  }

  return {
    isLoading,
    error,
    addProductToCollection
  }
}
