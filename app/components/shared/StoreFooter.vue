<script setup lang="ts">
const shopLinks = [
  { label: 'Conjuntos', to: '/categorias/conjuntos' },
  { label: 'Bras', to: '/categorias/bras' },
  { label: 'Tangas', to: '/categorias/tangas' },
  { label: 'Bodies', to: '/categorias/bodies' },
  { label: 'Ligueros', to: '/categorias/ligueros' }
]

const helpLinks = [
  { label: 'Envíos y entregas', to: '/envios' },
  { label: 'Cambios', to: '/cambios' },
  { label: 'Guía de tallas', to: '/guia-de-tallas' },
  { label: 'Contacto', to: '/contacto' }
]

const email = ref('')
const year = new Date().getFullYear()

function onSubscribe() {
  // TODO: conectar con el alta al newsletter
  email.value = ''
}
</script>

<template>
  <footer class="bg-primary text-white">
    <div class="max-w-7xl mx-auto px-6 lg:px-10 py-16">
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8">
        <!-- Marca -->
        <div>
          <p class="font-serif text-2xl tracking-[0.2em] leading-none">
            LA BENDITA
          </p>
          <p class="mt-1 text-[9px] tracking-[0.35em] text-white/60">
            LENCERÍA
          </p>
          <p class="mt-6 max-w-xs text-sm leading-relaxed text-white/70">
            Lencería artesanal hecha a mano en México.
            Para sentirte bendita, todos los días.
          </p>
          <div class="mt-6 flex items-center gap-3">
            <a
              href="#"
              aria-label="Instagram"
              class="w-10 h-10 rounded-full border border-white/30 flex items-center justify-center text-white/80 hover:text-white hover:border-white/60 transition-colors"
            >
              <UIcon
                name="i-lucide-instagram"
                class="w-4 h-4"
              />
            </a>
            <a
              href="#"
              aria-label="WhatsApp"
              class="w-10 h-10 rounded-full border border-white/30 flex items-center justify-center text-white/80 hover:text-white hover:border-white/60 transition-colors"
            >
              <UIcon
                name="i-lucide-message-circle"
                class="w-4 h-4"
              />
            </a>
          </div>
        </div>

        <!-- Tienda -->
        <div>
          <p class="text-[11px] tracking-[0.2em] uppercase text-white/50">
            Tienda
          </p>
          <ul class="mt-6 space-y-3.5">
            <li
              v-for="link in shopLinks"
              :key="link.to"
            >
              <NuxtLink
                :to="link.to"
                class="text-sm text-white/80 hover:text-white transition-colors"
              >
                {{ link.label }}
              </NuxtLink>
            </li>
          </ul>
        </div>

        <!-- Ayuda -->
        <div>
          <p class="text-[11px] tracking-[0.2em] uppercase text-white/50">
            Ayuda
          </p>
          <ul class="mt-6 space-y-3.5">
            <li
              v-for="link in helpLinks"
              :key="link.to"
            >
              <NuxtLink
                :to="link.to"
                class="text-sm text-white/80 hover:text-white transition-colors"
              >
                {{ link.label }}
              </NuxtLink>
            </li>
          </ul>
        </div>

        <!-- Newsletter -->
        <div>
          <p class="text-[11px] tracking-[0.2em] uppercase text-white/50">
            Recibe novedades
          </p>
          <p class="mt-6 text-sm text-white/70">
            Y un 10% en tu primer pedido.
          </p>
          <form
            class="mt-5"
            @submit.prevent="onSubscribe"
          >
            <div class="flex items-center gap-2 rounded-full border border-white/30 p-1.5 pl-5">
              <input
                v-model="email"
                type="email"
                required
                placeholder="Tu correo"
                class="flex-1 min-w-0 bg-transparent text-sm text-white placeholder:text-white/50 outline-none"
              >
              <button
                type="submit"
                class="shrink-0 rounded-full bg-white px-5 py-2.5 text-[11px] tracking-[0.15em] font-medium text-primary hover:bg-white/90 transition-colors"
              >
                SUSCRIBIR
              </button>
            </div>
          </form>
        </div>
      </div>

      <!-- Línea inferior -->
      <div class="mt-14 pt-6 border-t border-white/15 flex flex-col md:flex-row items-center justify-between gap-3 text-xs text-white/50">
        <p>© {{ year }} La Bendita Lencería · Tlaxcala, México</p>
        <p>Hecho a mano, con amor y responsabilidad</p>
      </div>
    </div>
  </footer>
</template>
