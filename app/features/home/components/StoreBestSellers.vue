<script setup lang="ts">
import { usePublicProducts } from '~/features/product/composables/usePublicProducts'

// Traemos 10 productos para la cuadrícula (2 filas de 5).
const { products } = usePublicProducts({ size: 10 })

const formatPrice = (value: number) =>
  value.toLocaleString('es-MX', { maximumFractionDigits: 0 })
</script>

<template>
  <section class="px-6 py-20 lg:px-10 lg:py-28">
    <div class="mx-auto max-w-(--ui-container)">
      <!-- Encabezado -->
      <div class="text-center">
        <p class="text-[11px] tracking-[0.3em] uppercase text-muted">
          Las favoritas de todas
        </p>
        <h2 class="mt-3 font-serif text-5xl font-medium text-highlighted lg:text-6xl">
          Más vendidos
        </h2>
      </div>

      <!-- Cuadrícula de productos -->
      <ul class="mt-14 grid grid-cols-2 gap-5 sm:grid-cols-3 lg:grid-cols-5">
        <li
          v-for="product in products"
          :key="product.id"
          class="group flex flex-col overflow-hidden rounded-2xl bg-muted shadow-[0_10px_30px_-14px_rgba(44,20,25,0.18)]"
        >
          <!-- Imagen -->
          <div class="relative aspect-[3/4] bg-elevated">
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
            <button
              type="button"
              class="absolute right-3 top-3 z-10 flex size-9 items-center justify-center rounded-full bg-white/90 text-toned shadow-sm transition-colors hover:text-wine-500"
              aria-label="Agregar a favoritos"
            >
              <UIcon
                name="i-lucide-heart"
                class="size-4"
              />
            </button>
          </div>

          <!-- Detalle -->
          <div class="flex flex-1 flex-col p-4">
            <p class="text-[10px] tracking-[0.2em] uppercase text-dimmed">
              {{ product.category?.name }}
            </p>
            <NuxtLink :to="`/products/${product.slug}`">
              <h3 class="mt-1 font-serif text-base text-highlighted transition-colors group-hover:text-wine-500">
                {{ product.name }}
              </h3>
            </NuxtLink>
            <p class="mt-1">
              <span class="text-lg font-semibold text-highlighted">${{ formatPrice(product.basePrice) }}</span>
              <span class="ml-1 text-xs text-muted">MXN</span>
            </p>
            <UButton
              :to="`/products/${product.slug}`"
              label="Agregar"
              color="neutral"
              variant="outline"
              block
              class="mt-4 rounded-full"
              :ui="{ label: 'uppercase tracking-[0.15em] text-[11px]' }"
            />
          </div>
        </li>
      </ul>
    </div>
  </section>
</template>
