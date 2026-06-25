<script setup lang="ts">
import { useActiveCollections } from '~/features/collection/composables/useActiveCollections'

definePageMeta({
  layout: 'store'
})
const { collections, pending } = useActiveCollections()

// Gradiente de respaldo cuando la colección no tiene imageUrl (se asigna por posición).
const gradients = [
  'bg-gradient-to-b from-terracotta-200 via-terracotta-400 to-terracotta-700',
  'bg-gradient-to-b from-slate-500 via-slate-700 to-slate-900',
  'bg-gradient-to-b from-bronze-200 via-bronze-400 to-bronze-600'
]
</script>

<template>
  <div class="px-6 py-12 lg:px-10 lg:py-16">
    <div class="mx-auto max-w-(--ui-container)">
      <!-- Breadcrumb -->
      <nav class="text-[11px] tracking-[0.15em] uppercase text-dimmed">
        <NuxtLink
          to="/"
          class="transition-colors hover:text-toned"
        >
          Inicio
        </NuxtLink>
        <span class="mx-2">/</span>
        <span class="text-toned">Colecciones</span>
      </nav>

      <!-- Encabezado -->
      <div class="mt-6 max-w-2xl">
        <p class="text-[11px] tracking-[0.3em] uppercase text-wine-500">
          Curadas a mano
        </p>
        <h1 class="mt-3 font-serif text-5xl font-medium text-highlighted lg:text-6xl">
          Nuestras colecciones
        </h1>
        <p class="mt-5 text-muted">
          Cada colección cuenta una historia distinta: una paleta, un material,
          un estado de ánimo. Elige una para ver sus piezas.
        </p>
      </div>

      <!-- Cuadrícula de colecciones -->
      <div class="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <!-- Esqueleto de carga -->
        <template v-if="pending && !collections.length">
          <div
            v-for="n in 4"
            :key="n"
            class="aspect-[3/4] animate-pulse rounded-3xl bg-elevated"
          />
        </template>

        <!-- Colecciones -->
        <NuxtLink
          v-for="(collection, i) in collections"
          :key="collection.id"
          :to="`/collections/${collection.slug}`"
          class="group relative flex aspect-[3/4] flex-col justify-end overflow-hidden rounded-3xl p-7 text-white"
          :class="collection.imageUrl ? '' : gradients[i % gradients.length]"
        >
          <img
            v-if="collection.imageUrl"
            :src="collection.imageUrl"
            :alt="collection.name"
            class="absolute inset-0 size-full object-cover transition-transform duration-500 group-hover:scale-105"
            loading="lazy"
          >
          <span class="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />

          <div class="relative">
            <p class="text-[11px] tracking-[0.2em] uppercase text-white/70">
              {{ collection.productCount }} piezas
            </p>
            <h2 class="mt-2 font-serif text-4xl">
              {{ collection.name }}
            </h2>
            <p
              v-if="collection.description"
              class="mt-3 text-sm text-white/80"
            >
              {{ collection.description }}
            </p>
            <span class="mt-5 inline-flex items-center gap-2 text-[11px] tracking-[0.2em] uppercase">
              Ver colección
              <UIcon
                name="i-lucide-arrow-right"
                class="transition-transform group-hover:translate-x-0.5"
              />
            </span>
          </div>
        </NuxtLink>

        <!-- Tarjeta hacia toda la tienda -->
        <NuxtLink
          to="/products"
          class="group flex aspect-[3/4] flex-col justify-between rounded-3xl border border-default bg-elevated p-7 transition-colors hover:border-toned"
        >
          <span class="flex size-10 items-center justify-center rounded-full bg-muted text-wine-500 transition-transform group-hover:translate-x-0.5">
            <UIcon name="i-lucide-arrow-right" />
          </span>
          <div>
            <h2 class="font-serif text-3xl text-highlighted">
              Toda la tienda
            </h2>
            <p class="mt-3 text-sm text-muted">
              ¿Buscas algo en particular? Explora el catálogo completo con filtros
              por categoría, color y talla.
            </p>
          </div>
        </NuxtLink>
      </div>
    </div>
  </div>
</template>
