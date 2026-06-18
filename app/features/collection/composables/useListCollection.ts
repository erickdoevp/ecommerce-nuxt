import { createAdminApi } from '~/api/admin-api'
import type { SelectOption } from '~/components/types/select'
import type { CollectionSearchResponse } from '../types/collection-search'

export const useListCollection = () => {
  const entities = ref<SelectOption[]>([])
  const isLoading = ref<boolean>(false)
  const error = ref<string>('')

  async function getCollections() {
    try {
      isLoading.value = true
      const api = createAdminApi()
      const data = await api<CollectionSearchResponse>('/collections/admin', {
        method: 'GET',
        params: { page: 0, size: 100 }
      })
      entities.value = data.content.map(c => ({
        label: c.name,
        value: c.id
      }))
    } catch (ferror) {
      error.value = extractApiError(ferror)
    } finally {
      isLoading.value = false
    }
  }

  return {
    getCollections,
    isLoading,
    error,
    selectCollections: entities
  }
}
