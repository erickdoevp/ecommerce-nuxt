<script setup lang="ts">
import PaginatedProductTable from '~/features/product/components/PaginatedProductTable.vue'
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
      >
        Nuevo producto
      </UButton>
    </div>
    <div class="bg-white p-4">
      <PaginatedProductTable />
    </div>
  </div>
</template>

<style scoped>
.page-container {

}
</style>
