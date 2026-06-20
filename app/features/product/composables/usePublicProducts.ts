import { createPublicApi } from '~/api/public-api'
import type { ProductSearchQuery, ProductSearchResponse } from '../types/product-search'

// Listado público de productos: GET /products (todos los query params son opcionales).
export const usePublicProducts = (query: Partial<ProductSearchQuery> = {}) => {
  const api = createPublicApi()

  const { data, pending, error, refresh } = useAsyncData(
    `public-products-${JSON.stringify(query)}`,
    () => api<ProductSearchResponse>('/products', {
      method: 'GET',
      params: {
        name: query.name,
        categoryId: query.categoryId,
        minPrice: query.minPrice,
        maxPrice: query.maxPrice,
        sizeId: query.sizeId,
        colorId: query.colorId,
        page: query.page,
        size: query.size,
        sort: query.sort
      }
    }),
    { default: () => null }
  )

  return {
    products: computed(() => data.value?.content ?? []),
    totalElements: computed(() => data.value?.page.totalElements ?? 0),
    pending,
    error,
    refresh
  }
}
