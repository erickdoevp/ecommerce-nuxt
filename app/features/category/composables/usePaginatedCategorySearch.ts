import { createAdminApi } from '~/api/admin-api'
import type { CategorySearchQuery, CategorySearchResponse } from '../types/category-search'

export const usePaginatedCategorySearch = () => {
  const isLoading = ref(false)
  const response = ref<CategorySearchResponse | null>(null)

  async function searchCategories(query: CategorySearchQuery) {
    try {
      isLoading.value = true
      const api = createAdminApi()
      const data = await api<CategorySearchResponse>('/categories/admin', {
        method: 'GET',
        params: {
          page: query.page,
          size: query.size,
          sort: query.sort,
          name: query.name,
          active: query.active,
          parentId: query.parentId
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
    searchCategories,
    isLoading,
    categories: computed(() => response.value?.content ?? []),
    totalElements: computed(() => response.value?.page.totalElements ?? 0),
    totalPages: computed(() => response.value?.page.totalPages ?? 0)
  }
}
