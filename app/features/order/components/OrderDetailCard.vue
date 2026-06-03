<script setup lang="ts">
import { useClipboard } from '@vueuse/core'
import type { OrderContent, OrderStatus } from '../types/order-search'
import { ORDER_STATUS_META, ORDER_STATUS_OPTIONS } from '../types/order-search'
import { PAYMENT_METHOD_LABELS, PAYMENT_STATUS_META } from '../types/payment'
import { useUpdateOrderStatus } from '../composables/useUpdateOrderStatus'
import { useCustomerDetail } from '../composables/useCustomerDetail'
import { useOrderPayment } from '../composables/useOrderPayment'

const props = defineProps<{
  order: OrderContent
}>()

const emit = defineEmits<{
  updated: []
  close: []
}>()

const toast = useToast()
const { isUpdating, updateStatus } = useUpdateOrderStatus()
const { isLoading: loadingCustomer, customer, fetchCustomer } = useCustomerDetail()
const { isLoading: loadingPayment, payment, fetchPayment } = useOrderPayment()
const { copy } = useClipboard()

const newStatus = ref<OrderStatus>(props.order.status)
const cancelNote = ref('')

watch(() => props.order.id, () => {
  newStatus.value = props.order.status
  cancelNote.value = ''
  fetchCustomer(props.order.userId)
  fetchPayment(props.order.id)
}, { immediate: true })

const isCancel = computed(() => newStatus.value === 'CANCELLED')
const canSave = computed(() => newStatus.value !== props.order.status && !isUpdating.value)
const statusMeta = computed(() => ORDER_STATUS_META[props.order.status])
const paymentStatusMeta = computed(() => payment.value ? PAYMENT_STATUS_META[payment.value.status] : null)

function formatCurrency(value: number) {
  return new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN' }).format(value ?? 0)
}

function formatDateTime(value: string) {
  if (!value) return '—'
  return new Date(value).toLocaleString('es-MX', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

function copyText(value: string, label: string) {
  copy(value)
  toast.add({ title: `${label} copiado`, color: 'success', icon: 'i-lucide-copy' })
}

async function save() {
  try {
    await updateStatus(
      props.order.id,
      newStatus.value,
      isCancel.value ? (cancelNote.value || undefined) : undefined
    )
    toast.add({ title: 'Estado actualizado', color: 'success', icon: 'i-lucide-check-circle' })
    emit('updated')
  } catch {
    toast.add({ title: 'No se pudo actualizar el estado', color: 'error', icon: 'i-lucide-circle-alert' })
  }
}
</script>

<template>
  <div class="bg-white border border-[#ececed] rounded-xl p-4 space-y-4 text-sm">
    <!-- Header -->
    <div class="flex items-start justify-between gap-2">
      <div>
        <p class="font-semibold text-gray-900 font-mono">
          {{ order.orderNumber }}
        </p>
        <UBadge
          :color="statusMeta?.color ?? 'neutral'"
          variant="subtle"
          size="sm"
          class="mt-1"
        >
          {{ statusMeta?.label ?? order.status }}
        </UBadge>
      </div>
      <UButton
        icon="i-lucide-x"
        color="neutral"
        variant="ghost"
        size="sm"
        @click="emit('close')"
      />
    </div>

    <!-- Cliente -->
    <div>
      <p class="text-xs font-medium text-gray-400 uppercase tracking-wide mb-1">
        Cliente
      </p>
      <div
        v-if="loadingCustomer"
        class="space-y-1.5"
      >
        <USkeleton class="h-4 w-32" />
        <USkeleton class="h-3 w-40" />
      </div>
      <template v-else-if="customer">
        <p class="font-medium text-gray-900">
          {{ customer.displayName }}
        </p>
        <div class="flex items-center gap-1">
          <span class="text-gray-500 truncate">{{ customer.email }}</span>
          <UButton
            icon="i-lucide-copy"
            color="neutral"
            variant="ghost"
            size="xs"
            @click="copyText(customer.email, 'Email')"
          />
        </div>
        <p
          v-if="customer.phoneNumber"
          class="text-gray-500"
        >
          {{ customer.phoneNumber }}
        </p>
      </template>
      <span
        v-else
        class="font-mono text-gray-500"
      >{{ order.userId }}</span>
    </div>

    <!-- Fecha -->
    <div>
      <p class="text-xs font-medium text-gray-400 uppercase tracking-wide mb-1">
        Fecha del pedido
      </p>
      <p class="text-gray-700">
        {{ formatDateTime(order.createdAt) }}
      </p>
    </div>

    <!-- Entrega -->
    <div>
      <p class="text-xs font-medium text-gray-400 uppercase tracking-wide mb-1">
        {{ order.pickup ? 'Recogida en tienda' : 'Dirección de envío' }}
      </p>
      <template v-if="order.pickup">
        <p class="text-gray-700">
          {{ order.pickupLocationName ?? '—' }}
        </p>
        <p
          v-if="order.pickupCode"
          class="text-gray-500"
        >
          Código: {{ order.pickupCode }}
        </p>
      </template>
      <template v-else-if="order.shippingAddress">
        <p class="text-gray-700">
          {{ order.shippingAddress.street }}
        </p>
        <p class="text-gray-500">
          {{ order.shippingAddress.city }}, {{ order.shippingAddress.state }}
          {{ order.shippingAddress.zipCode }}
        </p>
        <p class="text-gray-500">
          {{ order.shippingAddress.country }}
        </p>
        <p
          v-if="order.shippingConfigName"
          class="text-gray-400 mt-1"
        >
          {{ order.shippingConfigName }}
        </p>
      </template>
      <p
        v-else
        class="text-gray-400"
      >
        —
      </p>
    </div>

    <!-- Pago -->
    <div>
      <p class="text-xs font-medium text-gray-400 uppercase tracking-wide mb-1">
        Pago
      </p>
      <USkeleton
        v-if="loadingPayment"
        class="h-4 w-36"
      />
      <template v-else-if="payment">
        <div class="flex items-center justify-between">
          <span class="text-gray-700">
            {{ PAYMENT_METHOD_LABELS[payment.method] ?? payment.method }}
          </span>
          <UBadge
            :color="paymentStatusMeta?.color ?? 'neutral'"
            variant="subtle"
            size="sm"
          >
            {{ paymentStatusMeta?.label ?? payment.status }}
          </UBadge>
        </div>
        <p
          v-if="payment.paidAt"
          class="text-gray-400 mt-0.5"
        >
          Pagado el {{ formatDateTime(payment.paidAt) }}
        </p>
      </template>
      <p
        v-else
        class="text-gray-400"
      >
        Sin información de pago
      </p>
    </div>

    <!-- Resumen -->
    <div class="border-t border-[#ececed] pt-3 space-y-1">
      <p class="text-xs font-medium text-gray-400 uppercase tracking-wide mb-1">
        Resumen
      </p>
      <div class="flex justify-between text-gray-600">
        <span>Subtotal ({{ order.items.length }} productos)</span>
        <span>{{ formatCurrency(order.subtotal) }}</span>
      </div>
      <div
        v-if="order.discountAmount > 0"
        class="flex justify-between text-gray-600"
      >
        <span>Descuento <span
          v-if="order.couponCode"
          class="text-gray-400"
        >({{ order.couponCode }})</span></span>
        <span>-{{ formatCurrency(order.discountAmount) }}</span>
      </div>
      <div class="flex justify-between text-gray-600">
        <span>Envío</span>
        <span>{{ formatCurrency(order.shippingCost) }}</span>
      </div>
      <div class="flex justify-between text-gray-600">
        <span>Impuestos</span>
        <span>{{ formatCurrency(order.taxAmount) }}</span>
      </div>
      <div class="flex justify-between font-semibold text-gray-900 pt-1">
        <span>Total</span>
        <span>{{ formatCurrency(order.total) }}</span>
      </div>
    </div>

    <!-- Cambiar estado -->
    <div class="border-t border-[#ececed] pt-3 space-y-2">
      <p class="text-xs font-medium text-gray-400 uppercase tracking-wide">
        Cambiar estado
      </p>
      <USelectMenu
        v-model="newStatus"
        :items="ORDER_STATUS_OPTIONS"
        value-key="value"
        class="w-full"
      />
      <UTextarea
        v-if="isCancel"
        v-model="cancelNote"
        placeholder="Motivo de cancelación (opcional)"
        :rows="2"
        class="w-full"
      />
      <UButton
        block
        icon="i-lucide-save"
        :loading="isUpdating"
        :disabled="!canSave"
        @click="save"
      >
        Guardar
      </UButton>
    </div>
  </div>
</template>
