export interface CollectionSearchQuery {
  page: number
  size: number
  name?: string
  active?: boolean
}

export interface CollectionContent {
  id: string
  name: string
  slug: string
  description: string | null
  imageUrl: string | null
  active: boolean
  position: number
  productCount: number
  createdAt: string
  updatedAt: string
}

export interface CollectionSearchResponse {
  content: CollectionContent[]
  page: {
    size: number
    number: number
    totalElements: number
    totalPages: number
  }
}
