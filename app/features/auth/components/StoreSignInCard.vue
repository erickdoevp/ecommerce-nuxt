<script setup lang="ts">
defineProps<{
  loading?: boolean
}>()

const emit = defineEmits<{
  submit: [payload: { usernameOrEmail: string, password: string, remember: boolean, turnstileToken: string }]
  google: []
  guest: []
}>()

const usernameOrEmail = ref('')
const password = ref('')
const remember = ref(false)
const showPassword = ref(false)
const turnstileToken = ref('')
const turnstileRef = useTemplateRef('turnstileRef')

function onSubmit() {
  if (!turnstileToken.value) return
  emit('submit', {
    usernameOrEmail: usernameOrEmail.value,
    password: password.value,
    remember: remember.value,
    turnstileToken: turnstileToken.value
  })
}

function resetTurnstile() {
  turnstileToken.value = ''
  turnstileRef.value?.reset()
}

defineExpose({ resetTurnstile })
</script>

<template>
  <div>
    <!-- Marca -->
    <div class="mt-12 text-center">
      <p class="font-serif text-3xl tracking-[0.25em] text-highlighted">
        LA BENDITA
      </p>
      <p class="mt-1 text-[10px] tracking-[0.35em] text-dimmed">
        LENCERÍA
      </p>
    </div>

    <!-- Encabezado -->
    <div class="mt-8 text-center">
      <h1 class="font-serif text-4xl text-highlighted">
        Bienvenida de nuevo
      </h1>
      <p class="mt-3 text-sm text-muted">
        Entra para ver tus pedidos, favoritos y direcciones.
      </p>
    </div>

    <!-- Formulario -->
    <form
      class="mt-10 space-y-5"
      @submit.prevent="onSubmit"
    >
      <div>
        <label class="block text-[11px] tracking-widest text-muted mb-2">
          CORREO O USUARIO
        </label>
        <UInput
          v-model="usernameOrEmail"
          type="text"
          required
          placeholder="hola@labendita.mx"
          autocomplete="username"
          size="xl"
          class="w-full"
        />
      </div>

      <div>
        <div class="flex items-center justify-between mb-2">
          <label class="block text-[11px] tracking-widest text-muted">
            CONTRASEÑA
          </label>
          <button
            type="button"
            class="text-[11px] tracking-widest text-dimmed hover:text-muted transition-colors"
            @click="showPassword = !showPassword"
          >
            {{ showPassword ? 'OCULTAR' : 'MOSTRAR' }}
          </button>
        </div>
        <UInput
          v-model="password"
          :type="showPassword ? 'text' : 'password'"
          required
          placeholder="••••••••"
          autocomplete="current-password"
          size="xl"
          class="w-full"
        />
      </div>

      <div class="flex items-center justify-between">
        <UCheckbox
          v-model="remember"
          label="Recordarme"
          :ui="{ label: 'text-sm text-muted' }"
        />
        <NuxtLink
          to="/forgot-password"
          class="text-sm text-primary hover:underline"
        >
          ¿Olvidaste tu contraseña?
        </NuxtLink>
      </div>

      <div class="flex justify-center">
        <NuxtTurnstile
          ref="turnstileRef"
          v-model="turnstileToken"
          :options="{ theme: 'light', language: 'es' }"
        />
      </div>

      <UButton
        type="submit"
        block
        size="xl"
        :loading="loading"
        :disabled="!turnstileToken"
        class="tracking-widest justify-center"
      >
        INICIAR SESIÓN
      </UButton>
    </form>

    <!-- Separador -->
    <div class="my-8 flex items-center gap-4">
      <div class="h-px flex-1 bg-border" />
      <span class="text-[11px] tracking-widest text-dimmed">
        O CONTINÚA CON
      </span>
      <div class="h-px flex-1 bg-border" />
    </div>

    <!-- Google -->
    <UButton
      block
      size="xl"
      color="neutral"
      variant="outline"
      class="bg-default justify-center"
      @click="emit('google')"
    >
      <template #leading>
        <svg
          class="w-5 h-5"
          viewBox="0 0 48 48"
        >
          <path
            fill="#FFC107"
            d="M43.611 20.083H42V20H24v8h11.303c-1.649 4.657-6.08 8-11.303 8-6.627 0-12-5.373-12-12s5.373-12 12-12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4 12.955 4 4 12.955 4 24s8.955 20 20 20 20-8.955 20-20c0-1.341-.138-2.65-.389-3.917z"
          />
          <path
            fill="#FF3D00"
            d="m6.306 14.691 6.571 4.819C14.655 15.108 18.961 12 24 12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4 16.318 4 9.656 8.337 6.306 14.691z"
          />
          <path
            fill="#4CAF50"
            d="M24 44c5.166 0 9.86-1.977 13.409-5.192l-6.19-5.238A11.91 11.91 0 0 1 24 36c-5.202 0-9.619-3.317-11.283-7.946l-6.522 5.025C9.505 39.556 16.227 44 24 44z"
          />
          <path
            fill="#1976D2"
            d="M43.611 20.083H42V20H24v8h11.303a12.04 12.04 0 0 1-4.087 5.571l.003-.002 6.19 5.238C36.971 39.205 44 34 44 24c0-1.341-.138-2.65-.389-3.917z"
          />
        </svg>
      </template>
      Iniciar sesión con Google
    </UButton>

    <!-- Continuar como invitada -->
    <button
      type="button"
      class="mt-6 w-full text-center text-[11px] tracking-widest text-dimmed hover:text-muted transition-colors"
      @click="emit('guest')"
    >
      CONTINUAR COMO INVITADA
    </button>

    <!-- Crear cuenta -->
    <p class="mt-6 text-center text-sm text-muted">
      ¿Aún no tienes cuenta?
      <NuxtLink
        to="/sign-up"
        class="text-primary font-medium hover:underline"
      >
        Crea una
      </NuxtLink>
    </p>
  </div>
</template>
