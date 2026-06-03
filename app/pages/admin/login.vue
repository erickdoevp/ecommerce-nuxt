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
const showPassword = ref(false)

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

const features = [
  {
    icon: 'i-lucide-tag',
    title: 'Gestiona productos',
    description: 'Agrega, edita y organiza tus productos.'
  },
  {
    icon: 'i-lucide-shopping-cart',
    title: 'Procesa pedidos',
    description: 'Gestiona pedidos y envíos fácilmente.'
  },
  {
    icon: 'i-lucide-bar-chart-2',
    title: 'Visualiza estadísticas',
    description: 'Obtén reportes y métricas de tu negocio.'
  }
]
</script>

<template>
  <div class="min-h-screen flex">
    <!-- Left panel -->
    <div class="hidden lg:flex lg:w-[45%] bg-[#1a2a1a] flex-col justify-between p-12 relative overflow-hidden">
      <!-- Background decorative circle -->
      <div class="absolute -top-20 -right-20 w-96 h-96 rounded-full bg-white/5" />
      <div class="absolute top-32 -right-10 w-64 h-64 rounded-full bg-white/5" />

      <!-- Brand -->
      <div class="relative z-10">
        <p class="text-white text-xl font-bold tracking-widest">
          My ecommerce
        </p>
      </div>

      <!-- Hero text -->
      <div class="relative z-10 space-y-8">
        <div>
          <h1 class="text-white text-4xl font-bold leading-tight">
            Gestiona tu tienda<br>desde un solo lugar
          </h1>
          <p class="text-white/60 mt-4 text-base leading-relaxed max-w-xs">
            Inicia sesión para acceder al panel de administración y gestionar tu tienda, productos, pedidos y mucho más.
          </p>
        </div>

        <div class="space-y-4">
          <div
            v-for="feature in features"
            :key="feature.title"
            class="flex items-start gap-4"
          >
            <div class="w-10 h-10 rounded-lg bg-white/10 flex items-center justify-center shrink-0">
              <UIcon
                :name="feature.icon"
                class="w-5 h-5 text-white"
              />
            </div>
            <div>
              <p class="text-white font-semibold text-sm">
                {{ feature.title }}
              </p>
              <p class="text-white/50 text-sm mt-0.5">
                {{ feature.description }}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div class="relative z-10" />
    </div>

    <!-- Right panel -->
    <div class="flex-1 bg-[#f4f4f4] flex items-center justify-center p-8">
      <div class="w-full max-w-md">
        <div class="bg-white rounded-2xl p-10 shadow-sm border border-gray-100">
          <!-- Header -->
          <div class="mb-8">
            <h2 class="text-2xl font-bold text-gray-900">
              Iniciar sesión
            </h2>
            <p class="text-gray-500 mt-1 text-sm">
              Bienvenido de nuevo. Por favor, ingresa tus credenciales.
            </p>
          </div>

          <UAlert
            v-if="errorMessage"
            color="error"
            variant="subtle"
            icon="i-lucide-circle-alert"
            :description="errorMessage"
            class="mb-5"
          />

          <UForm
            :schema="loginSchema"
            :state="form"
            class="space-y-5"
            @submit="onSubmit"
          >
            <UFormField
              label="Correo electrónico"
              name="username"
            >
              <UInput
                v-model="form.username"
                placeholder="ejemplo@tienda.com"
                autocomplete="username"
                icon="i-lucide-mail"
                size="lg"
                class="w-full"
              />
            </UFormField>

            <UFormField
              label="Contraseña"
              name="password"
            >
              <template #hint>
                <button
                  type="button"
                  class="text-xs text-emerald-700 hover:text-emerald-800 font-medium"
                >
                  ¿Olvidaste tu contraseña?
                </button>
              </template>
              <UInput
                v-model="form.password"
                :type="showPassword ? 'text' : 'password'"
                placeholder="Ingresa tu contraseña"
                autocomplete="current-password"
                icon="i-lucide-lock"
                size="lg"
                class="w-full"
                :trailing-icon="showPassword ? 'i-lucide-eye-off' : 'i-lucide-eye'"
                @click:trailing="showPassword = !showPassword"
              />
            </UFormField>

            <UButton
              type="submit"
              :loading="loading"
              block
              size="lg"
              class="bg-emerald-700 hover:bg-emerald-800 text-white mt-2"
            >
              Iniciar sesión
            </UButton>
          </UForm>

          <p class="text-center text-sm text-gray-500 mt-6">
            ¿No tienes una cuenta?
            <span class="text-emerald-700 font-medium cursor-pointer hover:text-emerald-800">
              Contacta al administrador
            </span>
          </p>
        </div>
      </div>
    </div>
  </div>
</template>
