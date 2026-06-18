<script setup lang="ts">
import type { SelectOption } from '~/components/types/select'

defineProps<{
  selectCollections: SelectOption[]
}>()

const collectionId = ref('')

defineExpose({ collectionId })
</script>

<template>
  <div class="p-6 border border-[#ececed] rounded-xl bg-white h-fit w-full">
    <h3 class="font-semibold text-base mb-4">
      Organización
    </h3>
    <UFormField
      label="Colección"
      name="collectionId"
    >
      <USelectMenu
        v-model="collectionId"
        :items="selectCollections"
        value-key="value"
        placeholder="Selecciona una colección"
        class="w-full"
      />
    </UFormField>
  </div>
</template>
