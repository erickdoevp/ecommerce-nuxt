export interface SizeSearchQuery {
  page: number
  size: number
  name?: string
}

export interface SizeContent {
  id: string
  name: string
  sortOrder: number
}

export interface SizeSearchResponse {
  content: SizeContent[]
  page: {
    size: number
    number: number
    totalElements: number
    totalPages: number
  }
}
