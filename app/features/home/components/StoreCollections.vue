<script setup lang="ts">
import { useActiveCollections } from '~/features/collection/composables/useActiveCollections'

const { collections } = useActiveCollections()

// Bento: la primera colección va destacada (grande) y las dos siguientes apiladas.
const featured = computed(() => collections.value[0] ?? null)
const rest = computed(() => collections.value.slice(1, 3))

// Gradiente de respaldo cuando la colección no tiene imageUrl (se asigna por posición).
const gradients = [
  'bg-gradient-to-br from-terracotta-200 via-terracotta-400 to-terracotta-700',
  'bg-gradient-to-br from-slate-500 via-slate-700 to-slate-900',
  'bg-gradient-to-br from-bronze-200 via-bronze-400 to-bronze-600'
]
</script>

<template>
  <section class="px-6 py-20 lg:px-10 lg:py-28">
    <div class="mx-auto max-w-(--ui-container)">
      <!-- Encabezado -->
      <div class="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p class="text-[11px] tracking-[0.3em] uppercase text-muted">
            Curadas a mano
          </p>
          <h2 class="mt-3 font-serif text-5xl font-medium text-highlighted lg:text-6xl">
            Colecciones
          </h2>
          <p class="mt-5 max-w-md text-muted">
            Cada colección cuenta una historia distinta: una paleta, un material,
            un estado de ánimo. Confeccionadas por tandas pequeñas.
          </p>
        </div>
        <NuxtLink
          to="/collections"
          class="group inline-flex w-max items-center gap-2 border-b border-default pb-1 text-[11px] tracking-[0.2em] uppercase text-toned transition-colors hover:text-highlighted"
        >
          Ver todo el catálogo
          <UIcon
            name="i-lucide-arrow-right"
            class="transition-transform group-hover:translate-x-0.5"
          />
        </NuxtLink>
      </div>

      <!-- Bento de colecciones -->
      <div class="mt-14 grid gap-6 lg:grid-cols-2 lg:grid-rows-2">
        <!-- Destacada -->
        <NuxtLink
          v-if="featured"
          :to="`/collections/${featured.slug}`"
          class="group relative flex min-h-[420px] flex-col justify-end overflow-hidden rounded-3xl p-8 text-white lg:row-span-2 lg:min-h-[640px]"
          :class="featured.imageUrl ? '' : gradients[0]"
        >
          <img
            v-if="featured.imageUrl"
            :src="featured.imageUrl"
            :alt="featured.name"
            class="absolute inset-0 size-full object-cover transition-transform duration-500 group-hover:scale-105"
            loading="lazy"
          >
          <span class="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />

          <span class="absolute left-8 top-8 rounded-full border border-white/40 px-4 py-1.5 text-[10px] tracking-[0.2em] uppercase text-white/90 backdrop-blur-sm">
            Colección insignia
          </span>

          <div class="relative">
            <p class="text-[11px] tracking-[0.2em] uppercase text-white/70">
              {{ featured.productCount }} piezas
            </p>
            <h3 class="mt-2 font-serif text-5xl">
              {{ featured.name }}
            </h3>
            <p
              v-if="featured.description"
              class="mt-3 max-w-sm text-sm text-white/80"
            >
              {{ featured.description }}
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

        <!-- Secundarias -->
        <NuxtLink
          v-for="(collection, i) in rest"
          :key="collection.id"
          :to="`/collections/${collection.slug}`"
          class="group relative flex min-h-[300px] flex-col justify-end overflow-hidden rounded-3xl p-8 text-white"
          :class="collection.imageUrl ? '' : gradients[(i + 1) % gradients.length]"
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
            <h3 class="mt-2 font-serif text-3xl">
              {{ collection.name }}
            </h3>
            <span class="mt-4 inline-flex items-center gap-2 text-[11px] tracking-[0.2em] uppercase">
              Ver colección
              <UIcon
                name="i-lucide-arrow-right"
                class="transition-transform group-hover:translate-x-0.5"
              />
            </span>
          </div>
        </NuxtLink>
      </div>
    </div>
  </section>
</template>
