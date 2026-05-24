<script setup lang="ts">
import PaginatedCategoryTable from '~/features/category/components/PaginatedCategoryTable.vue'
</script>

<template>
  <div class="page-container">
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-xl font-semibold text-gray-900">
          Categorías
        </h1>
        <p class="text-sm text-gray-500 mt-0.5">
          Administra las categorías del catálogo.
        </p>
      </div>
      <UButton
        icon="i-lucide-plus"
        to="/admin/category/create"
      >
        Nueva categoría
      </UButton>
    </div>

    <div class="bg-white p-4">
      <PaginatedCategoryTable />
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
