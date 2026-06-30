<script setup lang="ts">
import StoreHeader from '~/components/shared/StoreHeader.vue'
import StoreFooter from '~/components/shared/StoreFooter.vue'
import CartSlideover from '~/features/cart/components/CartSlideover.vue'
import { useCart } from '~/features/cart/composables/useCart'

const { fetchCart } = useCart()

// Carga el carrito al entrar a la tienda. En cliente: el invitado lee su
// guestToken de localStorage y el usuario logueado consulta /cart.
onMounted(() => {
  fetchCart()
})
</script>

<template>
  <div class="min-h-screen flex flex-col bg-default">
    <StoreHeader />
    <main class="flex-1">
      <slot />
    </main>
    <StoreFooter />
    <CartSlideover />
  </div>
</template>
