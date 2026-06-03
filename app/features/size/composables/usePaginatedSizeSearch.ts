import { createAdminApi } from '~/api/admin-api'
import type { SizeSearchQuery, SizeSearchResponse } from '../types/size-search'

export const usePaginatedSizeSearch = () => {
  const isLoading = ref(false)
  const response = ref<SizeSearchResponse | null>(null)

  async function searchSizes(query: SizeSearchQuery) {
    try {
      isLoading.value = true
      const api = createAdminApi()
      const data = await api<SizeSearchResponse>('/sizes/admin', {
        method: 'GET',
        params: {
          page: query.page,
          size: query.size,
          ...(query.name ? { name: query.name } : {})
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
    searchSizes,
    isLoading,
    sizes: computed(() => response.value?.content ?? []),
    totalElements: computed(() => response.value?.page.totalElements ?? 0),
    totalPages: computed(() => response.value?.page.totalPages ?? 0)
  }
}
