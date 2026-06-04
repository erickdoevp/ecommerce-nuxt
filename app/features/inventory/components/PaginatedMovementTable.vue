<script setup lang="ts">
import type { TableColumn } from '@nuxt/ui'
import type { Content } from '../types/variant-paginated-kardex'
import { KARDEX_TYPE_META } from '../types/variant-paginated-kardex'
import { usePaginatedInventoryMovements } from '../composables/usePaginatedInventoryMovements'
import MovementFiltersForm from './MovementFiltersForm.vue'
import type { MovementFilters } from './MovementFiltersForm.vue'

const { searchMovements, movements, isLoading, totalElements } = usePaginatedInventoryMovements()

const PAGE_SIZE = 20
const currentPage = ref(1)
const activeFilters = ref<MovementFilters>({ sort: 'createdAt,desc' })

onMounted(() => load(1))

async function load(page: number) {
  currentPage.value = page
  await searchMovements({
    page: page - 1,
    size: PAGE_SIZE,
    ...activeFilters.value
  })
}

function onFiltersChange(filters: MovementFilters) {
  activeFilters.value = filters
  load(1)
}

function formatDate(value: Date | string) {
  return new Intl.DateTimeFormat('es-MX', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' }).format(new Date(value))
}

const columns: TableColumn<Content>[] = [
  { id: 'index', header: '#' },
  { id: 'createdAt', header: 'Fecha' },
  { id: 'product', header: 'Producto' },
  { id: 'type', header: 'Tipo' },
  { id: 'quantity', header: 'Cantidad' },
  { id: 'stock', header: 'Stock' },
  { accessorKey: 'reason', header: 'Motivo' },
  { accessorKey: 'createdBy', header: 'Usuario' }
]
</script>

<template>
  <div class="space-y-3">
    <MovementFiltersForm @change="onFiltersChange" />

    <div class="flex-1 overflow-auto border border-solid rounded-lg border-default">
      <UTable
        :data="movements"
        :columns="columns"
        :loading="isLoading"
        class="border border-[#ececed] rounded-xl overflow-hidden"
      >
        <template #index-cell="{ row }">
          <span class="text-xs text-gray-400 tabular-nums">
            {{ (currentPage - 1) * PAGE_SIZE + row.index + 1 }}
          </span>
        </template>

        <template #createdAt-cell="{ row }">
          <span class="text-xs text-gray-500 whitespace-nowrap">{{ formatDate(row.original.createdAt) }}</span>
        </template>

        <template #product-cell="{ row }">
          <div class="min-w-0">
            <p class="text-sm font-medium text-gray-900 truncate leading-tight">
              {{ row.original.productName }}
            </p>
            <span class="text-xs text-gray-400 font-mono">{{ row.original.variantSku }}</span>
          </div>
        </template>

        <template #type-cell="{ row }">
          <div class="flex items-center gap-1.5">
            <UIcon
              :name="KARDEX_TYPE_META[row.original.type]?.icon ?? 'i-lucide-circle'"
              class="w-4 h-4 shrink-0"
              :class="KARDEX_TYPE_META[row.original.type]?.color ?? 'text-gray-400'"
            />
            <span class="text-sm text-gray-600">
              {{ KARDEX_TYPE_META[row.original.type]?.label ?? row.original.type }}
            </span>
          </div>
        </template>

        <template #quantity-cell="{ row }">
          <span
            class="text-sm font-semibold tabular-nums"
            :class="row.original.quantity >= 0 ? 'text-green-600' : 'text-red-600'"
          >
            {{ row.original.quantity > 0 ? '+' : '' }}{{ row.original.quantity }}
          </span>
        </template>

        <template #stock-cell="{ row }">
          <span class="text-xs text-gray-500 tabular-nums whitespace-nowrap">
            {{ row.original.stockBefore }} → <span class="font-medium text-gray-700">{{ row.original.stockAfter }}</span>
          </span>
        </template>

        <template #reason-cell="{ row }">
          <span class="text-sm text-gray-600 line-clamp-1">{{ row.original.reason }}</span>
        </template>

        <template #createdBy-cell="{ row }">
          <span class="text-xs text-gray-500">{{ row.original.createdBy }}</span>
        </template>
      </UTable>
    </div>

    <div class="flex items-center justify-between px-1">
      <p class="text-sm text-gray-500">
        <span class="font-medium text-gray-700">{{ totalElements }}</span> movimientos en total
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
</template>
