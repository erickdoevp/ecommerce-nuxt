import type { OrderStatus } from './order-search'

// Dirección de envío embebida en el pedido (mismo shape que AddressResponse, sin ids).
export interface MyOrderShippingAddress {
  recipientName: string
  phone: string
  street: string
  exteriorNumber: string
  interiorNumber: string | null
  colonia: string
  cp: string
  municipio: string
  estado: string
}

export interface MyOrderItem {
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
  taxRate: number
  taxAmount: number
}

export interface MyOrder {
  id: string
  orderNumber: string
  userId: string
  status: OrderStatus
  pickup: boolean
  shippingAddress: MyOrderShippingAddress | null
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
  items: MyOrderItem[]
  createdAt: string
  updatedAt: string
}

// Page<T> de Spring Data (solo los campos que consumimos).
export interface MyOrdersPage {
  content: MyOrder[]
  totalPages: number
  totalElements: number
  number: number
  size: number
  first: boolean
  last: boolean
  empty: boolean
}
