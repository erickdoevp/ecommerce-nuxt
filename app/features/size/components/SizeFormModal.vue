<script setup lang="ts">
import { z } from 'zod'
import type { FormSubmitEvent } from '@nuxt/ui'
import { createAdminApi } from '~/api/admin-api'
import type { SizeContent } from '../types/size-search'

const props = defineProps<{
  mode: 'create' | 'edit' | 'view'
  size?: SizeContent
}>()

const emit = defineEmits<{ saved: [] }>()

const open = defineModel<boolean>('open', { default: false })

const schema = z.object({
  name: z.string().min(1, 'El nombre es requerido').max(30, 'Máximo 30 caracteres'),
  sortOrder: z.number({ error: 'Ingresa un número válido' }).int().min(1, 'El orden debe ser mayor a 0')
})

type Schema = z.output<typeof schema>

const form = reactive<Schema>({ name: '', sortOrder: 1 })
const isSaving = ref(false)
const toast = useToast()

watch(open, (val) => {
  if (val) {
    form.name = props.size?.name ?? ''
    form.sortOrder = props.size?.sortOrder ?? 1
  }
})

const title = computed(() => ({
  create: 'Nueva talla',
  edit: 'Editar talla',
  view: 'Detalle de la talla'
}[props.mode]))

async function onSubmit(event: FormSubmitEvent<Schema>) {
  try {
    isSaving.value = true
    const api = createAdminApi()
    if (props.mode === 'create') {
      await api('/sizes', { method: 'POST', body: event.data })
    } else {
      await api(`/sizes/${props.size!.id}`, { method: 'PUT', body: event.data })
    }
    toast.add({
      title: props.mode === 'create' ? 'Talla creada' : 'Talla actualizada',
      color: 'success',
      icon: 'i-lucide-check-circle'
    })
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
            placeholder="Ej. XL, 42, Talla única"
            class="w-full"
            :disabled="mode === 'view'"
            autofocus
          />
        </UFormField>

        <UFormField
          label="Orden de visualización"
          name="sortOrder"
          :required="mode !== 'view'"
          hint="Define el orden en que aparece la talla en los listados."
        >
          <UInputNumber
            v-model="form.sortOrder"
            :min="1"
            :step="1"
            class="w-full"
            :disabled="mode === 'view'"
          />
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
            {{ mode === 'create' ? 'Crear talla' : 'Guardar cambios' }}
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
