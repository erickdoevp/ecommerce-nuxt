<script setup lang="ts">
import AddressFormSlideover from '~/features/address/components/AddressFormSlideover.vue'
import { useClientAddresses } from '~/features/address/composables/useClientAddresses'
import type { AddressResponse } from '~/features/address/types/address'

definePageMeta({
  layout: 'account'
})

const {
  addresses,
  isLoading,
  isProcessing,
  fetchAddresses,
  deleteAddress,
  setDefaultAddress
} = useClientAddresses()

onMounted(() => fetchAddresses())

const slideoverOpen = ref(false)
const editing = ref<AddressResponse | undefined>(undefined)

function openCreate() {
  editing.value = undefined
  slideoverOpen.value = true
}

function openEdit(address: AddressResponse) {
  editing.value = address
  slideoverOpen.value = true
}

// ─── Confirmación (eliminar / marcar principal) ─────────────────────────────
const confirm = reactive({
  open: false,
  type: 'delete' as 'delete' | 'default',
  address: undefined as AddressResponse | undefined
})

const confirmText = computed(() =>
  confirm.type === 'delete'
    ? {
        title: 'Eliminar dirección',
        body: `¿Seguro que quieres eliminar la dirección "${confirm.address?.alias}"? Esta acción no se puede deshacer.`,
        accept: 'Eliminar',
        color: 'error' as const
      }
    : {
        title: 'Marcar como principal',
        body: `¿Usar "${confirm.address?.alias}" como tu dirección principal?`,
        accept: 'Marcar como principal',
        color: 'primary' as const
      }
)

function askDelete(address: AddressResponse) {
  confirm.type = 'delete'
  confirm.address = address
  confirm.open = true
}

function askSetDefault(address: AddressResponse) {
  confirm.type = 'default'
  confirm.address = address
  confirm.open = true
}

async function onConfirm() {
  const address = confirm.address
  if (!address) return
  const ok = confirm.type === 'delete'
    ? await deleteAddress(address.id)
    : await setDefaultAddress(address.id)
  if (ok) confirm.open = false
}

function line1(a: AddressResponse): string {
  const interior = a.interiorNumber ? ` Int. ${a.interiorNumber}` : ''
  return `${a.street} ${a.exteriorNumber}${interior}, ${a.colonia}`
}

function line2(a: AddressResponse): string {
  return `${a.municipio}, ${a.estado} ${a.cp}`
}
</script>

<template>
  <div>
    <div class="flex items-center justify-between gap-4">
      <div>
        <h2 class="font-serif text-3xl text-highlighted">
          Mis direcciones
        </h2>
        <p class="mt-1 text-sm text-muted">
          Administra tus direcciones de envío.
        </p>
      </div>
      <UButton
        icon="i-lucide-plus"
        class="rounded-full tracking-widest shrink-0"
        @click="openCreate"
      >
        Agregar
      </UButton>
    </div>

    <div class="mt-6 grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div
        v-for="address in addresses"
        :key="address.id"
        class="rounded-xl border border-default bg-muted p-6"
      >
        <div class="flex items-start justify-between gap-4">
          <p class="text-[11px] tracking-[0.2em] uppercase text-muted">
            {{ address.alias }}
          </p>
          <span
            v-if="address.default"
            class="rounded-full bg-accented px-3 py-1 text-[10px] tracking-[0.15em] uppercase text-toned"
          >
            Principal
          </span>
        </div>

        <p class="mt-4 font-serif text-xl text-highlighted">
          {{ address.recipientName }}
        </p>
        <div class="mt-3 space-y-1 text-sm text-muted">
          <p>{{ line1(address) }}</p>
          <p>{{ line2(address) }}</p>
          <p>{{ address.phone }}</p>
        </div>

        <div class="mt-5 flex items-center gap-5 text-[11px] tracking-[0.15em] uppercase">
          <button
            type="button"
            class="text-highlighted underline underline-offset-4 hover:opacity-80 transition-opacity"
            @click="openEdit(address)"
          >
            Editar
          </button>
          <button
            v-if="!address.default"
            type="button"
            class="text-primary hover:opacity-80 transition-opacity"
            @click="askSetDefault(address)"
          >
            Hacer principal
          </button>
          <button
            type="button"
            class="text-muted hover:text-highlighted transition-colors"
            @click="askDelete(address)"
          >
            Eliminar
          </button>
        </div>
      </div>

      <!-- Agregar dirección -->
      <button
        type="button"
        class="rounded-xl border border-dashed border-default p-6 min-h-[180px] flex flex-col items-center justify-center gap-3 text-muted hover:text-highlighted hover:border-primary transition-colors"
        @click="openCreate"
      >
        <UIcon
          name="i-lucide-plus"
          class="w-6 h-6"
        />
        <span class="text-[11px] tracking-[0.2em] uppercase">
          Agregar dirección
        </span>
      </button>
    </div>

    <p
      v-if="!isLoading && addresses.length === 0"
      class="mt-4 text-sm text-muted"
    >
      Aún no tienes direcciones guardadas.
    </p>

    <AddressFormSlideover
      v-model:open="slideoverOpen"
      :address="editing"
    />

    <UModal
      v-model:open="confirm.open"
      :title="confirmText.title"
      :ui="{ footer: 'justify-end' }"
    >
      <template #body>
        <p class="text-sm text-muted">
          {{ confirmText.body }}
        </p>
      </template>

      <template #footer="{ close }">
        <UButton
          color="neutral"
          variant="ghost"
          @click="close"
        >
          Cancelar
        </UButton>
        <UButton
          :color="confirmText.color"
          :loading="isProcessing"
          @click="onConfirm"
        >
          {{ confirmText.accept }}
        </UButton>
      </template>
    </UModal>
  </div>
</template>
