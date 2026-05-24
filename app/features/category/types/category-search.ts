export interface CategorySearchQuery {
  page: number
  size: number
  sort: string
  name?: string
  active?: boolean
  parentId?: string
}

export interface CategoryParent {
  id: string
  name: string
  slug: string
}

export interface CategoryContent {
  id: string
  name: string
  slug: string
  description: string
  imageUrl: string | null
  active: boolean
  parent: CategoryParent | null
  createdAt: string
  updatedAt: string
}

export interface CategorySearchResponse {
  content: CategoryContent[]
  page: {
    size: number
    number: number
    totalElements: number
    totalPages: number
  }
}
