<script setup lang="ts">
import { createAdminApi } from '~/api/admin-api'
import type { ProductDetail, Variant } from '../types/product-detail'
import { extractText } from '../utils/extract-text'

const props = defineProps<{
  open: boolean
  productId: string | null
}>()

const emit = defineEmits<{
  'update:open': [value: boolean]
}>()

const isOpen = computed({
  get: () => props.open,
  set: v => emit('update:open', v)
})

const product = ref<ProductDetail | null>(null)
const isLoading = ref(false)
const selectedColor = ref('')
const selectedSize = ref('')
const selectedImageUrl = ref('')

watch(() => props.open, async (val) => {
  if (val && props.productId) {
    await fetchProduct(props.productId)
  } else if (!val) {
    product.value = null
    selectedColor.value = ''
    selectedSize.value = ''
    selectedImageUrl.value = ''
  }
})

async function fetchProduct(id: string) {
  isLoading.value = true
  try {
    const api = createAdminApi()
    product.value = await api<ProductDetail>(`/products/admin/${id}`, { method: 'GET' })
    initSelection()
  } finally {
    isLoading.value = false
  }
}

function initSelection() {
  if (!product.value) return
  const first = product.value.variants[0]
  if (first) {
    selectedColor.value = first.color.name
    selectedSize.value = first.size.name
  }
  selectedImageUrl.value = product.value.images[0]?.url ?? ''
}

const uniqueColors = computed(() => {
  if (!product.value) return []
  const seen = new Set<string>()
  return product.value.variants
    .filter((v) => {
      if (seen.has(v.color.id)) return false
      seen.add(v.color.id)
      return true
    })
    .map(v => v.color)
})

const uniqueSizes = computed(() => {
  if (!product.value) return []
  const seen = new Set<string>()
  return product.value.variants
    .filter((v) => {
      if (seen.has(v.size.id)) return false
      seen.add(v.size.id)
      return true
    })
    .map(v => v.size)
    .sort((a, b) => a.sortOrder - b.sortOrder)
})

const selectedVariant = computed<Variant | null>(() => {
  if (!product.value) return null
  return product.value.variants.find(
    v => v.color.name === selectedColor.value && v.size.name === selectedSize.value
  ) ?? null
})

const mainImageUrl = computed(() =>
  selectedImageUrl.value ? selectedImageUrl.value : product.value?.images[0]?.url || ''
)

function isSizeAvailableForColor(sizeName: string): boolean {
  if (!product.value) return false
  return product.value.variants.some(
    v => v.color.name === selectedColor.value && v.size.name === sizeName
  )
}

function selectColor(colorName: string) {
  selectedColor.value = colorName
  const variant = product.value?.variants.find(
    v => v.color.name === colorName && v.size.name === selectedSize.value
  )
  if (variant?.imageUrl) selectedImageUrl.value = variant.imageUrl
  else if (!isSizeAvailableForColor(selectedSize.value)) {
    const fallback = product.value?.variants.find(v => v.color.name === colorName)
    if (fallback) selectedSize.value = fallback.size.name
  }
}

function selectSize(sizeName: string) {
  selectedSize.value = sizeName
  const variant = selectedVariant.value
  if (variant?.imageUrl) selectedImageUrl.value = variant.imageUrl
}

const descriptionText = computed(() => {
  if (!product.value?.description) return ''
  if (typeof product.value.description === 'string') return product.value.description
  return extractText(product.value.description)
})

function formatPrice(n: number): string {
  return '$ ' + Math.round(n).toLocaleString('es-CL')
}

const finalPrice = computed(() => {
  if (!product.value) return 0
  return product.value.basePrice + (selectedVariant.value?.priceAdjustment ?? 0)
})
</script>

<template>
  <UModal
    v-model:open="isOpen"
    size="4xl"
    :ui="{ footer: 'justify-between items-center' }"
  >
    <template #header>
      <p class="text-sm font-semibold text-gray-800">
        Vista previa del producto
      </p>
    </template>

    <template #body>
      <!-- Loading -->
      <div
        v-if="isLoading"
        class="flex items-center justify-center py-20"
      >
        <UIcon
          name="i-lucide-loader-circle"
          class="w-7 h-7 text-gray-400 animate-spin"
        />
      </div>

      <!-- Content -->
      <div
        v-else-if="product"
        class="flex gap-6"
      >
        <!-- Left: images -->
        <div class="w-[42%] shrink-0 flex flex-col gap-3">
          <div class="aspect-square rounded-xl overflow-hidden border border-gray-100 bg-gray-50 flex items-center justify-center">
            <img
              v-if="mainImageUrl"
              :src="mainImageUrl"
              :alt="product.name"
              class="w-full h-full object-contain"
            >
            <UIcon
              v-else
              name="i-lucide-image"
              class="w-16 h-16 text-gray-200"
            />
          </div>

          <!-- Thumbnails -->
          <div
            v-if="product.images.length > 1"
            class="flex gap-2 flex-wrap"
          >
            <button
              v-for="url in product.images"
              :key="url.url"
              type="button"
              class="w-14 h-14 rounded-lg overflow-hidden border-2 transition-colors shrink-0"
              :class="selectedImageUrl === url.url ? 'border-primary' : 'border-gray-200 hover:border-gray-300'"
              @click="selectedImageUrl = url.url"
            >
              <img
                :src="url.url"
                class="w-full h-full object-cover"
              >
            </button>
          </div>
        </div>

        <!-- Right: details -->
        <div class="flex-1 flex flex-col gap-4 min-w-0">
          <!-- Breadcrumb -->
          <div class="flex items-center gap-1 text-xs text-gray-400">
            <span>Ropa</span>
            <UIcon name="i-lucide-chevron-right" class="w-3 h-3" />
            <span>{{ product.category.name }}</span>
          </div>

          <!-- Name + price -->
          <div>
            <h2 class="text-xl font-semibold text-gray-900 leading-snug">
              {{ product.name }}
            </h2>
            <p
              v-if="descriptionText"
              class="text-sm text-gray-500 mt-1 line-clamp-2"
            >
              {{ descriptionText }}
            </p>
          </div>

          <div class="flex items-baseline gap-3">
            <span class="text-2xl font-bold text-gray-900">
              {{ formatPrice(finalPrice) }}
            </span>
            <span class="text-xs text-gray-400">
              {{ product.reviewCount }} vendidos
            </span>
          </div>

          <!-- Color selector -->
          <div v-if="uniqueColors.length">
            <p class="text-sm text-gray-600 mb-2">
              <span class="font-medium">Color:</span> {{ selectedColor }}
            </p>
            <div class="flex items-center gap-2 flex-wrap">
              <button
                v-for="color in uniqueColors"
                :key="color.id"
                type="button"
                class="w-7 h-7 rounded-full border-2 transition-all"
                :style="{ backgroundColor: color.hex }"
                :class="selectedColor === color.name
                  ? 'border-primary scale-110 shadow-sm'
                  : 'border-gray-200 hover:border-gray-400'"
                :title="color.name"
                @click="selectColor(color.name)"
              />
            </div>
          </div>

          <!-- Size selector -->
          <div v-if="uniqueSizes.length">
            <p class="text-sm text-gray-600 mb-2">
              <span class="font-medium">Talla:</span> {{ selectedSize }}
            </p>
            <div class="flex items-center gap-2 flex-wrap">
              <button
                v-for="size in uniqueSizes"
                :key="size.id"
                type="button"
                class="px-3 py-1 rounded-md text-sm font-medium border transition-colors"
                :class="[
                  !isSizeAvailableForColor(size.name)
                    ? 'border-gray-100 text-gray-300 cursor-not-allowed line-through'
                    : selectedSize === size.name
                      ? 'border-primary bg-primary text-white'
                      : 'border-gray-200 text-gray-700 hover:border-gray-400'
                ]"
                :disabled="!isSizeAvailableForColor(size.name)"
                @click="selectSize(size.name)"
              >
                {{ size.name }}
              </button>
            </div>
          </div>

          <!-- Variant details -->
          <div
            v-if="selectedVariant"
            class="rounded-lg border border-gray-100 bg-gray-50 divide-y divide-gray-100 text-sm"
          >
            <div class="flex items-center justify-between px-4 py-2.5">
              <span class="text-gray-500">SKU</span>
              <span class="font-mono text-gray-700 text-xs">{{ selectedVariant.sku }}</span>
            </div>
            <div class="flex items-center justify-between px-4 py-2.5">
              <span class="text-gray-500">Ajuste de precio</span>
              <span class="text-gray-700">{{ formatPrice(selectedVariant.priceAdjustment) }}</span>
            </div>
            <div class="flex items-center justify-between px-4 py-2.5">
              <span class="text-gray-500">Precio de venta</span>
              <span class="font-semibold text-gray-800">{{ formatPrice(finalPrice) }}</span>
            </div>
            <div class="flex items-center justify-between px-4 py-2.5">
              <span class="text-gray-500">Stock disponible</span>
              <span
                class="font-medium"
                :class="selectedVariant.availableStock > 0 ? 'text-green-600' : 'text-red-500'"
              >
                {{ selectedVariant.availableStock }}
              </span>
            </div>
          </div>

          <!-- CTA -->
          <UButton
            icon="i-lucide-shopping-cart"
            class="w-full justify-center"
            size="lg"
            disabled
          >
            Agregar al carrito
          </UButton>
        </div>
      </div>
    </template>

    <template #footer>
      <p class="text-xs text-gray-400 max-w-sm">
        Esta es solo una vista previa provisional. El diseño final puede variar en la tienda.
      </p>
      <UButton
        color="neutral"
        variant="outline"
        @click="isOpen = false"
      >
        Cerrar
      </UButton>
    </template>
  </UModal>
</template>
