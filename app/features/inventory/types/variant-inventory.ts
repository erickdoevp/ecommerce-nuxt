export type ProductStatus = 'DRAFT' | 'PUBLISHED' | 'ARCHIVED'

export interface VariantInventoryQuery {
  page: number
  size: number
  sort?: string
  productName?: string
  sku?: string
  colorId?: string
  sizeId?: string
  status?: ProductStatus
  active?: boolean
}

export interface VariantInventoryContent {
  variantId: string
  productId: string
  productName: string
  productSlug: string
  productStatus: ProductStatus
  sku: string
  colorName: string
  colorHex: string
  sizeName: string
  basePrice: number
  priceAdjustment: number
  finalPrice: number
  costPrice: number
  imageUrl: string | null
  active: boolean
  stock: number
  reservedStock: number
  availableStock: number
  lowStockThreshold: number
  lowStock: boolean
}

export interface VariantInventoryResponse {
  content: VariantInventoryContent[]
  page: {
    size: number
    number: number
    totalElements: number
    totalPages: number
  }
}

export const PRODUCT_STATUS_META: Record<ProductStatus, { label: string, color: 'neutral' | 'success' | 'error' }> = {
  DRAFT: { label: 'Borrador', color: 'neutral' },
  PUBLISHED: { label: 'Publicado', color: 'success' },
  ARCHIVED: { label: 'Archivado', color: 'error' }
}

export const PRODUCT_STATUS_OPTIONS = (Object.entries(PRODUCT_STATUS_META) as [ProductStatus, { label: string }][])
  .map(([value, meta]) => ({ label: meta.label, value }))
