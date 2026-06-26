import { createPublicApi } from '~/api/public-api'
import type { Review, ReviewPage } from '../types/review'

// Listado paginado de reseñas aprobadas con "ver más" (acumula páginas).
export const useProductReviews = (productId: string, pageSize = 5) => {
  const api = createPublicApi()

  const reviews = ref<Review[]>([])
  const currentPage = ref(0)
  const totalPages = ref(1)
  const loadingMore = ref(false)

  const fetchPage = (page: number) =>
    api<ReviewPage>(`/reviews/product/${productId}`, {
      method: 'GET',
      params: { page, size: pageSize, sort: 'createdAt,desc' }
    })

  // Primera página con SSR.
  const { pending } = useAsyncData(
    `reviews-${productId}`,
    async () => {
      const res = await fetchPage(0)
      reviews.value = res.content
      currentPage.value = 0
      totalPages.value = res.totalPages
      return res
    }
  )

  const hasMore = computed(() => currentPage.value < totalPages.value - 1)

  async function loadMore() {
    if (!hasMore.value || loadingMore.value) return
    loadingMore.value = true
    try {
      const next = currentPage.value + 1
      const res = await fetchPage(next)
      reviews.value.push(...res.content)
      currentPage.value = next
      totalPages.value = res.totalPages
    } finally {
      loadingMore.value = false
    }
  }

  return { reviews, pending, loadingMore, hasMore, loadMore }
}
