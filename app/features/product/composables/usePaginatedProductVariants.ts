import { createAdminApi } from '~/api/admin-api'
import type { ProductVariantListResponse } from '../types/product-variant-list'

export const usePaginatedProductVariants = () => {
  const isLoading = ref(false)
  const error = ref('')
  const response = ref<ProductVariantListResponse | null>(null)

  async function searchVariants(productId: string, page = 0, size = 20) {
    try {
      isLoading.value = true
      const api = createAdminApi()
      response.value = await api<ProductVariantListResponse>(
        `/products/admin/${productId}/variants`,
        { method: 'GET', query: { page, size, sort: 'sku,asc' } }
      )
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Error al cargar las variantes'
    } finally {
      isLoading.value = false
    }
  }

  return {
    searchVariants,
    isLoading,
    error,
    variants: computed(() => response.value?.content ?? []),
    totalElements: computed(() => response.value?.page.totalElements ?? 0),
    totalPages: computed(() => response.value?.page.totalPages ?? 0)
  }
}
