<script setup lang="ts">
definePageMeta({
  layout: 'account'
})

// TODO: reemplazar por los pedidos reales del usuario.
const orders = [
  {
    number: 'LB-2418',
    date: '28 May 2026',
    total: 818,
    status: 'Entregado',
    products: 'Conjunto Encaje Aurora · Tanga Encaje Vino',
    swatches: ['from-[#F6D7DD] to-[#EBA9B6]', 'from-[#C98B96] to-[#9A5562]']
  },
  {
    number: 'LB-2390',
    date: '12 May 2026',
    total: 479,
    status: 'En camino',
    products: 'Body Encaje Marfil',
    swatches: ['from-[#EFE3D2] to-[#E0CBB0]']
  },
  {
    number: 'LB-2351',
    date: '30 Abr 2026',
    total: 329,
    status: 'Entregado',
    products: 'Liguero Pasión',
    swatches: ['from-[#E98A7A] to-[#C0344A]']
  }
]

function statusColor(status: string): 'success' | 'warning' {
  return status === 'En camino' ? 'warning' : 'success'
}

function secondaryAction(status: string): string {
  return status === 'En camino' ? 'Rastrear' : 'Volver a pedir'
}
</script>

<template>
  <div>
    <h2 class="font-serif text-3xl text-highlighted">
      Mis pedidos
    </h2>

    <div class="mt-6 space-y-5">
      <article
        v-for="order in orders"
        :key="order.number"
        class="rounded-xl border border-default overflow-hidden"
      >
        <!-- Encabezado -->
        <div class="bg-elevated px-6 py-4 flex items-center justify-between gap-4">
          <div class="flex items-center gap-8 sm:gap-12">
            <div>
              <p class="text-[10px] tracking-[0.2em] uppercase text-muted">
                Pedido
              </p>
              <p class="mt-1 text-sm text-highlighted">
                #{{ order.number }}
              </p>
            </div>
            <div>
              <p class="text-[10px] tracking-[0.2em] uppercase text-muted">
                Fecha
              </p>
              <p class="mt-1 text-sm text-highlighted">
                {{ order.date }}
              </p>
            </div>
            <div>
              <p class="text-[10px] tracking-[0.2em] uppercase text-muted">
                Total
              </p>
              <p class="mt-1 text-sm text-highlighted">
                ${{ order.total }} MXN
              </p>
            </div>
          </div>

          <UBadge
            :color="statusColor(order.status)"
            variant="subtle"
            class="rounded-full text-[10px] tracking-[0.15em] uppercase shrink-0"
          >
            {{ order.status }}
          </UBadge>
        </div>

        <!-- Cuerpo -->
        <div class="bg-muted border-t border-default px-6 py-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div class="flex items-center gap-4 min-w-0">
            <div class="flex gap-2 shrink-0">
              <div
                v-for="(swatch, i) in order.swatches"
                :key="i"
                class="w-14 h-14 rounded-lg bg-gradient-to-br"
                :class="swatch"
              />
            </div>
            <p class="text-sm text-highlighted">
              {{ order.products }}
            </p>
          </div>

          <div class="flex items-center gap-3 shrink-0">
            <UButton
              color="neutral"
              variant="outline"
              size="sm"
              class="rounded-full text-[11px] tracking-[0.1em] uppercase"
            >
              Ver detalle
            </UButton>
            <UButton
              variant="outline"
              size="sm"
              class="rounded-full text-[11px] tracking-[0.1em] uppercase"
            >
              {{ secondaryAction(order.status) }}
            </UButton>
          </div>
        </div>
      </article>
    </div>
  </div>
</template>
