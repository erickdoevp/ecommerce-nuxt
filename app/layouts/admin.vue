<script setup lang="ts">
import type { NavigationMenuItem } from '@nuxt/ui'

const variant = ref<'sidebar' | 'floating' | 'inset'>('sidebar')
const side = ref<'left' | 'right'>('left')
const open = ref(true)

const items: NavigationMenuItem[] = [
  {
    label: 'Catálogo',
    type: 'label',
    slot: 'settings-label' as const
  },
  {
    label: 'Productos',
    icon: 'i-lucide-shopping-bag',
    to: '/admin/product'
  },
  {
    label: 'Inventario',
    icon: 'i-lucide-warehouse',
    to: '/admin/inventory'
  },
  {
    label: 'Categorías',
    icon: 'i-lucide-tag',
    to: '/admin/category'
  },
  {
    label: 'Colores',
    icon: 'i-lucide-palette',
    to: '/admin/color'
  },
  {
    label: 'Tallas',
    icon: 'i-lucide-ruler',
    to: '/admin/size'
  },
  {
    label: 'Colecciones',
    icon: 'i-lucide-layers',
    to: '/admin/collection'
  },
  {
    label: 'Operaciones',
    type: 'label',
    slot: 'settings-label' as const
  },
  {
    label: 'Órdenes',
    icon: 'i-lucide-package',
    to: '/admin/order'
  },
  {
    label: 'Clientes',
    icon: 'i-lucide-users',
    to: '/admin/customer'
  }
]
const initials = computed(() => {
  const email = 'erick.doev@gmail.com'
  return email.substring(0, 2).toUpperCase()
})
</script>

<template>
  <div
    class="flex h-screen overflow-hidden"
    :class="[
      variant === 'inset' && 'bg-neutral-50 dark:bg-neutral-950',
      side === 'right' && 'flex-row-reverse'
    ]"
  >
    <USidebar
      v-model:open="open"
      :variant="variant"
      mode="drawer"
      collapsible="offcanvas"
      :side="side"
      :ui="{
        container: 'h-full'
      }"
    >
      <template #header>
        <!-- <img
          src="/images/main-logo.png"
          alt="Cefire Fisioterapia logo"
          width="30"
          height="30"
        > -->
        <p class="text-black font-semibold tracking-wide flex-1 overflow-hidden">
          CEFIRE
        </p>
        <UBadge
          label="Admin"
          color="primary"
          variant="soft"
          class="shrink-0 text-xs rounded-full"
        />
      </template>

      <UNavigationMenu
        :items="items"
        orientation="vertical"
        :ui="{ link: 'p-1.5 overflow-hidden' }"
      />

      <template #footer>
        <div class="flex w-full items-center gap-3 overflow-hidden">
          <div class="rounded-full bg-primary w-9 h-9 flex items-center justify-center shrink-0">
            <span class="text-white text-sm font-bold">{{ initials }}</span>
          </div>
          <div class="flex-1 min-w-0 overflow-hidden">
            <p class="text-sm font-medium truncate">
              {{ 'email' }}
            </p>
            <p class="text-xs capitalize">
              {{ 'admin' }}
            </p>
          </div>
          <UButton
            icon="i-lucide-log-out"
            color="neutral"
            variant="ghost"
            aria-label="Cerrar sesión"
          />
        </div>
      </template>
    </USidebar>

    <div
      class="flex-1 min-w-0 flex flex-col lg:peer-data-[variant=floating]:my-4 peer-data-[variant=inset]:m-4 lg:peer-data-[variant=inset]:not-peer-data-[collapsible=offcanvas]:ms-0 peer-data-[variant=inset]:rounded-xl peer-data-[variant=inset]:shadow-sm peer-data-[variant=inset]:ring peer-data-[variant=inset]:ring-default bg-[#f6f7f9]"
    >
      <div
        class="h-(--ui-header-height) shrink-0 flex items-center px-4 bg-white"
        :class="[
          variant !== 'floating' && 'border-b border-default',
          side === 'right' && 'justify-end'
        ]"
      >
        <UButton
          :icon="side === 'left' ? 'i-lucide-panel-left' : 'i-lucide-panel-right'"
          color="neutral"
          variant="ghost"
          aria-label="Toggle sidebar"
          @click="open = !open"
        />
      </div>

      <div class="flex-1 overflow-auto">
        <div class="bg-[#f8f7f6] p-6 min-w-0">
          <slot />
        </div>
      </div>
    </div>
  </div>
</template>
