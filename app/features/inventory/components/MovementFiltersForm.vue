<script setup lang="ts">
import { useDebounceFn } from '@vueuse/core'
import type { InventoryMovementQuery } from '../types/inventory-movement'
import { KARDEX_TYPE_OPTIONS } from '../types/variant-paginated-kardex'

export type MovementFilters = Omit<InventoryMovementQuery, 'page' | 'size'>

const emit = defineEmits<{
  change: [filters: MovementFilters]
}>()

const type = ref<InventoryMovementQuery['type']>()
const dateFrom = ref('')
const dateTo = ref('')
const variantId = ref('')
const orderId = ref('')
const sort = ref('createdAt,desc')

function buildFilters(): MovementFilters {
  return {
    sort: sort.value,
    type: type.value,
    dateFrom: dateFrom.value || undefined,
    dateTo: dateTo.value || undefined,
    variantId: variantId.value.trim() || undefined,
    orderId: orderId.value.trim() || undefined
  }
}

function emitChange() {
  emit('change', buildFilters())
}

const debouncedEmit = useDebounceFn(emitChange, 500)

watch([type, dateFrom, dateTo, sort], emitChange)
watch([variantId, orderId], debouncedEmit)

const activeFilterCount = computed(() => {
  let count = 0
  if (type.value) count++
  if (dateFrom.value) count++
  if (dateTo.value) count++
  if (variantId.value.trim()) count++
  if (orderId.value.trim()) count++
  return count
})

function clearFilters() {
  if (activeFilterCount.value === 0) return
  type.value = undefined
  dateFrom.value = ''
  dateTo.value = ''
  variantId.value = ''
  orderId.value = ''
  sort.value = 'createdAt,desc'
}

const sortOptions = [
  { label: 'Más recientes', value: 'createdAt,desc' },
  { label: 'Más antiguos', value: 'createdAt,asc' }
]
</script>

<template>
  <div class="bg-white space-y-3">
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 items-center gap-2">
      <!-- Tipo -->
      <USelectMenu
        v-model="type"
        :items="KARDEX_TYPE_OPTIONS"
        value-key="value"
        placeholder="Tipo de movimiento"
        class="w-full"
      >
        <template #leading>
          <UIcon
            name="i-lucide-filter"
            class="w-3.5 h-3.5 text-gray-400"
          />
        </template>
      </USelectMenu>

      <!-- Desde -->
      <UInput
        v-model="dateFrom"
        type="date"
        class="w-full"
      >
        <template #leading>
          <UIcon
            name="i-lucide-calendar-arrow-up"
            class="w-3.5 h-3.5 text-gray-400"
          />
        </template>
      </UInput>

      <!-- Hasta -->
      <UInput
        v-model="dateTo"
        type="date"
        class="w-full"
      >
        <template #leading>
          <UIcon
            name="i-lucide-calendar-arrow-down"
            class="w-3.5 h-3.5 text-gray-400"
          />
        </template>
      </UInput>

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
    </div>

    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 items-center gap-2">
      <!-- Variant ID -->
      <UInput
        v-model="variantId"
        placeholder="ID de variante (UUID)"
        class="w-full"
      >
        <template #leading>
          <UIcon
            name="i-lucide-barcode"
            class="w-3.5 h-3.5 text-gray-400"
          />
        </template>
      </UInput>

      <!-- Order ID -->
      <UInput
        v-model="orderId"
        placeholder="ID de pedido (UUID)"
        class="w-full"
      >
        <template #leading>
          <UIcon
            name="i-lucide-package"
            class="w-3.5 h-3.5 text-gray-400"
          />
        </template>
      </UInput>

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
