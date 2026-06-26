export interface Review {
  id: string
  productId: string
  userId: string
  username: string
  rating: number
  title: string
  body: string
  verifiedPurchase: boolean
  approved: boolean
  createdAt: string
  updatedAt: string
}

// Page<ReviewResponseDto> que devuelve el backend.
export interface ReviewPage {
  content: Review[]
  totalElements: number
  totalPages: number
  number: number
  size: number
  first: boolean
  last: boolean
}

// GET /reviews/product/{id}/stats — ratingDistribution siempre trae las 5 claves (5→1).
export interface ReviewStats {
  productId: string
  averageRating: number
  reviewCount: number
  ratingDistribution: Record<string, number>
}
