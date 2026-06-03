<script setup lang="ts">
import type { TableColumn } from '@nuxt/ui'
import { usePaginatedCollectionSearch } from '../composables/usePaginatedCollectionSearch'
import type { CollectionContent } from '../types/collection-search'
import CollectionFormModal from './CollectionFormModal.vue'

const { searchCollections, collections, isLoading, totalElements } = usePaginatedCollectionSearch()

const PAGE_SIZE = 20
const currentPage = ref(1)
const nameSearch = ref('')
const activeFilter = ref<boolean | undefined>(undefined)

onMounted(() => load(1))

async function load(page: number) {
  currentPage.value = page
  await searchCollections({
    page: page - 1,
    size: PAGE_SIZE,
    name: nameSearch.value || undefined,
    active: activeFilter.value
  })
}

let searchTimer: ReturnType<typeof setTimeout>
watch(nameSearch, () => {
  clearTimeout(searchTimer)
  searchTimer = setTimeout(() => load(1), 300)
})

watch(activeFilter, () => load(1))

const modalOpen = ref(false)
const modalMode = ref<'create' | 'edit' | 'view'>('create')
const selectedCollection = ref<CollectionContent | undefined>()

function openEdit(collection: CollectionContent) {
  selectedCollection.value = collection
  modalMode.value = 'edit'
  modalOpen.value = true
}

function openView(collection: CollectionContent) {
  selectedCollection.value = collection
  modalMode.value = 'view'
  modalOpen.value = true
}

const activeOptions = [
  { label: 'Todos', value: undefined },
  { label: 'Activas', value: true },
  { label: 'Inactivas', value: false }
]

const columns: TableColumn<CollectionContent>[] = [
  { id: 'index', header: '#' },
  { id: 'image', header: 'Imagen' },
  { accessorKey: 'name', header: 'Nombre' },
  { accessorKey: 'slug', header: 'Slug' },
  { accessorKey: 'position', header: 'Posición' },
  { id: 'productCount', header: 'Productos' },
  { id: 'active', header: 'Estado' },
  { id: 'actions', header: 'Acciones' }
]
</script>

<template>
  <div class="space-y-3">
    <!-- Filters -->
    <div class="flex items-center gap-3">
      <UInput
        v-model="nameSearch"
        placeholder="Buscar por nombre..."
        icon="i-lucide-search"
        size="sm"
        class="w-64"
      />
      <USelectMenu
        v-model="activeFilter"
        :items="activeOptions"
        value-key="value"
        size="sm"
        class="w-36"
        placeholder="Estado"
      />
    </div>

    <div class="overflow-auto border border-solid rounded-lg border-default">
      <UTable
        :data="collections"
        :columns="columns"
        :loading="isLoading"
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
            class="w-11 h-11 rounded-lg object-cover border border-gray-100"
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
          <span class="text-sm font-medium text-gray-900">{{ row.original.name }}</span>
        </template>

        <template #slug-cell="{ row }">
          <span class="text-xs font-mono text-gray-400">{{ row.original.slug }}</span>
        </template>

        <template #position-cell="{ row }">
          <span class="text-sm text-gray-500 tabular-nums">{{ row.original.position }}</span>
        </template>

        <template #productCount-cell="{ row }">
          <span class="text-sm text-gray-700 tabular-nums">{{ row.original.productCount }}</span>
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
        <span class="font-medium text-gray-700">{{ totalElements }}</span> colecciones en total
      </p>
      <UPagination
        v-model:page="currentPage"
        variant="ghost"
        :total="totalElements"
        :items-per-page="PAGE_SIZE"
        @update:page="load"
      />
    </div>

    <CollectionFormModal
      v-model:open="modalOpen"
      :mode="modalMode"
      :collection="selectedCollection"
      @saved="load(currentPage)"
    />
  </div>
</template>
