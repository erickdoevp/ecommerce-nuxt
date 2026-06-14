<script setup lang="ts">
definePageMeta({
  layout: 'account'
})

// TODO: reemplazar por los favoritos reales del usuario.
const favorites = [
  {
    category: 'Conjuntos',
    name: 'Conjunto Encaje Aurora',
    price: 389,
    gradient: 'from-[#F8DCE4] to-[#EBA9B6]'
  },
  {
    category: 'Bodies',
    name: 'Body Encaje Marfil',
    price: 479,
    gradient: 'from-[#F2E9DA] to-[#E0CBB0]'
  },
  {
    category: 'Ligueros',
    name: 'Liguero Pasión',
    price: 329,
    gradient: 'from-[#F0B8BE] to-[#D06E7C]'
  },
  {
    category: 'Tangas',
    name: 'Tanga Encaje Lila',
    price: 259,
    gradient: 'from-[#E2D2F0] to-[#C2A4E2]'
  }
]
</script>

<template>
  <div>
    <div class="flex items-end justify-between gap-4">
      <h2 class="font-serif text-3xl text-highlighted">
        Mis favoritos
      </h2>
      <p class="text-sm text-muted shrink-0">
        {{ favorites.length }} piezas guardadas
      </p>
    </div>

    <div class="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      <article
        v-for="item in favorites"
        :key="item.name"
        class="rounded-xl border border-default bg-muted overflow-hidden flex flex-col"
      >
        <div
          class="relative aspect-[3/4] bg-gradient-to-br"
          :class="item.gradient"
        >
          <button
            type="button"
            class="absolute top-3 right-3 w-9 h-9 rounded-full bg-white/90 hover:bg-white flex items-center justify-center shadow-sm transition-colors"
            aria-label="Quitar de favoritos"
          >
            <svg
              viewBox="0 0 24 24"
              fill="currentColor"
              class="w-4 h-4 text-primary"
            >
              <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
            </svg>
          </button>
        </div>

        <div class="p-5 flex flex-col flex-1">
          <p class="text-[10px] tracking-[0.2em] uppercase text-muted">
            {{ item.category }}
          </p>
          <h3 class="mt-1 font-serif text-lg text-highlighted">
            {{ item.name }}
          </h3>
          <p class="mt-1 text-sm text-highlighted">
            ${{ item.price }} <span class="text-xs text-muted">MXN</span>
          </p>
          <UButton
            variant="outline"
            block
            class="mt-4 rounded-full text-[11px] tracking-[0.1em] uppercase"
          >
            Mover a la bolsa
          </UButton>
        </div>
      </article>
    </div>
  </div>
</template>
