<script setup lang="ts">
import { z } from 'zod'
import type { FormSubmitEvent } from '@nuxt/ui'

export interface SizeAdded {
  label: string
  value: string
}

const open = defineModel<boolean>('open', { default: false })
const emit = defineEmits<{ add: [size: SizeAdded] }>()

const schema = z.object({
  name: z.string().min(1, 'El nombre es requerido').max(30, 'Máximo 30 caracteres')
})

type Schema = z.output<typeof schema>

const form = reactive<Schema>({ name: '' })

function onSubmit(event: FormSubmitEvent<Schema>) {
  emit('add', {
    label: event.data.name,
    value: crypto.randomUUID()
  })
  form.name = ''
  open.value = false
}

function onCancel() {
  form.name = ''
  open.value = false
}
</script>

<template>
  <UModal
    v-model:open="open"
    title="Agregar talla"
    :ui="{ footer: 'justify-end' }"
  >
    <template #body>
      <UForm
        :schema="schema"
        :state="form"
        class="space-y-4"
        @submit="onSubmit"
      >
        <UFormField
          label="Nombre"
          name="name"
          required
        >
          <UInput
            v-model="form.name"
            placeholder="Ej. XL, 42, Talla única"
            class="w-full"
            autofocus
          />
        </UFormField>

        <div class="flex justify-end gap-2 pt-1">
          <UButton
            color="neutral"
            variant="outline"
            type="button"
            @click="onCancel"
          >
            Cancelar
          </UButton>
          <UButton type="submit">
            Agregar talla
          </UButton>
        </div>
      </UForm>
    </template>
  </UModal>
</template>
