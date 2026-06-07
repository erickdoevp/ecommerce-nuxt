<script setup lang="ts">
import type { TableColumn } from '@nuxt/ui'
import { usePaginatedColorSearch } from '../composables/usePaginatedColorSearch'
import type { ColorContent } from '../types/color-search'
import ColorFormModal from './ColorFormModal.vue'

const { searchColors, colors, isLoading, totalElements } = usePaginatedColorSearch()

const PAGE_SIZE = 10
const currentPage = ref(1)
const nameSearch = ref('')

onMounted(() => load(1))

async function load(page: number) {
  currentPage.value = page
  await searchColors({
    page: page - 1,
    size: PAGE_SIZE,
    name: nameSearch.value || undefined
  })
}

let searchTimer: ReturnType<typeof setTimeout>
watch(nameSearch, () => {
  clearTimeout(searchTimer)
  searchTimer = setTimeout(() => load(1), 300)
})

const modalOpen = ref(false)
const modalMode = ref<'create' | 'edit' | 'view'>('create')
const selectedColor = ref<ColorContent | undefined>()

function openAdd() {
  selectedColor.value = undefined
  modalMode.value = 'create'
  modalOpen.value = true
}

function openEdit(color: ColorContent) {
  selectedColor.value = color
  modalMode.value = 'edit'
  modalOpen.value = true
}

function openView(color: ColorContent) {
  selectedColor.value = color
  modalMode.value = 'view'
  modalOpen.value = true
}

defineExpose({ openAdd })

function rowActions(color: ColorContent) {
  return [[
    { label: 'Editar color', icon: 'i-lucide-pencil', onSelect: () => openEdit(color) },
    { label: 'Ver color', icon: 'i-lucide-eye', onSelect: () => openView(color) }
  ]]
}

const columns: TableColumn<ColorContent>[] = [
  { id: 'index', header: '#' },
  { id: 'swatch', header: 'Muestra' },
  { accessorKey: 'name', header: 'Nombre' },
  { accessorKey: 'hex', header: 'Hex' },
  { id: 'actions', header: 'Acciones', meta: { class: { th: 'text-center', td: 'text-center' } } }
]
</script>

<template>
  <div class="space-y-3">
    <UInput
      v-model="nameSearch"
      placeholder="Buscar por nombre..."
      icon="i-lucide-search"
      size="sm"
      class="w-64"
    />

    <div class="overflow-auto max-h-[70vh] border border-solid rounded-lg border-default">
      <UTable
        :data="colors"
        :columns="columns"
        :loading="isLoading"
      >
        <template #index-cell="{ row }">
          <span class="text-xs text-gray-400 tabular-nums">
            {{ (currentPage - 1) * PAGE_SIZE + row.index + 1 }}
          </span>
        </template>

        <template #swatch-cell="{ row }">
          <div
            class="w-7 h-7 rounded-md border border-gray-200 shrink-0"
            :style="{ backgroundColor: row.original.hex }"
          />
        </template>

        <template #name-cell="{ row }">
          <span class="text-sm font-medium text-gray-900">{{ row.original.name }}</span>
        </template>

        <template #hex-cell="{ row }">
          <span class="text-sm font-mono text-gray-500">{{ row.original.hex }}</span>
        </template>

        <template #actions-cell="{ row }">
          <UDropdownMenu :items="rowActions(row.original)">
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
        <span class="font-medium text-gray-700">{{ totalElements }}</span> colores en total
      </p>
      <UPagination
        v-model:page="currentPage"
        variant="ghost"
        :total="totalElements"
        :items-per-page="PAGE_SIZE"
        @update:page="load"
      />
    </div>

    <ColorFormModal
      v-model:open="modalOpen"
      :mode="modalMode"
      :color="selectedColor"
      @saved="load(currentPage)"
    />
  </div>
</template>
