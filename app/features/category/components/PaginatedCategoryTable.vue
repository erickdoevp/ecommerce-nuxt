<script setup lang="ts">
import type { TableColumn } from '@nuxt/ui'
import type { CategoryContent } from '../types/category-search'
import type { CategoryFilters } from './CategoryFiltersForm.vue'
import { usePaginatedCategorySearch } from '../composables/usePaginatedCategorySearch'
import CategoryFiltersForm from './CategoryFiltersForm.vue'
import { useListCategory } from '../composables/useListCategory'

const { searchCategories, categories, isLoading, totalElements } = usePaginatedCategorySearch()
const { selectCategories, getCategories } = useListCategory()

const PAGE_SIZE = 10
const currentPage = ref(1)
const activeFilters = ref<CategoryFilters>({ sort: 'createdAt,desc' })

onMounted(() => {
  getCategories()
  load(1)
})

async function load(page: number) {
  currentPage.value = page
  await searchCategories({
    page: page - 1,
    size: PAGE_SIZE,
    ...activeFilters.value
  })
}

function onFiltersChange(filters: CategoryFilters) {
  activeFilters.value = filters
  load(1)
}

function rowActions(id: string) {
  return [[
    { label: 'Editar categoría', icon: 'i-lucide-pencil', to: `/admin/category/${id}/edit` },
    { label: 'Ver categoría', icon: 'i-lucide-eye', to: `/admin/category/${id}` }
  ]]
}

const columns: TableColumn<CategoryContent>[] = [
  { id: 'index', header: '#' },
  { id: 'image', header: 'Imagen' },
  { accessorKey: 'name', header: 'Nombre' },
  { accessorKey: 'slug', header: 'Slug' },
  { id: 'parent', header: 'Categoría padre' },
  { accessorKey: 'active', header: 'Estado' },
  { id: 'actions', header: 'Acciones' }
]
</script>

<template>
  <div class="space-y-3">
    <CategoryFiltersForm
      :select-categories="selectCategories"
      @change="onFiltersChange"
    />
    <div class="flex-1 overflow-auto max-h-[70vh] border border-solid rounded-lg border-default">
      <UTable
        :data="categories"
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
            :alt="row.original.name"
            class="w-11 h-11 rounded-lg object-cover"
          >
          <div
            v-else
            class="w-11 h-11 rounded-lg bg-gray-100 flex items-center justify-center shrink-0"
          >
            <UIcon
              name="i-lucide-tag"
              class="w-5 h-5 text-gray-300"
            />
          </div>
        </template>

        <template #name-cell="{ row }">
          <div>
            <p class="font-medium text-sm text-gray-900 leading-tight">
              {{ row.original.name }}
            </p>
            <p class="text-xs text-gray-400 mt-0.5">
              {{ row.original.slug }}
            </p>
          </div>
        </template>

        <template #parent-cell="{ row }">
          <span
            v-if="row.original.parent"
            class="text-sm text-gray-600"
          >
            {{ row.original.parent.name }}
          </span>
          <span
            v-else
            class="text-xs text-gray-300"
          >
            —
          </span>
        </template>

        <template #active-cell="{ row }">
          <UBadge
            :color="row.original.active ? 'success' : 'neutral'"
            variant="subtle"
            size="sm"
          >
            {{ row.original.active ? 'Activo' : 'Inactivo' }}
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

    <div class="flex items-center justify-between px-1">
      <p class="text-sm text-gray-500">
        <span class="font-medium text-gray-700">{{ totalElements }}</span> categorías en total
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
