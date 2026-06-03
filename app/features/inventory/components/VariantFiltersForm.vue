<script setup lang="ts">
import { useDebounceFn } from '@vueuse/core'
import type { VariantInventoryQuery } from '../types/variant-inventory'
import { PRODUCT_STATUS_OPTIONS } from '../types/variant-inventory'
import { useListColor } from '../../product/composables/useListColor'
import { useListSize } from '../../product/composables/useListSize'

export type VariantFilters = Omit<VariantInventoryQuery, 'page' | 'size'>

const emit = defineEmits<{
  change: [filters: VariantFilters]
}>()

const productName = ref('')
const sku = ref('')
const colorId = ref<string>()
const sizeId = ref<string>()
const status = ref<VariantInventoryQuery['status']>()
const active = ref<boolean | undefined>(undefined)
const sort = ref('sku,asc')

const { getColors, selectColors, isLoading: loadingColors } = useListColor()
const { getSizes, selectSizes, isLoading: loadingSize } = useListSize()

onMounted(() => {
  getColors()
  getSizes()
})

function buildFilters(): VariantFilters {
  return {
    sort: sort.value,
    productName: productName.value || undefined,
    sku: sku.value || undefined,
    colorId: colorId.value,
    sizeId: sizeId.value,
    status: status.value,
    active: active.value
  }
}

function emitChange() {
  emit('change', buildFilters())
}

const debouncedEmit = useDebounceFn(emitChange, 500)

watch([colorId, sizeId, status, active, sort], emitChange)
watch([productName, sku], debouncedEmit)

const activeFilterCount = computed(() => {
  let count = 0
  if (productName.value) count++
  if (sku.value) count++
  if (colorId.value) count++
  if (sizeId.value) count++
  if (status.value) count++
  if (active.value !== undefined) count++
  return count
})

function clearFilters() {
  if (activeFilterCount.value === 0) return
  productName.value = ''
  sku.value = ''
  colorId.value = undefined
  sizeId.value = undefined
  status.value = undefined
  active.value = undefined
  sort.value = 'sku,asc'
}

const activeOptions = [
  { label: 'Todas', value: undefined },
  { label: 'Activas', value: true },
  { label: 'Inactivas', value: false }
]

const sortOptions = [
  { label: 'SKU A-Z', value: 'sku,asc' },
  { label: 'SKU Z-A', value: 'sku,desc' },
  { label: 'Stock: menor a mayor', value: 'availableStock,asc' },
  { label: 'Stock: mayor a menor', value: 'availableStock,desc' }
]
</script>

<template>
  <div class="bg-white space-y-3">
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 items-center gap-2">
      <!-- Product name -->
      <UInput
        v-model="productName"
        placeholder="Buscar por producto..."
        class="w-full"
      >
        <template #leading>
          <UIcon
            name="i-lucide-search"
            class="w-3.5 h-3.5 text-gray-400"
          />
        </template>
      </UInput>

      <!-- SKU -->
      <UInput
        v-model="sku"
        placeholder="SKU"
        class="w-full"
      >
        <template #leading>
          <UIcon
            name="i-lucide-barcode"
            class="w-3.5 h-3.5 text-gray-400"
          />
        </template>
      </UInput>

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
    </div>

    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 items-center gap-2">
      <!-- Status -->
      <USelectMenu
        v-model="status"
        :items="PRODUCT_STATUS_OPTIONS"
        value-key="value"
        placeholder="Estado del producto"
        class="w-full"
      >
        <template #leading>
          <UIcon
            name="i-lucide-filter"
            class="w-3.5 h-3.5 text-gray-400"
          />
        </template>
      </USelectMenu>

      <!-- Active -->
      <USelectMenu
        v-model="active"
        :items="activeOptions"
        value-key="value"
        placeholder="Variante"
        class="w-full"
      >
        <template #leading>
          <UIcon
            name="i-lucide-toggle-left"
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
