<script setup lang="ts">
import { Cropper } from 'vue-advanced-cropper'
import 'vue-advanced-cropper/dist/style.css'
import { useDropZone, useFileDialog } from '@vueuse/core'
import { useCollectionForm } from '../composables/useCollectionForm'

const { image } = useCollectionForm()

const dropZoneRef = ref<HTMLDivElement>()
const cropperRef = ref()
const showEditorModal = ref(false)

const { isOverDropZone } = useDropZone(dropZoneRef, {
  onDrop(files) {
    if (files?.[0]) setFile(files[0])
  },
  dataTypes: ['image/jpeg', 'image/png', 'image/webp', 'image/gif']
})

const { open: openFileDialog, onChange } = useFileDialog({
  accept: 'image/*',
  multiple: false
})

onChange((files) => {
  if (files?.[0]) setFile(files[0])
})

function setFile(file: File) {
  clearCurrentImage()
  const url = URL.createObjectURL(file)
  image.value = { id: crypto.randomUUID(), file, originalUrl: url, displayUrl: url }
}

function clearCurrentImage() {
  if (!image.value) return
  if (image.value.originalUrl.startsWith('blob:')) URL.revokeObjectURL(image.value.originalUrl)
  if (image.value.displayUrl !== image.value.originalUrl && image.value.displayUrl.startsWith('blob:')) {
    URL.revokeObjectURL(image.value.displayUrl)
  }
}

function removeImage() {
  clearCurrentImage()
  image.value = null
}

function openEditor() {
  showEditorModal.value = true
}

function applyEdit() {
  if (!cropperRef.value || !image.value) return
  const { canvas } = cropperRef.value.getResult()
  canvas.toBlob((blob: Blob | null) => {
    if (!blob || !image.value) return
    if (image.value.displayUrl !== image.value.originalUrl && image.value.displayUrl.startsWith('blob:')) {
      URL.revokeObjectURL(image.value.displayUrl)
    }
    image.value = { ...image.value, displayUrl: URL.createObjectURL(blob), editedBlob: blob }
    showEditorModal.value = false
  }, 'image/jpeg', 0.92)
}

function rotate(angle: number) { cropperRef.value?.rotate(angle) }
function flipX() { cropperRef.value?.flip(true, false) }
function flipY() { cropperRef.value?.flip(false, true) }

onUnmounted(() => clearCurrentImage())
</script>

<template>
  <div class="p-6 border border-[#ececed] rounded-xl bg-white">
    <div class="mb-5">
      <h3 class="font-semibold text-base">
        Imagen de portada
      </h3>
      <p class="text-sm text-gray-500 mt-0.5">
        Imagen principal de la colección.
      </p>
    </div>

    <div ref="dropZoneRef">
      <!-- Empty state -->
      <div
        v-if="!image"
        class="border-2 border-dashed rounded-xl flex flex-col items-center justify-center gap-3 py-14 cursor-pointer transition-colors"
        :class="isOverDropZone
          ? 'border-primary bg-primary/5'
          : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'"
        @click="openFileDialog()"
      >
        <div class="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center">
          <UIcon
            name="i-lucide-image-plus"
            class="w-6 h-6 text-gray-400"
          />
        </div>
        <div class="text-center">
          <p class="text-sm font-medium text-gray-700">
            Arrastra la imagen aquí
          </p>
          <p class="text-xs text-gray-400 mt-0.5">
            o haz clic para seleccionar · JPG, PNG, WEBP
          </p>
        </div>
      </div>

      <!-- Image preview -->
      <div
        v-else
        class="relative group w-full aspect-video rounded-xl overflow-hidden border border-gray-200"
        :class="isOverDropZone ? 'ring-2 ring-primary ring-offset-2' : ''"
        @click.self="openFileDialog()"
      >
        <img
          :src="image.displayUrl"
          class="w-full h-full object-cover"
        >
        <div class="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
          <button
            type="button"
            class="w-9 h-9 rounded-full bg-white/90 hover:bg-white transition-colors flex items-center justify-center"
            @click="openEditor"
          >
            <UIcon
              name="i-lucide-pencil"
              class="w-4 h-4 text-gray-700"
            />
          </button>
          <button
            type="button"
            class="w-9 h-9 rounded-full bg-white/90 hover:bg-white transition-colors flex items-center justify-center"
            @click="openFileDialog()"
          >
            <UIcon
              name="i-lucide-refresh-cw"
              class="w-4 h-4 text-gray-700"
            />
          </button>
          <button
            type="button"
            class="w-9 h-9 rounded-full bg-white/90 hover:bg-white transition-colors flex items-center justify-center"
            @click="removeImage"
          >
            <UIcon
              name="i-lucide-trash-2"
              class="w-4 h-4 text-red-500"
            />
          </button>
        </div>
      </div>
    </div>

    <!-- Cropper modal -->
    <UModal
      v-model:open="showEditorModal"
      title="Editar imagen"
      size="xl"
      :ui="{ footer: 'justify-end' }"
    >
      <template #body>
        <Cropper
          ref="cropperRef"
          class="h-96 w-full rounded-lg overflow-hidden bg-gray-900"
          :src="image?.originalUrl"
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
          Aplicar cambios
        </UButton>
      </template>
    </UModal>
  </div>
</template>
