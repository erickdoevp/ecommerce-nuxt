<script setup lang="ts">
import { z } from 'zod'
import type { FormSubmitEvent } from '@nuxt/ui'

export interface ColorAdded {
  label: string
  value: string
  hex: string
}

const open = defineModel<boolean>('open', { default: false })
const emit = defineEmits<{ add: [color: ColorAdded] }>()

const schema = z.object({
  name: z.string().min(1, 'El nombre es requerido').max(50, 'Máximo 50 caracteres'),
  hex: z.string().regex(/^#[0-9a-fA-F]{6}$/, 'Ingresa un color hexadecimal válido')
})

type Schema = z.output<typeof schema>

const form = reactive<Schema>({ name: '', hex: '#3b82f6' })

function onSubmit(event: FormSubmitEvent<Schema>) {
  emit('add', {
    label: event.data.name,
    value: crypto.randomUUID(),
    hex: event.data.hex
  })
  form.name = ''
  form.hex = '#3b82f6'
  open.value = false
}

function onCancel() {
  form.name = ''
  form.hex = '#3b82f6'
  open.value = false
}
</script>

<template>
  <UModal
    v-model:open="open"
    title="Agregar color"
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
            placeholder="Ej. Azul marino"
            class="w-full"
            autofocus
          />
        </UFormField>

        <UFormField
          label="Color"
          name="hex"
          required
        >
          <div class="flex items-center gap-3">
            <label class="cursor-pointer shrink-0">
              <div
                class="w-10 h-10 rounded-lg border-2 border-gray-200 overflow-hidden"
                :style="{ backgroundColor: form.hex }"
              >
                <input
                  v-model="form.hex"
                  type="color"
                  class="opacity-0 w-full h-full cursor-pointer"
                >
              </div>
            </label>
            <UInput
              v-model="form.hex"
              placeholder="#3b82f6"
              class="flex-1 font-mono"
              maxlength="7"
            />
            <div
              class="w-8 h-8 rounded-md border border-gray-200 shrink-0"
              :style="{ backgroundColor: form.hex }"
            />
          </div>
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
            Agregar color
          </UButton>
        </div>
      </UForm>
    </template>
  </UModal>
</template>
