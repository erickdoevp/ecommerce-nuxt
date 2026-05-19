<script setup lang="ts">
const statusOptions = [
  { label: 'Borrador', value: 'DRAFT' },
  { label: 'Activo', value: 'ACTIVE' },
  { label: 'Inactivo', value: 'INACTIVE' }
]

const form = reactive({
  status: 'DRAFT'
})
</script>

<template>
  <div class="p-6 border border-[#ececed] rounded-xl bg-white h-fit w-full">
    <h3 class="font-semibold text-base mb-4">
      Estado del producto
    </h3>
    <UFormField name="status">
      <USelect
        v-model="form.status"
        :items="statusOptions"
        value-key="value"
        class="w-full"
      />
    </UFormField>
  </div>
</template>
