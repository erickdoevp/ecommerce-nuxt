<script setup lang="ts">
import StoreSignInCard from '~/features/auth/components/StoreSignInCard.vue'

definePageMeta({
  layout: 'auth'
})

function onSubmit(payload: { email: string, password: string, remember: boolean, turnstileToken: string }) {
  // TODO: conectar con el login de usuario
  console.log(payload)
}
</script>

<template>
  <StoreSignInCard
    @submit="onSubmit"
  />
</template>
