<script setup lang="ts">
import { useClientAddresses } from '~/features/address/composables/useClientAddresses'
import type { AddressResponse } from '~/features/address/types/address'

definePageMeta({
  layout: 'account'
})

const { addresses, isLoading, fetchAddresses } = useClientAddresses()

onMounted(() => fetchAddresses())

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
            v-if="address.isDefault"
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
          >
            Editar
          </button>
          <button
            type="button"
            class="text-muted hover:text-highlighted transition-colors"
          >
            Eliminar
          </button>
        </div>
      </div>

      <!-- Agregar dirección -->
      <button
        type="button"
        class="rounded-xl border border-dashed border-default p-6 min-h-[180px] flex flex-col items-center justify-center gap-3 text-muted hover:text-highlighted hover:border-primary transition-colors"
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
  </div>
</template>
