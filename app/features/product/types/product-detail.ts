export interface ProductDetail {
  averageRating: null | number
  basePrice: number
  category: Category
  createdAt: Date
  description: any
  id: string
  images: Image[]
  name: string
  reviewCount: number
  slug: string
  status: 'DRAFT' | 'PUBLISHED' | 'ARCHIVED'
  taxConfigId: string | null
  taxName: string | null
  taxRate: number | null
  updatedAt: Date
  variants: Variant[]
}

export interface Category {
  id: string
  name: string
  slug: string
}

export interface Image {
  id: string
  altText: null | string
  position: number
  primary: boolean
  url: string
}

export interface Variant {
  active: boolean
  availableStock: number
  color: Color
  costPrice: number
  id: string
  imageUrl: string
  priceAdjustment: number
  size: Size
  sku: string
}

export interface Color {
  hex: string
  id: string
  name: string
}

export interface Size {
  id: string
  name: string
  sortOrder: number
}
