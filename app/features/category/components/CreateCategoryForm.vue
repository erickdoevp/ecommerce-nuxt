<script setup lang="ts">
import type { FormSubmitEvent } from '@nuxt/ui'
import { categorySchema } from '../schemas/category.schema'
import type { CategorySchema } from '../schemas/category.schema'
import { useCategoryForm } from '../composables/useCategoryForm'
import { useCreateCategory } from '../composables/useCreateCategory'
import { useTreeCategory } from '../composables/useTreeCategory'

const { form, images, wordCount, slugManuallyEdited, resetForm } = useCategoryForm()
const { createCategory, isLoading } = useCreateCategory()
const { getCategories, treeSelectCategory, isLoading: loadingCategories } = useTreeCategory()
const toast = useToast()

const formRef = useTemplateRef('formRef')

defineExpose({
  submit: () => formRef.value?.submit(),
  isLoading
})

onMounted(() => getCategories())

const toolbarItems = [
  [
    {
      label: 'Párrafo',
      trailingIcon: 'i-lucide-chevron-down',
      items: [[
        { kind: 'paragraph', label: 'Párrafo' },
        { kind: 'heading', level: 1, label: 'Encabezado 1' },
        { kind: 'heading', level: 2, label: 'Encabezado 2' },
        { kind: 'heading', level: 3, label: 'Encabezado 3' }
      ]]
    }
  ],
  [
    { kind: 'mark', mark: 'bold', icon: 'i-lucide-bold', tooltip: { text: 'Negrita' } },
    { kind: 'mark', mark: 'italic', icon: 'i-lucide-italic', tooltip: { text: 'Cursiva' } },
    { kind: 'mark', mark: 'underline', icon: 'i-lucide-underline', tooltip: { text: 'Subrayado' } }
  ],
  [
    { kind: 'bulletList', icon: 'i-lucide-list', tooltip: { text: 'Lista con viñetas' } },
    { kind: 'orderedList', icon: 'i-lucide-list-ordered', tooltip: { text: 'Lista numerada' } }
  ],
  [
    { kind: 'link', icon: 'i-lucide-link', tooltip: { text: 'Enlace' } },
    { kind: 'image', icon: 'i-lucide-image', tooltip: { text: 'Imagen' } }
  ]
]

async function onSubmit(event: FormSubmitEvent<CategorySchema>) {
  try {
    await createCategory(event.data, images.value)
    toast.add({ title: 'Categoría creada', color: 'success', icon: 'i-lucide-check-circle' })
    resetForm()
    await navigateTo('/admin/category')
  } catch {
    toast.add({ title: 'Error al crear la categoría', color: 'error', icon: 'i-lucide-circle-alert' })
  }
}
</script>

<template>
  <UForm
    ref="formRef"
    :schema="categorySchema"
    :state="form"
    class="space-y-4"
    @submit="onSubmit"
  >
    <!-- Información general -->
    <div class="p-6 border border-[#ececed] rounded-xl bg-white flex flex-col gap-5">
      <!-- Nombre + Slug -->
      <div class="grid grid-cols-2 gap-4">
        <UFormField
          label="Nombre de la categoría"
          name="name"
          class="w-full"
        >
          <UInput
            v-model="form.name"
            placeholder="Ej. Camisetas"
            class="w-full"
          />
        </UFormField>

        <UFormField
          name="slug"
          class="w-full"
        >
          <template #label>
            <span>ID (slug)</span>
          </template>
          <UInput
            v-model="form.slug"
            placeholder="Ej. camisetas"
            class="w-full"
            @input="slugManuallyEdited = true"
          />
        </UFormField>
      </div>

      <!-- Descripción (ancho completo) -->
      <UFormField
        label="Descripción"
        name="description"
        class="w-full"
      >
        <div class="relative w-full">
          <UEditor
            v-model="form.description"
            content-type="json"
            placeholder="Escribe una descripción para esta categoría..."
            :starter-kit="{
              blockquote: false,
              heading: { levels: [1, 2, 3] },
              dropcursor: { color: 'var(--ui-primary)', width: 2 },
              link: { openOnClick: false }
            }"
            class="w-full border border-[#cad5e2] rounded-md h-52"
          >
            <template #default="{ editor }">
              <UEditorToolbar
                :editor="editor"
                :items="toolbarItems"
              />
            </template>
          </UEditor>
          <span class="absolute bottom-2 right-3 text-xs text-gray-400 pointer-events-none select-none">
            {{ wordCount }} palabras
          </span>
        </div>
      </UFormField>

      <!-- Categoría padre -->
      <UFormField
        label="Categoría padre"
        name="categoryId"
        class="w-full"
      >
        <USelectMenu
          v-model="form.parentId"
          :items="treeSelectCategory"
          value-key="value"
          placeholder="Selecciona una categoría"
          class="w-full"
          :loading="loadingCategories"
        >
          <template #item="{ item }">
            <div
              class="flex items-center gap-2 w-full"
              :style="item.depth > 0 ? { paddingLeft: `${item.depth * 16}px` } : {}"
            >
              <UIcon
                :name="item.isParent ? 'i-lucide-folder' : 'i-lucide-tag'"
                class="shrink-0"
                :class="item.depth === 0 ? 'w-4 h-4 text-gray-500' : 'w-3.5 h-3.5 text-gray-400'"
              />
              <span :class="item.depth === 0 ? 'font-semibold text-gray-800' : item.depth === 1 ? 'text-gray-600' : 'text-gray-500 text-sm'">
                {{ item.label }}
              </span>
            </div>
          </template>
        </USelectMenu>
      </UFormField>
    </div>
  </UForm>
</template>
