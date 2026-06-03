<script setup lang="ts">
import type { TableColumn } from '@nuxt/ui'
import { usePaginatedSizeSearch } from '../composables/usePaginatedSizeSearch'
import type { SizeContent } from '../types/size-search'
import SizeFormModal from './SizeFormModal.vue'

const { searchSizes, sizes, isLoading, totalElements } = usePaginatedSizeSearch()

const PAGE_SIZE = 10
const currentPage = ref(1)
const nameSearch = ref('')

onMounted(() => load(1))

async function load(page: number) {
  currentPage.value = page
  await searchSizes({
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
const selectedSize = ref<SizeContent | undefined>()

function openAdd() {
  selectedSize.value = undefined
  modalMode.value = 'create'
  modalOpen.value = true
}

function openEdit(size: SizeContent) {
  selectedSize.value = size
  modalMode.value = 'edit'
  modalOpen.value = true
}

function openView(size: SizeContent) {
  selectedSize.value = size
  modalMode.value = 'view'
  modalOpen.value = true
}

defineExpose({ openAdd })

const columns: TableColumn<SizeContent>[] = [
  { id: 'index', header: '#' },
  { accessorKey: 'name', header: 'Nombre' },
  { accessorKey: 'sortOrder', header: 'Orden' },
  { id: 'actions', header: 'Acciones' }
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

    <div class="overflow-auto border border-solid rounded-lg border-default">
      <UTable
        :data="sizes"
        :columns="columns"
        :loading="isLoading"
      >
        <template #index-cell="{ row }">
          <span class="text-xs text-gray-400 tabular-nums">
            {{ (currentPage - 1) * PAGE_SIZE + row.index + 1 }}
          </span>
        </template>

        <template #name-cell="{ row }">
          <span class="text-sm font-medium text-gray-900">{{ row.original.name }}</span>
        </template>

        <template #sortOrder-cell="{ row }">
          <span class="text-sm text-gray-500 tabular-nums">{{ row.original.sortOrder }}</span>
        </template>

        <template #actions-cell="{ row }">
          <div class="flex items-center gap-0.5">
            <UButton
              color="neutral"
              variant="ghost"
              size="sm"
              icon="i-lucide-pencil"
              @click="openEdit(row.original)"
            />
            <UButton
              color="neutral"
              variant="ghost"
              size="sm"
              icon="i-lucide-eye"
              @click="openView(row.original)"
            />
          </div>
        </template>
      </UTable>
    </div>

    <div class="flex items-center justify-between px-1">
      <p class="text-sm text-gray-500">
        <span class="font-medium text-gray-700">{{ totalElements }}</span> tallas en total
      </p>
      <UPagination
        v-model:page="currentPage"
        variant="ghost"
        :total="totalElements"
        :items-per-page="PAGE_SIZE"
        @update:page="load"
      />
    </div>

    <SizeFormModal
      v-model:open="modalOpen"
      :mode="modalMode"
      :size="selectedSize"
      @saved="load(currentPage)"
    />
  </div>
</template>
