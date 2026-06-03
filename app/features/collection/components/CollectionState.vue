<script setup lang="ts">
import { useCollectionForm } from '../composables/useCollectionForm'

const { form } = useCollectionForm()
</script>

<template>
  <div class="p-6 border border-[#ececed] rounded-xl bg-white h-fit">
    <h3 class="font-semibold text-base mb-4">
      Estado
    </h3>
    <div class="flex items-center justify-between">
      <span class="text-sm text-gray-600">
        {{ form.active ? 'Activa' : 'Inactiva' }}
      </span>
      <USwitch v-model="form.active" />
    </div>
    <p class="text-xs text-gray-400 mt-2">
      {{ form.active
        ? 'La colección es visible en la tienda.'
        : 'La colección está oculta para los clientes.' }}
    </p>
  </div>
</template>
