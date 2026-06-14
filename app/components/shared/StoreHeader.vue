<script setup lang="ts">
const announcements = [
  'Hecho a mano en México',
  'Envío gratis en compras +$999',
  '10% en tu primer pedido con BENDITA10',
  'Hecho a mano en México'
]

const nav = [
  { label: 'Novedades', to: '/novedades' },
  { label: 'Colecciones', to: '/colecciones' },
  { label: 'Categorías', to: '/categorias' },
  { label: 'Más vendidos', to: '/mas-vendidos' },
  { label: 'Historia', to: '/historia' }
]

const mobileOpen = ref(false)
</script>

<template>
  <header>
    <!-- Barra de anuncios -->
    <div class="bg-primary text-white/90">
      <div class="flex items-center justify-center gap-x-10 px-4 py-2.5 text-[11px] tracking-[0.2em] uppercase whitespace-nowrap overflow-hidden">
        <span
          v-for="(msg, i) in announcements"
          :key="i"
          class="flex items-center gap-x-10"
        >
          {{ msg }}
          <span class="text-white/30">·</span>
        </span>
      </div>
    </div>

    <!-- Barra principal -->
    <div class="bg-default border-b border-default">
      <div class="grid grid-cols-3 items-center h-20 px-6 lg:px-10">
        <!-- Nav (desktop) -->
        <nav class="hidden lg:flex items-center gap-7 text-[12px] tracking-[0.15em] uppercase text-toned">
          <NuxtLink
            v-for="item in nav"
            :key="item.to"
            :to="item.to"
            class="hover:text-highlighted transition-colors"
          >
            {{ item.label }}
          </NuxtLink>
        </nav>

        <!-- Menú (móvil) -->
        <div class="lg:hidden">
          <UButton
            icon="i-lucide-menu"
            color="neutral"
            variant="ghost"
            aria-label="Abrir menú"
            @click="mobileOpen = true"
          />
        </div>

        <!-- Logo -->
        <NuxtLink
          to="/"
          class="text-center leading-none"
        >
          <span class="block font-serif text-2xl tracking-[0.2em] text-highlighted">
            LA BENDITA
          </span>
          <span class="block mt-1 text-[9px] tracking-[0.35em] text-dimmed">
            LENCERÍA
          </span>
        </NuxtLink>

        <!-- Acciones -->
        <div class="flex items-center justify-end gap-0.5">
          <UButton
            icon="i-lucide-search"
            color="neutral"
            variant="ghost"
            aria-label="Buscar"
          />
          <UButton
            icon="i-lucide-user"
            color="neutral"
            variant="ghost"
            to="/my-profile"
            aria-label="Mi cuenta"
          />
          <UButton
            icon="i-lucide-heart"
            color="neutral"
            variant="ghost"
            aria-label="Favoritos"
          />
          <UButton
            icon="i-lucide-shopping-bag"
            color="neutral"
            variant="ghost"
            aria-label="Carrito"
          />
        </div>
      </div>
    </div>

    <!-- Menú móvil -->
    <USlideover
      v-model:open="mobileOpen"
      title="Menú"
      :ui="{ content: 'max-w-xs' }"
    >
      <template #body>
        <nav class="flex flex-col">
          <NuxtLink
            v-for="item in nav"
            :key="item.to"
            :to="item.to"
            class="py-3 text-sm tracking-[0.15em] uppercase text-toned hover:text-highlighted transition-colors border-b border-default"
            @click="mobileOpen = false"
          >
            {{ item.label }}
          </NuxtLink>
        </nav>
      </template>
    </USlideover>
  </header>
</template>
