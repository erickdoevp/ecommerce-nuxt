<script setup lang="ts">
import { useClientAuthStore } from '~/features/auth/store/client-auth'
import { useProductReviews } from '../composables/useProductReviews'
import { useProductReviewStats } from '../composables/useProductReviewStats'

const props = defineProps<{ productId: string }>()

const { stats } = useProductReviewStats(props.productId)
const { reviews, pending, loadingMore, hasMore, loadMore } = useProductReviews(props.productId)

const auth = useClientAuthStore()

const reviewCount = computed(() => stats.value?.reviewCount ?? 0)

// Barras del histograma 5★ → 1★ a partir de ratingDistribution.
const distribution = computed(() =>
  [5, 4, 3, 2, 1].map((star) => {
    const count = stats.value?.ratingDistribution?.[star] ?? 0
    return {
      star,
      count,
      percent: reviewCount.value ? Math.round((count / reviewCount.value) * 100) : 0
    }
  })
)

// "% la recomienda" = reseñas de 4★ y 5★ sobre el total aprobado.
const recommendPercent = computed(() => {
  if (!reviewCount.value) return 0
  const positive = (stats.value?.ratingDistribution?.[5] ?? 0) + (stats.value?.ratingDistribution?.[4] ?? 0)
  return Math.round((positive / reviewCount.value) * 100)
})

const avatarPalette = ['bg-wine-500', 'bg-terracotta-500', 'bg-bronze-500', 'bg-forest-500', 'bg-sand-500']
const avatarColor = (name: string) => {
  const sum = [...name].reduce((acc, ch) => acc + ch.charCodeAt(0), 0)
  return avatarPalette[sum % avatarPalette.length]
}

const timeAgo = (iso: string) => {
  const diff = Date.now() - new Date(iso).getTime()
  const day = 86_400_000
  const days = Math.floor(diff / day)
  if (days < 1) return 'Hoy'
  if (days < 7) return `Hace ${days} día${days === 1 ? '' : 's'}`
  if (days < 30) {
    const weeks = Math.floor(days / 7)
    return `Hace ${weeks} semana${weeks === 1 ? '' : 's'}`
  }
  if (days < 365) {
    const months = Math.floor(days / 30)
    return `Hace ${months} mes${months === 1 ? '' : 'es'}`
  }
  const years = Math.floor(days / 365)
  return `Hace ${years} año${years === 1 ? '' : 's'}`
}

const writeReview = () => {
  if (!auth.isAuthenticated) {
    navigateTo('/sign-in')
    return
  }
  // El formulario de envío (POST /reviews/product/{id}) se conecta aquí cuando exista.
}
</script>

<template>
  <section class="px-6 py-20 lg:px-10">
    <div class="mx-auto max-w-(--ui-container)">
      <!-- Encabezado -->
      <div class="text-center">
        <p class="text-[11px] tracking-[0.3em] uppercase text-dimmed">
          Lo que dicen de esta pieza
        </p>
        <h2 class="mt-3 font-serif text-5xl font-medium text-highlighted">
          Reseñas
        </h2>
      </div>

      <div class="mt-12 grid gap-10 lg:grid-cols-[320px_1fr] lg:gap-14">
        <!-- Resumen -->
        <aside class="lg:sticky lg:top-24 lg:self-start">
          <div class="rounded-3xl border border-default p-8 text-center">
            <p class="font-serif text-6xl text-highlighted">
              {{ stats?.averageRating ?? '—' }}
            </p>
            <p class="mt-2 text-sm text-muted">
              Basado en {{ reviewCount }} reseñas
            </p>

            <!-- Histograma -->
            <div class="mt-6 space-y-2">
              <div
                v-for="row in distribution"
                :key="row.star"
                class="flex items-center gap-3"
              >
                <span class="flex w-7 shrink-0 items-center gap-0.5 text-xs text-toned">
                  {{ row.star }}<UIcon
                    name="i-lucide-star"
                    class="size-3 text-bronze-400"
                  />
                </span>
                <span class="h-1.5 flex-1 overflow-hidden rounded-full bg-elevated">
                  <span
                    class="block h-full rounded-full bg-wine-500"
                    :style="{ width: `${row.percent}%` }"
                  />
                </span>
                <span class="w-6 shrink-0 text-right text-xs text-dimmed">{{ row.count }}</span>
              </div>
            </div>

            <div
              v-if="reviewCount"
              class="mt-6 border-t border-default pt-6 text-left"
            >
              <p class="text-sm text-highlighted">
                <span class="font-serif text-lg">{{ recommendPercent }}%</span> la recomienda
              </p>
            </div>

            <UButton
              label="Escribir reseña"
              color="primary"
              variant="outline"
              block
              class="mt-6 justify-center rounded-full"
              :ui="{ label: 'uppercase tracking-[0.15em] text-[11px]' }"
              @click="writeReview"
            />
          </div>
        </aside>

        <!-- Lista -->
        <div>
          <!-- Cargando inicial -->
          <div
            v-if="pending && !reviews.length"
            class="space-y-4"
          >
            <div
              v-for="i in 3"
              :key="i"
              class="h-40 animate-pulse rounded-3xl bg-elevated"
            />
          </div>

          <!-- Sin reseñas -->
          <div
            v-else-if="!reviews.length"
            class="rounded-3xl border border-default p-12 text-center text-muted"
          >
            Esta pieza aún no tiene reseñas. Sé la primera en compartir tu experiencia.
          </div>

          <template v-else>
            <article
              v-for="review in reviews"
              :key="review.id"
              class="mb-4 rounded-3xl border border-default p-7"
            >
              <!-- Cabecera de la reseña -->
              <header class="flex items-start gap-3">
                <span
                  class="flex size-9 shrink-0 items-center justify-center rounded-full text-sm font-medium text-white"
                  :class="avatarColor(review.username)"
                >
                  {{ review.username.charAt(0).toUpperCase() }}
                </span>
                <div>
                  <div class="flex flex-wrap items-center gap-x-3 gap-y-1">
                    <span class="text-sm font-medium text-highlighted">{{ review.username }}</span>
                    <span
                      v-if="review.verifiedPurchase"
                      class="flex items-center gap-1 text-[11px] text-forest-500"
                    >
                      <UIcon
                        name="i-lucide-check"
                        class="size-3.5"
                      />
                      Compra verificada
                    </span>
                  </div>
                  <p class="mt-0.5 text-xs text-dimmed">
                    {{ timeAgo(review.createdAt) }}
                  </p>
                </div>
              </header>

              <!-- Estrellas -->
              <div class="mt-4 flex gap-0.5">
                <UIcon
                  v-for="n in 5"
                  :key="n"
                  name="i-lucide-star"
                  class="size-4"
                  :class="n <= review.rating ? 'text-bronze-400' : 'text-elevated'"
                />
              </div>

              <h3 class="mt-3 font-serif text-lg text-highlighted">
                {{ review.title }}
              </h3>
              <p class="mt-2 leading-relaxed text-toned">
                {{ review.body }}
              </p>
            </article>

            <!-- Ver más -->
            <UButton
              v-if="hasMore"
              label="Ver más reseñas"
              color="neutral"
              variant="outline"
              block
              size="lg"
              :loading="loadingMore"
              class="mt-4 justify-center rounded-full"
              :ui="{ label: 'uppercase tracking-[0.15em] text-[11px]' }"
              @click="loadMore"
            />
          </template>
        </div>
      </div>
    </div>
  </section>
</template>
