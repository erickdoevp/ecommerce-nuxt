import { createAdminApi } from '~/api/admin-api'
import type { ProductSearchQuery, ProductSearchResponse } from '../types/product-search'

export const usePaginatedProductSearch = () => {
  const isLoading = ref(false)
  const productSearchResponse = ref<ProductSearchResponse | null>(null)

  async function searchProducts(query: ProductSearchQuery) {
    try {
      isLoading.value = true
      const api = createAdminApi()
      const response = await api<ProductSearchResponse>('/products/admin', {
        method: 'GET',
        params: {
          page: query.page,
          pageSize: query.size,
          sort: query.sort,
          status: query.status,
          categoryId: query.categoryId,
          minPrice: query.minPrice,
          maxPrice: query.maxPrice,
          sizeId: query.sizeId,
          colorId: query.colorId,
          name: query.name
        }
      })
      productSearchResponse.value = response
    } catch (error) {
      console.error(error)
    } finally {
      isLoading.value = false
    }
  }

  return {
    searchProducts,
    isLoading,
    productSearchResponse,
    products: computed(() => productSearchResponse.value?.content),
    totaElements: computed(() => productSearchResponse.value?.page.totalElements),
    totalPages: computed(() => productSearchResponse.value?.page.totalPages)
  }
}
