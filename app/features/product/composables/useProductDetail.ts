import { createAdminApi } from '~/api/admin-api'
import type { ProductDetail } from '../types/product-detail'
import { useProductForm } from './useProductForm'

export const useProductDetail = () => {
  const { loadProductData } = useProductForm()
  const isLoading = ref(false)
  const product = ref<ProductDetail | null>(null)
  const errorMssg = ref<string>('')

  async function getProductById(id: string) {
    try {
      isLoading.value = true
      const api = createAdminApi()
      const response = await api<ProductDetail>(`/products/admin/${id}`, {
        method: 'GET'
      })
      product.value = response
      loadProductData(response)
    } catch (error) {
      errorMssg.value = error instanceof Error ? error.message : String(error)
    } finally {
      isLoading.value = false
    }
  }

  return {
    isLoading,
    product,
    errorMssg,
    getProductById
  }
}
