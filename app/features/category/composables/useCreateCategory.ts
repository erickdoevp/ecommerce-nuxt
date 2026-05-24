import { createAdminApi } from '~/api/admin-api'
import type { CategorySchema } from '../schemas/category.schema'
import type { MediaImage } from '~/features/product/types/image'

export const useCreateCategory = () => {
  const isLoading = ref(false)
  const error = ref<string | null>(null)

  async function createCategory(
    formData: CategorySchema,
    images: MediaImage[]
  ): Promise<void> {
    isLoading.value = true
    error.value = null
    try {
      const api = createAdminApi()
      const payload = new FormData()
      payload.append(
        'data',
        new Blob([JSON.stringify({
          name: formData.name,
          slug: formData.slug,
          ...(formData.description ? { description: formData.description } : {}),
          ...(formData.parentId ? { parentId: formData.parentId } : {}),
          active: formData.active
        })], { type: 'application/json' })
      )
      const primary = images[0]
      if (primary) {
        payload.append('image', primary.editedBlob ?? primary.file, primary.file.name)
      }
      await api('/categories', { method: 'POST', body: payload })
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Error al crear la categoría'
      throw err
    } finally {
      isLoading.value = false
    }
  }

  return { createCategory, isLoading, error }
}
