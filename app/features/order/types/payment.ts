export type PaymentMethod = 'CARD' | 'BANK_TRANSFER' | 'CASH_ON_DELIVERY'

export type PaymentStatus = 'PENDING' | 'PAID' | 'FAILED' | 'REFUNDED' | 'PARTIALLY_REFUNDED'

export interface PaymentDetail {
  id: string
  orderId: string
  orderNumber: string
  method: PaymentMethod
  status: PaymentStatus
  amount: number
  currency: string
  stripePaymentIntentId: string | null
  stripeClientSecret: string | null
  paidAt: string | null
  createdAt: string
  updatedAt: string
}

export const PAYMENT_METHOD_LABELS: Record<PaymentMethod, string> = {
  CARD: 'Tarjeta',
  BANK_TRANSFER: 'Transferencia bancaria',
  CASH_ON_DELIVERY: 'Pago contra entrega'
}

export const PAYMENT_STATUS_META: Record<
  PaymentStatus,
  { label: string, color: 'neutral' | 'success' | 'warning' | 'error' }
> = {
  PENDING: { label: 'Pendiente', color: 'warning' },
  PAID: { label: 'Pagado', color: 'success' },
  FAILED: { label: 'Fallido', color: 'error' },
  REFUNDED: { label: 'Reembolsado', color: 'neutral' },
  PARTIALLY_REFUNDED: { label: 'Reembolso parcial', color: 'warning' }
}
