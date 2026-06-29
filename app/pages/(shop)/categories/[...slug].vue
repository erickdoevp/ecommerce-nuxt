<script setup lang="ts">
import { usePublicCategoryTree } from '~/features/category/composables/usePublicCategoryTree'
import type { CategoryTree } from '~/features/category/types/category-tree'
import ProductCatalog from '~/features/product/components/ProductCatalog.vue'

definePageMeta({
  layout: 'store'
})

const route = useRoute()
const { categories: tree, pending } = usePublicCategoryTree()

// Segmentos del path: /categories/lenceria/bras/push-up -> ['lenceria','bras','push-up'].
const segments = computed(() => {
  const slug = route.params.slug
  return (Array.isArray(slug) ? slug : [slug]).filter(Boolean) as string[]
})

// Resuelve el path caminando el árbol por slug. Devuelve el rastro de
// categorías (para breadcrumb) o null si algún segmento no existe.
const trail = computed<CategoryTree[] | null>(() => {
  const result: CategoryTree[] = []
  let level = tree.value
  for (const slug of segments.value) {
    const found = level.find(c => c.slug === slug)
    if (!found) return null
    result.push(found)
    level = found.children
  }
  return result.length ? result : null
})

const category = computed(() => trail.value?.at(-1) ?? null)
const isLeaf = computed(() => category.value !== null && category.value.children.length === 0)
const notFound = computed(() => !pending.value && trail.value === null)

// Rastro con su path acumulado, para enlaces del breadcrumb y de los hijos.
const crumbs = computed(() =>
  (trail.value ?? []).map((cat, i) => ({
    ...cat,
    path: `/categories/${segments.value.slice(0, i + 1).join('/')}`
  }))
)

const currentPath = computed(() => `/categories/${segments.value.join('/')}`)

useHead(() => ({ title: category.value?.name ?? 'Categoría' }))

const total = ref(0)
</script>

<template>
  <div class="px-6 py-12 lg:px-10 lg:py-16">
    <div class="mx-auto max-w-(--ui-container)">
      <!-- No encontrada -->
      <div
        v-if="notFound"
        class="py-24 text-center"
      >
        <h1 class="font-serif text-4xl text-highlighted">
          Categoría no encontrada
        </h1>
        <p class="mt-4 text-muted">
          La categoría que buscas no existe o fue movida.
        </p>
        <UButton
          to="/products"
          label="Ver la tienda"
          color="primary"
          class="mt-8 rounded-full"
          :ui="{ label: 'tracking-[0.15em] uppercase text-[12px]' }"
        />
      </div>

      <template v-else-if="category">
        <!-- Breadcrumb -->
        <nav class="text-[11px] tracking-[0.15em] uppercase text-dimmed">
          <NuxtLink
            to="/"
            class="transition-colors hover:text-toned"
          >
            Inicio
          </NuxtLink>
          <template
            v-for="crumb in crumbs"
            :key="crumb.id"
          >
            <span class="mx-2">/</span>
            <NuxtLink
              :to="crumb.path"
              class="transition-colors hover:text-toned"
              :class="crumb.id === category.id ? 'text-toned' : ''"
            >
              {{ crumb.name }}
            </NuxtLink>
          </template>
        </nav>

        <!-- Encabezado -->
        <div class="mt-6">
          <p class="text-[11px] tracking-[0.3em] uppercase text-wine-500">
            Categoría
          </p>
          <h1 class="mt-3 font-serif text-5xl font-medium text-highlighted lg:text-6xl">
            {{ category.name }}
          </h1>
          <p
            v-if="isLeaf"
            class="mt-3 text-sm text-muted"
          >
            {{ total }} piezas
          </p>
        </div>

        <!-- Hoja: listado de productos con filtros (categoría fija, sin colección) -->
        <div
          v-if="isLeaf"
          class="mt-10"
        >
          <ProductCatalog
            :locked-category-id="category.id"
            hide-collection-filter
            @update:total="total = $event"
          />
        </div>

        <!-- Con hijos: grid de subcategorías -->
        <div
          v-else
          class="mt-10 grid grid-cols-2 gap-5 sm:grid-cols-3 lg:grid-cols-4"
        >
          <NuxtLink
            v-for="child in category.children"
            :key="child.id"
            :to="`${currentPath}/${child.slug}`"
            class="group relative block aspect-[3/4] overflow-hidden rounded-2xl bg-elevated"
          >
            <img
              v-if="child.imageUrl"
              :src="child.imageUrl"
              :alt="child.name"
              class="absolute inset-0 size-full object-cover transition-transform duration-500 group-hover:scale-105"
              loading="lazy"
            >
            <div class="absolute inset-0 bg-gradient-to-t from-black/55 via-black/10 to-transparent" />
            <div class="absolute inset-x-0 bottom-0 p-5">
              <p class="font-serif text-xl text-white leading-tight">
                {{ child.name }}
              </p>
            </div>
          </NuxtLink>
        </div>
      </template>
    </div>
  </div>
</template>
