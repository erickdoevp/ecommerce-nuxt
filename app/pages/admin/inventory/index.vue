<script setup lang="ts">
import PaginatedVariantTable from '~/features/inventory/components/PaginatedVariantTable.vue'
</script>

<template>
  <div class="page-container">
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-xl font-semibold text-gray-900">
          Inventario
        </h1>
        <p class="text-sm text-gray-500 mt-0.5">
          Consulta el stock de cada variante de producto.
        </p>
      </div>
    </div>

    <div class="bg-white p-4 border border-[#ececed] rounded-xl">
      <PaginatedVariantTable />
    </div>
  </div>
</template>

<style scoped>
.page-container {
  display: flex;
  flex-direction: column;
  gap: 16px;
}
</style>
