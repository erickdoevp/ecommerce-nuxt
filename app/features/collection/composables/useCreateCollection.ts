import { createAdminApi } from '~/api/admin-api'

export const useCreateCollection = () => {
  const isLoading = ref(false)
  const error = ref<string | null>(null)

  async function createCollection(formData: FormData) {
    try {
      isLoading.value = true
      const api = createAdminApi()
      await api('/collections', { method: 'POST', body: formData })
      return true
    } catch (err) {
      error.value = extractApiError(err, 'Error al crear la colección')
      return false
    } finally {
      isLoading.value = false
    }
  }

  return { isLoading, error, createCollection }
}
