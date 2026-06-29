import { createPublicApi } from '~/api/public-api'
import type { CategoryTree } from '../types/category-tree'

export const usePublicCategoryTree = () => {
  const api = createPublicApi()

  const { data, pending, error, refresh } = useAsyncData(
    'public-category-tree',
    async () => await api<CategoryTree[]>('/categories/tree', { method: 'GET' }),
    { default: () => [] as CategoryTree[] }
  )

  return { categories: data, pending, error, refresh }
}
