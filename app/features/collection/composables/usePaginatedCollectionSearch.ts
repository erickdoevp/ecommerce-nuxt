import { createAdminApi } from '~/api/admin-api'
import type { CollectionSearchQuery, CollectionSearchResponse } from '../types/collection-search'

export const usePaginatedCollectionSearch = () => {
  const isLoading = ref(false)
  const response = ref<CollectionSearchResponse | null>(null)

  async function searchCollections(query: CollectionSearchQuery) {
    try {
      isLoading.value = true
      const api = createAdminApi()
      const data = await api<CollectionSearchResponse>('/collections/admin', {
        method: 'GET',
        params: {
          page: query.page,
          size: query.size,
          ...(query.name ? { name: query.name } : {}),
          ...(query.active !== undefined ? { active: query.active } : {})
        }
      })
      response.value = data
    } catch (error) {
      console.error(error)
    } finally {
      isLoading.value = false
    }
  }

  return {
    searchCollections,
    isLoading,
    collections: computed(() => response.value?.content ?? []),
    totalElements: computed(() => response.value?.page.totalElements ?? 0),
    totalPages: computed(() => response.value?.page.totalPages ?? 0)
  }
}
