<script setup lang="ts">
import { useClientOrderDetail } from '~/features/order/composables/useClientOrderDetail'
import type { MyOrder } from '~/features/order/types/my-order'
import { ORDER_STATUS_META } from '~/features/order/types/order-search'

const props = defineProps<{
  orderId: string | null
}>()

const open = defineModel<boolean>('open', { default: false })

const { order, isLoading, fetchOrder } = useClientOrderDetail()

watch([open, () => props.orderId], ([isOpen, id]) => {
  if (isOpen && id) fetchOrder(id)
})

const statusMeta = computed(() => order.value ? ORDER_STATUS_META[order.value.status] : null)

function formatCurrency(value: number) {
  return new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN' }).format(value ?? 0)
}

function longDate(value?: string) {
  if (!value) return ''
  return new Date(value).toLocaleDateString('es-MX', { day: 'numeric', month: 'long', year: 'numeric' })
}

function itemMeta(item: MyOrder['items'][number]): string {
  return [
    item.colorName,
    item.sizeName ? `Talla ${item.sizeName}` : null,
    `Cant. ${item.quantity}`
  ].filter(Boolean).join(' · ')
}
</script>

<template>
  <USlideover
    v-model:open="open"
    :ui="{ content: 'max-w-lg' }"
  >
    <template #header>
      <div class="flex items-start justify-between gap-4 w-full">
        <div class="min-w-0">
          <p class="text-[11px] tracking-[0.2em] uppercase text-muted">
            Detalle del pedido
          </p>
          <div class="mt-1 flex items-center gap-3">
            <h2 class="font-serif text-2xl text-highlighted truncate">
              {{ order?.orderNumber ?? '—' }}
            </h2>
            <UBadge
              v-if="statusMeta"
              :color="statusMeta.color"
              variant="subtle"
              class="rounded-full text-[10px] tracking-[0.15em] uppercase shrink-0"
            >
              {{ statusMeta.label }}
            </UBadge>
          </div>
          <p
            v-if="order"
            class="mt-1 text-sm text-muted"
          >
            Realizado el {{ longDate(order.createdAt) }}
          </p>
        </div>
        <UButton
          icon="i-lucide-x"
          color="neutral"
          variant="ghost"
          class="rounded-full shrink-0"
          @click="open = false"
        />
      </div>
    </template>

    <template #body>
      <!-- Cargando -->
      <div
        v-if="isLoading"
        class="flex items-center justify-center py-20"
      >
        <UIcon
          name="i-lucide-loader-circle"
          class="w-6 h-6 text-muted animate-spin"
        />
      </div>

      <!-- Error / no encontrado -->
      <p
        v-else-if="!order"
        class="py-20 text-center text-sm text-muted"
      >
        No se pudo cargar el pedido.
      </p>

      <div
        v-else
        class="space-y-8"
      >
        <!-- Artículos -->
        <div class="space-y-4">
          <p class="text-[11px] tracking-[0.2em] uppercase text-muted">
            Artículos ({{ order.items.length }})
          </p>
          <div
            v-for="item in order.items"
            :key="item.id"
            class="flex items-center gap-4"
          >
            <img
              v-if="item.imageUrl"
              :src="item.imageUrl"
              :alt="item.productName"
              class="w-16 h-16 rounded-lg object-cover shrink-0"
            >
            <div
              v-else
              class="w-16 h-16 rounded-lg bg-muted flex items-center justify-center shrink-0"
            >
              <UIcon
                name="i-lucide-image"
                class="w-5 h-5 text-muted"
              />
            </div>
            <div class="min-w-0 flex-1">
              <p class="font-serif text-lg text-highlighted truncate">
                {{ item.productName }}
              </p>
              <p class="text-sm text-muted">
                {{ itemMeta(item) }}
              </p>
            </div>
            <span class="text-sm text-highlighted shrink-0">
              {{ formatCurrency(item.subtotal) }}
            </span>
          </div>
        </div>

        <!-- Resumen -->
        <div class="rounded-xl border border-default p-5 space-y-2.5 text-sm">
          <div class="flex justify-between text-muted">
            <span>Subtotal</span>
            <span>{{ formatCurrency(order.subtotal) }}</span>
          </div>
          <div class="flex justify-between text-muted">
            <span>Envío</span>
            <span>{{ order.shippingCost === 0 ? 'Gratis' : formatCurrency(order.shippingCost) }}</span>
          </div>
          <div
            v-if="order.discountAmount > 0"
            class="flex justify-between text-success"
          >
            <span>Descuento <template v-if="order.couponCode">{{ order.couponCode }}</template></span>
            <span>−{{ formatCurrency(order.discountAmount) }}</span>
          </div>
          <div class="flex justify-between text-muted">
            <span>Impuestos</span>
            <span>{{ formatCurrency(order.taxAmount) }}</span>
          </div>
          <div class="border-t border-default pt-3 flex items-end justify-between">
            <span class="text-highlighted">Total</span>
            <span class="font-serif text-2xl text-highlighted">
              {{ formatCurrency(order.total) }} <span class="text-xs text-muted">MXN</span>
            </span>
          </div>
        </div>

        <!-- Entrega y pago -->
        <div class="grid grid-cols-2 gap-6 text-sm">
          <div>
            <p class="text-[11px] tracking-[0.2em] uppercase text-muted mb-2">
              {{ order.pickup ? 'Recoger en' : 'Enviar a' }}
            </p>
            <template v-if="order.pickup">
              <p class="text-highlighted">
                {{ order.pickupLocationName ?? '—' }}
              </p>
              <p
                v-if="order.pickupCode"
                class="text-muted"
              >
                Código: {{ order.pickupCode }}
              </p>
            </template>
            <template v-else-if="order.shippingAddress">
              <p class="text-highlighted">
                {{ order.shippingAddress.recipientName }}
              </p>
              <p class="text-muted">
                {{ order.shippingAddress.street }} {{ order.shippingAddress.exteriorNumber }}<span v-if="order.shippingAddress.interiorNumber"> Int. {{ order.shippingAddress.interiorNumber }}</span>, {{ order.shippingAddress.colonia }}
              </p>
              <p class="text-muted">
                {{ order.shippingAddress.municipio }}, {{ order.shippingAddress.estado }} {{ order.shippingAddress.cp }}
              </p>
            </template>
            <p
              v-else
              class="text-muted"
            >
              —
            </p>
          </div>
          <div>
            <p class="text-[11px] tracking-[0.2em] uppercase text-muted mb-2">
              Pago
            </p>
            <p class="text-highlighted">
              {{ order.shippingConfigName ?? 'Envío' }}
              <span class="text-muted">({{ order.shippingCost === 0 ? 'gratis' : formatCurrency(order.shippingCost) }})</span>
            </p>
          </div>
        </div>
      </div>
    </template>

    <template #footer>
      <div
        v-if="order"
        class="flex gap-3 w-full"
      >
        <UButton
          color="neutral"
          variant="outline"
          class="flex-1 rounded-full justify-center text-[11px] tracking-widest uppercase"
        >
          Ayuda con el pedido
        </UButton>
        <UButton
          class="flex-1 rounded-full justify-center text-[11px] tracking-widest uppercase"
        >
          Volver a pedir
        </UButton>
      </div>
    </template>
  </USlideover>
</template>
