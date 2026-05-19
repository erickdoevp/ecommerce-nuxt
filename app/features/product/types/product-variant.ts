export interface VariantGridRow {
  id: string
  color: string
  colorId: string
  size: string
  sizeId: string
}

export interface VariantEditable {
  sku?: string
  image?: string | null
  imageBlob?: Blob | null
  adjustPercent?: number
  adjustAmount?: number
  costPrice?: number
  initialStock?: number
}
