<script setup lang="ts">
import { useTreeCategory } from '~/features/category/composables/useTreeCategory'
import CreateProductForm from '~/features/product/components/CreateProductForm.vue'
import ProductMediaCard from '~/features/product/components/ProductMediaCard.vue'
import ProductState from '~/features/product/components/ProductState.vue'
import ProductVariantsCard from '~/features/product/components/ProductVariantsCard.vue'
import { useCreateProduct } from '~/features/product/composables/useCreateProduct'
import { useListColor } from '~/features/product/composables/useListColor'
import { useListSize } from '~/features/product/composables/useListSize'
import { useProductForm } from '~/features/product/composables/useProductForm'

const { getSizes, selectSizes } = useListSize()
const { getColors, selectColors } = useListColor()
const { getCategories, treeSelectCategory } = useTreeCategory()
const { form, images, variantGrid, variantData } = useProductForm()
const { createProduct } = useCreateProduct()

function onSave(): void {
  const variants = variantGrid.value.map((row) => {
    const v = variantData.value[row.id] ?? {}
    return {
      colorId: row.colorId,
      sizeId: row.sizeId,
      ...(v.sku ? { sku: v.sku } : {}),
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
    description: form.description,
    status: form.status,
    variants
  }
  console.log(data)

  const formData = new FormData()
  formData.append('data', new Blob([JSON.stringify(data)], { type: 'application/json' }))
  for (const img of images.value) {
    formData.append('images', img.editedBlob ?? img.file, img.file.name)
  }
  for (let i = 0; i < variantGrid.value.length; i++) {
    const v = variantData.value[variantGrid.value[i]!.id] ?? {}
    if (v.imageBlob) {
      formData.append(`variantImages[${i}]`, v.imageBlob, `variant-${i}.jpg`)
    }
  }

  createProduct(formData)
}

onMounted(() => {
  getColors()
  getSizes()
  getCategories()
})
</script>

<template>
  <div class="page-container">
    <UContainer>
      <div class="flex flex-col gap-1 mb-6">
        <h1 class="text-xl font-semibold text-gray-900">
          Nuevo producto
        </h1>
        <p class="text-sm text-gray-500 mt-0.5">
          Completa los datos para agregar un nuevo producto a la tienda.
        </p>
      </div>
      <div class="flex flex-row gap-3">
        <div class="flex flex-col gap-3 w-[70%]">
          <CreateProductForm
            :select-categories="treeSelectCategory"
            :select-sizes="selectSizes"
            :select-colors="selectColors"
          />

          <ProductMediaCard />

          <ProductVariantsCard
            :base-price="form.basePrice"
            :select-colors="selectColors"
            :select-sizes="selectSizes"
          />
        </div>
        <div class="flex flex-col gap-3 flex-1">
          <ProductState />
        </div>
      </div>
      <div class="w-full">
        <UButton
          class="w-full bg-green-500 text-white py-2 rounded hover:bg-green-600 transition-colors"
          @click="onSave"
        >
          Save Product
        </UButton>
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
