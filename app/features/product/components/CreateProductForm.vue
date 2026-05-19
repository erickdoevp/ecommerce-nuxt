<script setup lang="ts">
import type { Category, CategoryOption } from '../types/category'
import { productSchema } from '../schemas/product.schema'
import { useProductForm } from '../composables/useProductForm'
import type { SelectOption } from '~/components/types/select'

const props = defineProps<{
  selectSizes: SelectOption[]
  selectColors: SelectOption[]
  selectCategories: Category[]
}>()

const { form, wordCount } = useProductForm()

function flattenCategories(cats: Category[] | undefined, depth = 0): CategoryOption[] {
  return cats?.flatMap(cat => [
    { label: cat.name, value: cat.id, depth, isParent: cat?.children?.length > 0 },
    ...flattenCategories(cat?.children, depth + 1)
  ]) || []
}

const flatCategories = computed(() => flattenCategories(props.selectCategories))

const toolbarItems = [
  [
    {
      label: 'Párrafo',
      trailingIcon: 'i-lucide-chevron-down',
      items: [[
        { kind: 'paragraph', label: 'Párrafo' },
        { kind: 'heading', level: 1, label: 'Encabezado 1' },
        { kind: 'heading', level: 2, label: 'Encabezado 2' },
        { kind: 'heading', level: 3, label: 'Encabezado 3' },
        { kind: 'heading', level: 4, label: 'Encabezado 4' }
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
</script>

<template>
  <div class="space-y-4">
    <UForm
      :schema="productSchema"
      :state="form"
      class="grid grid-cols-2 gap-4 items-start"
    >
      <!-- Información general -->
      <div class="col-span-2 p-6 border border-[#ececed] rounded-xl bg-white">
        <div class="mb-5">
          <h3 class="font-semibold text-base">
            Información general del producto
          </h3>
          <p class="text-sm text-gray-500 mt-0.5">
            Completa los detalles básicos del producto como nombre, descripción y precio.
          </p>
        </div>
        <div class="space-y-5">
          <div class="grid grid-cols-2 gap-4">
            <UFormField
              label="Nombre del producto"
              name="name"
              class="w-full"
            >
              <UInput
                v-model="form.name"
                placeholder="Ej. Camiseta básica algodón"
                class="w-full"
              />
            </UFormField>
            <UFormField
              label="Slug (identificador)"
              name="slug"
              class="w-full"
            >
              <UInput
                v-model="form.slug"
                placeholder="ej. camiseta-basica-algodon"
                class="w-full"
              />
            </UFormField>
          </div>

          <div class="grid grid-cols-2 gap-4">
            <UFormField
              label="Precio base"
              name="basePrice"
              class="w-full"
            >
              <UInput
                v-model="form.basePrice"
                type="number"
                step="0.01"
                min="0"
                placeholder="0.00"
                class="w-full"
              >
                <template #leading>
                  <span class="text-sm text-gray-500">$</span>
                </template>
              </UInput>
            </UFormField>
            <UFormField
              label="Categoría"
              name="categoryId"
              class="w-full"
            >
              <USelectMenu
                v-model="form.categoryId"
                :items="flatCategories"
                value-key="value"
                placeholder="Selecciona una categoría"
                class="w-full"
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

          <UFormField
            label="Descripción"
            name="description"
            class="w-full"
          >
            <div class="relative w-full">
              <UEditor
                v-model="form.description"
                content-type="json"
                placeholder="Escribe la descripción del producto..."
                :starter-kit="{
                  blockquote: false,
                  heading: { levels: [1, 2, 3, 4] },
                  dropcursor: { color: 'var(--ui-primary)', width: 2 },
                  link: { openOnClick: false }
                }"
                class="w-full border border-[#cad5e2] rounded-md h-75"
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
        </div>
      </div>
    </UForm>
  </div>
</template>
