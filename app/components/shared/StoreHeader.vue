<script setup lang="ts">
import { useScroll } from '@vueuse/core'
import { useRootCategories } from '~/features/category/composables/useRootCategories'
import { useActiveCollections } from '~/features/collection/composables/useActiveCollections'
import type { NavItem } from '../types/header'

const { categories } = useRootCategories()
const { collections } = useActiveCollections()

const nav = computed<NavItem[]>(() => [
  {
    label: 'Novedades',
    to: '/products/novedades',
    mega: {
      columns: [
        {
          title: 'Recién llegado',
          links: [
            { label: 'Últimos modelos', to: '/products/ultimos-modelos' },
            { label: 'Lo más vendido', to: '/products/mas-vendido' },
            { label: 'Ver todo', to: '/products' }
          ]
        },
        {
          title: 'Beneficios',
          links: [
            { label: '10% primer pedido', to: '/first-order' },
            { label: 'Envío gratis +$999', to: '/free-shipment' }
          ]
        },
        {
          title: 'Colecciones',
          links: collections.value.map(c => ({ label: c.name, to: `/collections/${c.slug}` }))
        }
      ],
      featured: {
        eyebrow: 'Recién llegadas',
        title: 'Lo nuevo de esta temporada',
        cta: 'Descubrir',
        to: '/products/novedades',
        gradient: 'from-wine-200 via-wine-400 to-wine-600'
      }
    }
  },
  {
    label: 'Tienda',
    to: '/products',
    mega: {
      columns: [
        {
          title: 'Por categoría',
          links: categories.value.map(c => ({ label: c.name, to: `/categories/${c.slug}` }))
        },
        {
          title: 'Por colección',
          links: collections.value.map(c => ({ label: c.name, to: `/collections/${c.slug}` }))
        },
        {
          title: 'Destacado',
          links: [
            { label: 'Más vendidos', to: '/products/mas-vendidos' },
            { label: 'Novedades', to: '/collections/novedades' },
            { label: 'Toda la tienda', to: '/products' }
          ]
        }
      ],
      featured: {
        eyebrow: 'Colección insignia',
        title: collections.value.map(c => ({ label: c.name, to: `/collections/${c.slug}` }))[0]?.label ?? 'Explora nuestra tienda',
        cta: 'Descubrir',
        to: collections.value.map(c => ({ label: c.name, to: `/collections/${c.slug}` }))[0]?.to ?? '/collections',
        gradient: 'from-terracotta-200 via-terracotta-400 to-terracotta-700'
      }
    }
  },
  {
    label: 'Colecciones',
    to: '/collections',
    mega: {
      columns: [
        {
          title: 'Nuestras colecciones',
          links: collections.value.map(c => ({ label: c.name, to: `/collections/${c.slug}` }))
        },
        {
          title: 'Explorar',
          links: [
            { label: 'Ver todas', to: '/collections' },
            { label: 'Toda la tienda', to: '/products' }
          ]
        }
      ],
      featured: {
        eyebrow: 'Para la noche',
        title: 'Medianoche malla & encaje',
        cta: 'Descubrir',
        to: '/collections/medianoche',
        gradient: 'from-slate-500 via-slate-700 to-slate-900'
      }
    }
  },
  { label: 'Nuestra Historia', to: '/history' }
])

const mobileOpen = ref(false)
const activeMenu = ref<string | null>(null)

const activeMega = computed(
  () => nav.value.find(item => item.label === activeMenu.value)?.mega ?? null
)

// Ocultar al hacer scroll hacia abajo y mostrar al subir.
// Se mantiene visible cerca del top y mientras haya un menú abierto.
const { y } = useScroll(import.meta.client ? window : undefined)
const hidden = ref(false)

watch(y, (newY, oldY) => {
  if (newY < 80) {
    hidden.value = false
    return
  }
  hidden.value = newY > oldY
})

const headerHidden = computed(
  () => hidden.value && !activeMenu.value && !mobileOpen.value
)
</script>

<template>
  <header
    class="sticky top-0 z-50 transition-transform duration-300 ease-out"
    :class="headerHidden ? '-translate-y-full' : 'translate-y-0'"
  >
    <!-- Línea de acento -->
    <div class="h-[3px] bg-gradient-to-r from-indigo-300 via-indigo-400 to-indigo-300" />

    <div
      class="relative"
      @mouseleave="activeMenu = null"
    >
      <!-- Barra principal -->
      <div class="bg-default">
        <div class="grid grid-cols-3 items-center h-20 px-6 lg:px-10">
          <!-- Izquierda: menú (móvil) + logo -->
          <div class="flex items-center gap-2">
            <UButton
              class="lg:hidden"
              icon="i-lucide-menu"
              color="neutral"
              variant="ghost"
              aria-label="Abrir menú"
              @click="mobileOpen = true"
            />
            <NuxtLink
              to="/"
              class="leading-none flex flex-col items-center"
            >
              <span class="block font-serif text-2xl leading-[0.95] tracking-[0.14em] font-semibold text-highlighted">
                LA BENDITA
              </span>
              <span class="block mt-1 text-[9.5px] tracking-[0.52em] text-dimmed">
                LENCERÍA
              </span>
            </NuxtLink>
          </div>

          <!-- Centro: nav (desktop) -->
          <nav class="hidden lg:flex items-center justify-center gap-7 h-20 text-[12px] tracking-[0.15em] uppercase text-toned">
            <NuxtLink
              v-for="item in nav"
              :key="item.to"
              :to="item.to"
              class="relative flex items-center h-full transition-colors hover:text-highlighted"
              :class="activeMenu === item.label ? 'text-highlighted' : ''"
              @mouseenter="activeMenu = item.label"
            >
              {{ item.label }}
              <span
                v-show="activeMenu === item.label"
                class="absolute bottom-0 inset-x-0 h-[2px] bg-primary"
              />
            </NuxtLink>
          </nav>

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

      <!-- Mega menú (desktop) -->
      <div
        v-if="activeMega"
        class="hidden lg:block absolute inset-x-0 top-full bg-white border-b border-default shadow-sm z-50"
      >
        <div class="grid grid-cols-3 gap-10 px-10 py-12 max-w-(--ui-container) mx-auto">
          <!-- Columnas de enlaces -->
          <div class="col-span-2 grid grid-cols-3 gap-8">
            <div
              v-for="col in activeMega.columns"
              :key="col.title"
            >
              <h3 class="pb-3 border-b border-default text-[11px] tracking-[0.2em] uppercase text-dimmed">
                {{ col.title }}
              </h3>
              <ul class="mt-5 space-y-4">
                <li
                  v-for="link in col.links"
                  :key="link.to"
                >
                  <NuxtLink
                    :to="link.to"
                    class="font-serif text-lg text-toned hover:text-highlighted transition-colors"
                  >
                    {{ link.label }}
                  </NuxtLink>
                </li>
              </ul>
            </div>
          </div>

          <!-- Tarjeta destacada -->
          <NuxtLink
            :to="activeMega.featured.to"
            class="relative flex flex-col justify-end min-h-[300px] p-8 rounded-xl overflow-hidden bg-gradient-to-br text-white"
            :class="activeMega.featured.gradient"
          >
            <span class="text-[11px] tracking-[0.2em] uppercase text-white/70">
              {{ activeMega.featured.eyebrow }}
            </span>
            <h3 class="mt-3 font-serif text-3xl leading-tight">
              {{ activeMega.featured.title }}
            </h3>
            <span class="inline-flex items-center gap-2 mt-5 text-[12px] tracking-[0.2em] uppercase">
              {{ activeMega.featured.cta }}
              <UIcon name="i-lucide-arrow-right" />
            </span>
          </NuxtLink>
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
