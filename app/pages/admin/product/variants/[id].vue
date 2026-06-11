<script setup lang="ts">
import PaginatedProductVariantsTable from '~/features/product/components/PaginatedProductVariantsTable.vue'
import { useProductDetail } from '~/features/product/composables/useProductDetail'

const route = useRoute()
const id = String(route.params.id)

const { getProductById, product } = useProductDetail()

function goBack() {
  navigateTo('/admin/product')
}

onMounted(() => {
  getProductById(id)
})
</script>

<template>
  <div class="page-container">
    <div class="flex items-center gap-3">
      <UButton
        color="neutral"
        variant="ghost"
        size="sm"
        icon="i-lucide-arrow-left"
        @click="goBack"
      />
      <div>
        <h1 class="text-xl font-semibold text-gray-900">
          Variantes del producto
        </h1>
        <p class="text-sm text-gray-500 mt-0.5">
          {{ product?.name ?? 'Cargando…' }}
        </p>
      </div>
    </div>

    <PaginatedProductVariantsTable
      :product-id="id"
      :base-price="product?.basePrice ?? 0"
      @close="goBack"
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
