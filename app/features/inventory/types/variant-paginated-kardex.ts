export interface VariantPaginatedKardex {
  content: Content[]
  page: Page
}

export type KardexType = 'INITIAL' | 'PURCHASE' | 'SALE' | 'ADJUSTMENT' | 'RETURN'

export interface Content {
  id: string
  variantId: string
  variantSku: string
  productName: string
  type: KardexType
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

export const KARDEX_TYPE_META: Record<KardexType, { label: string, icon: string, color: string }> = {
  INITIAL: { label: 'Stock inicial', icon: 'i-lucide-flag', color: 'text-gray-500' },
  PURCHASE: { label: 'Reabastecimiento', icon: 'i-lucide-arrow-down-to-line', color: 'text-green-600' },
  SALE: { label: 'Venta', icon: 'i-lucide-shopping-cart', color: 'text-blue-600' },
  ADJUSTMENT: { label: 'Ajuste', icon: 'i-lucide-sliders-horizontal', color: 'text-amber-600' },
  RETURN: { label: 'Devolución', icon: 'i-lucide-undo-2', color: 'text-purple-600' }
}

export const KARDEX_TYPE_OPTIONS = (Object.entries(KARDEX_TYPE_META) as [KardexType, { label: string }][])
  .map(([value, meta]) => ({ label: meta.label, value }))
