<script setup lang="ts">
import { useScroll } from '@vueuse/core'
import { usePublicCategoryTree } from '~/features/category/composables/usePublicCategoryTree'
import { useActiveCollections } from '~/features/collection/composables/useActiveCollections'
import { useCart } from '~/features/cart/composables/useCart'
import type { CategoryTree } from '~/features/category/types/category-tree'

const { categories: tree } = usePublicCategoryTree()
const { collections } = useActiveCollections()
const { itemCount, openCart } = useCart()

const hasChildren = (cat: CategoryTree) => (cat.children?.length ?? 0) > 0

// --- Panel de escritorio (drawer) ---
const openKey = ref<string | null>(null)
const activeChildId = ref<string | null>(null)

const isOpen = computed(() => openKey.value !== null)
const activeRoot = computed(() => tree.value.find(c => c.id === openKey.value) ?? null)
const activeChild = computed(
  () => activeRoot.value?.children.find(c => c.id === activeChildId.value) ?? null
)

function toggleMenu(key: string) {
  openKey.value = openKey.value === key ? null : key
  activeChildId.value = null
}

function closeMenu() {
  openKey.value = null
  activeChildId.value = null
}

function selectChild(child: CategoryTree) {
  activeChildId.value = activeChildId.value === child.id ? null : child.id
}

// --- Menú móvil (drill-down) ---
const mobileOpen = ref(false)
const mobileStack = ref<{ title: string, items: CategoryTree[], slugs: string[] }[]>([])

const mobileItems = computed(() =>
  mobileStack.value.length
    ? mobileStack.value[mobileStack.value.length - 1]!.items
    : tree.value
)
const mobileTitle = computed(() =>
  mobileStack.value.length
    ? mobileStack.value[mobileStack.value.length - 1]!.title
    : 'Menú'
)
// Slugs acumulados del nivel actual, para construir la ruta jerárquica.
const mobileSlugs = computed(() =>
  mobileStack.value.length
    ? mobileStack.value[mobileStack.value.length - 1]!.slugs
    : []
)

const categoryPath = (slug: string) =>
  `/categories/${[...mobileSlugs.value, slug].join('/')}`

function mobileDrill(cat: CategoryTree) {
  if (hasChildren(cat)) {
    mobileStack.value.push({
      title: cat.name,
      items: cat.children,
      slugs: [...mobileSlugs.value, cat.slug]
    })
  }
}

function mobileBack() {
  mobileStack.value.pop()
}

function closeMobile() {
  mobileOpen.value = false
  mobileStack.value = []
}

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
  () => hidden.value && !isOpen.value && !mobileOpen.value
)
</script>

<template>
  <header
    class="sticky top-0 z-50 transition-transform duration-300 ease-out"
    :class="headerHidden ? '-translate-y-full' : 'translate-y-0'"
  >
    <!-- Línea de acento -->
    <div class="relative z-50 h-[3px] bg-gradient-to-r from-indigo-300 via-indigo-400 to-indigo-300" />

    <!-- Barra principal -->
    <div class="relative z-50 bg-default">
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
            @click="closeMenu"
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
          <button
            v-for="root in tree"
            :key="root.id"
            type="button"
            class="relative flex items-center h-full transition-colors hover:text-highlighted"
            :class="openKey === root.id ? 'text-highlighted' : ''"
            @click="toggleMenu(root.id)"
          >
            {{ root.name }}
            <span
              v-show="openKey === root.id"
              class="absolute bottom-0 inset-x-0 h-[2px] bg-primary"
            />
          </button>
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
          <UChip
            :text="itemCount"
            :show="itemCount > 0"
            color="primary"
            size="lg"
          >
            <UButton
              icon="i-lucide-shopping-bag"
              color="neutral"
              variant="ghost"
              :aria-label="`Carrito${itemCount ? `, ${itemCount} artículos` : ''}`"
              @click="openCart()"
            />
          </UChip>
        </div>
      </div>
    </div>

    <!-- Backdrop + drawer: teleportados a body para no quedar atrapados en el
         bloque contenedor que crea el transform del header -->
    <Teleport to="body">
      <!-- Backdrop -->
      <Transition
        enter-active-class="transition-opacity duration-200"
        enter-from-class="opacity-0"
        leave-active-class="transition-opacity duration-200"
        leave-to-class="opacity-0"
      >
        <div
          v-if="isOpen"
          class="hidden lg:block fixed inset-0 z-30 bg-black/30"
          @click="closeMenu"
        />
      </Transition>

      <!-- Drawer (desktop): alto completo, ancho parcial anclado a la izquierda -->
      <Transition
        enter-active-class="transition-transform duration-300 ease-out"
        enter-from-class="-translate-x-full"
        leave-active-class="transition-transform duration-300 ease-out"
        leave-to-class="-translate-x-full"
      >
        <div
          v-if="isOpen"
          class="hidden lg:flex fixed inset-y-0 left-0 z-40 max-w-[90vw] bg-white shadow-xl flex-col pt-[83px]"
        >
          <!-- Cerrar -->
          <button
            type="button"
            class="flex items-center gap-2 px-8 py-5 text-[13px] tracking-[0.12em] uppercase text-toned hover:text-highlighted transition-colors"
            @click="closeMenu"
          >
            <UIcon
              name="i-lucide-chevron-left"
              class="size-4"
            />
            Cerrar
          </button>

          <div
            v-if="activeRoot"
            class="flex flex-1 overflow-y-auto"
          >
            <!-- Categorías: columna nivel 2 -->
            <div class="w-[340px] shrink-0 border-r border-default px-4 py-4">
              <NuxtLink
                :to="`/categories/${activeRoot.slug}`"
                class="block px-4 py-3 font-medium underline underline-offset-4 text-highlighted"
                @click="closeMenu"
              >
                Ver todo
              </NuxtLink>

              <template
                v-for="child in activeRoot.children"
                :key="child.id"
              >
                <button
                  v-if="hasChildren(child)"
                  type="button"
                  class="group flex w-full items-center justify-between rounded-lg px-4 py-3 text-left font-serif text-lg transition-colors"
                  :class="activeChildId === child.id ? 'bg-elevated text-highlighted' : 'text-toned hover:bg-elevated hover:text-highlighted'"
                  @click="selectChild(child)"
                >
                  {{ child.name }}
                  <UIcon
                    name="i-lucide-chevron-right"
                    class="size-4 transition-transform group-hover:translate-x-1"
                  />
                </button>
                <NuxtLink
                  v-else
                  :to="`/categories/${activeRoot.slug}/${child.slug}`"
                  class="block rounded-lg px-4 py-3 font-serif text-lg text-toned hover:bg-elevated hover:text-highlighted transition-colors"
                  @click="closeMenu"
                >
                  {{ child.name }}
                </NuxtLink>
              </template>
            </div>

            <!-- Categorías: columna nivel 3 -->
            <div
              v-if="activeChild"
              class="w-[320px] shrink-0 border-r border-default px-8 py-4"
            >
              <NuxtLink
                :to="`/categories/${activeRoot.slug}/${activeChild.slug}`"
                class="block py-3 font-medium underline underline-offset-4 text-highlighted"
                @click="closeMenu"
              >
                Ver todo
              </NuxtLink>
              <NuxtLink
                v-for="leaf in activeChild.children"
                :key="leaf.id"
                :to="`/categories/${activeRoot.slug}/${activeChild.slug}/${leaf.slug}`"
                class="block py-3 text-toned hover:text-highlighted transition-colors"
                @click="closeMenu"
              >
                {{ leaf.name }}
              </NuxtLink>
            </div>

            <!-- Panel de colecciones (tarjetas con imagen) -->
            <div
              v-if="collections.length"
              class="w-[360px] shrink-0 overflow-y-auto px-8 py-4"
            >
              <p class="text-[11px] tracking-[0.18em] uppercase text-dimmed mb-4">
                Nuestras colecciones
              </p>
              <div class="flex flex-col gap-4">
                <NuxtLink
                  v-for="collection in collections"
                  :key="collection.slug"
                  :to="`/collections/${collection.slug}`"
                  class="group relative block h-44 overflow-hidden rounded-lg bg-elevated"
                  @click="closeMenu"
                >
                  <img
                    v-if="collection.imageUrl"
                    :src="collection.imageUrl"
                    :alt="collection.name"
                    class="absolute inset-0 size-full object-cover transition-transform duration-500 group-hover:scale-105"
                  >
                  <div class="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />
                  <div class="absolute inset-x-0 bottom-0 p-4">
                    <p class="font-serif text-lg text-white leading-tight">
                      {{ collection.name }}
                    </p>
                    <span class="text-[13px] text-white/90 underline underline-offset-4">
                      Descubrir
                    </span>
                  </div>
                </NuxtLink>
              </div>
            </div>
          </div>
        </div>
      </Transition>
    </Teleport>

    <!-- Menú móvil (drill-down) -->
    <USlideover
      :open="mobileOpen"
      :title="mobileTitle"
      :ui="{ content: 'max-w-xs' }"
      @update:open="(value) => value ? (mobileOpen = true) : closeMobile()"
    >
      <template #body>
        <button
          v-if="mobileStack.length"
          type="button"
          class="flex items-center gap-2 py-3 text-sm tracking-[0.12em] uppercase text-toned hover:text-highlighted transition-colors"
          @click="mobileBack"
        >
          <UIcon
            name="i-lucide-chevron-left"
            class="size-4"
          />
          Volver
        </button>

        <nav class="flex flex-col">
          <template
            v-for="item in mobileItems"
            :key="item.id"
          >
            <button
              v-if="hasChildren(item)"
              type="button"
              class="flex items-center justify-between py-3 text-sm tracking-[0.15em] uppercase text-toned hover:text-highlighted transition-colors border-b border-default"
              @click="mobileDrill(item)"
            >
              {{ item.name }}
              <UIcon
                name="i-lucide-chevron-right"
                class="size-4"
              />
            </button>
            <NuxtLink
              v-else
              :to="categoryPath(item.slug)"
              class="py-3 text-sm tracking-[0.15em] uppercase text-toned hover:text-highlighted transition-colors border-b border-default"
              @click="closeMobile"
            >
              {{ item.name }}
            </NuxtLink>
          </template>

          <NuxtLink
            v-if="!mobileStack.length"
            to="/collections"
            class="py-3 text-sm tracking-[0.15em] uppercase text-toned hover:text-highlighted transition-colors border-b border-default"
            @click="closeMobile"
          >
            Colecciones
          </NuxtLink>
        </nav>
      </template>
    </USlideover>
  </header>
</template>
