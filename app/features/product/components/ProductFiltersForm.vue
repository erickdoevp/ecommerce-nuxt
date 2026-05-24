<script setup lang="ts">
import { useDebounceFn } from '@vueuse/core'
import type { ProductSearchQuery } from '../types/product-search'
import { useListColor } from '../composables/useListColor'
import { useListSize } from '../composables/useListSize'
import { useListCategory } from '../../category/composables/useListCategory'

export type ProductFilters = Omit<ProductSearchQuery, 'page' | 'size'>

const emit = defineEmits<{
  change: [filters: ProductFilters]
}>()

const name = ref('')
const status = ref<ProductSearchQuery['status']>()
const categoryId = ref<string>()
const colorId = ref<string>()
const sizeId = ref<string>()
const sort = ref('createdAt')
const minPrice = ref<number | undefined>()
const maxPrice = ref<number | undefined>()

const { getColors, selectColors, isLoading: loadingColors } = useListColor()
const { getSizes, selectSizes, isLoading: loadingSize } = useListSize()
const { getCategories, selectCategories, isLoading: loadingCategories } = useListCategory()

onMounted(() => {
  getColors()
  getSizes()
  getCategories()
})

function buildFilters(): ProductFilters {
  return {
    sort: sort.value,
    name: name.value || undefined,
    status: status.value,
    categoryId: categoryId.value,
    colorId: colorId.value,
    sizeId: sizeId.value,
    minPrice: minPrice.value,
    maxPrice: maxPrice.value
  }
}

function emitChange() {
  emit('change', buildFilters())
}

const debouncedEmit = useDebounceFn(emitChange, 500)

watch([status, categoryId, colorId, sizeId, sort], emitChange)
watch([name, minPrice, maxPrice], debouncedEmit)

const activeFilterCount = computed(() => {
  let count = 0
  if (name.value) count++
  if (status.value) count++
  if (categoryId.value) count++
  if (colorId.value) count++
  if (sizeId.value) count++
  if (minPrice.value !== undefined) count++
  if (maxPrice.value !== undefined) count++
  return count
})

function clearFilters() {
  if (activeFilterCount.value === 0) return
  name.value = ''
  status.value = undefined
  categoryId.value = undefined
  colorId.value = undefined
  sizeId.value = undefined
  sort.value = 'createdAt'
  minPrice.value = undefined
  maxPrice.value = undefined
}

const statusOptions = [
  { label: 'Borrador', value: 'DRAFT' },
  { label: 'Publicado', value: 'PUBLISHED' },
  { label: 'Archivado', value: 'ARCHIVED' }
]

const sortOptions = [
  { label: 'Más recientes', value: 'createdAt' },
  { label: 'Nombre A-Z', value: 'name,asc' },
  { label: 'Precio: menor a mayor', value: 'basePrice,asc' },
  { label: 'Precio: mayor a menor', value: 'basePrice,desc' }
]
</script>

<template>
  <div class="bg-white space-y-3">
    <!-- Row 1: categorical filters -->
    <div class="grid grid-cols-1 md:grid-cols-2">
      <!-- Name search -->
      <UInput
        v-model="name"
        placeholder="Buscar por nombre..."
        class="w-full"
      >
        <template #leading>
          <UIcon
            name="i-lucide-search"
            class="w-3.5 h-3.5 text-gray-400"
          />
        </template>
      </UInput>
    </div>
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 items-center gap-2">
      <!-- Status -->
      <USelectMenu
        v-model="status"
        :items="statusOptions"
        value-key="value"
        placeholder="Estado"
        class="w-full"
      >
        <template #leading>
          <UIcon
            name="i-lucide-filter"
            class="w-3.5 h-3.5 text-gray-400"
          />
        </template>
      </USelectMenu>

      <!-- Category -->
      <USelectMenu
        v-model="categoryId"
        :items="selectCategories"
        value-key="value"
        placeholder="Categoría"
        :loading="loadingCategories"
        class="w-full"
        searchable
        search-placeholder="Buscar categoría..."
      >
        <template #leading>
          <UIcon
            name="i-lucide-folder"
            class="w-3.5 h-3.5 text-gray-400"
          />
        </template>
      </USelectMenu>

      <!-- Color -->
      <USelectMenu
        v-model="colorId"
        :items="selectColors"
        value-key="value"
        placeholder="Color"
        :loading="loadingColors"
        class="w-full"
        searchable
        search-placeholder="Buscar color..."
      >
        <template #leading>
          <UIcon
            name="i-lucide-palette"
            class="w-3.5 h-3.5 text-gray-400"
          />
        </template>
      </USelectMenu>

      <!-- Size -->
      <USelectMenu
        v-model="sizeId"
        :items="selectSizes"
        value-key="value"
        placeholder="Talla"
        :loading="loadingSize"
        class="w-full"
        searchable
        search-placeholder="Buscar talla..."
      >
        <template #leading>
          <UIcon
            name="i-lucide-ruler"
            class="w-3.5 h-3.5 text-gray-400"
          />
        </template>
      </USelectMenu>

      <!-- Sort -->
      <USelectMenu
        v-model="sort"
        :items="sortOptions"
        value-key="value"
        class="w-full"
      >
        <template #leading>
          <UIcon
            name="i-lucide-arrow-up-down"
            class="w-3.5 h-3.5 text-gray-400"
          />
        </template>
      </USelectMenu>

      <!-- Clear -->
      <UButton
        :disabled="activeFilterCount === 0"
        color="neutral"
        variant="outline"
        size="sm"
        icon="i-lucide-x"
        class="w-fit"
        @click="clearFilters"
      >
        Limpiar
        <UBadge
          :label="activeFilterCount"
          color="neutral"
          variant="solid"
          size="sm"
          class="ml-1"
        />
      </UButton>
    </div>
  </div>
</template>
