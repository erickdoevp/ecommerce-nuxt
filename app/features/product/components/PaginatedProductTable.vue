<script setup lang="ts">
import type { TableColumn } from '@nuxt/ui'
import type { Content } from '../types/product-search'
import type { ProductFilters } from './ProductFiltersForm.vue'
import { usePaginatedProductSearch } from '../composables/usePaginatedProductSearch'
import ProductFiltersForm from './ProductFiltersForm.vue'

const { searchProducts, products, isLoading, totaElements } = usePaginatedProductSearch()

const PAGE_SIZE = 10
const currentPage = ref(1)
const activeFilters = ref<ProductFilters>({ sort: 'createdAt' })

onMounted(() => load(1))

async function load(page: number) {
  currentPage.value = page
  await searchProducts({
    page: page - 1,
    size: PAGE_SIZE,
    ...activeFilters.value
  })
}

function onFiltersChange(filters: ProductFilters) {
  activeFilters.value = filters
  load(1)
}

const statusConfig: Record<string, { label: string, color: 'neutral' | 'success' | 'error' | 'warning' }> = {
  DRAFT: { label: 'Borrador', color: 'neutral' },
  ACTIVE: { label: 'Activo', color: 'success' },
  INACTIVE: { label: 'Inactivo', color: 'error' }
}

const columns: TableColumn<Content>[] = [
  { id: 'index', header: '#' },
  { id: 'image', header: 'Imagen' },
  { accessorKey: 'name', header: 'Nombre' },
  { accessorKey: 'slug', header: 'Slug' },
  { accessorKey: 'category', header: 'Categoría' },
  { accessorKey: 'basePrice', header: 'Precio base' },
  { accessorKey: 'status', header: 'Estado' },
  { id: 'actions', header: 'Acciones' }
]
</script>

<template>
  <div class="space-y-3">
    <ProductFiltersForm @change="onFiltersChange" />

    <div class="flex-1 overflow-auto border border-solid rounded-lg border-default">
      <UTable
        :data="products ?? []"
        :columns="columns"
        :loading="isLoading"
        class="border border-[#ececed] rounded-xl overflow-hidden"
      >
        <template #index-cell="{ row }">
          <span class="text-xs text-gray-400 tabular-nums">
            {{ (currentPage - 1) * PAGE_SIZE + row.index + 1 }}
          </span>
        </template>

        <template #image-cell="{ row }">
          <img
            v-if="row.original.primaryImageUrl"
            :src="row.original.primaryImageUrl"
            :alt="row.original.name"
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

        <template #name-cell="{ row }">
          <p class="font-medium text-sm text-gray-900 leading-tight">
            {{ row.original.name }}
          </p>
        </template>

        <template #slug-cell="{ row }">
          <span class="text-xs text-gray-400 font-mono">{{ row.original.slug }}</span>
        </template>

        <template #category-cell="{ row }">
          <span class="text-sm text-gray-600">{{ row.original.category.name }}</span>
        </template>

        <template #basePrice-cell="{ row }">
          <span class="text-sm font-semibold text-gray-800">
            ${{ row.original.basePrice.toFixed(2) }}
          </span>
        </template>

        <template #status-cell="{ row }">
          <UBadge
            :color="statusConfig[row.original.status]?.color ?? 'neutral'"
            variant="subtle"
            size="sm"
          >
            {{ statusConfig[row.original.status]?.label ?? row.original.status }}
          </UBadge>
        </template>

        <template #actions-cell="{ row }">
          <div class="flex items-center justify-start gap-0.5">
            <UButton
              color="neutral"
              variant="ghost"
              size="sm"
              icon="i-lucide-pencil"
              :to="`/admin/product/${row.original.id}`"
            />
            <UButton
              color="neutral"
              variant="ghost"
              size="sm"
              icon="i-lucide-eye"
              :to="`/admin/product/${row.original.id}`"
            />
          </div>
        </template>
      </UTable>
    </div>

    <div class="flex items-center justify-between px-1">
      <p class="text-sm text-gray-500">
        <span class="font-medium text-gray-700">{{ totaElements ?? 0 }}</span> productos en total
      </p>
      <UPagination
        v-model:page="currentPage"
        variant="ghost"
        :total="totaElements ?? 0"
        :items-per-page="PAGE_SIZE"
        @update:page="load"
      />
    </div>
  </div>
</template>
