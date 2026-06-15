<script setup lang="ts">
import { useClientAddresses } from '~/features/address/composables/useClientAddresses'
import type { AddressResponse, AddressRequest } from '~/features/address/types/address'

const props = defineProps<{
  address?: AddressResponse
}>()

const open = defineModel<boolean>('open', { default: false })

const emit = defineEmits<{
  saved: []
}>()

const { createAddress, updateAddress, lookupPostalCode, isSaving } = useClientAddresses()

const form = reactive({
  alias: '',
  recipientName: '',
  phone: '',
  street: '',
  exteriorNumber: '',
  interiorNumber: '',
  colonia: '',
  cp: '',
  municipio: '',
  estado: '',
  isDefault: false
})

// Evita que el autocompletado del CP se dispare al precargar una edición.
let suppressCpLookup = false

function resetForm() {
  suppressCpLookup = true
  const a = props.address
  form.alias = a?.alias ?? ''
  form.recipientName = a?.recipientName ?? ''
  form.phone = a?.phone ?? ''
  form.street = a?.street ?? ''
  form.exteriorNumber = a?.exteriorNumber ?? ''
  form.interiorNumber = a?.interiorNumber ?? ''
  form.colonia = a?.colonia ?? ''
  form.cp = a?.cp ?? ''
  form.municipio = a?.municipio ?? ''
  form.estado = a?.estado ?? ''
  form.isDefault = a?.default ?? false
  cpNotFound.value = false
  nextTick(() => {
    suppressCpLookup = false
  })
}

watch(open, (isOpen) => {
  if (isOpen) resetForm()
})

// ─── Autocompletado por CP ──────────────────────────────────────────────────
const lookingUpCp = ref(false)
const cpNotFound = ref(false)

watch(() => form.cp, async (cp) => {
  if (suppressCpLookup) return
  cpNotFound.value = false
  if (!/^\d{5}$/.test(cp)) return
  lookingUpCp.value = true
  const res = await lookupPostalCode(cp)
  lookingUpCp.value = false
  if (res) {
    form.municipio = res.municipio
    form.estado = res.estado
  } else {
    // Tabla de CPs vacía por ahora → captura manual de municipio/estado.
    cpNotFound.value = true
  }
})

// ─── Validación ─────────────────────────────────────────────────────────────
const cpValid = computed(() => /^\d{5}$/.test(form.cp))
const aliasValid = computed(() => {
  const v = form.alias.trim()
  return v.length > 0 && v.length <= 50
})

const canSubmit = computed(() =>
  aliasValid.value
  && form.recipientName.trim() !== ''
  && form.phone.trim() !== ''
  && form.street.trim() !== ''
  && form.exteriorNumber.trim() !== ''
  && form.colonia.trim() !== ''
  && cpValid.value
  && form.municipio.trim() !== ''
  && form.estado.trim() !== ''
)

async function onSave() {
  if (!canSubmit.value) return

  const body: AddressRequest = {
    alias: form.alias.trim(),
    recipientName: form.recipientName.trim(),
    phone: form.phone.trim(),
    street: form.street.trim(),
    exteriorNumber: form.exteriorNumber.trim(),
    interiorNumber: form.interiorNumber.trim() || null,
    colonia: form.colonia.trim(),
    cp: form.cp.trim(),
    municipio: form.municipio.trim(),
    estado: form.estado.trim(),
    isDefault: form.isDefault
  }

  const ok = props.address
    ? await updateAddress(props.address.id, body)
    : await createAddress(body)

  if (ok) {
    emit('saved')
    open.value = false
  }
}
</script>

<template>
  <USlideover
    v-model:open="open"
    :title="props.address ? 'Editar dirección' : 'Nueva dirección'"
    :ui="{ content: 'max-w-lg' }"
  >
    <template #body>
      <div class="space-y-5">
        <UFormField label="Alias">
          <UInput
            v-model="form.alias"
            placeholder="Ej. Casa, Oficina"
            maxlength="50"
            class="w-full"
          />
        </UFormField>

        <UFormField label="Nombre de quien recibe">
          <UInput
            v-model="form.recipientName"
            placeholder="Nombre completo"
            class="w-full"
          />
        </UFormField>

        <UFormField label="Teléfono">
          <UInput
            v-model="form.phone"
            type="tel"
            placeholder="10 dígitos"
            class="w-full"
          />
        </UFormField>

        <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <UFormField
            label="Calle"
            class="sm:col-span-3"
          >
            <UInput
              v-model="form.street"
              placeholder="Av. Reforma"
              class="w-full"
            />
          </UFormField>

          <UFormField label="No. exterior">
            <UInput
              v-model="form.exteriorNumber"
              placeholder="123"
              class="w-full"
            />
          </UFormField>

          <UFormField label="No. interior">
            <UInput
              v-model="form.interiorNumber"
              placeholder="Opcional"
              class="w-full"
            />
          </UFormField>
        </div>

        <UFormField
          label="Código postal"
          help="Autocompleta municipio y estado."
        >
          <UInput
            v-model="form.cp"
            inputmode="numeric"
            maxlength="5"
            placeholder="06600"
            class="w-full"
            :loading="lookingUpCp"
          />
        </UFormField>

        <p
          v-if="cpNotFound"
          class="-mt-2 text-xs text-warning"
        >
          No encontramos ese código postal. Captura municipio y estado manualmente.
        </p>

        <UFormField label="Colonia">
          <UInput
            v-model="form.colonia"
            placeholder="Juárez"
            class="w-full"
          />
        </UFormField>

        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <UFormField label="Municipio / Alcaldía">
            <UInput
              v-model="form.municipio"
              placeholder="Cuauhtémoc"
              class="w-full"
            />
          </UFormField>

          <UFormField label="Estado">
            <UInput
              v-model="form.estado"
              placeholder="Ciudad de México"
              class="w-full"
            />
          </UFormField>
        </div>

        <div class="flex items-center justify-between pt-2 border-t border-default">
          <div>
            <p class="text-sm text-highlighted">
              Dirección principal
            </p>
            <p class="text-xs text-muted">
              Se usará por defecto en tus pedidos.
            </p>
          </div>
          <USwitch v-model="form.isDefault" />
        </div>
      </div>
    </template>

    <template #footer="{ close }">
      <div class="flex items-center justify-end gap-3 w-full">
        <UButton
          color="neutral"
          variant="ghost"
          @click="close"
        >
          Cancelar
        </UButton>
        <UButton
          color="primary"
          :loading="isSaving"
          :disabled="!canSubmit"
          @click="onSave"
        >
          {{ props.address ? 'Guardar cambios' : 'Guardar dirección' }}
        </UButton>
      </div>
    </template>
  </USlideover>
</template>
