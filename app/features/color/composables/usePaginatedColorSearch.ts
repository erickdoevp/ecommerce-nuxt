import { createAdminApi } from '~/api/admin-api'
import type { ColorSearchQuery, ColorSearchResponse } from '../types/color-search'

export const usePaginatedColorSearch = () => {
  const isLoading = ref(false)
  const response = ref<ColorSearchResponse | null>(null)

  async function searchColors(query: ColorSearchQuery) {
    try {
      isLoading.value = true
      const api = createAdminApi()
      const data = await api<ColorSearchResponse>('/colors/admin', {
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
    searchColors,
    isLoading,
    colors: computed(() => response.value?.content ?? []),
    totalElements: computed(() => response.value?.page.totalElements ?? 0),
    totalPages: computed(() => response.value?.page.totalPages ?? 0)
  }
}
