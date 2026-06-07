<script setup lang="ts">
import PaginatedProductTable from '~/features/product/components/PaginatedProductTable.vue'
import PaginatedProductVariantsTable from '~/features/product/components/PaginatedProductVariantsTable.vue'
import { useProductForm } from '~/features/product/composables/useProductForm'

const { cleanProductData } = useProductForm()

const variantsProductId = ref<string | null>(null)
const variantsBasePrice = ref(0)
const variantsTableRef = ref<{ reload: () => void } | null>(null)

function onViewVariants(id: string, basePrice: number) {
  variantsProductId.value = id
  variantsBasePrice.value = basePrice
}

function onVariantCreated(productId: string) {
  if (productId === variantsProductId.value) variantsTableRef.value?.reload()
}
</script>

<template>
  <div class="page-container">
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-xl font-semibold text-gray-900">
          Productos
        </h1>
        <p class="text-sm text-gray-500 mt-0.5">
          Administra el catálogo de productos de la tienda.
        </p>
      </div>
      <UButton
        icon="i-lucide-plus"
        to="/admin/product/create"
        @click="cleanProductData()"
      >
        Nuevo producto
      </UButton>
    </div>
    <div class="bg-white p-4 rounded-md">
      <PaginatedProductTable
        @view-variants="onViewVariants"
        @variant-created="onVariantCreated"
      />
    </div>

    <PaginatedProductVariantsTable
      ref="variantsTableRef"
      :product-id="variantsProductId"
      :base-price="variantsBasePrice"
      @close="variantsProductId = null"
    />
  </div>
</template>

<style scoped>
.page-container {
  display: flex;
  flex-direction: column;
  gap: 16px;
}
</style>
