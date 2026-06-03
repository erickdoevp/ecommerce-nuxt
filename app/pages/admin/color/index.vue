<script setup lang="ts">
import PaginatedColorTable from '~/features/color/components/PaginatedColorTable.vue'

const table = useTemplateRef('table')
</script>

<template>
  <div class="page-container">
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-xl font-semibold text-gray-900">
          Colores
        </h1>
        <p class="text-sm text-gray-500 mt-0.5">
          Administra los colores disponibles para las variantes de productos.
        </p>
      </div>
      <UButton
        icon="i-lucide-plus"
        @click="table?.openAdd()"
      >
        Nuevo color
      </UButton>
    </div>

    <div class="bg-white p-4 border border-[#ececed] rounded-xl">
      <PaginatedColorTable ref="table" />
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
