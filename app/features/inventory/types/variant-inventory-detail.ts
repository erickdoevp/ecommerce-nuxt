export interface VariantInventoryDetail {
  id: string
  variantId: string
  variantSku: string
  stock: number
  reservedStock: number
  availableStock: number
  lowStockThreshold: number
  lowStock: number
  updatedAt: string
}
