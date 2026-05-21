<script setup lang="ts">
import { z } from 'zod'
import type { FormSubmitEvent } from '@nuxt/ui'
import { useAuthStore } from '~/features/auth/store/auth'

definePageMeta({ layout: false })

const authStore = useAuthStore()

const loginSchema = z.object({
  username: z.string().min(1, 'El usuario es requerido'),
  password: z.string().min(1, 'La contraseña es requerida')
})

type LoginForm = z.infer<typeof loginSchema>

const form = reactive<LoginForm>({ username: '', password: '' })
const loading = ref(false)
const errorMessage = ref('')

async function onSubmit(event: FormSubmitEvent<LoginForm>) {
  loading.value = true
  errorMessage.value = ''
  try {
    await authStore.login(event.data)
    await navigateTo('/admin/product')
  } catch {
    errorMessage.value = 'Credenciales incorrectas. Verifica tu usuario y contraseña.'
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="min-h-screen bg-gray-50 flex items-center justify-center p-4">
    <div class="w-full max-w-sm">
      <!-- Logo / Brand -->
      <div class="text-center mb-8">
        <p class="text-2xl font-bold tracking-widest text-gray-900">
          My Ecommerce
        </p>
        <p class="text-sm text-gray-500 mt-1">
          Panel de administración
        </p>
      </div>

      <!-- Card -->
      <div class="bg-white border border-[#ececed] rounded-2xl p-8 space-y-5">
        <div>
          <h1 class="text-lg font-semibold text-gray-900">
            Iniciar sesión
          </h1>
          <p class="text-sm text-gray-500 mt-0.5">
            Ingresa tus credenciales para continuar.
          </p>
        </div>

        <UAlert
          v-if="errorMessage"
          color="error"
          variant="subtle"
          icon="i-lucide-circle-alert"
          :description="errorMessage"
        />

        <UForm
          :schema="loginSchema"
          :state="form"
          class="space-y-4"
          @submit="onSubmit"
        >
          <UFormField
            label="Usuario"
            name="username"
          >
            <UInput
              v-model="form.username"
              placeholder="admin"
              autocomplete="username"
              class="w-full"
            />
          </UFormField>

          <UFormField
            label="Contraseña"
            name="password"
          >
            <UInput
              v-model="form.password"
              type="password"
              placeholder="••••••••"
              autocomplete="current-password"
              class="w-full"
            />
          </UFormField>

          <UButton
            type="submit"
            :loading="loading"
            block
            class="mt-2"
          >
            Ingresar
          </UButton>
        </UForm>
      </div>
    </div>
  </div>
</template>
