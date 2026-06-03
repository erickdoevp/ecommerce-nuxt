export interface ColorSearchQuery {
  page: number
  size: number
  name?: string
}

export interface ColorContent {
  id: string
  name: string
  hex: string
}

export interface ColorSearchResponse {
  content: ColorContent[]
  page: {
    size: number
    number: number
    totalElements: number
    totalPages: number
  }
}
