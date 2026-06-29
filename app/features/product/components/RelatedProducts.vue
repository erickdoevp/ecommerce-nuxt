<script setup lang="ts">
import { usePublicProducts } from '../composables/usePublicProducts'
import ProductCard from './ProductCard.vue'

const props = defineProps<{
  categoryId: string
  excludeProductId: string
}>()

// Productos de la misma categoría, excluyendo el actual; máximo 4.
const { products } = usePublicProducts(() => ({ categoryId: props.categoryId, size: 5 }))

const related = computed(() =>
  products.value.filter(p => p.id !== props.excludeProductId).slice(0, 4)
)
</script>

<template>
  <section
    v-if="related.length"
    class="px-6 py-20 lg:px-10"
  >
    <div class="mx-auto max-w-(--ui-container)">
      <!-- Encabezado -->
      <div class="flex items-end justify-between gap-6">
        <div>
          <p class="text-[11px] tracking-[0.3em] uppercase text-wine-500">
            Te puede gustar
          </p>
          <h2 class="mt-3 font-serif text-4xl font-medium text-highlighted lg:text-5xl">
            Completa el look
          </h2>
        </div>
        <NuxtLink
          to="/products"
          class="shrink-0 border-b border-default pb-1 text-[11px] tracking-[0.2em] uppercase text-toned transition-colors hover:text-wine-500"
        >
          Ver todo
        </NuxtLink>
      </div>

      <!-- Listado -->
      <ul class="mt-10 grid grid-cols-2 gap-5 lg:grid-cols-4 lg:gap-6">
        <li
          v-for="product in related"
          :key="product.id"
        >
          <ProductCard :product="product" />
        </li>
      </ul>
    </div>
  </section>
</template>
