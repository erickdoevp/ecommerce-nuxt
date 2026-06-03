import { createAdminApi } from '~/api/admin-api'
import type { VariantInventoryQuery, VariantInventoryResponse } from '../types/variant-inventory'

export const usePaginatedVariantSearch = () => {
  const isLoading = ref(false)
  const response = ref<VariantInventoryResponse | null>(null)

  async function searchVariants(query: VariantInventoryQuery) {
    try {
      isLoading.value = true
      const api = createAdminApi()
      const data = await api<VariantInventoryResponse>('/products/admin/variants', {
        method: 'GET',
        params: {
          page: query.page,
          size: query.size,
          ...(query.sort ? { sort: query.sort } : {}),
          ...(query.productName ? { productName: query.productName } : {}),
          ...(query.sku ? { sku: query.sku } : {}),
          ...(query.colorId ? { colorId: query.colorId } : {}),
          ...(query.sizeId ? { sizeId: query.sizeId } : {}),
          ...(query.status ? { status: query.status } : {}),
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
    searchVariants,
    isLoading,
    variants: computed(() => response.value?.content ?? []),
    totalElements: computed(() => response.value?.page.totalElements ?? 0),
    totalPages: computed(() => response.value?.page.totalPages ?? 0)
  }
}
