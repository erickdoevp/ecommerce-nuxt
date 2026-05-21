<script setup lang="ts">
import { useDebounceFn } from '@vueuse/core'
import type { ProductSearchQuery } from '../types/product-search'
import { useListColor } from '../composables/useListColor'
import { useListSize } from '../composables/useListSize'
import { useListCategory } from '../composables/useListCategory'

export type ProductFilters = Omit<ProductSearchQuery, 'page' | 'size'>

const emit = defineEmits<{
  change: [filters: ProductFilters]
}>()

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

const debouncedPriceChange = useDebounceFn(emitChange, 600)

watch([status, categoryId, colorId, sizeId, sort], emitChange)
watch([minPrice, maxPrice], debouncedPriceChange)

const activeFilterCount = computed(() => {
  let count = 0
  if (status.value) count++
  if (categoryId.value) count++
  if (colorId.value) count++
  if (sizeId.value) count++
  if (minPrice.value !== undefined) count++
  if (maxPrice.value !== undefined) count++
  return count
})

function clearFilters() {
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
    <div class="flex flex-wrap gap-2">
      <!-- Status -->
      <USelectMenu
        v-model="status"
        :items="statusOptions"
        value-key="value"
        placeholder="Estado"
        class="w-36"
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
        class="w-44"
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
        class="w-36"
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
        class="w-32"
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

      <!-- Divider -->
      <div class="w-px bg-gray-200 self-stretch mx-1" />

      <!-- Price range -->
      <div class="flex items-center gap-1.5">
        <UInput
          v-model.number="minPrice"
          type="number"
          placeholder="Precio min"
          min="0"
          class="w-32"
          :ui="{ base: 'text-sm' }"
        >
          <template #leading>
            <span class="text-xs text-gray-400">$</span>
          </template>
        </UInput>
        <span class="text-gray-300 text-sm">—</span>
        <UInput
          v-model.number="maxPrice"
          type="number"
          placeholder="Precio max"
          min="0"
          class="w-32"
          :ui="{ base: 'text-sm' }"
        >
          <template #leading>
            <span class="text-xs text-gray-400">$</span>
          </template>
        </UInput>
      </div>

      <!-- Spacer -->
      <div class="flex-1" />

      <!-- Sort -->
      <USelectMenu
        v-model="sort"
        :items="sortOptions"
        value-key="value"
        class="w-48"
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
        v-if="activeFilterCount > 0"
        color="neutral"
        variant="outline"
        size="sm"
        icon="i-lucide-x"
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
