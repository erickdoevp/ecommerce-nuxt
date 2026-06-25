<script setup lang="ts">
import { useCollectionDetail } from '~/features/collection/composables/useCollectionDetail'
import { useActiveCollections } from '~/features/collection/composables/useActiveCollections'
import ProductCard from '~/features/product/components/ProductCard.vue'

definePageMeta({
  layout: 'store'
})

const slug = useRoute().params.slug as string

const { collection: current, pending } = useCollectionDetail(slug)
const { collections } = useActiveCollections()

const products = computed(() => current.value?.products ?? [])
const others = computed(() =>
  collections.value.filter(c => c.slug !== slug)
)

// Gradiente de respaldo para el hero cuando la colección no tiene imageUrl.
const gradients = [
  'bg-gradient-to-br from-terracotta-200 via-terracotta-400 to-terracotta-700',
  'bg-gradient-to-br from-slate-500 via-slate-700 to-slate-900',
  'bg-gradient-to-br from-bronze-200 via-bronze-400 to-bronze-600'
]
const heroGradient = computed(() =>
  gradients[(current.value?.position ?? 0) % gradients.length]
)
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
        <NuxtLink
          to="/collections"
          class="transition-colors hover:text-toned"
        >
          Colecciones
        </NuxtLink>
        <span class="mx-2">/</span>
        <span class="text-toned">{{ current?.name ?? slug }}</span>
      </nav>

      <!-- Esqueleto del hero -->
      <div
        v-if="pending && !current"
        class="mt-6 h-[400px] animate-pulse rounded-3xl bg-elevated"
      />

      <!-- Colección no encontrada -->
      <div
        v-else-if="!current"
        class="mt-16 text-center"
      >
        <h1 class="font-serif text-4xl text-highlighted">
          Colección no encontrada
        </h1>
        <NuxtLink
          to="/collections"
          class="mt-6 inline-flex items-center gap-2 text-[11px] tracking-[0.2em] uppercase text-wine-500 hover:text-wine-700"
        >
          <UIcon name="i-lucide-arrow-left" />
          Ver todas las colecciones
        </NuxtLink>
      </div>

      <template v-else>
        <!-- Hero -->
        <div
          class="relative mt-6 flex min-h-[400px] flex-col justify-end overflow-hidden rounded-3xl p-10 text-white shadow-[0_30px_60px_-30px_rgba(44,20,25,0.4)]"
          :class="current.imageUrl ? '' : heroGradient"
        >
          <img
            v-if="current.imageUrl"
            :src="current.imageUrl"
            :alt="current.name"
            class="absolute inset-0 size-full object-cover"
          >
          <span class="absolute inset-0 bg-gradient-to-t from-black/50 via-black/10 to-transparent" />

          <div class="relative max-w-2xl">
            <p class="text-[11px] tracking-[0.3em] uppercase text-white/70">
              Colección
            </p>
            <h1 class="mt-3 font-serif text-6xl font-medium lg:text-7xl">
              {{ current.name }}
            </h1>
            <p
              v-if="current.description"
              class="mt-4 text-white/85"
            >
              {{ current.description }}
            </p>
          </div>
        </div>

        <!-- Otras colecciones -->
        <div
          v-if="others.length"
          class="mt-8 flex flex-wrap items-center gap-3"
        >
          <span class="text-[11px] tracking-[0.2em] uppercase text-dimmed">
            Otras colecciones:
          </span>
          <NuxtLink
            v-for="other in others"
            :key="other.id"
            :to="`/collections/${other.slug}`"
            class="rounded-full border border-default px-5 py-2 text-[12px] tracking-[0.05em] text-toned transition-colors hover:border-toned hover:text-highlighted"
          >
            {{ other.name }}
          </NuxtLink>
        </div>

        <!-- Piezas -->
        <div class="mt-16">
          <div class="flex items-end justify-between">
            <h2 class="font-serif text-4xl font-medium text-highlighted">
              Piezas de {{ current.name }}
            </h2>
            <span class="text-sm text-muted">
              {{ products.length }} piezas
            </span>
          </div>

          <div
            v-if="products.length"
            class="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4"
          >
            <ProductCard
              v-for="product in products"
              :key="product.id"
              :product="product"
              :to="`/collections/${slug}/${product.slug}`"
            />
          </div>

          <p
            v-else
            class="mt-8 text-muted"
          >
            Esta colección aún no tiene piezas disponibles.
          </p>
        </div>
      </template>
    </div>
  </div>
</template>
