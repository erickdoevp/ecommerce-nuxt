<script setup lang="ts">
import { z } from 'zod'
import { Cropper } from 'vue-advanced-cropper'
import 'vue-advanced-cropper/dist/style.css'
import { useFileDialog } from '@vueuse/core'
import { useListColor } from '../composables/useListColor'
import { useListSize } from '../composables/useListSize'
import { useCreateVariant } from '../composables/useCreateVariant'

const props = defineProps<{
  productId: string | null
}>()

const open = defineModel<boolean>('open', { default: false })

const emit = defineEmits<{
  created: []
}>()

const { getColors, selectColors } = useListColor()
const { getSizes, selectSizes } = useListSize()
const { createVariant, isSaving, error: saveError } = useCreateVariant()

const schema = z.object({
  colorId: z.string().min(1, 'Selecciona un color'),
  sizeId: z.string().min(1, 'Selecciona una talla')
})

const form = reactive({
  colorId: '',
  sizeId: '',
  costPrice: 0,
  initialStock: 0,
  priceAdjustment: 0
})

const formRef = ref()

function resetForm() {
  form.colorId = ''
  form.sizeId = ''
  form.costPrice = 0
  form.initialStock = 0
  form.priceAdjustment = 0
  revokeSource()
  revokePreview()
  imageBlob.value = null
  imagePreview.value = ''
  imageError.value = ''
}

watch(open, (isOpen) => {
  if (isOpen) {
    if (!selectColors.value.length) getColors()
    if (!selectSizes.value.length) getSizes()
    resetForm()
  }
})

// ─── Selección + recorte de imagen ──────────────────────────────────────────────
const imageBlob = ref<Blob | null>(null)
const imagePreview = ref<string>('')
const sourceObjectUrl = ref<string | null>(null)
const previewObjectUrl = ref<string | null>(null)
const imageError = ref('')

const cropperRef = ref()
const cropperSrc = ref('')
const showCropperModal = ref(false)

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

onUnmounted(() => {
  revokeSource()
  revokePreview()
})

async function onSave() {
  if (!props.productId) return
  try {
    await formRef.value.validate()
  } catch {
    return
  }

  const result = await createVariant(
    props.productId,
    {
      sizeId: form.sizeId,
      colorId: form.colorId,
      costPrice: form.costPrice || 0,
      initialStock: form.initialStock || 0,
      priceAdjustment: form.priceAdjustment || 0
    },
    imageBlob.value
  )

  if (result) {
    emit('created')
    open.value = false
  }
}
</script>

<template>
  <USlideover
    v-model:open="open"
    title="Agregar variante"
    :ui="{ content: 'max-w-xl' }"
  >
    <template #body>
      <UForm
        ref="formRef"
        :schema="schema"
        :state="form"
        class="space-y-6"
      >
        <!-- Atributos -->
        <div class="space-y-4">
          <h3 class="text-sm font-semibold text-gray-800">
            Atributos
          </h3>
          <div class="grid grid-cols-2 gap-4">
            <UFormField
              label="Color"
              name="colorId"
              required
            >
              <USelectMenu
                v-model="form.colorId"
                :items="selectColors"
                value-key="value"
                placeholder="Selecciona un color"
                class="w-full"
              />
            </UFormField>

            <UFormField
              label="Talla"
              name="sizeId"
              required
            >
              <USelectMenu
                v-model="form.sizeId"
                :items="selectSizes"
                value-key="value"
                placeholder="Selecciona una talla"
                class="w-full"
              />
            </UFormField>
          </div>
        </div>

        <!-- Precios e inventario -->
        <div class="space-y-4">
          <h3 class="text-sm font-semibold text-gray-800">
            Precios e inventario
          </h3>
          <div class="grid grid-cols-2 gap-4">
            <UFormField
              label="Precio de costo"
              name="costPrice"
            >
              <UInput
                v-model.number="form.costPrice"
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
              label="Stock inicial"
              name="initialStock"
            >
              <UInput
                v-model.number="form.initialStock"
                type="number"
                min="0"
                class="w-full"
              />
            </UFormField>

            <UFormField
              label="Ajuste de precio"
              name="priceAdjustment"
              class="col-span-2"
              help="Monto fijo sumado al precio base del producto."
            >
              <UInput
                v-model.number="form.priceAdjustment"
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

        <!-- Imagen -->
        <div class="space-y-3">
          <h3 class="text-sm font-semibold text-gray-800">
            Imagen <span class="font-normal text-gray-400">(opcional)</span>
          </h3>

          <div class="relative group w-40 h-40">
            <template v-if="imagePreview">
              <img
                :src="imagePreview"
                class="w-40 h-40 rounded-lg object-cover border border-gray-200"
              >
              <div class="absolute inset-0 rounded-lg bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                <button
                  type="button"
                  class="w-8 h-8 rounded-full bg-white/90 hover:bg-white flex items-center justify-center"
                  title="Editar imagen"
                  @click="editCurrentImage"
                >
                  <UIcon
                    name="i-lucide-pencil"
                    class="w-4 h-4 text-gray-700"
                  />
                </button>
                <button
                  type="button"
                  class="w-8 h-8 rounded-full bg-white/90 hover:bg-white flex items-center justify-center"
                  title="Volver a seleccionar"
                  @click="openFileDialog()"
                >
                  <UIcon
                    name="i-lucide-refresh-cw"
                    class="w-4 h-4 text-gray-700"
                  />
                </button>
              </div>
            </template>
            <button
              v-else
              type="button"
              class="w-40 h-40 rounded-lg border-2 border-dashed border-gray-200 hover:border-primary transition-colors flex flex-col items-center justify-center gap-1 cursor-pointer"
              @click="openFileDialog()"
            >
              <UIcon
                name="i-lucide-image-plus"
                class="w-7 h-7 text-gray-300"
              />
              <span class="text-xs text-gray-400">Subir imagen</span>
            </button>
          </div>

          <p
            v-if="imageError"
            class="text-xs text-red-500"
          >
            {{ imageError }}
          </p>
        </div>
      </UForm>
    </template>

    <template #footer="{ close }">
      <div class="flex items-center justify-end gap-3 w-full">
        <p
          v-if="saveError"
          class="text-xs text-red-500 mr-auto"
        >
          {{ saveError }}
        </p>
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
          @click="onSave"
        >
          Agregar variante
        </UButton>
      </div>
    </template>
  </USlideover>

  <!-- Editor de imagen (hermano del slideover para apilarse por encima) -->
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
