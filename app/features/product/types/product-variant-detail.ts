export interface ProductVariantDetail {
  active: boolean
  availableStock: number
  basePrice: number
  colorHex: string
  colorName: string
  costPrice: number
  finalPrice: number
  imageUrl: string
  lowStock: boolean
  lowStockThreshold: number
  priceAdjustment: number
  productId: string
  productName: string
  productSlug: string
  productStatus: string
  reservedStock: number
  sizeName: string
  sku: string
  stock: number
  taxConfigId: string | null
  taxName: string | null
  taxRate: number | null
  variantId: string
}
