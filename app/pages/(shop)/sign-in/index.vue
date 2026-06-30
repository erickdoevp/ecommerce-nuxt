<script setup lang="ts">
import StoreSignInCard from '~/features/auth/components/StoreSignInCard.vue'
import { useClientSignIn } from '~/features/auth/composables/useClientSignIn'
import { useClientAuthStore } from '~/features/auth/store/client-auth'
import { useCart } from '~/features/cart/composables/useCart'
import type { SignInRequest } from '~/features/auth/types/auth'

definePageMeta({
  layout: 'auth'
})

const { signIn, isLoading, data } = useClientSignIn()
const clientAuth = useClientAuthStore()
const { mergeGuestCart } = useCart()
const toast = useToast()
const cardRef = useTemplateRef('cardRef')

async function onSubmit(payload: { usernameOrEmail: string, password: string, remember: boolean, turnstileToken: string }) {
  const request: SignInRequest = {
    usernameOrEmail: payload.usernameOrEmail,
    password: payload.password,
    turnstileToken: payload.turnstileToken
  }

  await signIn(request)

  if (data.value) {
    clientAuth.setSession(data.value.accessToken, data.value.refreshToken)
    // Fusiona el carrito de invitado en el del usuario (best-effort: nunca lanza).
    await mergeGuestCart()
    toast.add({ title: 'Bienvenida de nuevo', color: 'success', icon: 'i-lucide-check-circle' })
    navigateTo('/my-profile')
  } else {
    cardRef.value?.resetTurnstile()
  }
}
</script>

<template>
  <StoreSignInCard
    ref="cardRef"
    :loading="isLoading"
    @submit="onSubmit"
  />
</template>
