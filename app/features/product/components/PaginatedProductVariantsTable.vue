<script setup lang="ts">
import type { TableColumn } from '@nuxt/ui'
import type { ProductVariantListItem } from '../types/product-variant-list'
import { usePaginatedProductVariants } from '../composables/usePaginatedProductVariants'
import EditVariantSlideover from './EditVariantSlideover.vue'
import AddVariantSlideover from './AddVariantSlideover.vue'

const props = defineProps<{
  productId: string | null
  basePrice?: number
}>()

const emit = defineEmits<{
  close: []
}>()

const { searchVariants, variants, isLoading, totalElements } = usePaginatedProductVariants()

const editVariantId = ref<string | null>(null)
const showEditVariant = ref(false)

const showAddVariant = ref(false)

function openEditVariant(id: string) {
  editVariantId.value = id
  showEditVariant.value = true
}

function rowActions(id: string) {
  return [[
    { label: 'Editar variante', icon: 'i-lucide-pencil', onSelect: () => openEditVariant(id) }
  ]]
}

const PAGE_SIZE = 20
const currentPage = ref(1)

watch(() => props.productId, (id) => {
  if (id) {
    currentPage.value = 1
    load(1)
  }
})

async function load(page: number) {
  if (!props.productId) return
  currentPage.value = page
  await searchVariants(props.productId, page - 1, PAGE_SIZE)
}

defineExpose({
  reload: () => load(currentPage.value)
})

function formatPrice(n: number): string {
  return '$ ' + n.toLocaleString('es-MX', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
}

function profit(item: ProductVariantListItem): number {
  return (props.basePrice ?? 0) + item.priceAdjustment - item.costPrice
}

const columns: TableColumn<ProductVariantListItem>[] = [
  { id: 'index', header: '#' },
  { id: 'image', header: 'Imagen' },
  { accessorKey: 'sku', header: 'SKU' },
  { accessorKey: 'color', header: 'Color' },
  { accessorKey: 'size', header: 'Talla' },
  { accessorKey: 'priceAdjustment', header: 'Ajuste de precio' },
  { accessorKey: 'costPrice', header: 'Costo' },
  { id: 'profit', header: 'Ganancia' },
  { accessorKey: 'availableStock', header: 'Stock disponible' },
  { accessorKey: 'active', header: 'Estado' },
  { id: 'actions', header: 'Acciones', meta: { class: { th: 'text-center', td: 'text-center' } } }
]
</script>

<template>
  <div
    v-if="productId"
    class="space-y-3 bg-white p-4 rounded-md"
  >
    <div class="flex items-center justify-between">
      <h2 class="text-sm font-semibold text-gray-800">
        Variantes del producto
      </h2>
      <UButton
        color="neutral"
        variant="ghost"
        size="sm"
        icon="i-lucide-x"
        @click="emit('close')"
      />
    </div>

    <div class="flex-1 overflow-auto max-h-[70vh] border border-solid rounded-lg border-default">
      <UTable
        :data="variants"
        :columns="columns"
        :loading="isLoading"
        class="w-full"
      >
        <template #index-cell="{ row }">
          <span class="text-xs text-gray-400 tabular-nums">
            {{ (currentPage - 1) * PAGE_SIZE + row.index + 1 }}
          </span>
        </template>

        <template #image-cell="{ row }">
          <img
            v-if="row.original.imageUrl"
            :src="row.original.imageUrl"
            :alt="row.original.sku"
            class="w-11 h-11 rounded-lg object-cover"
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
        </template>

        <template #sku-cell="{ row }">
          <span class="text-xs text-gray-600 font-mono">{{ row.original.sku }}</span>
        </template>

        <template #color-cell="{ row }">
          <div class="flex items-center gap-2">
            <span
              class="w-4 h-4 rounded-full border border-gray-200 shrink-0"
              :style="{ backgroundColor: row.original.color.hex }"
            />
            <span class="text-sm text-gray-700">{{ row.original.color.name }}</span>
          </div>
        </template>

        <template #size-cell="{ row }">
          <span class="text-sm text-gray-700">{{ row.original.size.name }}</span>
        </template>

        <template #priceAdjustment-cell="{ row }">
          <span class="text-sm text-gray-600">{{ formatPrice(row.original.priceAdjustment) }}</span>
        </template>

        <template #costPrice-cell="{ row }">
          <span class="text-sm text-gray-600">{{ formatPrice(row.original.costPrice) }}</span>
        </template>

        <template #profit-cell="{ row }">
          <span
            class="text-sm font-medium"
            :class="profit(row.original) >= 0 ? 'text-green-600' : 'text-red-500'"
          >
            {{ formatPrice(profit(row.original)) }}
          </span>
        </template>

        <template #availableStock-cell="{ row }">
          <span
            class="text-sm font-medium"
            :class="row.original.availableStock > 0 ? 'text-green-600' : 'text-red-500'"
          >
            {{ row.original.availableStock }}
          </span>
        </template>

        <template #active-cell="{ row }">
          <UBadge
            :color="row.original.active ? 'success' : 'neutral'"
            variant="subtle"
            size="sm"
          >
            {{ row.original.active ? 'Activa' : 'Inactiva' }}
          </UBadge>
        </template>

        <template #actions-cell="{ row }">
          <UDropdownMenu :items="rowActions(row.original.id)">
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

    <div>
      <UButton
        color="neutral"
        variant="outline"
        size="sm"
        icon="i-lucide-plus"
        @click="showAddVariant = true"
      >
        Agregar variante
      </UButton>
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

    <EditVariantSlideover
      v-model:open="showEditVariant"
      :variant-id="editVariantId"
      @updated="load(currentPage)"
    />

    <AddVariantSlideover
      v-model:open="showAddVariant"
      :product-id="productId"
      @created="load(currentPage)"
    />
  </div>
</template>
