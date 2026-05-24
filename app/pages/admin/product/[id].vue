<script setup lang="ts">
import { useTreeCategory } from '~/features/category/composables/useTreeCategory'
import CreateProductForm from '~/features/product/components/CreateProductForm.vue'
import ProductMediaCard from '~/features/product/components/ProductMediaCard.vue'
import ProductState from '~/features/product/components/ProductState.vue'
import ProductVariantsCard from '~/features/product/components/ProductVariantsCard.vue'
import { useListColor } from '~/features/product/composables/useListColor'
import { useListSize } from '~/features/product/composables/useListSize'
import { useProductDetail } from '~/features/product/composables/useProductDetail'

const route = useRoute()
const id = String(route.params.id)

const { getProductById } = useProductDetail()
const { getSizes, selectSizes } = useListSize()
const { getColors, selectColors } = useListColor()
const { getCategories, treeSelectCategory } = useTreeCategory()

onMounted(() => {
  getProductById(id)
  getSizes()
  getColors()
  getCategories()
})
</script>

<template>
  <div class="page-container">
    <UContainer>
      <div class="flex flex-col gap-1 mb-6">
        <h1 class="text-xl font-semibold text-gray-900">
          Editar producto
        </h1>
        <p class="text-sm text-gray-500 mt-0.5">
          Completa los datos para editar un nuevo producto a la tienda.
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
            :select-colors="selectColors"
            :select-sizes="selectSizes"
          />
        </div>
        <div class="flex flex-col gap-3 flex-1">
          <ProductState />
        </div>
      </div>
    </UContainer>
  </div>
</template>

<style scoped>

</style>
