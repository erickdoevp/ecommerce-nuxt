<script setup lang="ts">
definePageMeta({
  layout: 'account'
})

// TODO: reemplazar por datos reales (pedidos, favoritos, cupón, último pedido).
const summary = {
  orders: 3,
  favorites: 4,
  coupon: { code: 'BENDITA10', description: '10% en tu próxima compra' }
}

const lastOrder = {
  number: 'LB-2418',
  date: '28 May 2026',
  items: 2,
  status: 'Entregado',
  total: 818,
  swatches: ['from-[#F0C2C9] to-[#EBA9B6]', 'from-[#C2A4E2] to-[#A98BD0]']
}
</script>

<template>
  <div class="space-y-6">
    <!-- Tarjetas resumen -->
    <div class="grid grid-cols-1 sm:grid-cols-3 gap-5">
      <div class="rounded-xl border border-default bg-muted p-6">
        <p class="text-[11px] tracking-[0.2em] uppercase text-muted">
          Pedidos
        </p>
        <p class="mt-4 font-serif text-4xl text-highlighted">
          {{ summary.orders }}
        </p>
      </div>

      <div class="rounded-xl border border-default bg-muted p-6">
        <p class="text-[11px] tracking-[0.2em] uppercase text-muted">
          Favoritos
        </p>
        <p class="mt-4 font-serif text-4xl text-highlighted">
          {{ summary.favorites }}
        </p>
      </div>

      <div class="rounded-xl bg-primary text-white p-6">
        <p class="text-[11px] tracking-[0.2em] uppercase text-white/60">
          Tu cupón
        </p>
        <p class="mt-3 font-serif text-2xl">
          {{ summary.coupon.code }}
        </p>
        <p class="mt-2 text-xs text-white/70">
          {{ summary.coupon.description }}
        </p>
      </div>
    </div>

    <!-- Último pedido -->
    <div class="rounded-xl border border-default bg-muted p-6">
      <div class="flex items-center justify-between">
        <h2 class="font-serif text-2xl text-highlighted">
          Tu último pedido
        </h2>
        <NuxtLink
          to="/my-profile/orders"
          class="text-[11px] tracking-[0.15em] uppercase text-muted hover:text-highlighted underline underline-offset-4 transition-colors"
        >
          Ver todos
        </NuxtLink>
      </div>

      <div class="mt-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div class="flex items-center gap-4">
          <div class="flex gap-2">
            <div
              v-for="(swatch, i) in lastOrder.swatches"
              :key="i"
              class="w-14 h-14 rounded-lg bg-gradient-to-br"
              :class="swatch"
            />
          </div>
          <div>
            <p class="text-sm font-medium text-highlighted">
              Pedido #{{ lastOrder.number }}
            </p>
            <p class="mt-1 text-xs text-muted">
              {{ lastOrder.date }} · {{ lastOrder.items }} piezas
            </p>
          </div>
        </div>

        <div class="flex items-center gap-5">
          <UBadge
            color="success"
            variant="subtle"
            class="rounded-full text-[10px] tracking-[0.15em] uppercase"
          >
            {{ lastOrder.status }}
          </UBadge>
          <p class="font-serif text-2xl text-highlighted">
            ${{ lastOrder.total }}
            <span class="text-xs text-muted">MXN</span>
          </p>
        </div>
      </div>
    </div>

    <!-- Completa tu colección -->
    <div class="rounded-xl bg-elevated p-8 flex flex-col md:flex-row md:items-center justify-between gap-6">
      <div>
        <h3 class="font-serif text-2xl text-highlighted">
          Completa tu colección
        </h3>
        <p class="mt-2 max-w-md text-sm text-muted">
          Vimos que amas el encaje. Tenemos novedades de la colección Aurora pensadas para ti.
        </p>
      </div>
      <UButton
        to="/colecciones"
        size="lg"
        class="rounded-full tracking-widest px-8 shrink-0"
      >
        DESCUBRIR
      </UButton>
    </div>
  </div>
</template>
