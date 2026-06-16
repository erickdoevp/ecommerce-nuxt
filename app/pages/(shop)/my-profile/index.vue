<script setup lang="ts">
import MyOrderDetailSlideover from '~/features/order/components/MyOrderDetailSlideover.vue'
import { useClientOrders } from '~/features/order/composables/useClientOrders'
import { ORDER_STATUS_META } from '~/features/order/types/order-search'
import type { MyOrder } from '~/features/order/types/my-order'

definePageMeta({
  layout: 'account'
})

const {
  orders,
  isLoading,
  page,
  totalElements,
  pageSize,
  fetchOrders
} = useClientOrders()

onMounted(() => fetchOrders(1))

const detailOpen = ref(false)
const selectedId = ref<string | null>(null)

function openDetail(order: MyOrder) {
  selectedId.value = order.id
  detailOpen.value = true
}

function formatCurrency(value: number) {
  return new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN' }).format(value ?? 0)
}

function formatDate(value: string) {
  if (!value) return '—'
  return new Date(value).toLocaleDateString('es-MX', {
    day: '2-digit',
    month: 'short',
    year: 'numeric'
  })
}

function summary(order: MyOrder): string {
  return order.items.map(i => i.productName).join(' · ')
}
</script>

<template>
  <div>
    <h2 class="font-serif text-3xl text-highlighted">
      Mis pedidos
    </h2>

    <!-- Cargando -->
    <div
      v-if="isLoading && orders.length === 0"
      class="mt-6 space-y-5"
    >
      <USkeleton
        v-for="i in 3"
        :key="i"
        class="h-40 w-full rounded-xl"
      />
    </div>

    <!-- Vacío -->
    <p
      v-else-if="!isLoading && orders.length === 0"
      class="mt-6 text-sm text-muted"
    >
      Aún no tienes pedidos.
    </p>

    <!-- Lista -->
    <div
      v-else
      class="mt-6 space-y-5"
    >
      <article
        v-for="order in orders"
        :key="order.id"
        class="rounded-xl border border-default overflow-hidden"
      >
        <!-- Encabezado -->
        <div class="bg-elevated px-6 py-4 flex items-center justify-between gap-4">
          <div class="flex items-center gap-8 sm:gap-12">
            <div>
              <p class="text-[10px] tracking-[0.2em] uppercase text-muted">
                Pedido
              </p>
              <p class="mt-1 text-sm text-highlighted font-mono">
                {{ order.orderNumber }}
              </p>
            </div>
            <div>
              <p class="text-[10px] tracking-[0.2em] uppercase text-muted">
                Fecha
              </p>
              <p class="mt-1 text-sm text-highlighted">
                {{ formatDate(order.createdAt) }}
              </p>
            </div>
            <div>
              <p class="text-[10px] tracking-[0.2em] uppercase text-muted">
                Total
              </p>
              <p class="mt-1 text-sm text-highlighted">
                {{ formatCurrency(order.total) }}
              </p>
            </div>
          </div>

          <UBadge
            :color="ORDER_STATUS_META[order.status]?.color ?? 'neutral'"
            variant="subtle"
            class="rounded-full text-[10px] tracking-[0.15em] uppercase shrink-0"
          >
            {{ ORDER_STATUS_META[order.status]?.label ?? order.status }}
          </UBadge>
        </div>

        <!-- Cuerpo -->
        <div class="bg-muted border-t border-default px-6 py-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div class="flex items-center gap-4 min-w-0">
            <div class="flex gap-2 shrink-0">
              <img
                v-for="item in order.items.slice(0, 3)"
                :key="item.id"
                :src="item.imageUrl ?? undefined"
                :alt="item.productName"
                class="w-14 h-14 rounded-lg object-cover bg-elevated"
              >
            </div>
            <p class="text-sm text-highlighted line-clamp-2">
              {{ summary(order) }}
            </p>
          </div>

          <UButton
            color="neutral"
            variant="outline"
            size="sm"
            class="rounded-full text-[11px] tracking-widest uppercase shrink-0"
            @click="openDetail(order)"
          >
            Ver detalle
          </UButton>
        </div>
      </article>

      <div
        v-if="totalElements > pageSize"
        class="flex justify-center pt-2"
      >
        <UPagination
          v-model:page="page"
          variant="ghost"
          :total="totalElements"
          :items-per-page="pageSize"
          @update:page="fetchOrders"
        />
      </div>
    </div>

    <MyOrderDetailSlideover
      v-model:open="detailOpen"
      :order-id="selectedId"
    />
  </div>
</template>
