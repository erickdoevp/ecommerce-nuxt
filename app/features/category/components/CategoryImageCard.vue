<script setup lang="ts">
import { Cropper } from 'vue-advanced-cropper'
import 'vue-advanced-cropper/dist/style.css'
import { useDropZone, useFileDialog } from '@vueuse/core'
import { useCategoryForm } from '../composables/useCategoryForm'

const { image } = useCategoryForm()

const dropZoneRef = ref<HTMLDivElement>()
const cropperRef = ref()
const showEditorModal = ref(false)

const { isOverDropZone } = useDropZone(dropZoneRef, {
  onDrop(files) { if (files?.[0]) setImage(files[0]) },
  dataTypes: ['image/jpeg', 'image/png', 'image/webp'],
})

const { open: openFileDialog, onChange } = useFileDialog({ accept: 'image/*', multiple: false })
onChange((files) => { if (files?.[0]) setImage(files[0]) })

function setImage(file: File) {
  if (image.value) {
    URL.revokeObjectURL(image.value.originalUrl)
    if (image.value.displayUrl !== image.value.originalUrl) URL.revokeObjectURL(image.value.displayUrl)
  }
  const url = URL.createObjectURL(file)
  image.value = { file, originalUrl: url, displayUrl: url }
}

function removeImage() {
  if (!image.value) return
  URL.revokeObjectURL(image.value.originalUrl)
  if (image.value.displayUrl !== image.value.originalUrl) URL.revokeObjectURL(image.value.displayUrl)
  image.value = null
}

function applyEdit() {
  if (!cropperRef.value || !image.value) return
  const { canvas } = cropperRef.value.getResult()
  canvas.toBlob((blob: Blob | null) => {
    if (!blob || !image.value) return
    const newUrl = URL.createObjectURL(blob)
    if (image.value.displayUrl !== image.value.originalUrl) URL.revokeObjectURL(image.value.displayUrl)
    image.value = { ...image.value, displayUrl: newUrl, editedBlob: blob }
    showEditorModal.value = false
  }, 'image/jpeg', 0.92)
}

function rotate(angle: number) { cropperRef.value?.rotate(angle) }
function flipX() { cropperRef.value?.flip(true, false) }
function flipY() { cropperRef.value?.flip(false, true) }

onUnmounted(() => {
  if (image.value) {
    URL.revokeObjectURL(image.value.originalUrl)
    if (image.value.displayUrl !== image.value.originalUrl) URL.revokeObjectURL(image.value.displayUrl)
  }
})
</script>

<template>
  <div>
    <div ref="dropZoneRef">
      <!-- Empty state -->
      <div
        v-if="!image"
        class="border-2 border-dashed rounded-xl flex flex-col items-center justify-center gap-3 py-10 cursor-pointer transition-colors"
        :class="isOverDropZone
          ? 'border-primary bg-primary/5'
          : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'"
        @click="openFileDialog()"
      >
        <UIcon
          name="i-lucide-image"
          class="w-10 h-10 text-gray-300"
        />
        <div class="text-center space-y-1">
          <UButton
            color="neutral"
            variant="outline"
            size="sm"
            type="button"
            @click.stop="openFileDialog()"
          >
            Agregar imagen
          </UButton>
          <p class="text-xs text-gray-400">
            o arrastra y suelta
          </p>
          <p class="text-xs text-gray-400">
            Recomendado: 800 x 800px (1:1)
          </p>
        </div>
      </div>

      <!-- Preview -->
      <div
        v-else
        class="relative group rounded-xl overflow-hidden border border-gray-200 aspect-square"
        :class="isOverDropZone ? 'ring-2 ring-primary ring-offset-2' : ''"
      >
        <img
          :src="image.displayUrl"
          class="w-full h-full object-cover"
          alt="Imagen de categoría"
        >
        <div class="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
          <button
            type="button"
            class="w-9 h-9 rounded-full bg-white/90 hover:bg-white flex items-center justify-center"
            @click="showEditorModal = true"
          >
            <UIcon name="i-lucide-pencil" class="w-4 h-4 text-gray-700" />
          </button>
          <button
            type="button"
            class="w-9 h-9 rounded-full bg-white/90 hover:bg-white flex items-center justify-center"
            @click="removeImage"
          >
            <UIcon name="i-lucide-trash-2" class="w-4 h-4 text-red-500" />
          </button>
        </div>
      </div>
    </div>

    <!-- Editor modal -->
    <UModal
      v-model:open="showEditorModal"
      title="Editar imagen"
      size="xl"
      :ui="{ footer: 'justify-end' }"
    >
      <template #body>
        <Cropper
          ref="cropperRef"
          class="h-80 w-full rounded-lg overflow-hidden bg-gray-900"
          :src="image?.originalUrl"
          :stencil-props="{ aspectRatio: 1 }"
        />
        <div class="flex items-center gap-2 mt-4">
          <UButton color="neutral" variant="outline" size="sm" icon="i-lucide-rotate-ccw" @click="rotate(-90)">Rotar izq.</UButton>
          <UButton color="neutral" variant="outline" size="sm" icon="i-lucide-rotate-cw" @click="rotate(90)">Rotar der.</UButton>
          <UButton color="neutral" variant="outline" size="sm" icon="i-lucide-flip-horizontal-2" @click="flipX">Voltear H</UButton>
          <UButton color="neutral" variant="outline" size="sm" icon="i-lucide-flip-vertical-2" @click="flipY">Voltear V</UButton>
        </div>
      </template>
      <template #footer>
        <UButton color="neutral" variant="outline" @click="showEditorModal = false">Cancelar</UButton>
        <UButton @click="applyEdit">Aplicar cambios</UButton>
      </template>
    </UModal>
  </div>
</template>
