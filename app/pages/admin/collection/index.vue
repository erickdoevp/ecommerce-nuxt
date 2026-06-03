<script setup lang="ts">
import PaginatedCollectionTable from '~/features/collection/components/PaginatedCollectionTable.vue'

</script>

<template>
  <div class="page-container">
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-xl font-semibold text-gray-900">
          Colecciones
        </h1>
        <p class="text-sm text-gray-500 mt-0.5">
          Agrupa productos en colecciones temáticas o de temporada.
        </p>
      </div>
      <UButton
        icon="i-lucide-plus"
        to="/admin/collection/create"
      >
        Nueva colección
      </UButton>
    </div>

    <div class="bg-white p-4 border border-[#ececed] rounded-xl">
      <PaginatedCollectionTable />
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
