<script setup lang="ts">
import { Cropper } from 'vue-advanced-cropper'
import 'vue-advanced-cropper/dist/style.css'
import { useDropZone, useFileDialog } from '@vueuse/core'
import type { MediaImage } from '~/features/product/types/image'
import { useCategoryForm } from '../composables/useCategoryForm'

const { images } = useCategoryForm()

const dropZoneRef = ref<HTMLDivElement>()
const cropperRef = ref()
const editingImage = ref<MediaImage | null>(null)
const showEditorModal = ref(false)

const { isOverDropZone } = useDropZone(dropZoneRef, {
  onDrop(files) {
    if (files) addFiles(files)
  },
  dataTypes: ['image/jpeg', 'image/png', 'image/webp', 'image/gif']
})

const { open: openFileDialog, onChange } = useFileDialog({
  accept: 'image/*',
  multiple: false
})

onChange((files) => {
  if (files?.[0]) replaceImage(files[0])
})

function replaceImage(file: File) {
  if (!file.type.startsWith('image/')) return
  if (images.value[0]) {
    URL.revokeObjectURL(images.value[0].originalUrl)
    if (images.value[0].displayUrl !== images.value[0].originalUrl) URL.revokeObjectURL(images.value[0].displayUrl)
  }
  const url = URL.createObjectURL(file)
  images.value = [{ id: crypto.randomUUID(), file, originalUrl: url, displayUrl: url }]
}

function addFiles(files: File[]) {
  const file = files.find(f => f.type.startsWith('image/'))
  if (file) replaceImage(file)
}

function removeImage(id: string) {
  const idx = images.value.findIndex(img => img.id === id)
  if (idx === -1) return
  const img = images.value[idx]
  if (!img) return
  URL.revokeObjectURL(img.originalUrl)
  if (img.displayUrl !== img.originalUrl) URL.revokeObjectURL(img.displayUrl)
  images.value.splice(idx, 1)
}

function openEditor(image: MediaImage) {
  editingImage.value = image
  showEditorModal.value = true
}

function applyEdit() {
  if (!cropperRef.value || !editingImage.value) return
  const { canvas } = cropperRef.value.getResult()
  canvas.toBlob((blob: Blob | null) => {
    if (!blob || !editingImage.value) return
    const newUrl = URL.createObjectURL(blob)
    const idx = images.value.findIndex(img => img.id === editingImage.value!.id)
    if (idx !== -1) {
      if (images.value[idx]?.displayUrl !== images.value[idx]?.originalUrl) {
        URL.revokeObjectURL(images.value[idx]!.displayUrl)
      }
      images.value[idx] = { ...images.value[idx]!, displayUrl: newUrl, editedBlob: blob }
    }
    showEditorModal.value = false
    editingImage.value = null
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
  for (const img of images.value) {
    URL.revokeObjectURL(img.originalUrl)
    if (img.displayUrl !== img.originalUrl) URL.revokeObjectURL(img.displayUrl)
  }
})
</script>

<template>
  <div class="p-6 border border-[#ececed] rounded-xl bg-white">
    <div class="mb-5">
      <h3 class="font-semibold text-base">
        Imagen
      </h3>
      <p class="text-sm text-gray-500 mt-0.5">
        Agrega la imagen de la categoría.
      </p>
    </div>

    <div ref="dropZoneRef">
      <!-- Empty state -->
      <div
        v-if="!images.length"
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

      <!-- Thumbnails grid -->
      <div
        v-else
        class="grid gap-3"
        :class="isOverDropZone ? 'ring-2 ring-primary ring-offset-2 rounded-xl' : ''"
        style="grid-template-columns: repeat(auto-fill, minmax(120px, 1fr))"
      >
        <div
          v-for="image in images"
          :key="image.id"
          class="relative group aspect-square rounded-lg overflow-hidden border border-gray-200"
        >
          <img
            :src="image.displayUrl"
            class="w-full h-full object-cover"
          >

          <div class="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
            <button
              type="button"
              class="w-8 h-8 rounded-full bg-white/90 hover:bg-white transition-colors flex items-center justify-center"
              @click="openEditor(image)"
            >
              <UIcon
                name="i-lucide-pencil"
                class="w-3.5 h-3.5 text-gray-700"
              />
            </button>
            <button
              type="button"
              class="w-8 h-8 rounded-full bg-white/90 hover:bg-white transition-colors flex items-center justify-center"
              @click="removeImage(image.id)"
            >
              <UIcon
                name="i-lucide-trash-2"
                class="w-3.5 h-3.5 text-red-500"
              />
            </button>
          </div>
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
          class="h-96 w-full rounded-lg overflow-hidden bg-gray-900"
          :src="editingImage?.originalUrl"
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
