import { createAdminApi } from '~/api/admin-api'

export const useCreateProduct = () => {
  const isLoading = ref(false)
  const error = ref<string | null>(null)

  async function createProduct(formData: FormData) {
    try {
      isLoading.value = true
      const api = createAdminApi()
      const data = await api('/products', {
        method: 'POST',
        body: formData
      })
      return data
    } catch (err) {
      error.value = extractApiError(err, 'Error al crear el producto')
      return undefined
    } finally {
      isLoading.value = false
    }
  }

  return {
    isLoading,
    error,
    createProduct
  }
}
