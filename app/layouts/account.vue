<script setup lang="ts">
import { useClientAuthStore } from '~/features/auth/store/client-auth'
import { useClientProfile } from '~/features/profile/composables/useClientProfile'

const clientAuth = useClientAuthStore()
const route = useRoute()
const { profile, fetchProfile } = useClientProfile()

onMounted(() => fetchProfile())

const displayName = computed(() => profile.value?.name ?? '')
const initial = computed(() => (profile.value?.name ?? '?').charAt(0).toUpperCase())
const memberSince = computed(() =>
  profile.value?.createdAt ? new Date(profile.value.createdAt).getFullYear() : null
)
// TODO: las recompensas no vienen de /users/me — placeholder.
const rewards = 1280

const nav = [
  { label: 'Resumen', to: '/my-profile' },
  { label: 'Mis pedidos', to: '/my-profile/orders' },
  { label: 'Favoritos', to: '/my-profile/favorites' },
  { label: 'Direcciones', to: '/my-profile/addresses' },
  { label: 'Mis datos', to: '/my-profile/data' }
]

function isActive(to: string): boolean {
  return route.path === to
}

function onLogout() {
  clientAuth.logout()
}
</script>

<template>
  <div class="min-h-screen flex flex-col bg-default">
    <!-- Header -->
    <header class="border-b border-default">
      <div class="max-w-7xl mx-auto w-full px-6 lg:px-10 h-20 flex items-center justify-between">
        <NuxtLink
          to="/"
          class="leading-none text-center"
        >
          <span class="block font-serif text-xl tracking-[0.2em] text-highlighted">
            LA BENDITA
          </span>
          <span class="block mt-0.5 text-[8px] tracking-[0.35em] text-dimmed">
            LENCERÍA
          </span>
        </NuxtLink>

        <nav class="flex items-center gap-7 text-[12px] tracking-[0.15em] uppercase text-toned">
          <NuxtLink
            to="/"
            class="hover:text-highlighted transition-colors"
          >
            Tienda
          </NuxtLink>
          <NuxtLink
            to="/colecciones"
            class="hover:text-highlighted transition-colors"
          >
            Colecciones
          </NuxtLink>
          <button
            type="button"
            class="flex items-center gap-1.5 text-primary hover:opacity-80 transition-opacity"
            @click="onLogout"
          >
            <UIcon
              name="i-lucide-log-out"
              class="w-4 h-4"
            />
            Salir
          </button>
        </nav>
      </div>
    </header>

    <!-- Banner de bienvenida -->
    <section class="bg-elevated">
      <div class="max-w-7xl mx-auto w-full px-6 lg:px-10 py-14 flex flex-col md:flex-row md:items-center justify-between gap-8">
        <div class="flex items-center gap-6">
          <div class="w-20 h-20 rounded-full overflow-hidden bg-gradient-to-br from-[#E7D4C0] to-[#C9A989] flex items-center justify-center shadow-sm">
            <img
              v-if="profile?.avatarImgUrl"
              :src="profile.avatarImgUrl"
              alt=""
              class="w-full h-full object-cover"
            >
            <span
              v-else
              class="font-serif text-3xl text-white"
            >
              {{ initial }}
            </span>
          </div>
          <div>
            <p class="text-[11px] tracking-[0.25em] uppercase text-muted">
              Mi cuenta
            </p>
            <h1 class="mt-1 font-serif text-4xl md:text-5xl text-highlighted">
              Hola, {{ displayName }}
            </h1>
          </div>
        </div>

        <div class="flex items-center gap-12">
          <div>
            <p class="font-serif text-2xl text-primary">
              Bendita
            </p>
            <p class="mt-1 text-[10px] tracking-[0.2em] uppercase text-muted">
              Miembro desde {{ memberSince ?? '—' }}
            </p>
          </div>
          <div>
            <p class="font-serif text-2xl text-highlighted">
              ${{ rewards.toLocaleString('es-MX') }}
            </p>
            <p class="mt-1 text-[10px] tracking-[0.2em] uppercase text-muted">
              En recompensas
            </p>
          </div>
        </div>
      </div>
    </section>

    <!-- Sidebar + contenido -->
    <div class="max-w-7xl mx-auto w-full px-6 lg:px-10 py-10 flex-1">
      <div class="flex flex-col lg:flex-row gap-10">
        <aside class="lg:w-64 shrink-0">
          <nav class="flex flex-col gap-1">
            <NuxtLink
              v-for="item in nav"
              :key="item.to"
              :to="item.to"
              class="px-4 py-3 rounded-lg text-sm transition-colors"
              :class="isActive(item.to)
                ? 'bg-primary text-white'
                : 'text-toned hover:text-highlighted hover:bg-elevated'"
            >
              {{ item.label }}
            </NuxtLink>
          </nav>

          <div class="my-4 border-t border-default" />

          <button
            type="button"
            class="flex items-center gap-2 px-4 py-2 text-sm text-muted hover:text-highlighted transition-colors"
            @click="onLogout"
          >
            <UIcon
              name="i-lucide-log-out"
              class="w-4 h-4"
            />
            Cerrar sesión
          </button>
        </aside>

        <div class="flex-1 min-w-0">
          <slot />
        </div>
      </div>
    </div>
  </div>
</template>
