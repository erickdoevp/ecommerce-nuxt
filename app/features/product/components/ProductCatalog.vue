<script setup lang="ts">
import { useRootCategories } from '~/features/category/composables/useRootCategories'
import { useActiveCollections } from '~/features/collection/composables/useActiveCollections'
import { usePublicProducts } from '~/features/product/composables/usePublicProducts'
import { usePublicColors } from '~/features/product/composables/usePublicColors'
import { usePublicSizes } from '~/features/product/composables/usePublicSizes'
import type { ProductSearchQuery } from '~/features/product/types/product-search'
import ProductCard from '~/features/product/components/ProductCard.vue'

// Catálogo reutilizable: toolbar + grid + slideover de filtros.
// - lockedCategoryId: fija el filtro de categoría y oculta su acordeón (páginas de categoría).
// - hideCollectionFilter: oculta el acordeón de colección.
const props = defineProps<{
  lockedCategoryId?: string
  hideCollectionFilter?: boolean
}>()

const emit = defineEmits<{ 'update:total': [number] }>()

const showCategoryFilter = computed(() => !props.lockedCategoryId)
const showCollectionFilter = computed(() => !props.hideCollectionFilter)

// Datos para los filtros.
const { categories } = useRootCategories()
const { collections } = useActiveCollections()
const { colors } = usePublicColors()
const { sizes } = usePublicSizes()

// Estado de filtros (todos multivalor, soportados por el endpoint).
const filters = reactive({
  categories: [] as string[],
  collections: [] as string[],
  colors: [] as string[],
  sizes: [] as string[],
  minPrice: null as number | null,
  maxPrice: null as number | null
})

function toggle(list: string[], value: string) {
  const i = list.indexOf(value)
  if (i === -1) list.push(value)
  else list.splice(i, 1)
}

function clearFilters() {
  filters.categories = []
  filters.collections = []
  filters.colors = []
  filters.sizes = []
  filters.minPrice = null
  filters.maxPrice = null
}

// Orden.
const sortOptions = [
  { id: 'destacado', label: 'Destacado', sort: 'createdAt,desc' },
  { id: 'novedades', label: 'Novedades', sort: 'createdAt,desc' },
  { id: 'precio-asc', label: 'Precio ↑', sort: 'basePrice,asc' },
  { id: 'precio-desc', label: 'Precio ↓', sort: 'basePrice,desc' }
]
const selectedSort = ref(sortOptions[0]!)
const sortOpen = ref(false)

// Query reactiva → el composable refetch al cambiar cualquier filtro u orden.
const query = computed<Partial<ProductSearchQuery>>(() => ({
  size: 12,
  sort: selectedSort.value.sort,
  categoryId: props.lockedCategoryId
    ? props.lockedCategoryId
    : filters.categories.length ? filters.categories : undefined,
  collectionId: showCollectionFilter.value && filters.collections.length ? filters.collections : undefined,
  colorId: filters.colors.length ? filters.colors : undefined,
  sizeId: filters.sizes.length ? filters.sizes : undefined,
  minPrice: filters.minPrice || undefined,
  maxPrice: filters.maxPrice || undefined
}))

const { products, totalElements } = usePublicProducts(query)

watch(totalElements, value => emit('update:total', value), { immediate: true })

// UI: slideover y secciones colapsables.
const filtersOpen = ref(false)
const open = reactive({
  categoria: false,
  coleccion: true,
  color: true,
  talla: true,
  precio: false
})
</script>

<template>
  <div>
    <!-- Toolbar -->
    <div class="flex items-center justify-between">
      <div class="flex items-center gap-4">
        <UButton
          icon="i-lucide-sliders-horizontal"
          label="Filtros"
          color="neutral"
          variant="outline"
          class="rounded-full"
          :ui="{ label: 'tracking-[0.15em] uppercase text-[12px]' }"
          @click="filtersOpen = true"
        />
        <span class="text-sm text-muted">{{ totalElements }} piezas</span>
      </div>

      <!-- Menú de orden -->
      <UPopover
        v-model:open="sortOpen"
        :content="{ align: 'end' }"
      >
        <button
          type="button"
          class="flex items-center gap-2 rounded-full border border-default px-5 py-2.5 text-[12px] tracking-[0.15em] uppercase"
        >
          <span class="text-muted">Ordenar:</span>
          <span class="text-highlighted">{{ selectedSort.label }}</span>
          <UIcon
            name="i-lucide-chevron-down"
            class="text-muted transition-transform"
            :class="sortOpen ? 'rotate-180' : ''"
          />
        </button>
        <template #content>
          <div class="w-56 p-2">
            <button
              v-for="opt in sortOptions"
              :key="opt.id"
              type="button"
              class="flex w-full items-center justify-between rounded-lg px-4 py-3 text-sm transition-colors"
              :class="selectedSort.id === opt.id ? 'bg-elevated text-wine-500' : 'text-toned hover:bg-muted'"
              @click="selectedSort = opt; sortOpen = false"
            >
              {{ opt.label }}
              <UIcon
                v-if="selectedSort.id === opt.id"
                name="i-lucide-check"
              />
            </button>
          </div>
        </template>
      </UPopover>
    </div>

    <!-- Grid de productos -->
    <div
      v-if="products.length"
      class="mt-8 grid grid-cols-2 gap-5 sm:grid-cols-3 lg:grid-cols-4"
    >
      <ProductCard
        v-for="product in products"
        :key="product.id"
        :product="product"
        :to="`/products/${product.slug}`"
      />
    </div>
    <p
      v-else
      class="mt-16 text-center text-muted"
    >
      No encontramos piezas con esos filtros.
    </p>

    <!-- Slideover de filtros -->
    <USlideover
      v-model:open="filtersOpen"
      side="left"
      :ui="{ content: 'max-w-md' }"
    >
      <template #header>
        <div class="flex w-full items-center justify-between">
          <h2 class="font-serif text-3xl text-highlighted">
            Filtros
          </h2>
          <UButton
            icon="i-lucide-x"
            color="neutral"
            variant="soft"
            class="rounded-full"
            aria-label="Cerrar filtros"
            @click="filtersOpen = false"
          />
        </div>
      </template>

      <template #body>
        <!-- Categoría -->
        <div
          v-if="showCategoryFilter"
          class="border-b border-default py-5"
        >
          <button
            type="button"
            class="flex w-full items-center justify-between"
            @click="open.categoria = !open.categoria"
          >
            <span class="text-[12px] tracking-[0.2em] uppercase text-muted">Categoría</span>
            <UIcon :name="open.categoria ? 'i-lucide-chevron-up' : 'i-lucide-chevron-down'" />
          </button>
          <div
            v-show="open.categoria"
            class="mt-4 space-y-1"
          >
            <button
              v-for="category in categories"
              :key="category.id"
              type="button"
              class="flex w-full items-center justify-between py-2.5"
              @click="toggle(filters.categories, category.id)"
            >
              <span class="flex items-center gap-3">
                <span
                  class="flex size-6 items-center justify-center rounded-md border"
                  :class="filters.categories.includes(category.id) ? 'border-wine-500 bg-wine-500 text-white' : 'border-default'"
                >
                  <UIcon
                    v-if="filters.categories.includes(category.id)"
                    name="i-lucide-check"
                    class="size-4"
                  />
                </span>
                <span class="text-toned">{{ category.name }}</span>
              </span>
            </button>
          </div>
        </div>

        <!-- Colección -->
        <div
          v-if="showCollectionFilter"
          class="border-b border-default py-5"
        >
          <button
            type="button"
            class="flex w-full items-center justify-between"
            @click="open.coleccion = !open.coleccion"
          >
            <span class="text-[12px] tracking-[0.2em] uppercase text-muted">Colección</span>
            <UIcon :name="open.coleccion ? 'i-lucide-chevron-up' : 'i-lucide-chevron-down'" />
          </button>
          <div
            v-show="open.coleccion"
            class="mt-4 space-y-1"
          >
            <button
              v-for="collection in collections"
              :key="collection.id"
              type="button"
              class="flex w-full items-center justify-between py-2.5"
              @click="toggle(filters.collections, collection.id)"
            >
              <span class="flex items-center gap-3">
                <span
                  class="flex size-6 items-center justify-center rounded-md border"
                  :class="filters.collections.includes(collection.id) ? 'border-wine-500 bg-wine-500 text-white' : 'border-default'"
                >
                  <UIcon
                    v-if="filters.collections.includes(collection.id)"
                    name="i-lucide-check"
                    class="size-4"
                  />
                </span>
                <span class="text-toned">{{ collection.name }}</span>
              </span>
              <span class="text-sm text-dimmed">{{ collection.productCount }}</span>
            </button>
          </div>
        </div>

        <!-- Color -->
        <div class="border-b border-default py-5">
          <button
            type="button"
            class="flex w-full items-center justify-between"
            @click="open.color = !open.color"
          >
            <span class="text-[12px] tracking-[0.2em] uppercase text-muted">Color</span>
            <UIcon :name="open.color ? 'i-lucide-chevron-up' : 'i-lucide-chevron-down'" />
          </button>
          <div
            v-show="open.color"
            class="mt-5 flex flex-wrap gap-3"
          >
            <button
              v-for="color in colors"
              :key="color.id"
              type="button"
              class="flex size-11 items-center justify-center rounded-full border-2 transition-colors"
              :class="filters.colors.includes(color.id) ? 'border-wine-500' : 'border-default'"
              :aria-label="color.name"
              @click="toggle(filters.colors, color.id)"
            >
              <span
                class="size-8 rounded-full"
                :style="{ backgroundColor: color.hex }"
              />
            </button>
          </div>
        </div>

        <!-- Talla -->
        <div class="border-b border-default py-5">
          <button
            type="button"
            class="flex w-full items-center justify-between"
            @click="open.talla = !open.talla"
          >
            <span class="text-[12px] tracking-[0.2em] uppercase text-muted">Talla</span>
            <UIcon :name="open.talla ? 'i-lucide-chevron-up' : 'i-lucide-chevron-down'" />
          </button>
          <div
            v-show="open.talla"
            class="mt-5 flex flex-wrap gap-3"
          >
            <button
              v-for="size in sizes"
              :key="size.id"
              type="button"
              class="flex size-14 items-center justify-center rounded-xl border text-sm transition-colors"
              :class="filters.sizes.includes(size.id) ? 'border-wine-500 bg-wine-500 text-white' : 'border-default text-toned hover:border-wine-300'"
              @click="toggle(filters.sizes, size.id)"
            >
              {{ size.name }}
            </button>
          </div>
        </div>

        <!-- Precio -->
        <div class="py-5">
          <button
            type="button"
            class="flex w-full items-center justify-between"
            @click="open.precio = !open.precio"
          >
            <span class="text-[12px] tracking-[0.2em] uppercase text-muted">Precio</span>
            <UIcon :name="open.precio ? 'i-lucide-chevron-up' : 'i-lucide-chevron-down'" />
          </button>
          <div
            v-show="open.precio"
            class="mt-4 flex items-center gap-3"
          >
            <UInput
              v-model.number="filters.minPrice"
              type="number"
              placeholder="Mín"
              class="flex-1"
            />
            <span class="text-muted">—</span>
            <UInput
              v-model.number="filters.maxPrice"
              type="number"
              placeholder="Máx"
              class="flex-1"
            />
          </div>
        </div>
      </template>

      <template #footer>
        <div class="flex w-full gap-3">
          <UButton
            label="Limpiar"
            color="neutral"
            variant="outline"
            size="lg"
            class="rounded-full"
            :ui="{ label: 'tracking-[0.15em] uppercase text-[12px]' }"
            @click="clearFilters"
          />
          <UButton
            :label="`Ver ${totalElements} piezas`"
            color="primary"
            size="lg"
            block
            class="flex-1 rounded-full"
            :ui="{ label: 'tracking-[0.15em] uppercase text-[12px]' }"
            @click="filtersOpen = false"
          />
        </div>
      </template>
    </USlideover>
  </div>
</template>
