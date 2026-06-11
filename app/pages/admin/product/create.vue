<script setup lang="ts">
import { useTreeCategory } from '~/features/category/composables/useTreeCategory'
import CreateProductForm from '~/features/product/components/CreateProductForm.vue'
import ProductMediaCard from '~/features/product/components/ProductMediaCard.vue'
import ProductState from '~/features/product/components/ProductState.vue'
import ProductVariantsCard from '~/features/product/components/ProductVariantsCard.vue'
import { useCreateProduct } from '~/features/product/composables/useCreateProduct'
import { useListColor } from '~/features/product/composables/useListColor'
import { useListSize } from '~/features/product/composables/useListSize'
import { useListTax } from '~/features/product/composables/useListTax'
import { useProductForm } from '~/features/product/composables/useProductForm'

const { getSizes, selectSizes } = useListSize()
const { getColors, selectColors } = useListColor()
const { getTaxConfigs, selectTax } = useListTax()
const { getCategories, treeSelectCategory } = useTreeCategory()
const { form, images, variantGrid, variantData } = useProductForm()
const { createProduct, isLoading } = useCreateProduct()

const productFormRef = useTemplateRef('productFormRef')

async function onSave(): Promise<void> {
  try {
    await productFormRef.value?.validate()
  } catch {
    return
  }

  const variants = variantGrid.value.map((row) => {
    const v = variantData.value[row.id] ?? {}
    return {
      colorId: row.colorId,
      sizeId: row.sizeId,
      priceAdjustment: v.adjustAmount ?? 0,
      costPrice: v.costPrice ?? 0,
      initialStock: v.initialStock ?? 0
    }
  })

  const data = {
    name: form.name,
    slug: form.slug,
    basePrice: form.basePrice,
    categoryId: form.categoryId,
    taxConfigId: form.taxConfigId,
    description: form.description,
    status: form.status,
    variants
  }
  console.log(data)

  const formData = new FormData()
  formData.append('data', new Blob([JSON.stringify(data)], { type: 'application/json' }))
  for (const img of images.value) {
    const blob = img.editedBlob ?? img.file
    if (!blob) continue
    formData.append('images', blob, img.file?.name ?? 'image.jpg')
  }
  for (let i = 0; i < variantGrid.value.length; i++) {
    const v = variantData.value[variantGrid.value[i]!.id] ?? {}
    if (v.imageBlob) {
      formData.append(`variantImages[${i}]`, v.imageBlob, `variant-${i}.jpg`)
    }
  }

  const created = await createProduct(formData)
  if (created) navigateTo('/admin/product')
}

onMounted(() => {
  getColors()
  getSizes()
  getTaxConfigs()
  getCategories()
})
</script>

<template>
  <div class="page-container">
    <UContainer>
      <div class="flex items-center gap-3 mb-6">
        <UButton
          color="neutral"
          variant="ghost"
          size="sm"
          icon="i-lucide-arrow-left"
          to="/admin/product"
        />
        <div class="flex flex-col gap-1">
          <h1 class="text-xl font-semibold text-gray-900">
            Nuevo producto
          </h1>
          <p class="text-sm text-gray-500 mt-0.5">
            Completa los datos para agregar un nuevo producto a la tienda.
          </p>
        </div>
      </div>
      <div class="flex flex-row gap-3">
        <div class="flex flex-col gap-3 w-[70%]">
          <CreateProductForm
            ref="productFormRef"
            :select-categories="treeSelectCategory"
            :select-sizes="selectSizes"
            :select-colors="selectColors"
            :select-tax="selectTax"
          />

          <ProductMediaCard />

          <ProductVariantsCard
            :select-colors="selectColors"
            :select-sizes="selectSizes"
          />
          <div class="flex items-center justify-end gap-3">
            <UButton
              color="neutral"
              variant="outline"
              to="/admin/product"
            >
              Cancelar
            </UButton>
            <UButton
              :loading="isLoading"
              icon="i-lucide-save"
              @click="onSave"
            >
              Crear producto
            </UButton>
          </div>
        </div>
        <div class="flex flex-col gap-3 flex-1">
          <ProductState />
        </div>
      </div>
    </UContainer>
  </div>
</template>

<style scoped>
.page-container{
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  position: relative;
}
.page-topbar {
  display: flex;
  flex-direction: row;
  justify-content: center;
  position: sticky;
  width: 100%;
  height: 50px;
  background-color: black;
  z-index: 99;
  top: 0;
  right: 0;
  margin: 1rem;
}
</style>
