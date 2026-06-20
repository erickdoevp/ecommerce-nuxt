<script setup lang="ts">
import { useRootCategories } from '~/features/category/composables/useRootCategories'

const { categories } = useRootCategories()

// Solo mostramos las primeras 5 categorías raíz.
const items = computed(() => categories.value.slice(0, 5))

// Paleta pastel para los orbes (se asigna por posición, cicla si hay menos colores).
const orbs = [
  { light: '#FBE9EE', mid: '#F4D2DC', deep: '#EFC0CE' },
  { light: '#FBEBD9', mid: '#F4D6B6', deep: '#EFC79F' },
  { light: '#EDE5F7', mid: '#D6C6ED', deep: '#C7B4E6' },
  { light: '#E4EEF8', mid: '#C9DCEF', deep: '#B7D0EB' },
  { light: '#FCF3D9', mid: '#F4E2A8', deep: '#EFD894' }
]

const orbStyle = (i: number) => {
  const o = orbs[i % orbs.length]!
  return `background: radial-gradient(circle at 38% 32%, ${o.light}, ${o.mid} 45%, ${o.deep} 100%);`
}

const benefits = [
  { icon: 'i-lucide-truck', title: 'Envío gratis +$999', desc: 'A todo México en compras superiores a $999.' },
  { icon: 'i-lucide-percent', title: '10% primer pedido', desc: 'Usa el código BENDITA10 al pagar.' },
  { icon: 'i-lucide-hand', title: 'Hecho a mano', desc: 'Confeccionado pieza por pieza en Tlaxcala.' }
]
</script>

<template>
  <section class="px-6 py-20 lg:px-10 lg:py-28">
    <div class="mx-auto max-w-(--ui-container)">
      <!-- Encabezado -->
      <p class="text-[11px] tracking-[0.3em] uppercase text-wine-500">
        Explora por
      </p>
      <h2 class="mt-3 font-serif text-5xl font-medium text-highlighted lg:text-6xl">
        Categorías
      </h2>

      <!-- Orbes de categorías -->
      <ul class="mt-14 grid grid-cols-2 gap-x-6 gap-y-12 sm:grid-cols-3 lg:grid-cols-5">
        <li
          v-for="(category, i) in items"
          :key="category.id"
        >
          <NuxtLink
            :to="`/categories/${category.slug}`"
            class="group flex flex-col items-center gap-5"
          >
            <span
              class="aspect-square w-full max-w-[16rem] overflow-hidden rounded-full shadow-xl shadow-wine-950/5 transition-transform duration-300 group-hover:-translate-y-1"
              :style="category.imageUrl ? undefined : orbStyle(i)"
            >
              <img
                v-if="category.imageUrl"
                :src="category.imageUrl"
                :alt="category.name"
                class="size-full object-cover"
                loading="lazy"
              >
            </span>
            <span class="font-serif text-xl text-toned transition-colors group-hover:text-highlighted">
              {{ category.name }}
            </span>
          </NuxtLink>
        </li>
      </ul>

      <!-- Beneficios -->
      <div class="mt-20 rounded-3xl border border-default bg-elevated px-8 py-10 lg:px-12">
        <ul class="grid grid-cols-1 gap-10 md:grid-cols-3">
          <li
            v-for="benefit in benefits"
            :key="benefit.title"
            class="flex items-start gap-5"
          >
            <span class="mt-1 flex size-12 shrink-0 items-center justify-center rounded-full bg-sand-200 text-wine-500">
              <UIcon
                :name="benefit.icon"
                class="size-5"
              />
            </span>
            <div>
              <h3 class="font-serif text-xl text-highlighted">
                {{ benefit.title }}
              </h3>
              <p class="mt-1 text-sm text-muted">
                {{ benefit.desc }}
              </p>
            </div>
          </li>
        </ul>
      </div>
    </div>
  </section>
</template>
