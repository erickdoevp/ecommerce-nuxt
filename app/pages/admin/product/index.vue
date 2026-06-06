<script setup lang="ts">
import PaginatedProductTable from '~/features/product/components/PaginatedProductTable.vue'
import PaginatedProductVariantsTable from '~/features/product/components/PaginatedProductVariantsTable.vue'
import { useProductForm } from '~/features/product/composables/useProductForm'

const { cleanProductData } = useProductForm()

const variantsProductId = ref<string | null>(null)
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
      <PaginatedProductTable @view-variants="variantsProductId = $event" />
    </div>

    <PaginatedProductVariantsTable
      :product-id="variantsProductId"
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
