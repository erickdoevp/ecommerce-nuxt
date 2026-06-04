import type { Content, KardexType, Page } from './variant-paginated-kardex'

export interface InventoryMovementQuery {
  page: number
  size: number
  sort?: string
  variantId?: string
  type?: KardexType
  orderId?: string
  dateFrom?: string
  dateTo?: string
}

export interface InventoryMovementResponse {
  content: Content[]
  page: Page
}
