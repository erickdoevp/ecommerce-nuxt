export type OrderStatus
  = | 'PENDING_PAYMENT'
    | 'CONFIRMED'
    | 'PROCESSING'
    | 'SHIPPED'
    | 'READY_FOR_PICKUP'
    | 'DELIVERED'
    | 'CANCELLED'
    | 'REFUNDED'

export interface OrderSearchQuery {
  page: number
  size: number
  sort?: string
  status?: OrderStatus
  orderNumber?: string
  userId?: string
  dateFrom?: string
  dateTo?: string
}

export interface OrderItem {
  id: string
  variantId: string
  sku: string
  productName: string
  colorName: string | null
  sizeName: string | null
  imageUrl: string | null
  quantity: number
  unitPrice: number
  subtotal: number
}

export interface ShippingAddress {
  street: string
  city: string
  state: string
  zipCode: string
  country: string
}

export interface OrderContent {
  id: string
  orderNumber: string
  userId: string
  status: OrderStatus
  pickup: boolean
  shippingAddress: ShippingAddress | null
  shippingConfigId: string | null
  shippingConfigName: string | null
  pickupLocationId: string | null
  pickupLocationName: string | null
  pickupCode: string | null
  subtotal: number
  discountAmount: number
  shippingCost: number
  taxRate: number
  taxAmount: number
  total: number
  couponId: string | null
  couponCode: string | null
  notes: string | null
  adminNotes: string | null
  items: OrderItem[]
  createdAt: string
  updatedAt: string
}

export interface OrderSearchResponse {
  content: OrderContent[]
  page: {
    size: number
    number: number
    totalElements: number
    totalPages: number
  }
}

export const ORDER_STATUS_META: Record<
  OrderStatus,
  { label: string, color: 'neutral' | 'primary' | 'info' | 'success' | 'warning' | 'error' }
> = {
  PENDING_PAYMENT: { label: 'Pendiente de pago', color: 'warning' },
  CONFIRMED: { label: 'Confirmado', color: 'info' },
  PROCESSING: { label: 'En preparación', color: 'primary' },
  SHIPPED: { label: 'Enviado', color: 'info' },
  READY_FOR_PICKUP: { label: 'Listo para recoger', color: 'primary' },
  DELIVERED: { label: 'Entregado', color: 'success' },
  CANCELLED: { label: 'Cancelado', color: 'error' },
  REFUNDED: { label: 'Reembolsado', color: 'neutral' }
}

export const ORDER_STATUS_OPTIONS = (Object.entries(ORDER_STATUS_META) as [OrderStatus, { label: string }][])
  .map(([value, meta]) => ({ label: meta.label, value }))
