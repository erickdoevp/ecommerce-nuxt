<script setup lang="ts">
import { KARDEX_TYPE_META } from '../types/variant-paginated-kardex'
import { usePaginatedVariantKardex } from '../composables/usePaginatedVariantKardex'
import { useProductVariantDetail } from '~/features/product/composables/useProductVartiantDetail'
import { useAdjustVariantStock } from '../composables/useAdjustVariantStock'

const props = defineProps<{
  variantId: string | null
}>()

const open = defineModel<boolean>('open', { default: false })

const emit = defineEmits<{
  updated: []
}>()

const { getProductVariantDetail, productVariantDetail, isLoading: isLoadingDetail } = useProductVariantDetail()
const { searchVariantKardex, response: kardex, isLoading: isLoadingKardex } = usePaginatedVariantKardex()
const { adjustStockDelta, setStockAbsolute, isSaving, error: saveError } = useAdjustVariantStock()

type Mode = 'set' | 'delta'
const mode = ref<Mode>('delta')
const newStock = ref(0)
const newThreshold = ref(0)
const delta = ref(0)
const reason = ref('')

const modeOptions = [
  { label: 'Establecer un nuevo valor', value: 'set' },
  { label: 'Ajustar por una cantidad', value: 'delta' }
]

function resetForm() {
  mode.value = 'delta'
  delta.value = 0
  reason.value = ''
  newStock.value = productVariantDetail.value?.stock ?? 0
  newThreshold.value = productVariantDetail.value?.lowStockThreshold ?? 0
}

async function load(id: string) {
  await Promise.all([
    getProductVariantDetail(id),
    searchVariantKardex(id)
  ])
  resetForm()
}

watch([open, () => props.variantId], ([isOpen, id]) => {
  if (isOpen && id) load(id)
})

const resultingStock = computed(() => {
  if (mode.value === 'set') return newStock.value
  return (productVariantDetail.value?.stock ?? 0) + delta.value
})

const isInvalid = computed(() => {
  if (resultingStock.value < 0) return true
  if (mode.value === 'delta' && delta.value === 0) return true
  return false
})

async function onSave() {
  if (!props.variantId || isInvalid.value) return

  const result = mode.value === 'set'
    ? await setStockAbsolute(props.variantId, {
        stock: newStock.value,
        lowStockThreshold: newThreshold.value,
        reason: reason.value || undefined
      })
    : await adjustStockDelta(props.variantId, {
        delta: delta.value,
        reason: reason.value || undefined
      })

  if (result) {
    await load(props.variantId)
    emit('updated')
  }
}

function formatCurrency(value: number) {
  return new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN' }).format(value ?? 0)
}

function formatDate(value: Date | string) {
  return new Intl.DateTimeFormat('es-MX', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' }).format(new Date(value))
}

const inventoryValue = computed(() => (productVariantDetail.value?.costPrice ?? 0) * (productVariantDetail.value?.stock ?? 0))
</script>

<template>
  <USlideover
    v-model:open="open"
    title="Editar stock"
    :ui="{ content: 'max-w-3xl' }"
  >
    <template #body>
      <div
        v-if="isLoadingDetail && !productVariantDetail"
        class="flex items-center justify-center py-20"
      >
        <UIcon
          name="i-lucide-loader-circle"
          class="w-6 h-6 text-gray-400 animate-spin"
        />
      </div>

      <div
        v-else-if="productVariantDetail"
        class="space-y-6"
      >
        <!-- Encabezado variante -->
        <div class="flex items-center gap-3 pb-4 border-b border-gray-100">
          <img
            v-if="productVariantDetail.imageUrl"
            :src="productVariantDetail.imageUrl"
            :alt="productVariantDetail.productName"
            class="w-14 h-14 rounded-lg object-cover shrink-0"
          >
          <div
            v-else
            class="w-14 h-14 rounded-lg bg-gray-100 flex items-center justify-center shrink-0"
          >
            <UIcon
              name="i-lucide-image"
              class="w-6 h-6 text-gray-300"
            />
          </div>
          <div class="min-w-0">
            <p class="text-sm font-semibold text-gray-900 truncate">
              {{ productVariantDetail.productName }}
            </p>
            <div class="flex items-center gap-1.5 mt-0.5">
              <span
                class="w-3 h-3 rounded-full border border-gray-200 shrink-0"
                :style="{ backgroundColor: productVariantDetail.colorHex }"
              />
              <span class="text-xs text-gray-500">
                {{ productVariantDetail.colorName }} / {{ productVariantDetail.sizeName }}
              </span>
            </div>
            <span class="text-xs text-gray-400 font-mono">SKU: {{ productVariantDetail.sku }}</span>
          </div>
        </div>

        <!-- Resumen de stock -->
        <div class="grid grid-cols-4 gap-3">
          <div>
            <p class="text-xs text-gray-400">
              Disponible
            </p>
            <p class="text-lg font-semibold text-gray-900 tabular-nums">
              {{ productVariantDetail.availableStock }}
            </p>
          </div>
          <div>
            <p class="text-xs text-gray-400">
              Reservado
            </p>
            <p class="text-lg font-semibold text-gray-900 tabular-nums">
              {{ productVariantDetail.reservedStock }}
            </p>
          </div>
          <div>
            <p class="text-xs text-gray-400">
              Total
            </p>
            <p class="text-lg font-semibold text-gray-900 tabular-nums">
              {{ productVariantDetail.stock }}
            </p>
          </div>
          <div>
            <p class="text-xs text-gray-400">
              Umbral
            </p>
            <p class="text-lg font-semibold text-gray-900 tabular-nums">
              {{ productVariantDetail.lowStockThreshold }}
            </p>
          </div>
        </div>

        <div class="grid grid-cols-2 gap-6 pt-2">
          <!-- Ajustar stock -->
          <div class="space-y-4">
            <h3 class="text-sm font-semibold text-gray-800">
              Ajustar stock
            </h3>

            <URadioGroup
              v-model="mode"
              :items="modeOptions"
              value-key="value"
            />

            <UFormField
              v-if="mode === 'set'"
              label="Nuevo valor de stock"
            >
              <UInput
                v-model.number="newStock"
                type="number"
                min="0"
                class="w-full"
              />
            </UFormField>

            <UFormField
              v-if="mode === 'set'"
              label="Umbral de stock bajo"
            >
              <UInput
                v-model.number="newThreshold"
                type="number"
                min="0"
                class="w-full"
              />
            </UFormField>

            <UFormField
              v-if="mode === 'delta'"
              label="Cantidad (+ entrada / − merma)"
            >
              <UInput
                v-model.number="delta"
                type="number"
                placeholder="Ej. 30 o -3"
                class="w-full"
              />
            </UFormField>

            <UFormField label="Motivo del ajuste">
              <UTextarea
                v-model="reason"
                :rows="3"
                placeholder="Ej. Reabastecimiento proveedor X, conteo físico, merma…"
                class="w-full"
              />
            </UFormField>

            <div
              class="flex items-center justify-between text-sm px-3 py-2 rounded-lg"
              :class="resultingStock < 0 ? 'bg-red-50 text-red-600' : 'bg-gray-50 text-gray-600'"
            >
              <span>Stock resultante</span>
              <span class="font-semibold tabular-nums">{{ resultingStock }}</span>
            </div>

            <p
              v-if="saveError"
              class="text-xs text-red-500"
            >
              {{ saveError }}
            </p>
          </div>

          <!-- Historial y detalles -->
          <div class="space-y-5">
            <div>
              <h3 class="text-sm font-semibold text-gray-800 mb-3">
                Historial de movimientos
              </h3>
              <div
                v-if="isLoadingKardex && !kardex"
                class="text-xs text-gray-400"
              >
                Cargando…
              </div>
              <div
                v-else-if="!kardex?.content.length"
                class="text-xs text-gray-400"
              >
                Sin movimientos registrados.
              </div>
              <ul
                v-else
                class="space-y-3"
              >
                <li
                  v-for="m in kardex.content"
                  :key="m.id"
                  class="flex gap-2.5"
                >
                  <UIcon
                    :name="KARDEX_TYPE_META[m.type]?.icon ?? 'i-lucide-circle'"
                    class="w-4 h-4 mt-0.5 shrink-0"
                    :class="KARDEX_TYPE_META[m.type]?.color ?? 'text-gray-400'"
                  />
                  <div class="min-w-0 flex-1">
                    <div class="flex items-center justify-between gap-2">
                      <span class="text-xs font-medium text-gray-700">
                        {{ KARDEX_TYPE_META[m.type]?.label ?? m.type }}
                      </span>
                      <span
                        class="text-xs font-semibold tabular-nums"
                        :class="m.quantity >= 0 ? 'text-green-600' : 'text-red-600'"
                      >
                        {{ m.quantity > 0 ? '+' : '' }}{{ m.quantity }}
                      </span>
                    </div>
                    <p
                      v-if="m.reason"
                      class="text-xs text-gray-500 truncate"
                    >
                      {{ m.reason }}
                    </p>
                    <p class="text-[11px] text-gray-400">
                      {{ formatDate(m.createdAt) }} · {{ m.createdBy }}
                    </p>
                  </div>
                </li>
              </ul>
            </div>

            <div class="pt-4 border-t border-gray-100">
              <h3 class="text-sm font-semibold text-gray-800 mb-3">
                Detalles del producto
              </h3>
              <dl class="space-y-2 text-sm">
                <div class="flex items-center justify-between">
                  <dt class="text-gray-500">
                    Costo por unidad
                  </dt>
                  <dd class="font-medium text-gray-800 tabular-nums">
                    {{ formatCurrency(productVariantDetail.costPrice) }}
                  </dd>
                </div>
                <div class="flex items-center justify-between">
                  <dt class="text-gray-500">
                    Precio de venta
                  </dt>
                  <dd class="font-medium text-gray-800 tabular-nums">
                    {{ formatCurrency(productVariantDetail.finalPrice) }}
                  </dd>
                </div>
                <div class="flex items-center justify-between">
                  <dt class="text-gray-500">
                    Valor del inventario
                  </dt>
                  <dd class="font-medium text-gray-800 tabular-nums">
                    {{ formatCurrency(inventoryValue) }}
                  </dd>
                </div>
              </dl>
            </div>
          </div>
        </div>
      </div>
    </template>

    <template #footer="{ close }">
      <div class="flex items-center justify-end gap-2 w-full">
        <UButton
          color="neutral"
          variant="ghost"
          @click="close"
        >
          Cancelar
        </UButton>
        <UButton
          color="primary"
          :loading="isSaving"
          :disabled="isInvalid"
          @click="onSave"
        >
          Guardar cambios
        </UButton>
      </div>
    </template>
  </USlideover>
</template>
