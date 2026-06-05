<script setup lang="ts">
defineProps<{
  productId: string | null
}>()

const open = defineModel<boolean>('open', { default: false })
</script>

<template>
  <USlideover
    v-model:open="open"
    title="Editar variantes"
    :ui="{ content: 'max-w-2xl' }"
  >
    <template #body>
      <!-- TODO: desarrollar la edición de variantes del producto -->
      <div class="flex flex-col items-center justify-center py-20 text-center">
        <UIcon
          name="i-lucide-construction"
          class="w-8 h-8 text-gray-300 mb-3"
        />
        <p class="text-sm text-gray-500">
          Edición de variantes en construcción.
        </p>
      </div>
    </template>
  </USlideover>
</template>
