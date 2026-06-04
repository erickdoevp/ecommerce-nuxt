import { createAdminApi } from '~/api/admin-api'
import type { VariantPaginatedKardex } from '../types/variant-paginated-kardex'

export const usePaginatedVariantKardex = () => {
  const error = ref<string>('')
  const isLoading = ref<boolean>(false)
  const response = ref<VariantPaginatedKardex | null>(null)

  async function searchVariantKardex(variantId: string, page = 0, size = 20) {
    try {
      isLoading.value = true
      const api = createAdminApi()
      response.value = await api<VariantPaginatedKardex>(
        `/inventory/variant/${variantId}/movements`,
        {
          method: 'GET',
          query: { page, size, sort: 'createdAt,desc' }
        }
      )
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Error al cargar el kardex de la variante'
    } finally {
      isLoading.value = false
    }
  }

  return {
    error,
    isLoading,
    response,
    searchVariantKardex
  }
}
