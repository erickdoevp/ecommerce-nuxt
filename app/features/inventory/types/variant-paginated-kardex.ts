export interface VariantPaginatedKardex {
  content: Content[]
  page: Page
}

export interface Content {
  id: string
  variantId: string
  variantSku: string
  productName: string
  type: string
  quantity: number
  stockBefore: number
  stockAfter: number
  reason: string
  orderId: null | string
  createdBy: string
  createdAt: Date
}

export interface Page {
  size: number
  number: number
  totalElements: number
  totalPages: number
}
