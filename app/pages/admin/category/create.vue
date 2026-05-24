<script setup lang="ts">
import CreateCategoryForm from '~/features/category/components/CreateCategoryForm.vue'
import CategoryState from '~/features/category/components/CategoryState.vue'
import { useListCategory } from '~/features/category/composables/useListCategory'

const { getCategories, selectCategories, isLoading: loadingCategories } = useListCategory()

onMounted(() => getCategories())
</script>

<template>
  <div class="page-container">
    <UContainer>
      <div class="flex flex-col gap-1 mb-6">
        <h1 class="text-xl font-semibold text-gray-900">
          Nueva categoría
        </h1>
        <p class="text-sm text-gray-500 mt-0.5">
          Completa los datos para agregar una nueva categoría al catálogo.
        </p>
      </div>
      <div class="flex flex-row gap-3">
        <div class="flex flex-col gap-3 w-[70%]">
          <CreateCategoryForm
            :select-categories="selectCategories"
            :loading-categories="loadingCategories"
          />
        </div>
        <div class="flex flex-col gap-3 flex-1">
          <CategoryState />
        </div>
      </div>
    </UContainer>
  </div>
</template>

<style scoped>
.page-container {
  display: flex;
  flex-direction: column;
  gap: 16px;
}
</style>
