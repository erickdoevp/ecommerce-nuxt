<script setup lang="ts">
import { useCart } from '~/features/cart/composables/useCart'
import type { CartItem } from '~/features/cart/types/cart'

const { items, itemCount, subtotal, isEmpty, isLoading, isOpen, updateItem, removeItem } = useCart()

function formatCurrency(value: number) {
  return new Intl.NumberFormat('es-MX', {
    style: 'currency',
    currency: 'MXN',
    maximumFractionDigits: 0
  }).format(value ?? 0)
}

// Subtítulo de la variante: color y talla (el carrito no devuelve categoría).
function itemMeta(item: CartItem): string {
  return [item.colorName, item.sizeName ? `Talla ${item.sizeName}` : null]
    .filter(Boolean)
    .join(' · ')
}

// −/+: actualiza la cantidad. quantity 0 elimina el item (lo hace el backend).
function decrement(item: CartItem) {
  updateItem(item.id, item.quantity - 1)
}
function increment(item: CartItem) {
  updateItem(item.id, item.quantity + 1)
}
</script>

<template>
  <USlideover
    v-model:open="isOpen"
    :ui="{ content: 'max-w-md' }"
  >
    <template #header>
      <div class="flex items-center justify-between gap-4 w-full">
        <h2 class="font-serif text-2xl text-highlighted">
          Tu bolsa <span class="text-muted">({{ itemCount }})</span>
        </h2>
        <UButton
          icon="i-lucide-x"
          color="neutral"
          variant="soft"
          class="rounded-full shrink-0"
          aria-label="Cerrar"
          @click="isOpen = false"
        />
      </div>
    </template>

    <template #body>
      <!-- Bolsa vacía -->
      <div
        v-if="isEmpty"
        class="flex flex-col items-center justify-center py-24 text-center"
      >
        <UIcon
          name="i-lucide-shopping-bag"
          class="w-10 h-10 text-muted"
        />
        <p class="mt-4 font-serif text-xl text-highlighted">
          Tu bolsa está vacía
        </p>
        <p class="mt-1 text-sm text-muted">
          Aún no has agregado productos.
        </p>
      </div>

      <!-- Items -->
      <div v-else>
        <div
          v-for="item in items"
          :key="item.id"
          class="flex gap-4 py-5 border-b border-default"
        >
          <img
            v-if="item.imageUrl"
            :src="item.imageUrl"
            :alt="item.productName"
            class="w-20 h-24 rounded-2xl object-cover shrink-0"
          >
          <div
            v-else
            class="w-20 h-24 rounded-2xl bg-gradient-to-br from-primary/20 to-primary/5 shrink-0"
          />

          <div class="flex-1 min-w-0 flex flex-col">
            <div class="flex items-start justify-between gap-3">
              <div class="min-w-0">
                <p class="font-serif text-lg text-highlighted leading-tight truncate">
                  {{ item.productName }}
                </p>
                <p class="mt-0.5 text-[11px] tracking-[0.18em] uppercase text-muted">
                  {{ itemMeta(item) }}
                </p>
              </div>
              <button
                type="button"
                class="shrink-0 text-muted hover:text-highlighted transition-colors disabled:opacity-50"
                :disabled="isLoading"
                aria-label="Quitar producto"
                @click="removeItem(item.id)"
              >
                <UIcon
                  name="i-lucide-trash-2"
                  class="w-4.5 h-4.5"
                />
              </button>
            </div>

            <div class="mt-auto pt-3 flex items-center justify-between">
              <div class="flex items-center gap-3 rounded-full border border-default px-1.5 py-1">
                <button
                  type="button"
                  class="flex items-center justify-center w-6 h-6 text-muted hover:text-highlighted transition-colors disabled:opacity-40"
                  :disabled="isLoading"
                  aria-label="Disminuir cantidad"
                  @click="decrement(item)"
                >
                  <UIcon
                    name="i-lucide-minus"
                    class="w-4 h-4"
                  />
                </button>
                <span class="w-5 text-center text-sm text-highlighted tabular-nums">
                  {{ item.quantity }}
                </span>
                <button
                  type="button"
                  class="flex items-center justify-center w-6 h-6 text-muted hover:text-highlighted transition-colors disabled:opacity-40"
                  :disabled="isLoading"
                  aria-label="Aumentar cantidad"
                  @click="increment(item)"
                >
                  <UIcon
                    name="i-lucide-plus"
                    class="w-4 h-4"
                  />
                </button>
              </div>
              <span class="font-medium text-highlighted shrink-0">
                {{ formatCurrency(item.subtotal) }}
              </span>
            </div>
          </div>
        </div>
      </div>
    </template>

    <template #footer>
      <div
        v-if="!isEmpty"
        class="w-full space-y-4"
      >
        <div class="flex items-end justify-between">
          <span class="text-highlighted">Subtotal</span>
          <span class="font-serif text-2xl text-highlighted">
            {{ formatCurrency(subtotal) }} <span class="text-xs text-muted">MXN</span>
          </span>
        </div>
        <p class="text-sm text-muted">
          Impuestos incluidos. Envío calculado en el checkout.
        </p>
        <UButton
          block
          size="lg"
          class="rounded-full tracking-widest uppercase"
        >
          Finalizar compra
        </UButton>
      </div>
    </template>
  </USlideover>
</template>
