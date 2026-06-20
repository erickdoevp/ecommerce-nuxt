<script setup lang="ts">
// Etiquetas de la franja vino inferior (marquee infinito de derecha a izquierda).
const marquee = ['Encaje', 'Malla', 'Seda', 'Hecho a mano', 'Tlaxcala, México']
// Repetimos las etiquetas para que cada mitad de la pista llene pantallas anchas
// y el bucle (translateX -50%) quede continuo y sin huecos.
const loop = [...marquee, ...marquee, ...marquee]
</script>

<template>
  <section class="relative overflow-hidden bg-[#F6F1E9]">
    <!-- Franja de anuncio -->
    <NuxtLink
      to="/sign-in"
      class="group relative flex items-center justify-center gap-2 overflow-hidden border-b border-wine-200/60 bg-gradient-to-b from-wine-100/60 to-transparent py-3 text-center text-[11px] tracking-[0.2em] uppercase text-wine-500 transition-colors hover:text-wine-700"
    >
      <!-- Resplandor difuminado de fondo -->
      <span
        aria-hidden="true"
        class="pointer-events-none absolute left-1/2 top-0 h-24 w-[40rem] max-w-[80%] -translate-x-1/2 -translate-y-1/2 rounded-full bg-gradient-to-r from-terracotta-300/40 via-wine-300/40 to-terracotta-300/40 blur-3xl"
      />
      <span class="relative flex items-center gap-2">
        Regístrate o inicia sesión para una mejor experiencia
        <UIcon name="i-lucide-arrow-right" />
      </span>
    </NuxtLink>

    <!-- Escenario -->
    <div class="relative flex min-h-[68vh] flex-col items-center justify-center px-6 py-20">
      <!-- Wordmark de fondo (solo contorno) -->
      <span
        aria-hidden="true"
        class="pointer-events-none absolute inset-x-0 top-1/2 -translate-y-1/2 select-none text-center font-serif font-medium leading-none text-[20vw] text-transparent"
        style="-webkit-text-stroke: 1px var(--color-wine-200); opacity: 0.7;"
      >
        BENDITA
      </span>

      <!-- Contenido -->
      <div class="relative flex flex-col items-center text-center">
        <span class="text-[11px] tracking-[0.3em] uppercase text-wine-500 sm:text-xs">
          Edición Primavera · Núm. 01
        </span>

        <h1 class="mt-6 font-serif font-medium leading-[0.9] text-highlighted">
          <span class="block text-6xl sm:text-7xl lg:text-8xl">Sentirte</span>
          <span class="mt-1 block text-6xl italic text-wine-500 sm:text-7xl lg:text-8xl">divina</span>
        </h1>

        <!-- Tarjeta de producto -->
        <NuxtLink
          to="/products"
          class="group mt-12 flex items-center gap-4 rounded-2xl bg-white p-3 pr-4 shadow-lg shadow-wine-950/5 transition-shadow hover:shadow-xl hover:shadow-wine-950/10"
        >
          <div class="size-16 rounded-xl bg-gradient-to-br from-wine-100 via-wine-300 to-wine-400" />
          <div class="text-left">
            <p class="text-[10px] tracking-[0.2em] uppercase text-dimmed">
              Lo nuevo
            </p>
            <p class="font-serif text-lg leading-tight text-highlighted">
              Body Marfil
            </p>
            <p class="text-sm text-wine-500">
              $479 MXN
            </p>
          </div>
          <span class="flex size-10 items-center justify-center rounded-full bg-wine-500 text-white transition-transform group-hover:translate-x-0.5">
            <UIcon name="i-lucide-arrow-right" />
          </span>
        </NuxtLink>
      </div>
    </div>

    <!-- Franja vino · marquee de derecha a izquierda -->
    <div class="overflow-hidden bg-wine-500 py-4">
      <div class="marquee flex w-max">
        <ul
          v-for="group in 2"
          :key="group"
          :aria-hidden="group === 2 ? 'true' : undefined"
          class="flex shrink-0 items-center"
        >
          <li
            v-for="(label, i) in loop"
            :key="`${group}-${i}`"
            class="flex items-center"
          >
            <span
              class="word inline-block px-8 text-xs tracking-[0.25em] uppercase text-sand-100"
              :style="{ animationDelay: `${i * 0.25}s` }"
            >
              {{ label }}
            </span>
            <span class="text-sand-100/40">·</span>
          </li>
        </ul>
      </div>
    </div>
  </section>
</template>

<style scoped>
@keyframes marquee {
  from { transform: translateX(0); }
  to { transform: translateX(-50%); }
}

.marquee {
  animation: marquee 28s linear infinite;
}

@keyframes word-float {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-4px); }
}

.word {
  animation: word-float 2.8s ease-in-out infinite;
}

/* Bajo "reducir movimiento" detenemos solo el vaivén decorativo de las palabras;
   el desplazamiento de la franja es el comportamiento central y se mantiene. */
@media (prefers-reduced-motion: reduce) {
  .word {
    animation: none;
  }
}
</style>
