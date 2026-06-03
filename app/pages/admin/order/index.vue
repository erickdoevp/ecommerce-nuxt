<script setup lang="ts">
import PaginatedOrderTable from '~/features/order/components/PaginatedOrderTable.vue'
</script>

<template>
  <div class="page-container">
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-xl font-semibold text-gray-900">
          Pedidos
        </h1>
        <p class="text-sm text-gray-500 mt-0.5">
          Consulta y filtra los pedidos realizados por los clientes.
        </p>
      </div>
    </div>

    <div class="bg-white p-4 border border-[#ececed] rounded-xl">
      <PaginatedOrderTable />
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
