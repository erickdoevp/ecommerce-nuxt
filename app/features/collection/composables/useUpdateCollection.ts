import { createAdminApi } from '~/api/admin-api'

export const useUpdateCollection = () => {
  const isSaving = ref(false)
  const error = ref<string | null>(null)

  async function updateCollection(id: string, formData: FormData) {
    try {
      isSaving.value = true
      error.value = null
      const api = createAdminApi()
      const data = await api(`/collections/${id}`, { method: 'PUT', body: formData })
      return data
    } catch (err) {
      error.value = extractApiError(err, 'Error al actualizar la colección')
      return undefined
    } finally {
      isSaving.value = false
    }
  }

  return { isSaving, error, updateCollection }
}
