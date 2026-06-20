<script setup lang="ts">
const stats = [
  { title: '100% artesanal', desc: 'Cada pieza, a mano' },
  { title: 'Tlaxcala, MX', desc: 'Hecho en México' },
  { title: 'Con causa', desc: 'Economía solidaria' }
]
</script>

<template>
  <section class="bg-elevated px-6 py-20 lg:px-10 lg:py-28">
    <div class="mx-auto grid max-w-(--ui-container) items-center gap-12 lg:grid-cols-2 lg:gap-20">
      <!-- Recuadro (color sólido) -->
      <div class="relative aspect-square w-full overflow-hidden rounded-3xl bg-terracotta-200">
        <span class="absolute bottom-8 left-8 text-sm tracking-[0.2em] uppercase text-white/70">
          Taller · Tlaxcala
        </span>
      </div>

      <!-- Texto -->
      <div>
        <p class="text-[11px] tracking-[0.3em] uppercase text-wine-500">
          Nuestra historia
        </p>
        <h2 class="mt-5 font-serif text-4xl font-medium leading-tight text-highlighted lg:text-6xl">
          Todo hecho a mano, con amor y responsabilidad
        </h2>

        <div class="mt-7 space-y-5 text-muted">
          <p>
            Cada pieza de La Bendita Lencería se confecciona a mano en Tlaxcala, con
            materiales nobles y muchísimo cuidado. Creemos en la lencería como un
            acto de cariño hacia una misma.
          </p>
          <p>
            Somos parte de un programa de reactivación económica solidaria: al
            elegirnos, apoyas el trabajo de manos mexicanas.
          </p>
        </div>

        <dl class="mt-10 grid grid-cols-3 gap-6">
          <div
            v-for="stat in stats"
            :key="stat.title"
          >
            <dt class="font-serif text-xl text-wine-500">
              {{ stat.title }}
            </dt>
            <dd class="mt-1 text-sm text-muted">
              {{ stat.desc }}
            </dd>
          </div>
        </dl>
      </div>
    </div>
  </section>
</template>
