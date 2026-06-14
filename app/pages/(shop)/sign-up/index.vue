<script setup lang="ts">
import StoreSignUpCard from '~/features/auth/components/StoreSignUpCard.vue'
import { useClientSignUp } from '~/features/auth/composables/useClientSignUp'
import { useClientAuthStore } from '~/features/auth/store/client-auth'
import type { SignUpRequest } from '~/features/auth/types/auth'

definePageMeta({
  layout: 'auth'
})

const { signUp, isLoading, data } = useClientSignUp()
const clientAuth = useClientAuthStore()
const toast = useToast()
const cardRef = useTemplateRef('cardRef')

async function onSubmit(payload: { firstName: string, paternalLastName: string, maternalLastName: string, username: string, phoneNumber: string, email: string, password: string, acceptedPrivacyPolicy: boolean, turnstileToken: string }) {
  const request: SignUpRequest = {
    username: payload.username,
    email: payload.email,
    password: payload.password,
    name: payload.firstName,
    firstLastName: payload.paternalLastName,
    secondLastName: payload.maternalLastName,
    phoneNumber: payload.phoneNumber,
    acceptedPrivacyPolicy: payload.acceptedPrivacyPolicy,
    turnstileToken: payload.turnstileToken
  }

  await signUp(request)

  if (data.value) {
    clientAuth.setToken(data.value.accessToken)
    toast.add({ title: 'Cuenta creada', color: 'success', icon: 'i-lucide-check-circle' })
    navigateTo('/')
  } else {
    cardRef.value?.resetTurnstile()
  }
}
</script>

<template>
  <StoreSignUpCard
    ref="cardRef"
    :loading="isLoading"
    @submit="onSubmit"
  />
</template>
