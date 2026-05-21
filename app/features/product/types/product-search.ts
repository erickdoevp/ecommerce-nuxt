export interface ProductSearchQuery {
  page: number
  size: number
  sort: string
  status?: 'DRAFT' | 'PUBLISHED' | 'ARCHIVED'
  categoryId?: string
  minPrice?: number
  maxPrice?: number
  sizeId?: string
  colorId?: string
}

export interface ProductSearchResponse {
  content: Content[]
  page: Page
}

export interface Content {
  averageRating: null
  basePrice: number
  category: Category
  id: string
  name: string
  primaryImageUrl: string
  reviewCount: number
  slug: string
  status: string
}

export interface Category {
  id: string
  name: string
  slug: string
}

export interface Page {
  size: number
  number: number
  totalElements: number
  totalPages: number
}
