<script setup lang="ts">
import { useDebounceFn } from '@vueuse/core'
import type { CategorySearchQuery } from '../types/category-search'
import type { SelectOption } from '~/components/types/select'

export type CategoryFilters = Omit<CategorySearchQuery, 'page' | 'size'>

defineProps<{
  selectCategories: SelectOption[]
}>()

const emit = defineEmits<{
  change: [filters: CategoryFilters]
}>()

const name = ref('')
const parentId = ref<string>()
const activeFilter = ref<'all' | 'true' | 'false'>('all')
const sort = ref('createdAt,desc')

function buildFilters(): CategoryFilters {
  return {
    sort: sort.value,
    name: name.value || undefined,
    active: activeFilter.value === 'all' ? undefined : activeFilter.value === 'true',
    parentId: parentId.value
  }
}

function emitChange() {
  emit('change', buildFilters())
}

const debouncedEmit = useDebounceFn(emitChange, 500)

watch([activeFilter, sort, parentId], emitChange)
watch(name, debouncedEmit)

const activeFilterCount = computed(() => {
  let count = 0
  if (name.value) count++
  if (activeFilter.value !== 'all') count++
  if (parentId.value) count++
  return count
})

function clearFilters() {
  if (activeFilterCount.value === 0) return
  name.value = ''
  activeFilter.value = 'all'
  parentId.value = undefined
  sort.value = 'createdAt,desc'
}

const activeOptions = [
  { label: 'Todos', value: 'all' },
  { label: 'Activo', value: 'true' },
  { label: 'Inactivo', value: 'false' }
]

const sortOptions = [
  { label: 'Más recientes', value: 'createdAt,desc' },
  { label: 'Más antiguos', value: 'createdAt,asc' },
  { label: 'Nombre A-Z', value: 'name,asc' },
  { label: 'Nombre Z-A', value: 'name,desc' }
]
</script>

<template>
  <div class="bg-white space-y-3">
    <div class="grid grid-cols-1 md:grid-cols-2">
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

    <div class="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-3">
      <!-- Estado -->
      <USelectMenu
        v-model="activeFilter"
        :items="activeOptions"
        value-key="value"
        class="w-full"
      >
        <template #leading>
          <UIcon
            name="i-lucide-circle-dot"
            class="w-3.5 h-3.5 text-gray-400"
          />
        </template>
      </USelectMenu>

      <!-- Categoría padre -->
      <USelectMenu
        v-model="parentId"
        :items="selectCategories"
        value-key="value"
        placeholder="Categoría padre"
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

      <!-- Ordenar -->
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

      <!-- Limpiar -->
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
          v-if="activeFilterCount > 0"
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
