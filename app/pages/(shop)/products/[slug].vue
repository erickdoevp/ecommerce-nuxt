<script setup lang="ts">
import { usePublicProductDetail } from '~/features/product/composables/usePublicProductDetail'
import ProductDetailView from '~/features/product/components/ProductDetailView.vue'
import ProductReviews from '~/features/review/components/ProductReviews.vue'

definePageMeta({
  layout: 'store'
})

const slug = useRoute().params.slug as string

const { product, pending } = usePublicProductDetail(slug)
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
          to="/products"
          class="transition-colors hover:text-toned"
        >
          Productos
        </NuxtLink>
        <span class="mx-2">/</span>
        <span class="text-toned">{{ product?.name ?? slug }}</span>
      </nav>

      <!-- Esqueleto de carga -->
      <div
        v-if="pending && !product"
        class="mt-10 grid gap-10 lg:grid-cols-2 lg:gap-16"
      >
        <div class="aspect-[3/4] animate-pulse rounded-3xl bg-elevated" />
        <div class="space-y-4">
          <div class="h-4 w-32 animate-pulse rounded bg-elevated" />
          <div class="h-12 w-3/4 animate-pulse rounded bg-elevated" />
          <div class="h-8 w-24 animate-pulse rounded bg-elevated" />
        </div>
      </div>

      <!-- Producto no encontrado -->
      <div
        v-else-if="!product"
        class="mt-16 text-center"
      >
        <h1 class="font-serif text-4xl text-highlighted">
          Producto no encontrado
        </h1>
        <NuxtLink
          to="/products"
          class="mt-6 inline-flex items-center gap-2 text-[11px] tracking-[0.2em] uppercase text-wine-500 hover:text-wine-700"
        >
          <UIcon name="i-lucide-arrow-left" />
          Ver todos los productos
        </NuxtLink>
      </div>

      <ProductDetailView
        v-else
        :product="product"
        class="mt-10"
      />
    </div>

    <ProductReviews
      v-if="product"
      :product-id="product.id"
    />
  </div>
</template>
