<script setup lang="ts">
import { useDebounceFn } from '@vueuse/core'
import type { OrderSearchQuery } from '../types/order-search'
import { ORDER_STATUS_OPTIONS } from '../types/order-search'

export type OrderFilters = Omit<OrderSearchQuery, 'page' | 'size'>

const emit = defineEmits<{
  change: [filters: OrderFilters]
}>()

const orderNumber = ref('')
const status = ref<OrderSearchQuery['status']>()
const userId = ref('')
const dateFrom = ref('')
const dateTo = ref('')
const sort = ref('createdAt,desc')

function buildFilters(): OrderFilters {
  return {
    sort: sort.value,
    status: status.value,
    orderNumber: orderNumber.value || undefined,
    userId: userId.value || undefined,
    dateFrom: dateFrom.value || undefined,
    dateTo: dateTo.value || undefined
  }
}

function emitChange() {
  emit('change', buildFilters())
}

const debouncedEmit = useDebounceFn(emitChange, 500)

watch([status, dateFrom, dateTo, sort], emitChange)
watch([orderNumber, userId], debouncedEmit)

const activeFilterCount = computed(() => {
  let count = 0
  if (status.value) count++
  if (orderNumber.value) count++
  if (userId.value) count++
  if (dateFrom.value) count++
  if (dateTo.value) count++
  return count
})

function clearFilters() {
  if (activeFilterCount.value === 0) return
  orderNumber.value = ''
  status.value = undefined
  userId.value = ''
  dateFrom.value = ''
  dateTo.value = ''
  sort.value = 'createdAt,desc'
}

const sortOptions = [
  { label: 'Más recientes', value: 'createdAt,desc' },
  { label: 'Más antiguos', value: 'createdAt,asc' },
  { label: 'Total: mayor a menor', value: 'total,desc' },
  { label: 'Total: menor a mayor', value: 'total,asc' }
]
</script>

<template>
  <div class="bg-white space-y-3">
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 items-center gap-2">
      <!-- Order number -->
      <UInput
        v-model="orderNumber"
        placeholder="N° de pedido"
        class="w-full"
      >
        <template #leading>
          <UIcon
            name="i-lucide-hash"
            class="w-3.5 h-3.5 text-gray-400"
          />
        </template>
      </UInput>

      <!-- Status -->
      <USelectMenu
        v-model="status"
        :items="ORDER_STATUS_OPTIONS"
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

      <!-- Customer id -->
      <UInput
        v-model="userId"
        placeholder="ID de cliente"
        class="w-full"
      >
        <template #leading>
          <UIcon
            name="i-lucide-user"
            class="w-3.5 h-3.5 text-gray-400"
          />
        </template>
      </UInput>

      <!-- Date from -->
      <UInput
        v-model="dateFrom"
        type="date"
        class="w-full"
      />

      <!-- Date to -->
      <UInput
        v-model="dateTo"
        type="date"
        class="w-full"
      />

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

    <div class="flex justify-end">
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
