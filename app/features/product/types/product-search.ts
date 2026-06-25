export interface ProductSearchQuery {
  page: number
  size: number
  sort: string
  status?: 'DRAFT' | 'PUBLISHED' | 'ARCHIVED'
  // Filtros multivalor: aceptan uno (string) o varios (string[]) → IN en backend.
  categoryId?: string | string[]
  collectionId?: string | string[]
  colorId?: string | string[]
  sizeId?: string | string[]
  minPrice?: number
  maxPrice?: number
  name?: string
}

// Forma mínima que consume ProductCard. Tanto Content (listado) como
// CollectionProduct (detalle de colección) son asignables a esta interfaz.
export interface ProductCardItem {
  name: string
  slug: string
  basePrice: number
  primaryImageUrl: string | null
  category?: { name: string } | null
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
  taxConfigId: string | null
  taxName: string | null
  taxRate: number | null
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
