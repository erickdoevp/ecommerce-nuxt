export interface ProductVariantListItem {
  id: string
  size: { id: string, name: string, sortOrder: number }
  color: { id: string, name: string, hex: string }
  sku: string
  priceAdjustment: number
  costPrice: number
  imageUrl: string
  active: boolean
  availableStock: number
}

export interface ProductVariantListPage {
  size: number
  number: number
  totalElements: number
  totalPages: number
}

export interface ProductVariantListResponse {
  content: ProductVariantListItem[]
  page: ProductVariantListPage
}
