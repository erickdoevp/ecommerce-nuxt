<script setup lang="ts">
import PaginatedMovementTable from '~/features/inventory/components/PaginatedMovementTable.vue'
</script>

<template>
  <div class="page-container">
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-xl font-semibold text-gray-900">
          Movimientos de inventario
        </h1>
        <p class="text-sm text-gray-500 mt-0.5">
          Historial de entradas, salidas y ajustes de stock de todas las variantes.
        </p>
      </div>
    </div>

    <div class="bg-white p-4 border border-[#ececed] rounded-xl">
      <PaginatedMovementTable />
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
