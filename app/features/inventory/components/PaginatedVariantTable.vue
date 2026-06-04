<script setup lang="ts">
import type { TableColumn } from '@nuxt/ui'
import type { VariantInventoryContent } from '../types/variant-inventory'
import { PRODUCT_STATUS_META } from '../types/variant-inventory'
import { usePaginatedVariantSearch } from '../composables/usePaginatedVariantSearch'
import VariantFiltersForm from './VariantFiltersForm.vue'
import type { VariantFilters } from './VariantFiltersForm.vue'
import VariantInventorySlideover from './VariantInventorySlideover.vue'

const { searchVariants, variants, isLoading, totalElements } = usePaginatedVariantSearch()

const PAGE_SIZE = 20
const currentPage = ref(1)
const activeFilters = ref<VariantFilters>({ sort: 'sku,asc' })

const selectedVariantId = ref<string | null>(null)
const showSlideover = ref(false)

function openSlideover(variantId: string) {
  selectedVariantId.value = variantId
  showSlideover.value = true
}

onMounted(() => load(1))

async function load(page: number) {
  currentPage.value = page
  await searchVariants({
    page: page - 1,
    size: PAGE_SIZE,
    ...activeFilters.value
  })
}

function onFiltersChange(filters: VariantFilters) {
  activeFilters.value = filters
  load(1)
}

function formatCurrency(value: number) {
  return new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN' }).format(value ?? 0)
}

function stockMeta(row: VariantInventoryContent): { label: string, color: 'success' | 'warning' | 'error' } {
  if (row.availableStock <= 0) return { label: 'Sin stock', color: 'error' }
  if (row.lowStock) return { label: 'Stock bajo', color: 'warning' }
  return { label: 'Disponible', color: 'success' }
}

const columns: TableColumn<VariantInventoryContent>[] = [
  { id: 'index', header: '#' },
  { id: 'product', header: 'Producto' },
  { accessorKey: 'sku', header: 'SKU' },
  { id: 'color', header: 'Color' },
  { accessorKey: 'sizeName', header: 'Talla' },
  { accessorKey: 'finalPrice', header: 'Precio' },
  { id: 'stock', header: 'Stock' },
  { id: 'productStatus', header: 'Estado' },
  { id: 'actions', header: '' }
]
</script>

<template>
  <div class="space-y-3">
    <VariantFiltersForm @change="onFiltersChange" />

    <div class="flex-1 overflow-auto border border-solid rounded-lg border-default">
      <UTable
        :data="variants"
        :columns="columns"
        :loading="isLoading"
        class="border border-[#ececed] rounded-xl overflow-hidden"
      >
        <template #index-cell="{ row }">
          <span class="text-xs text-gray-400 tabular-nums">
            {{ (currentPage - 1) * PAGE_SIZE + row.index + 1 }}
          </span>
        </template>

        <template #product-cell="{ row }">
          <div class="flex items-center gap-2.5">
            <img
              v-if="row.original.imageUrl"
              :src="row.original.imageUrl"
              :alt="row.original.productName"
              class="w-11 h-11 rounded-lg object-cover shrink-0"
            >
            <div
              v-else
              class="w-11 h-11 rounded-lg bg-gray-100 flex items-center justify-center shrink-0"
            >
              <UIcon
                name="i-lucide-image"
                class="w-5 h-5 text-gray-300"
              />
            </div>
            <div class="min-w-0">
              <p class="text-sm font-medium text-gray-900 truncate leading-tight">
                {{ row.original.productName }}
              </p>
              <span class="text-xs text-gray-400 font-mono">{{ row.original.productSlug }}</span>
            </div>
          </div>
        </template>

        <template #sku-cell="{ row }">
          <span class="text-xs font-mono text-gray-600">{{ row.original.sku }}</span>
        </template>

        <template #color-cell="{ row }">
          <div class="flex items-center gap-1.5">
            <span
              class="w-3.5 h-3.5 rounded-full border border-gray-200 shrink-0"
              :style="{ backgroundColor: row.original.colorHex }"
            />
            <span class="text-sm text-gray-600">{{ row.original.colorName }}</span>
          </div>
        </template>

        <template #sizeName-cell="{ row }">
          <span class="text-sm text-gray-600">{{ row.original.sizeName }}</span>
        </template>

        <template #finalPrice-cell="{ row }">
          <span class="text-sm font-semibold text-gray-800">{{ formatCurrency(row.original.finalPrice) }}</span>
        </template>

        <template #stock-cell="{ row }">
          <div class="flex items-center gap-2">
            <span class="text-sm tabular-nums text-gray-800 font-medium">
              {{ row.original.availableStock }}
            </span>
            <UBadge
              :color="stockMeta(row.original).color"
              variant="subtle"
              size="sm"
            >
              {{ stockMeta(row.original).label }}
            </UBadge>
          </div>
        </template>

        <template #productStatus-cell="{ row }">
          <UBadge
            :color="PRODUCT_STATUS_META[row.original.productStatus]?.color ?? 'neutral'"
            variant="subtle"
            size="sm"
          >
            {{ PRODUCT_STATUS_META[row.original.productStatus]?.label ?? row.original.productStatus }}
          </UBadge>
        </template>

        <template #actions-cell="{ row }">
          <UButton
            icon="i-lucide-pencil"
            color="neutral"
            variant="ghost"
            size="sm"
            aria-label="Editar stock"
            @click="openSlideover(row.original.variantId)"
          />
        </template>
      </UTable>
    </div>

    <div class="flex items-center justify-between px-1">
      <p class="text-sm text-gray-500">
        <span class="font-medium text-gray-700">{{ totalElements }}</span> variantes en total
      </p>
      <UPagination
        v-model:page="currentPage"
        variant="ghost"
        :total="totalElements"
        :items-per-page="PAGE_SIZE"
        @update:page="load"
      />
    </div>

    <VariantInventorySlideover
      v-model:open="showSlideover"
      :variant-id="selectedVariantId"
      @updated="load(currentPage)"
    />
  </div>
</template>
