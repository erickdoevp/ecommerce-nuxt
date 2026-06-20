import { createPublicApi } from '~/api/public-api'
import type { Category } from '../types/category'

export const useRootCategories = () => {
  const api = createPublicApi()

  const { data, pending, error, refresh } = useAsyncData(
    'root-categories',
    async () => await api<Category[]>('/categories/roots', { method: 'GET' }),
    { default: () => [] as Category[] }
  )

  return { categories: data, pending, error, refresh }
}
