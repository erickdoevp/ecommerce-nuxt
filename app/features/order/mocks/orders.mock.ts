import type { MyOrder, MyOrderItem } from '~/features/order/types/my-order'
import type { OrderStatus } from '~/features/order/types/order-search'

// ─── Datos dummy para previsualizar historial y detalle de pedidos ──────────
// Activa/desactiva con USE_MOCK_ORDERS en los composables. Ids deterministas
// (no random) para que coincidan entre SSR y cliente, y entre lista y detalle.

const USER_ID = '11111111-1111-1111-1111-111111111111'

function img(seed: string): string {
  return `https://picsum.photos/seed/${seed}/240/240`
}

function it(
  productName: string,
  colorName: string,
  sizeName: string,
  unitPrice: number,
  quantity: number,
  seed: string
): MyOrderItem {
  const subtotal = +(unitPrice * quantity).toFixed(2)
  return {
    id: `mock-item-${seed}`,
    variantId: `mock-var-${seed}`,
    sku: `${seed.toUpperCase()}-${sizeName}`,
    productName,
    colorName,
    sizeName,
    imageUrl: img(seed),
    quantity,
    unitPrice,
    subtotal,
    taxRate: 0.16,
    taxAmount: +(subtotal * 0.16).toFixed(2)
  }
}

const ADDRESS = {
  recipientName: 'Valentina Ríos',
  phone: '5512345678',
  street: 'Av. Independencia',
  exteriorNumber: '218',
  interiorNumber: null,
  colonia: 'Centro',
  cp: '90000',
  municipio: 'Tlaxcala',
  estado: 'Tlax.'
}

let seq = 2418
function makeOrder(opts: {
  status: OrderStatus
  daysAgo: number
  items: MyOrderItem[]
  pickup?: boolean
  shippingCost?: number
  discountAmount?: number
  couponCode?: string | null
  notes?: string | null
}): MyOrder {
  const subtotal = +opts.items.reduce((s, i) => s + i.subtotal, 0).toFixed(2)
  const taxAmount = +opts.items.reduce((s, i) => s + i.taxAmount, 0).toFixed(2)
  const shippingCost = opts.shippingCost ?? 99
  const discountAmount = opts.discountAmount ?? 0
  const total = +(subtotal + shippingCost - discountAmount).toFixed(2)
  const createdAt = new Date(Date.now() - opts.daysAgo * 86_400_000)
  const updatedAt = new Date(createdAt.getTime() + 3 * 86_400_000)
  const pickup = opts.pickup ?? false
  const num = seq--

  return {
    id: `mock-${num}`,
    orderNumber: `LB-${num}`,
    userId: USER_ID,
    status: opts.status,
    pickup,
    shippingAddress: pickup ? null : ADDRESS,
    shippingConfigId: pickup ? null : 'cfg-std',
    shippingConfigName: pickup ? null : 'Envío estándar',
    pickupLocationId: pickup ? 'loc-1' : null,
    pickupLocationName: pickup ? 'Boutique Roma Norte' : null,
    pickupCode: pickup ? 'LB-PICK-7842' : null,
    subtotal,
    discountAmount,
    shippingCost,
    taxRate: 0.16,
    taxAmount,
    total,
    couponId: opts.couponCode ? 'cpn-1' : null,
    couponCode: opts.couponCode ?? null,
    notes: opts.notes ?? null,
    adminNotes: null,
    items: opts.items,
    createdAt: createdAt.toISOString(),
    updatedAt: updatedAt.toISOString()
  }
}

export const MOCK_ORDERS: MyOrder[] = [
  makeOrder({ status: 'DELIVERED', daysAgo: 18, shippingCost: 0, discountAmount: 10, couponCode: 'BENDITA10', notes: 'Dejar con el portero', items: [
    it('Conjunto Encaje Aurora', 'Aurora', 'M', 389, 1, 'aurora'),
    it('Tanga Encaje Vino', 'Vino', 'M', 149, 1, 'vino'),
    it('Bra Triángulo Durazno', 'Durazno', 'M', 249, 1, 'durazno')
  ] }),
  makeOrder({ status: 'SHIPPED', daysAgo: 6, items: [
    it('Body Encaje Marfil', 'Marfil', 'S', 479, 1, 'marfil')
  ] }),
  makeOrder({ status: 'PROCESSING', daysAgo: 3, shippingCost: 0, items: [
    it('Babydoll Seda Noche', 'Noche', 'G', 559, 1, 'noche'),
    it('Liguero Pasión', 'Vino', 'M', 329, 1, 'pasion')
  ] }),
  makeOrder({ status: 'CONFIRMED', daysAgo: 1, items: [
    it('Brasier Push-up Arena', 'Arena', 'M', 299, 2, 'arena')
  ] }),
  makeOrder({ status: 'PENDING_PAYMENT', daysAgo: 0, items: [
    it('Camisón Satín Perla', 'Perla', 'M', 429, 1, 'perla')
  ] }),
  makeOrder({ status: 'READY_FOR_PICKUP', daysAgo: 2, pickup: true, shippingCost: 0, items: [
    it('Kimono Encaje Terracota', 'Terracota', 'U', 649, 1, 'terracota')
  ] }),
  makeOrder({ status: 'CANCELLED', daysAgo: 25, items: [
    it('Pantaleta Algodón Rosa', 'Rosa', 'M', 119, 3, 'rosa')
  ] }),
  makeOrder({ status: 'DELIVERED', daysAgo: 40, shippingCost: 0, items: [
    it('Conjunto Encaje Aurora', 'Aurora', 'S', 389, 2, 'aurora2')
  ] }),
  makeOrder({ status: 'DELIVERED', daysAgo: 55, discountAmount: 50, couponCode: 'VIP50', items: [
    it('Body Encaje Marfil', 'Marfil', 'M', 479, 1, 'marfil2'),
    it('Tanga Encaje Vino', 'Vino', 'S', 149, 2, 'vino2')
  ] }),
  makeOrder({ status: 'REFUNDED', daysAgo: 70, items: [
    it('Babydoll Seda Noche', 'Noche', 'M', 559, 1, 'noche2')
  ] }),
  makeOrder({ status: 'DELIVERED', daysAgo: 85, shippingCost: 0, items: [
    it('Liguero Pasión', 'Vino', 'S', 329, 1, 'pasion2'),
    it('Brasier Push-up Arena', 'Arena', 'S', 299, 1, 'arena2')
  ] }),
  makeOrder({ status: 'DELIVERED', daysAgo: 100, items: [
    it('Kimono Encaje Terracota', 'Terracota', 'U', 649, 1, 'terra2')
  ] })
]

export function findMockOrder(id: string): MyOrder | null {
  return MOCK_ORDERS.find(o => o.id === id) ?? null
}
