<script setup lang="ts">
import PaginatedSizeTable from '~/features/size/components/PaginatedSizeTable.vue'

const table = useTemplateRef('table')
</script>

<template>
  <div class="page-container">
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-xl font-semibold text-gray-900">
          Tallas
        </h1>
        <p class="text-sm text-gray-500 mt-0.5">
          Administra las tallas disponibles para las variantes de productos.
        </p>
      </div>
      <UButton
        icon="i-lucide-plus"
        @click="table?.openAdd()"
      >
        Nueva talla
      </UButton>
    </div>

    <div class="bg-white p-4 border border-[#ececed] rounded-xl">
      <PaginatedSizeTable ref="table" />
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
