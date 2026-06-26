import { createPublicApi } from '~/api/public-api'
import type { ReviewStats } from '../types/review'

// Stats públicas de reseñas: promedio, total y distribución por estrellas.
export const useProductReviewStats = (productId: string) => {
  const api = createPublicApi()

  const { data, pending, refresh } = useAsyncData(
    `review-stats-${productId}`,
    () => api<ReviewStats>(`/reviews/product/${productId}/stats`, { method: 'GET' })
  )

  return { stats: data, pending, refresh }
}
