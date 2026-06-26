<script setup lang="ts">
import type { ProductDetail } from '../types/product-detail'
import { extractText } from '../utils/extract-text'

const props = defineProps<{ product: ProductDetail }>()

const formatPrice = (value: number) =>
  value.toLocaleString('es-MX', { maximumFractionDigits: 0 })

// Galería: imágenes del producto ordenadas por posición.
const gallery = computed(() =>
  [...props.product.images]
    .sort((a, b) => a.position - b.position)
    .map(img => img.url)
)

// Colores únicos a partir de las variantes (preserva el primero encontrado).
const colors = computed(() => {
  const map = new Map<string, ProductDetail['variants'][number]['color']>()
  for (const v of props.product.variants) {
    if (!map.has(v.color.id)) map.set(v.color.id, v.color)
  }
  return [...map.values()]
})

// Tallas únicas ordenadas por sortOrder.
const sizes = computed(() => {
  const map = new Map<string, ProductDetail['variants'][number]['size']>()
  for (const v of props.product.variants) {
    if (!map.has(v.size.id)) map.set(v.size.id, v.size)
  }
  return [...map.values()].sort((a, b) => a.sortOrder - b.sortOrder)
})

// Carrusel vertical de miniaturas: muestra máximo 4 a la vez.
const THUMBS_VISIBLE = 4
const thumbStart = ref(0)
const visibleThumbs = computed(() =>
  gallery.value
    .map((url, index) => ({ url, index }))
    .slice(thumbStart.value, thumbStart.value + THUMBS_VISIBLE)
)
const canScrollUp = computed(() => thumbStart.value > 0)
const canScrollDown = computed(() => thumbStart.value + THUMBS_VISIBLE < gallery.value.length)
const scrollThumbs = (delta: number) => {
  thumbStart.value = Math.min(
    Math.max(0, thumbStart.value + delta),
    Math.max(0, gallery.value.length - THUMBS_VISIBLE)
  )
}

const selectedColorId = ref(colors.value[0]?.id ?? null)
const selectedSizeId = ref<string | null>(null)
const quantity = ref(1)
const activeImage = ref<string | null>(null)

const selectedColor = computed(() =>
  colors.value.find(c => c.id === selectedColorId.value) ?? null
)

// Una talla está disponible si existe una variante activa con stock para el color elegido.
const isSizeAvailable = (sizeId: string) =>
  props.product.variants.some(
    v => v.color.id === selectedColorId.value
      && v.size.id === sizeId
      && v.active
      && v.availableStock > 0
  )

const selectedVariant = computed(() =>
  props.product.variants.find(
    v => v.color.id === selectedColorId.value && v.size.id === selectedSizeId.value
  ) ?? null
)

// Precio final = basePrice + priceAdjustment de la variante elegida.
const finalPrice = computed(() =>
  props.product.basePrice + (selectedVariant.value?.priceAdjustment ?? 0)
)

// Imagen principal: la elegida en miniaturas, o la de la variante del color, o la primera.
const variantImage = computed(() =>
  props.product.variants.find(v => v.color.id === selectedColorId.value)?.imageUrl ?? null
)
const mainImage = computed(() =>
  activeImage.value ?? variantImage.value ?? gallery.value[0] ?? null
)

const selectColor = (id: string) => {
  selectedColorId.value = id
  selectedSizeId.value = null
  activeImage.value = null
}

const actionLabel = computed(() => {
  if (!selectedSizeId.value) return 'Elegir talla'
  if (!selectedVariant.value || selectedVariant.value.availableStock <= 0) return 'Sin stock'
  return 'Agregar'
})

const descriptionText = computed(() => extractText(props.product.description))

const sections = [
  { key: 'desc', label: 'Descripción y materiales' },
  { key: 'care', label: 'Cuidado de la prenda' },
  { key: 'ship', label: 'Envíos y devoluciones' }
] as const

const openSection = ref<string>('desc')
const toggleSection = (key: string) => {
  openSection.value = openSection.value === key ? '' : key
}
</script>

<template>
  <div class="grid gap-10 lg:grid-cols-2 lg:gap-16">
    <!-- Galería (flota mientras el panel de compra hace scroll) -->
    <div class="flex gap-4 lg:sticky lg:top-24 lg:max-h-[calc(100vh-7rem)] lg:self-start">
      <div
        v-if="gallery.length > 1"
        class="flex flex-col items-center gap-3"
      >
        <button
          v-if="gallery.length > THUMBS_VISIBLE"
          type="button"
          class="flex size-8 items-center justify-center rounded-full text-toned transition-colors hover:bg-elevated disabled:opacity-30 disabled:hover:bg-transparent"
          :disabled="!canScrollUp"
          aria-label="Ver imágenes anteriores"
          @click="scrollThumbs(-1)"
        >
          <UIcon name="i-lucide-chevron-up" />
        </button>

        <button
          v-for="thumb in visibleThumbs"
          :key="thumb.index"
          type="button"
          class="aspect-[3/4] w-20 overflow-hidden rounded-2xl bg-elevated ring-1 transition-all"
          :class="mainImage === thumb.url ? 'ring-wine-500' : 'ring-transparent hover:ring-default'"
          @click="activeImage = thumb.url"
        >
          <img
            :src="thumb.url"
            :alt="`${product.name} ${thumb.index + 1}`"
            class="size-full object-cover"
            loading="lazy"
          >
        </button>

        <button
          v-if="gallery.length > THUMBS_VISIBLE"
          type="button"
          class="flex size-8 items-center justify-center rounded-full text-toned transition-colors hover:bg-elevated disabled:opacity-30 disabled:hover:bg-transparent"
          :disabled="!canScrollDown"
          aria-label="Ver más imágenes"
          @click="scrollThumbs(1)"
        >
          <UIcon name="i-lucide-chevron-down" />
        </button>
      </div>

      <div class="relative aspect-[3/4] flex-1 overflow-hidden rounded-3xl bg-elevated shadow-[0_30px_60px_-30px_rgba(44,20,25,0.4)] lg:aspect-auto lg:h-[calc(100vh-7rem)]">
        <span class="absolute left-5 top-5 z-10 rounded-full bg-wine-500 px-4 py-2 text-[10px] tracking-[0.2em] uppercase text-white">
          Hecho a mano
        </span>
        <img
          v-if="mainImage"
          :src="mainImage"
          :alt="product.name"
          class="size-full object-cover"
        >
      </div>
    </div>

    <!-- Panel de compra -->
    <div>
      <p class="text-[11px] tracking-[0.3em] uppercase text-dimmed">
        {{ product.category?.name }}
      </p>
      <h1 class="mt-4 font-serif text-5xl leading-[1.05] font-medium text-highlighted lg:text-6xl">
        {{ product.name }}
      </h1>

      <!-- Reseñas -->
      <div class="mt-6 flex items-center gap-3 text-sm text-toned">
        <span class="flex items-center gap-1.5">
          <UIcon
            name="i-lucide-star"
            class="size-4 text-bronze-400"
          />
          {{ product.averageRating ?? '—' }}
        </span>
        <span class="text-dimmed">•</span>
        <span class="text-muted underline-offset-4 hover:underline">
          {{ product.reviewCount }} reseñas
        </span>
      </div>

      <!-- Precio -->
      <p class="mt-7 font-serif text-4xl text-highlighted">
        ${{ formatPrice(finalPrice) }}
        <span class="ml-1 align-middle text-sm font-sans text-muted">MXN</span>
      </p>

      <!-- Descripción corta -->
      <p
        v-if="descriptionText"
        class="mt-6 max-w-md leading-relaxed text-toned"
      >
        {{ descriptionText }}
      </p>

      <!-- Color -->
      <div
        v-if="colors.length"
        class="mt-10"
      >
        <div class="flex items-center justify-between">
          <span class="text-[11px] tracking-[0.2em] uppercase text-dimmed">Color</span>
          <span class="text-sm text-toned">{{ selectedColor?.name }}</span>
        </div>
        <div class="mt-4 flex flex-wrap gap-3">
          <button
            v-for="color in colors"
            :key="color.id"
            type="button"
            class="flex size-9 items-center justify-center rounded-full ring-1 ring-offset-2 ring-offset-default transition-all"
            :class="selectedColorId === color.id ? 'ring-wine-500' : 'ring-default hover:ring-toned'"
            :aria-label="color.name"
            @click="selectColor(color.id)"
          >
            <span
              class="size-6 rounded-full"
              :style="{ backgroundColor: color.hex }"
            />
          </button>
        </div>
      </div>

      <!-- Talla -->
      <div
        v-if="sizes.length"
        class="mt-8"
      >
        <div class="flex items-center justify-between">
          <span class="text-[11px] tracking-[0.2em] uppercase text-dimmed">Talla</span>
          <NuxtLink
            to="/size-guide"
            class="text-sm text-wine-500 underline-offset-4 hover:underline"
          >
            Guía de tallas
          </NuxtLink>
        </div>
        <div class="mt-4 flex flex-wrap gap-3">
          <button
            v-for="size in sizes"
            :key="size.id"
            type="button"
            :disabled="!isSizeAvailable(size.id)"
            class="flex h-12 min-w-12 items-center justify-center rounded-xl border px-4 text-sm transition-colors"
            :class="[
              selectedSizeId === size.id
                ? 'border-wine-500 bg-wine-500 text-white'
                : 'border-default text-toned hover:border-toned',
              !isSizeAvailable(size.id) && 'cursor-not-allowed text-dimmed line-through opacity-50 hover:border-default'
            ]"
            @click="selectedSizeId = size.id"
          >
            {{ size.name }}
          </button>
        </div>
      </div>

      <!-- Cantidad + acciones -->
      <div class="mt-8 flex items-center gap-3">
        <div class="flex items-center gap-1 rounded-full bg-elevated p-1.5">
          <button
            type="button"
            class="flex size-10 items-center justify-center rounded-full text-toned transition-colors hover:bg-default disabled:opacity-40"
            :disabled="quantity <= 1"
            aria-label="Disminuir cantidad"
            @click="quantity = Math.max(1, quantity - 1)"
          >
            <UIcon name="i-lucide-minus" />
          </button>
          <span class="w-8 text-center text-sm font-medium text-highlighted">{{ quantity }}</span>
          <button
            type="button"
            class="flex size-10 items-center justify-center rounded-full text-toned transition-colors hover:bg-default"
            aria-label="Aumentar cantidad"
            @click="quantity++"
          >
            <UIcon name="i-lucide-plus" />
          </button>
        </div>

        <UButton
          :label="actionLabel"
          color="primary"
          size="xl"
          block
          class="flex-1 justify-center rounded-full"
          :ui="{ label: 'uppercase tracking-[0.15em] text-[12px]' }"
        />

        <button
          type="button"
          class="flex size-14 shrink-0 items-center justify-center rounded-full border border-default text-toned transition-colors hover:border-wine-500 hover:text-wine-500"
          aria-label="Agregar a favoritos"
        >
          <UIcon
            name="i-lucide-heart"
            class="size-5"
          />
        </button>
      </div>

      <!-- Beneficios -->
      <div class="mt-10 grid grid-cols-3 gap-6 border-t border-default pt-8 text-sm text-toned">
        <p>Envío gratis en compras +$999</p>
        <p>Cambios fáciles dentro de 15 días</p>
        <p>Hecho a mano en Tlaxcala, México</p>
      </div>

      <!-- Acordeones -->
      <div class="mt-8 border-t border-default">
        <div
          v-for="section in sections"
          :key="section.key"
          class="border-b border-default"
        >
          <button
            type="button"
            class="flex w-full items-center justify-between py-5 text-left text-highlighted"
            @click="toggleSection(section.key)"
          >
            <span>{{ section.label }}</span>
            <UIcon
              :name="openSection === section.key ? 'i-lucide-x' : 'i-lucide-plus'"
              class="size-5 text-muted"
            />
          </button>
          <div
            v-show="openSection === section.key"
            class="pb-6 leading-relaxed text-toned"
          >
            <p v-if="section.key === 'desc'">
              {{ descriptionText || 'Sin descripción disponible.' }}
            </p>
            <p v-else-if="section.key === 'care'">
              Lavar a mano con agua fría y jabón neutro. No usar blanqueador ni secadora.
              Secar a la sombra para conservar el color y la forma de cada pieza.
            </p>
            <p v-else>
              Envío gratis en compras mayores a $999 MXN. Aceptamos cambios dentro de los
              15 días posteriores a la entrega, siempre que la prenda conserve sus etiquetas.
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
