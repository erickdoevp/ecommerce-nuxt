<script setup lang="ts">
import { useProductDetail } from '../composables/useProductDetail'
import { useProductForm } from '../composables/useProductForm'
import { useUpdateProduct } from '../composables/useUpdateProduct'
import { productUpdateSchema } from '../schemas/product-update.schema'
import { useListTax } from '../composables/useListTax'
import { useTreeCategory } from '~/features/category/composables/useTreeCategory'

const props = defineProps<{
  productId: string | null
}>()

const open = defineModel<boolean>('open', { default: false })

const emit = defineEmits<{
  updated: []
}>()

const { getProductById, product, isLoading } = useProductDetail()
const { form, wordCount } = useProductForm()
const { updateProduct, isSaving, error: saveError } = useUpdateProduct()
const { getCategories, treeSelectCategory } = useTreeCategory()
const { getTaxConfigs, selectTax } = useListTax()

const toast = useToast()

const formRef = ref()
const isReady = ref(false)

async function load(id: string) {
  isReady.value = false
  await getProductById(id)
  isReady.value = true
}

watch([open, () => props.productId], ([isOpen, id]) => {
  if (isOpen && id) load(id)
  if (!isOpen) isReady.value = false
})

onMounted(() => {
  if (!treeSelectCategory.value.length) getCategories()
  if (!selectTax.value.length) getTaxConfigs()
})

const statusMeta: Record<string, { label: string, color: 'neutral' | 'success' | 'error' }> = {
  DRAFT: { label: 'Borrador', color: 'neutral' },
  PUBLISHED: { label: 'Activo en tienda', color: 'success' },
  ARCHIVED: { label: 'Inactivado', color: 'error' }
}

const statusOptions = [
  { label: 'Borrador', value: 'DRAFT' },
  { label: 'Activo en tienda', value: 'PUBLISHED' },
  { label: 'Inactivado', value: 'ARCHIVED' }
]

const primaryImage = computed(() => {
  const imgs = product.value?.images ?? []
  return imgs.find(i => i.isPrimary)?.url ?? imgs[0]?.url ?? ''
})

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

async function onSave() {
  if (!props.productId) return
  try {
    await formRef.value.validate()
  } catch {
    return
  }

  const result = await updateProduct(props.productId, {
    name: form.name,
    slug: form.slug,
    description: form.description,
    basePrice: Number(form.basePrice),
    categoryId: form.categoryId,
    taxConfigId: form.taxConfigId,
    status: form.status as 'DRAFT' | 'PUBLISHED' | 'ARCHIVED'
  })

  if (result) {
    toast.add({ title: 'Producto actualizado', color: 'success', icon: 'i-lucide-check-circle' })
    emit('updated')
    open.value = false
  }
}
</script>

<template>
  <USlideover
    v-model:open="open"
    title="Editar producto"
    :ui="{ content: 'max-w-xl' }"
  >
    <template #body>
      <div
        v-if="isLoading && !isReady"
        class="flex items-center justify-center py-20"
      >
        <UIcon
          name="i-lucide-loader-circle"
          class="w-6 h-6 text-gray-400 animate-spin"
        />
      </div>

      <div
        v-else-if="isReady && product"
        class="space-y-6"
      >
        <!-- Encabezado -->
        <div class="flex items-center gap-3 pb-4 border-b border-gray-100">
          <img
            v-if="primaryImage"
            :src="primaryImage"
            :alt="product.name"
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
          <div class="min-w-0 flex-1">
            <p class="text-sm font-semibold text-gray-900 truncate">
              {{ product.name }}
            </p>
            <span class="text-xs text-gray-400 font-mono">ID: {{ product.id }}</span>
          </div>
          <UBadge
            :color="statusMeta[product.status]?.color ?? 'neutral'"
            variant="subtle"
            size="sm"
          >
            {{ statusMeta[product.status]?.label ?? product.status }}
          </UBadge>
        </div>

        <UForm
          ref="formRef"
          :schema="productUpdateSchema"
          :state="form"
          class="space-y-6"
        >
          <!-- Organización -->
          <div class="space-y-4">
            <h3 class="text-sm font-semibold text-gray-800">
              Organización
            </h3>
            <UFormField
              label="Estado"
              name="status"
            >
              <USelect
                v-model="form.status"
                :items="statusOptions"
                value-key="value"
                class="w-full"
              />
            </UFormField>
          </div>
          <!-- Información básica -->
          <div class="space-y-4">
            <h3 class="text-sm font-semibold text-gray-800">
              Información básica
            </h3>

            <UFormField
              label="Nombre del producto"
              name="name"
            >
              <UInput
                v-model="form.name"
                placeholder="Ej. Camiseta básica algodón"
                class="w-full"
              />
            </UFormField>

            <UFormField
              label="Slug del producto"
              name="slug"
              help="Se usa en la URL. Mantén guiones y solo minúsculas."
            >
              <UInput
                v-model="form.slug"
                placeholder="ej. camiseta-basica-algodon"
                class="w-full font-mono"
              />
            </UFormField>

            <UFormField
              label="Categoría"
              name="categoryId"
            >
              <USelectMenu
                v-model="form.categoryId"
                :items="treeSelectCategory"
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
                    <span :class="item.depth === 0 ? 'font-semibold text-gray-800' : 'text-gray-600'">
                      {{ item.label }}
                    </span>
                  </div>
                </template>
              </USelectMenu>
            </UFormField>
          </div>

          <!-- Precios -->
          <div class="space-y-4">
            <h3 class="text-sm font-semibold text-gray-800">
              Precios
            </h3>
            <UFormField
              label="Precio base"
              name="basePrice"
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
              label="Tipo de IVA"
              name="taxConfigId"
            >
              <USelectMenu
                v-model="form.taxConfigId"
                :items="selectTax"
                value-key="value"
                placeholder="Selecciona un tipo de IVA"
                class="w-full"
              />
            </UFormField>
          </div>

          <!-- Descripción -->
          <div class="space-y-4">
            <h3 class="text-sm font-semibold text-gray-800">
              Descripción
            </h3>
            <UFormField name="description">
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
                  class="w-full border border-[#cad5e2] rounded-md h-64"
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
        </UForm>
      </div>
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
          Guardar cambios
        </UButton>
      </div>
    </template>
  </USlideover>
</template>
