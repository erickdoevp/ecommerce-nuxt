<script setup lang="ts">
import { useClientOrders } from '~/features/order/composables/useClientOrders'
import { ORDER_STATUS_META } from '~/features/order/types/order-search'
import type { MyOrder } from '~/features/order/types/my-order'

definePageMeta({
  layout: 'account'
})

const { orders, totalElements, fetchOrders } = useClientOrders()

onMounted(() => fetchOrders(1))

// La lista viene ordenada createdAt,desc → el primero es el más reciente.
const lastOrder = computed(() => orders.value[0] ?? null)

// TODO: favoritos sigue pendiente de endpoint del backend.
const summary = {
  favorites: 4
}

function formatCurrency(value: number) {
  return new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN' }).format(value ?? 0)
}

function formatDate(value: string) {
  return new Date(value).toLocaleDateString('es-MX', { day: '2-digit', month: 'short', year: 'numeric' })
}

function pieces(order: MyOrder): number {
  return order.items.reduce((sum, item) => sum + item.quantity, 0)
}
</script>

<template>
  <div class="space-y-6">
    <!-- Tarjetas resumen -->
    <div class="grid grid-cols-1 sm:grid-cols-2 gap-5">
      <div class="rounded-xl border border-default bg-muted p-6">
        <p class="text-[11px] tracking-[0.2em] uppercase text-muted">
          Pedidos
        </p>
        <p class="mt-4 font-serif text-4xl text-highlighted">
          {{ totalElements }}
        </p>
      </div>

      <div class="rounded-xl border border-default bg-muted p-6">
        <p class="text-[11px] tracking-[0.2em] uppercase text-muted">
          Favoritos
        </p>
        <p class="mt-4 font-serif text-4xl text-highlighted">
          {{ summary.favorites }}
        </p>
      </div>
    </div>

    <!-- Último pedido -->
    <div class="rounded-xl border border-default bg-muted p-6">
      <div class="flex items-center justify-between">
        <h2 class="font-serif text-2xl text-highlighted">
          Tu último pedido
        </h2>
        <NuxtLink
          to="/my-profile/orders"
          class="text-[11px] tracking-[0.15em] uppercase text-muted hover:text-highlighted underline underline-offset-4 transition-colors"
        >
          Ver todos
        </NuxtLink>
      </div>

      <div
        v-if="lastOrder"
        class="mt-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
      >
        <div class="flex items-center gap-4">
          <div class="flex gap-2">
            <img
              v-for="item in lastOrder.items.slice(0, 3)"
              :key="item.id"
              :src="item.imageUrl ?? undefined"
              :alt="item.productName"
              class="w-14 h-14 rounded-lg object-cover bg-elevated"
            >
          </div>
          <div>
            <p class="text-sm font-medium text-highlighted">
              Pedido {{ lastOrder.orderNumber }}
            </p>
            <p class="mt-1 text-xs text-muted">
              {{ formatDate(lastOrder.createdAt) }} · {{ pieces(lastOrder) }} piezas
            </p>
          </div>
        </div>

        <div class="flex items-center gap-5">
          <UBadge
            :color="ORDER_STATUS_META[lastOrder.status]?.color ?? 'neutral'"
            variant="subtle"
            class="rounded-full text-[10px] tracking-[0.15em] uppercase"
          >
            {{ ORDER_STATUS_META[lastOrder.status]?.label ?? lastOrder.status }}
          </UBadge>
          <p class="font-serif text-2xl text-highlighted">
            {{ formatCurrency(lastOrder.total) }}
            <span class="text-xs text-muted">MXN</span>
          </p>
        </div>
      </div>

      <p
        v-else
        class="mt-5 text-sm text-muted"
      >
        Aún no tienes pedidos.
      </p>
    </div>
  </div>
</template>
