<script setup lang="ts">
import { Cropper } from 'vue-advanced-cropper'
import 'vue-advanced-cropper/dist/style.css'
import { useFileDialog } from '@vueuse/core'
import { useProductVariantDetail } from '../composables/useProductVartiantDetail'
import { useUpdateVariant } from '../composables/useUpdateVariant'

const props = defineProps<{
  variantId: string | null
}>()

const open = defineModel<boolean>('open', { default: false })

const emit = defineEmits<{
  updated: [payload: { id: string, sku: string, costPrice: number, priceAdjustment: number, image: string | null }]
}>()

const { getProductVariantDetail, productVariantDetail, isLoading } = useProductVariantDetail()
const { updateVariant, isSaving, error: saveError } = useUpdateVariant()
const toast = useToast()

// ─── Form state ───────────────────────────────────────────────────────────────
const sku = ref('')
const costPrice = ref(0)
const priceAdjustment = ref(0)
const active = ref(true)

const imageBlob = ref<Blob | null>(null)
const imagePreview = ref<string>('')
const sourceObjectUrl = ref<string | null>(null)
const previewObjectUrl = ref<string | null>(null)
const imageError = ref('')

function revokeSource() {
  if (sourceObjectUrl.value) {
    URL.revokeObjectURL(sourceObjectUrl.value)
    sourceObjectUrl.value = null
  }
}

function revokePreview() {
  if (previewObjectUrl.value) {
    URL.revokeObjectURL(previewObjectUrl.value)
    previewObjectUrl.value = null
  }
}

function resetForm() {
  const d = productVariantDetail.value
  sku.value = d?.sku ?? ''
  costPrice.value = d?.costPrice ?? 0
  priceAdjustment.value = d?.priceAdjustment ?? 0
  active.value = d?.active ?? true
  revokeSource()
  revokePreview()
  imageBlob.value = null
  imagePreview.value = d?.imageUrl ?? ''
  imageError.value = ''
}

async function load(id: string) {
  await getProductVariantDetail(id)
  resetForm()
}

watch([open, () => props.variantId], ([isOpen, id]) => {
  if (isOpen && id) load(id)
})

// ─── Image select + crop ──────────────────────────────────────────────────────
const cropperRef = ref()
const cropperSrc = ref('')
const showCropperModal = ref(false)

const { open: openFileDialog, onChange: onFileChange } = useFileDialog({
  accept: 'image/jpeg,image/png,image/webp',
  multiple: false
})

onFileChange((files) => {
  const file = files?.[0]
  if (!file) return
  if (file.size > 2 * 1024 * 1024) {
    imageError.value = 'La imagen supera el máximo de 2MB.'
    return
  }
  imageError.value = ''
  revokeSource()
  const url = URL.createObjectURL(file)
  sourceObjectUrl.value = url
  cropperSrc.value = url
  showCropperModal.value = true
})

function editCurrentImage() {
  if (!imagePreview.value) {
    openFileDialog()
    return
  }
  cropperSrc.value = imagePreview.value
  showCropperModal.value = true
}

function applyCrop() {
  if (!cropperRef.value) return
  const { canvas } = cropperRef.value.getResult()
  canvas.toBlob((blob: Blob | null) => {
    if (!blob) return
    revokePreview()
    const url = URL.createObjectURL(blob)
    previewObjectUrl.value = url
    imageBlob.value = blob
    imagePreview.value = url
    showCropperModal.value = false
  }, 'image/jpeg', 0.92)
}

function rotate(angle: number) {
  cropperRef.value?.rotate(angle)
}
function flipX() {
  cropperRef.value?.flip(true, false)
}
function flipY() {
  cropperRef.value?.flip(false, true)
}

function clearImage() {
  revokePreview()
  imageBlob.value = null
  imagePreview.value = ''
  imageError.value = ''
}

onUnmounted(() => {
  revokeSource()
  revokePreview()
})

// ─── Derived ──────────────────────────────────────────────────────────────────
const suggestedPrice = computed(() => (productVariantDetail.value?.basePrice ?? 0) + (priceAdjustment.value || 0))

function formatCLP(n: number): string {
  return Math.round(n).toLocaleString('es-CL')
}

async function onSave() {
  if (!props.variantId || !productVariantDetail.value) return

  const result = await updateVariant(
    productVariantDetail.value.productId,
    props.variantId,
    {
      sku: sku.value,
      priceAdjustment: priceAdjustment.value || 0,
      costPrice: costPrice.value || 0,
      active: active.value
    },
    imageBlob.value
  )

  if (result) {
    toast.add({ title: 'Variante actualizada', color: 'success', icon: 'i-lucide-check-circle' })
    emit('updated', {
      id: props.variantId,
      sku: sku.value,
      costPrice: costPrice.value || 0,
      priceAdjustment: priceAdjustment.value || 0,
      image: result.imageUrl ?? imagePreview.value ?? null
    })
    open.value = false
  }
}
</script>

<template>
  <USlideover
    v-model:open="open"
    title="Editar variante"
    :ui="{ content: 'max-w-xl' }"
  >
    <template #body>
      <div
        v-if="isLoading && !productVariantDetail"
        class="flex items-center justify-center py-20"
      >
        <UIcon
          name="i-lucide-loader-circle"
          class="w-6 h-6 text-gray-400 animate-spin"
        />
      </div>

      <div
        v-else-if="productVariantDetail"
        class="space-y-5"
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

        <div class="space-y-5">
          <!-- Imagen -->
          <div>
            <p class="text-sm font-semibold text-gray-700 mb-2">
              Imagen de la variante
            </p>
            <div class="relative group w-28 h-28">
              <template v-if="imagePreview">
                <img
                  :src="imagePreview"
                  class="w-28 h-28 rounded-lg object-cover border border-gray-200"
                >
                <div class="absolute inset-0 rounded-lg bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-1.5">
                  <button
                    type="button"
                    class="w-7 h-7 rounded-full bg-white/90 hover:bg-white flex items-center justify-center"
                    title="Editar imagen"
                    @click="editCurrentImage"
                  >
                    <UIcon
                      name="i-lucide-pencil"
                      class="w-3.5 h-3.5 text-gray-700"
                    />
                  </button>
                  <button
                    type="button"
                    class="w-7 h-7 rounded-full bg-white/90 hover:bg-white flex items-center justify-center"
                    title="Volver a seleccionar"
                    @click="openFileDialog()"
                  >
                    <UIcon
                      name="i-lucide-refresh-cw"
                      class="w-3.5 h-3.5 text-gray-700"
                    />
                  </button>
                  <button
                    type="button"
                    class="w-7 h-7 rounded-full bg-white/90 hover:bg-white flex items-center justify-center"
                    title="Borrar imagen"
                    @click="clearImage"
                  >
                    <UIcon
                      name="i-lucide-trash-2"
                      class="w-3.5 h-3.5 text-red-500"
                    />
                  </button>
                </div>
              </template>
              <button
                v-else
                type="button"
                class="w-28 h-28 rounded-lg border-2 border-dashed border-gray-200 hover:border-primary transition-colors flex flex-col items-center justify-center gap-1 cursor-pointer"
                @click="openFileDialog()"
              >
                <UIcon
                  name="i-lucide-image-plus"
                  class="w-6 h-6 text-gray-300"
                />
                <span class="text-xs text-gray-400">Subir imagen</span>
              </button>
            </div>
            <p
              v-if="imageError"
              class="text-xs text-red-500 mt-1.5"
            >
              {{ imageError }}
            </p>
            <p
              v-else-if="!imagePreview"
              class="text-xs text-red-500 mt-1.5"
            >
              Selecciona una imagen para la variante.
            </p>
          </div>

          <!-- Precios -->
          <div>
            <p class="text-sm font-semibold text-gray-700 mb-3">
              Precios
            </p>
            <div class="grid grid-cols-2 gap-4">
              <UFormField label="Precio (sugerido)">
                <UInput
                  :model-value="formatCLP(suggestedPrice)"
                  disabled
                  class="w-full"
                >
                  <template #leading>
                    <span class="text-xs text-gray-500">$</span>
                  </template>
                  <template #trailing>
                    <span class="text-xs text-gray-400">MXN</span>
                  </template>
                </UInput>
              </UFormField>

              <UFormField label="Costo unitario">
                <UInput
                  v-model.number="costPrice"
                  type="number"
                  min="0"
                  class="w-full"
                >
                  <template #leading>
                    <span class="text-xs text-gray-500">$</span>
                  </template>
                  <template #trailing>
                    <span class="text-xs text-gray-400">MXN</span>
                  </template>
                </UInput>
              </UFormField>

              <UFormField
                label="Ajuste de precio"
                class="col-span-2"
                help="Monto fijo sumado al precio base para calcular el precio sugerido."
              >
                <UInput
                  v-model.number="priceAdjustment"
                  type="number"
                  class="w-full"
                >
                  <template #leading>
                    <span class="text-xs text-gray-500">$</span>
                  </template>
                  <template #trailing>
                    <span class="text-xs text-gray-400">MXN</span>
                  </template>
                </UInput>
              </UFormField>
            </div>
          </div>

          <!-- SKU y estado -->
          <UFormField label="SKU">
            <UInput
              v-model="sku"
              placeholder="Ej. CAM-NEG-M"
              class="w-full font-mono"
            />
          </UFormField>

          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm font-medium text-gray-700">
                Variante activa
              </p>
              <p class="text-xs text-gray-500">
                Las variantes inactivas no se muestran en la tienda.
              </p>
            </div>
            <USwitch v-model="active" />
          </div>
        </div>

        <p
          v-if="saveError"
          class="text-xs text-red-500"
        >
          {{ saveError }}
        </p>
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
          :disabled="!imagePreview"
          @click="onSave"
        >
          Guardar cambios
        </UButton>
      </div>
    </template>

  </USlideover>

  <!-- Image editor modal (sibling so it stacks above the slideover) -->
  <UModal
    v-model:open="showCropperModal"
    title="Editar imagen de variante"
    size="xl"
    :ui="{ overlay: 'z-[60]', content: 'z-[60]', footer: 'justify-end' }"
  >
    <template #body>
      <Cropper
        ref="cropperRef"
        class="h-96 w-full rounded-lg overflow-hidden bg-gray-900"
        :src="cropperSrc"
      />
      <div class="flex items-center gap-2 mt-4">
        <UButton
          color="neutral"
          variant="outline"
          size="sm"
          icon="i-lucide-rotate-ccw"
          @click="rotate(-90)"
        >
          Rotar izq.
        </UButton>
        <UButton
          color="neutral"
          variant="outline"
          size="sm"
          icon="i-lucide-rotate-cw"
          @click="rotate(90)"
        >
          Rotar der.
        </UButton>
        <UButton
          color="neutral"
          variant="outline"
          size="sm"
          icon="i-lucide-flip-horizontal-2"
          @click="flipX"
        >
          Voltear H
        </UButton>
        <UButton
          color="neutral"
          variant="outline"
          size="sm"
          icon="i-lucide-flip-vertical-2"
          @click="flipY"
        >
          Voltear V
        </UButton>
      </div>
    </template>
    <template #footer>
      <UButton
        color="neutral"
        variant="outline"
        @click="showCropperModal = false"
      >
        Cancelar
      </UButton>
      <UButton @click="applyCrop">
        Aplicar cambios
      </UButton>
    </template>
  </UModal>
</template>

