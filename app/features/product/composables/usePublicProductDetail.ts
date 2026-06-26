import { createPublicApi } from '~/api/public-api'
import type { ProductDetail } from '../types/product-detail'

// Detalle público de un producto por slug: GET /products/slug/{slug}.
// Trae averageRating y reviewCount precalculados (no requiere reviews/stats).
export const usePublicProductDetail = (slug: string) => {
  const api = createPublicApi()

  const { data, pending, error, refresh } = useAsyncData(
    `public-product-${slug}`,
    () => api<ProductDetail>(`/products/slug/${slug}`, { method: 'GET' })
  )

  return { product: data, pending, error, refresh }
}
