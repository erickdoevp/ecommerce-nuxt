<script setup lang="ts">
import { Cropper, CircleStencil } from 'vue-advanced-cropper'
import 'vue-advanced-cropper/dist/style.css'
import { useFileDialog } from '@vueuse/core'

const props = defineProps<{
  currentUrl: string | null
  name?: string
}>()

// Blob recortado pendiente de guardar; el padre lo envía con updateProfile.
const file = defineModel<Blob | null>('file', { default: null })

const cropperRef = ref()
const showEditorModal = ref(false)
const sourceUrl = ref<string | null>(null) // foto original (entrada del cropper)
const previewUrl = ref<string | null>(null) // resultado recortado (preview)

const initial = computed(() => (props.name ?? '?').charAt(0).toUpperCase())

const { open: openFileDialog, onChange } = useFileDialog({ accept: 'image/*', multiple: false })
onChange((files) => {
  if (files?.[0]) {
    if (sourceUrl.value) URL.revokeObjectURL(sourceUrl.value)
    sourceUrl.value = URL.createObjectURL(files[0])
    showEditorModal.value = true
  }
})

function applyEdit() {
  if (!cropperRef.value) return
  const { canvas } = cropperRef.value.getResult()
  canvas.toBlob((blob: Blob | null) => {
    if (!blob) return
    if (previewUrl.value) URL.revokeObjectURL(previewUrl.value)
    previewUrl.value = URL.createObjectURL(blob)
    file.value = blob
    showEditorModal.value = false
  }, 'image/jpeg', 0.92)
}

function discard() {
  if (previewUrl.value) URL.revokeObjectURL(previewUrl.value)
  previewUrl.value = null
  file.value = null
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

// Si el padre limpia el modelo (p. ej. tras guardar), descarta el preview local.
watch(file, (value) => {
  if (!value && previewUrl.value) {
    URL.revokeObjectURL(previewUrl.value)
    previewUrl.value = null
  }
})

onUnmounted(() => {
  if (sourceUrl.value) URL.revokeObjectURL(sourceUrl.value)
  if (previewUrl.value) URL.revokeObjectURL(previewUrl.value)
})
</script>

<template>
  <div class="flex items-center gap-5">
    <div class="w-24 h-24 rounded-full overflow-hidden bg-gradient-to-br from-[#E7D4C0] to-[#C9A989] flex items-center justify-center shrink-0 shadow-sm">
      <img
        v-if="previewUrl || currentUrl"
        :src="previewUrl ?? currentUrl ?? undefined"
        alt=""
        class="w-full h-full object-cover"
      >
      <span
        v-else
        class="font-serif text-3xl text-white"
      >
        {{ initial }}
      </span>
    </div>

    <div class="space-y-2">
      <div class="flex items-center gap-2">
        <UButton
          color="neutral"
          variant="outline"
          size="sm"
          type="button"
          class="rounded-full tracking-widest"
          @click="openFileDialog()"
        >
          Cambiar foto
        </UButton>
        <UButton
          v-if="file"
          color="neutral"
          variant="ghost"
          size="sm"
          type="button"
          @click="discard"
        >
          Descartar
        </UButton>
      </div>
      <p class="text-xs text-dimmed">
        JPG o PNG. Se recorta en círculo.
      </p>
    </div>

    <!-- Editor de recorte -->
    <UModal
      v-model:open="showEditorModal"
      title="Recortar foto"
      size="xl"
      :ui="{ footer: 'justify-end' }"
    >
      <template #body>
        <Cropper
          ref="cropperRef"
          class="h-80 w-full rounded-lg overflow-hidden bg-gray-900"
          :src="sourceUrl"
          :stencil-component="CircleStencil"
          :stencil-props="{ aspectRatio: 1 }"
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
          @click="showEditorModal = false"
        >
          Cancelar
        </UButton>
        <UButton @click="applyEdit">
          Aplicar
        </UButton>
      </template>
    </UModal>
  </div>
</template>
