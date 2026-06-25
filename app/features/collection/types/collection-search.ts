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

export interface CollectionProduct {
  id: string
  name: string
  slug: string
  basePrice: number
  primaryImageUrl: string | null
}

export interface CollectionDetail {
  id: string
  name: string
  slug: string
  // El backend declara description como Object; hoy llega como string. Si la BD
  // guarda rich text estructurado podría llegar como objeto/array. Confirmar.
  description: string | null
  imageUrl: string | null
  active: boolean
  position: number
  // Solo productos PUBLISHED; vacío ([]) si no hay ninguno, nunca null.
  products: CollectionProduct[]
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
