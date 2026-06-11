import { createAdminApi } from '~/api/admin-api'

export const useUpdateCategory = () => {
  const isSaving = ref(false)
  const error = ref<string | null>(null)

  async function updateCategory(id: string, formData: FormData) {
    try {
      isSaving.value = true
      error.value = null
      const api = createAdminApi()
      const data = await api(`/categories/${id}`, { method: 'PUT', body: formData })
      return data
    } catch (err) {
      error.value = extractApiError(err, 'Error al actualizar la categoría')
      return undefined
    } finally {
      isSaving.value = false
    }
  }

  return { isSaving, error, updateCategory }
}
