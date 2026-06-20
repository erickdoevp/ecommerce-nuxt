<script setup lang="ts">
import { usePublicProducts } from '~/features/product/composables/usePublicProducts'

// Recién llegadas: los más nuevos primero.
const { products } = usePublicProducts({ size: 8, sort: 'createdAt,desc' })

const formatPrice = (value: number) =>
  value.toLocaleString('es-MX', { maximumFractionDigits: 0 })
</script>

<template>
  <section class="px-6 py-20 lg:px-10 lg:py-28">
    <div class="mx-auto max-w-(--ui-container)">
      <!-- Encabezado -->
      <div class="flex items-end justify-between gap-6">
        <div>
          <p class="text-[11px] tracking-[0.3em] uppercase text-wine-500">
            Recién llegadas
          </p>
          <h2 class="mt-3 font-serif text-5xl font-medium text-highlighted lg:text-6xl">
            Últimos modelos
          </h2>
        </div>
        <span class="hidden shrink-0 items-center gap-2 text-sm text-muted sm:inline-flex">
          Desliza para ver más
          <UIcon name="i-lucide-arrow-right" />
        </span>
      </div>

      <!-- Carrusel -->
      <ul class="no-scrollbar mt-12 flex snap-x snap-mandatory gap-6 overflow-x-auto pb-2">
        <li
          v-for="product in products"
          :key="product.id"
          class="group w-[72%] shrink-0 snap-start sm:w-[45%] lg:w-[calc(25%-1.125rem)]"
        >
          <!-- Imagen -->
          <div class="relative aspect-[4/5] overflow-hidden rounded-2xl bg-elevated">
            <NuxtLink
              :to="`/products/${product.slug}`"
              class="absolute inset-0"
            >
              <img
                v-if="product.primaryImageUrl"
                :src="product.primaryImageUrl"
                :alt="product.name"
                class="size-full object-cover transition-transform duration-500 group-hover:scale-105"
                loading="lazy"
              >
            </NuxtLink>

            <span class="absolute left-4 top-4 rounded-full bg-white px-3 py-1.5 text-[10px] tracking-[0.15em] uppercase text-wine-500 shadow-sm">
              Nuevo
            </span>

            <NuxtLink
              :to="`/products/${product.slug}`"
              class="absolute bottom-4 right-4 flex size-12 items-center justify-center rounded-full bg-wine-500 text-white shadow-md transition-colors hover:bg-wine-600"
              :aria-label="`Ver ${product.name}`"
            >
              <UIcon
                name="i-lucide-plus"
                class="size-5"
              />
            </NuxtLink>
          </div>

          <!-- Detalle -->
          <div class="mt-4">
            <NuxtLink :to="`/products/${product.slug}`">
              <h3 class="font-serif text-lg text-highlighted transition-colors group-hover:text-wine-500">
                {{ product.name }}
              </h3>
            </NuxtLink>
            <p class="mt-1 text-sm text-muted">
              ${{ formatPrice(product.basePrice) }} MXN
            </p>
          </div>
        </li>
      </ul>
    </div>
  </section>
</template>

<style scoped>
.no-scrollbar {
  scrollbar-width: none;
}
.no-scrollbar::-webkit-scrollbar {
  display: none;
}
</style>
