<script setup lang="ts">
import { z } from 'zod'
import type { FormSubmitEvent } from '@nuxt/ui'
import { createAdminApi } from '~/api/admin-api'
import type { ColorContent } from '../types/color-search'

const props = defineProps<{
  mode: 'create' | 'edit' | 'view'
  color?: ColorContent
}>()

const emit = defineEmits<{ saved: [] }>()

const open = defineModel<boolean>('open', { default: false })

const schema = z.object({
  name: z.string().min(1, 'El nombre es requerido').max(50, 'Máximo 50 caracteres'),
  hex: z.string().regex(/^#[0-9a-fA-F]{6}$/, 'Ingresa un color hexadecimal válido')
})

type Schema = z.output<typeof schema>

const form = reactive<Schema>({ name: '', hex: '#3b82f6' })
const isSaving = ref(false)

watch(open, (val) => {
  if (val) {
    form.name = props.color?.name ?? ''
    form.hex = props.color?.hex ?? '#3b82f6'
  }
})

const title = computed(() => ({
  create: 'Nuevo color',
  edit: 'Editar color',
  view: 'Detalle del color'
}[props.mode]))

async function onSubmit(event: FormSubmitEvent<Schema>) {
  try {
    isSaving.value = true
    const api = createAdminApi()
    if (props.mode === 'create') {
      await api('/colors', { method: 'POST', body: event.data })
    } else {
      await api(`/colors/${props.color!.id}`, { method: 'PUT', body: event.data })
    }
    emit('saved')
    open.value = false
  } catch (error) {
    console.error(error)
  } finally {
    isSaving.value = false
  }
}
</script>

<template>
  <UModal
    v-model:open="open"
    :title="title"
    :ui="{ footer: 'justify-end' }"
  >
    <template #body>
      <UForm
        :schema="mode !== 'view' ? schema : undefined"
        :state="form"
        class="space-y-4"
        @submit="onSubmit"
      >
        <UFormField
          label="Nombre"
          name="name"
          :required="mode !== 'view'"
        >
          <UInput
            v-model="form.name"
            placeholder="Ej. Azul marino"
            class="w-full"
            :disabled="mode === 'view'"
            autofocus
          />
        </UFormField>

        <UFormField
          label="Color"
          name="hex"
          :required="mode !== 'view'"
        >
          <div class="flex items-center gap-3">
            <label
              class="shrink-0"
              :class="mode === 'view' ? 'pointer-events-none' : 'cursor-pointer'"
            >
              <div
                class="w-10 h-10 rounded-lg border-2 border-gray-200 overflow-hidden"
                :style="{ backgroundColor: form.hex }"
              >
                <input
                  v-model="form.hex"
                  type="color"
                  class="opacity-0 w-full h-full cursor-pointer"
                  :disabled="mode === 'view'"
                >
              </div>
            </label>
            <UInput
              v-model="form.hex"
              placeholder="#3b82f6"
              class="flex-1 font-mono"
              maxlength="7"
              :disabled="mode === 'view'"
            />
            <div
              class="w-8 h-8 rounded-md border border-gray-200 shrink-0"
              :style="{ backgroundColor: form.hex }"
            />
          </div>
        </UFormField>

        <div
          v-if="mode !== 'view'"
          class="flex justify-end gap-2 pt-1"
        >
          <UButton
            color="neutral"
            variant="outline"
            type="button"
            @click="open = false"
          >
            Cancelar
          </UButton>
          <UButton
            type="submit"
            :loading="isSaving"
          >
            {{ mode === 'create' ? 'Crear color' : 'Guardar cambios' }}
          </UButton>
        </div>

        <div
          v-else
          class="flex justify-end pt-1"
        >
          <UButton
            color="neutral"
            variant="outline"
            @click="open = false"
          >
            Cerrar
          </UButton>
        </div>
      </UForm>
    </template>
  </UModal>
</template>
