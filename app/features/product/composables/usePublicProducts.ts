import type { MaybeRefOrGetter } from 'vue'
import { createPublicApi } from '~/api/public-api'
import type { ProductSearchQuery, ProductSearchResponse } from '../types/product-search'

// Listado público de productos: GET /products (todos los query params son opcionales).
// Acepta una query estática o reactiva (ref/getter); refetch automático al cambiar.
export const usePublicProducts = (query: MaybeRefOrGetter<Partial<ProductSearchQuery>> = {}) => {
  const api = createPublicApi()

  const params = computed(() => {
    const q = toValue(query)
    return {
      name: q.name,
      categoryId: q.categoryId,
      collectionId: q.collectionId,
      colorId: q.colorId,
      sizeId: q.sizeId,
      minPrice: q.minPrice,
      maxPrice: q.maxPrice,
      page: q.page,
      size: q.size,
      sort: q.sort
    }
  })

  const { data, pending, error, refresh } = useAsyncData(
    `public-products-${JSON.stringify(params.value)}`,
    () => api<ProductSearchResponse>('/products', { method: 'GET', params: params.value }),
    { watch: [params], default: () => null }
  )

  return {
    products: computed(() => data.value?.content ?? []),
    totalElements: computed(() => data.value?.page.totalElements ?? 0),
    totalPages: computed(() => data.value?.page.totalPages ?? 0),
    pending,
    error,
    refresh
  }
}
