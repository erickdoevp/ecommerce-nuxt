<script setup lang="ts">
import { useCategoryForm } from '../composables/useCategoryForm'

const { form } = useCategoryForm()

const activeOptions = [
  { label: 'Activo', value: true },
  { label: 'Inactivo', value: false },
]
</script>

<template>
  <div class="p-6 border border-[#ececed] rounded-xl bg-white h-fit w-full">
    <h3 class="font-semibold text-base mb-4">
      Estado de la categoría
    </h3>
    <UFormField name="active">
      <USelect
        v-model="form.active"
        :items="activeOptions"
        value-key="value"
        class="w-full"
      />
    </UFormField>
  </div>
</template>
