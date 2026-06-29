<script setup lang="ts">
import ProductCatalog from '~/features/product/components/ProductCatalog.vue'

definePageMeta({
  layout: 'store'
})

useHead({ title: 'La tienda' })

const total = ref(0)
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
        <span class="text-toned">Tienda</span>
      </nav>

      <!-- Encabezado -->
      <div class="mt-6 flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p class="text-[11px] tracking-[0.3em] uppercase text-wine-500">
            Toda la colección
          </p>
          <h1 class="mt-3 font-serif text-5xl font-medium text-highlighted lg:text-6xl">
            La tienda
          </h1>
        </div>
        <p class="max-w-xs text-sm text-muted lg:text-right">
          Lencería hecha a mano en México. Encuentra tu próxima favorita entre
          {{ total }} piezas.
        </p>
      </div>

      <!-- Catálogo -->
      <div class="mt-10">
        <ProductCatalog @update:total="total = $event" />
      </div>
    </div>
  </div>
</template>
