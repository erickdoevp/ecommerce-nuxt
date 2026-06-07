<script setup lang="ts">
import type { TableColumn, TableRow } from '@nuxt/ui'
import type { OrderContent } from '../types/order-search'
import { ORDER_STATUS_META } from '../types/order-search'
import { usePaginatedOrderSearch } from '../composables/usePaginatedOrderSearch'
import OrderFiltersForm from './OrderFiltersForm.vue'
import type { OrderFilters } from './OrderFiltersForm.vue'
import OrderDetailCard from './OrderDetailCard.vue'

const { searchOrders, orders, isLoading, totalElements } = usePaginatedOrderSearch()

const PAGE_SIZE = 20
const currentPage = ref(1)
const activeFilters = ref<OrderFilters>({ sort: 'createdAt,desc' })

const ordersTable = useTemplateRef('ordersTable')
const selectedOrder = ref<OrderContent | null>(null)

function selectRow(_e: Event, row: TableRow<OrderContent>) {
  selectedOrder.value = row.original
  ordersTable.value?.tableApi?.setRowSelection({ [row.id]: true })
}

function closeCard() {
  selectedOrder.value = null
  ordersTable.value?.tableApi?.resetRowSelection()
}

onMounted(() => load(1))

async function load(page: number) {
  currentPage.value = page
  await searchOrders({
    page: page - 1,
    size: PAGE_SIZE,
    ...activeFilters.value
  })
}

function onFiltersChange(filters: OrderFilters) {
  activeFilters.value = filters
  closeCard()
  load(1)
}

async function onStatusUpdated() {
  const id = selectedOrder.value?.id
  await load(currentPage.value)
  const idx = orders.value.findIndex(o => o.id === id)
  if (idx >= 0) {
    selectedOrder.value = orders.value[idx] ?? null
    ordersTable.value?.tableApi?.setRowSelection({ [String(idx)]: true })
  } else {
    closeCard()
  }
}

function formatCurrency(value: number) {
  return new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN' }).format(value ?? 0)
}

function formatDate(value: string) {
  if (!value) return '—'
  return new Date(value).toLocaleDateString('es-MX', { day: '2-digit', month: 'short', year: 'numeric' })
}

function itemsCount(order: OrderContent) {
  return order.items?.reduce((sum, item) => sum + item.quantity, 0) ?? 0
}

function rowActions(row: TableRow<OrderContent>) {
  return [[
    { label: 'Ver pedido', icon: 'i-lucide-eye', onSelect: () => selectRow(new Event('select'), row) }
  ]]
}

const columns: TableColumn<OrderContent>[] = [
  { id: 'index', header: '#' },
  { accessorKey: 'orderNumber', header: 'Pedido' },
  { accessorKey: 'status', header: 'Estado' },
  { id: 'items', header: 'Artículos' },
  { accessorKey: 'total', header: 'Total' },
  { accessorKey: 'createdAt', header: 'Fecha' },
  { id: 'actions', header: 'Acciones', meta: { class: { th: 'text-center', td: 'text-center' } } }
]
</script>

<template>
  <div class="space-y-3">
    <OrderFiltersForm @change="onFiltersChange" />

    <div class="flex items-start gap-4">
      <div class="flex-1 min-w-0 space-y-3">
        <div class="flex-1 overflow-auto max-h-[70vh] border border-solid rounded-lg border-default">
          <UTable
            ref="ordersTable"
            :data="orders"
            :columns="columns"
            :loading="isLoading"
            class="w-full"
            @select="selectRow"
          >
            <template #index-cell="{ row }">
              <span class="text-xs text-gray-400 tabular-nums">
                {{ (currentPage - 1) * PAGE_SIZE + row.index + 1 }}
              </span>
            </template>

            <template #orderNumber-cell="{ row }">
              <span class="text-sm font-medium text-gray-900 font-mono">{{ row.original.orderNumber }}</span>
            </template>

            <template #status-cell="{ row }">
              <UBadge
                :color="ORDER_STATUS_META[row.original.status]?.color ?? 'neutral'"
                variant="subtle"
                size="sm"
              >
                {{ ORDER_STATUS_META[row.original.status]?.label ?? row.original.status }}
              </UBadge>
            </template>

            <template #items-cell="{ row }">
              <span class="text-sm text-gray-600 tabular-nums">
                {{ itemsCount(row.original) }}
              </span>
            </template>

            <template #total-cell="{ row }">
              <span class="text-sm font-semibold text-gray-800">{{ formatCurrency(row.original.total) }}</span>
            </template>

            <template #createdAt-cell="{ row }">
              <span class="text-sm text-gray-600">{{ formatDate(row.original.createdAt) }}</span>
            </template>

            <template #actions-cell="{ row }">
              <UDropdownMenu :items="rowActions(row)">
                <UButton
                  color="neutral"
                  variant="ghost"
                  size="sm"
                  icon="i-lucide-ellipsis-vertical"
                />
              </UDropdownMenu>
            </template>
          </UTable>
        </div>

        <div class="flex items-center justify-between px-1">
          <p class="text-sm text-gray-500">
            <span class="font-medium text-gray-700">{{ totalElements }}</span> pedidos en total
          </p>
          <UPagination
            v-model:page="currentPage"
            variant="ghost"
            :total="totalElements"
            :items-per-page="PAGE_SIZE"
            @update:page="load"
          />
        </div>
      </div>

      <OrderDetailCard
        v-if="selectedOrder"
        :order="selectedOrder"
        class="w-[340px] shrink-0 sticky top-4"
        @updated="onStatusUpdated"
        @close="closeCard"
      />
    </div>
  </div>
</template>
