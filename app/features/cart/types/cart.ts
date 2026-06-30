// Tipos del carrito. Todos los endpoints (usuario e invitado) devuelven
// el mismo CartResponseDto; los bodies de mutación son CartItemAddRequestDto
// y CartItemUpdateRequestDto.

export interface CartItem {
  id: string // itemId del carrito → usar en PATCH/DELETE de items
  variantId: string
  sku: string
  productName: string
  colorName: string
  sizeName: string
  imageUrl: string
  quantity: number
  unitPrice: number
  subtotal: number
}

export type CartStatus = 'ACTIVE' | 'MERGED'

export interface CartResponse {
  id: string
  userId: string | null // null en carrito de invitado
  guestToken: string | null // null en carrito de usuario
  status: CartStatus
  items: CartItem[]
  subtotal: number // suma de subtotales de los items
  itemCount: number // suma de cantidades
  createdAt: string
  updatedAt: string
}

// POST /cart/items y POST /public/cart/{guestToken}/items
export interface CartItemAddRequest {
  variantId: string
  quantity: number // mínimo 1
}

// PATCH .../items/{itemId}
export interface CartItemUpdateRequest {
  quantity: number // mínimo 0; 0 elimina el item
}
