<script setup lang="ts">
defineProps<{
  loading?: boolean
}>()

const emit = defineEmits<{
  submit: [payload: { firstName: string, paternalLastName: string, maternalLastName: string, username: string, phoneNumber: string, email: string, password: string, acceptedPrivacyPolicy: boolean, turnstileToken: string }]
  google: []
  guest: []
}>()

const firstName = ref('')
const paternalLastName = ref('')
const maternalLastName = ref('')
const username = ref('')
const phoneNumber = ref('')
const email = ref('')
const password = ref('')
const confirmPassword = ref('')
const acceptTerms = ref(false)
const showPassword = ref(false)
const turnstileToken = ref('')
const turnstileRef = useTemplateRef('turnstileRef')

const rules = computed(() => [
  { label: 'Mínimo 12 caracteres', met: password.value.length >= 12 },
  { label: 'Una letra mayúscula (A–Z)', met: /[A-Z]/.test(password.value) },
  { label: 'Una letra minúscula (a–z)', met: /[a-z]/.test(password.value) },
  { label: 'Un número (0–9)', met: /[0-9]/.test(password.value) },
  { label: 'Un carácter especial (!#$…)', met: /[^A-Za-z0-9]/.test(password.value) }
])

const allRulesMet = computed(() => rules.value.every(r => r.met))
const passwordsMatch = computed(() => password.value !== '' && password.value === confirmPassword.value)
const isValid = computed(() =>
  firstName.value.trim() !== ''
  && paternalLastName.value.trim() !== ''
  && maternalLastName.value.trim() !== ''
  && username.value.trim() !== ''
  && email.value.trim() !== ''
  && allRulesMet.value
  && passwordsMatch.value
  && acceptTerms.value
  && turnstileToken.value !== ''
)

function onSubmit() {
  if (!isValid.value) return
  emit('submit', {
    firstName: firstName.value,
    paternalLastName: paternalLastName.value,
    maternalLastName: maternalLastName.value,
    username: username.value,
    phoneNumber: phoneNumber.value,
    email: email.value,
    password: password.value,
    acceptedPrivacyPolicy: acceptTerms.value,
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
        Crea tu cuenta
      </h1>
      <p class="mt-3 text-sm text-muted">
        Únete y recibe 10% en tu primer pedido con el código
        <span class="font-medium text-toned">BENDITA10</span>.
      </p>
    </div>

    <!-- Formulario -->
    <form
      class="mt-10 space-y-5"
      @submit.prevent="onSubmit"
    >
      <div>
        <label class="block text-[11px] tracking-widest text-muted mb-2">
          NOMBRE
        </label>
        <UInput
          v-model="firstName"
          type="text"
          required
          placeholder="Valentina"
          autocomplete="given-name"
          size="xl"
          class="w-full"
        />
      </div>

      <div class="grid grid-cols-2 gap-4">
        <div>
          <label class="block text-[11px] tracking-widest text-muted mb-2">
            APELLIDO PATERNO
          </label>
          <UInput
            v-model="paternalLastName"
            type="text"
            required
            placeholder="Ríos"
            autocomplete="family-name"
            size="xl"
            class="w-full"
          />
        </div>

        <div>
          <label class="block text-[11px] tracking-widest text-muted mb-2">
            APELLIDO MATERNO
          </label>
          <UInput
            v-model="maternalLastName"
            type="text"
            required
            placeholder="Cruz"
            autocomplete="additional-name"
            size="xl"
            class="w-full"
          />
        </div>
      </div>

      <div>
        <label class="block text-[11px] tracking-widest text-muted mb-2">
          USUARIO
        </label>
        <UInput
          v-model="username"
          type="text"
          required
          placeholder="valentina.rios"
          autocomplete="username"
          size="xl"
          class="w-full"
        />
      </div>

      <div>
        <label class="block text-[11px] tracking-widest text-muted mb-2">
          CORREO ELECTRÓNICO
        </label>
        <UInput
          v-model="email"
          type="email"
          required
          placeholder="hola@labendita.mx"
          autocomplete="email"
          size="xl"
          class="w-full"
        />
      </div>

      <div>
        <label class="block text-[11px] tracking-widest text-muted mb-2">
          TELÉFONO <span class="text-dimmed">(OPCIONAL)</span>
        </label>
        <UInput
          v-model="phoneNumber"
          type="tel"
          placeholder="55 1234 5678"
          autocomplete="tel"
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
          autocomplete="new-password"
          size="xl"
          class="w-full"
        />
      </div>

      <div>
        <label class="block text-[11px] tracking-widest text-muted mb-2">
          CONFIRMAR CONTRASEÑA
        </label>
        <UInput
          v-model="confirmPassword"
          type="password"
          required
          placeholder="••••••••"
          autocomplete="new-password"
          size="xl"
          class="w-full"
        />
        <p
          v-if="confirmPassword !== '' && !passwordsMatch"
          class="mt-1.5 text-xs text-error"
        >
          Las contraseñas no coinciden.
        </p>
      </div>

      <!-- Reglas de contraseña -->
      <div class="rounded-lg border border-default bg-elevated/60 p-4 space-y-2">
        <div
          v-for="rule in rules"
          :key="rule.label"
          class="flex items-center gap-2 text-sm"
        >
          <UIcon
            :name="rule.met ? 'i-lucide-circle-check' : 'i-lucide-circle'"
            class="w-4 h-4 shrink-0"
            :class="rule.met ? 'text-success' : 'text-dimmed'"
          />
          <span :class="rule.met ? 'text-toned' : 'text-muted'">
            {{ rule.label }}
          </span>
        </div>
      </div>

      <!-- Términos -->
      <UCheckbox
        v-model="acceptTerms"
        :ui="{ label: 'text-sm text-muted' }"
      >
        <template #label>
          Acepto los
          <NuxtLink
            to="/terminos"
            class="text-primary hover:underline"
          >
            Términos
          </NuxtLink>
          y el
          <NuxtLink
            to="/aviso-de-privacidad"
            class="text-primary hover:underline"
          >
            aviso de privacidad
          </NuxtLink>
        </template>
      </UCheckbox>

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
        :disabled="!isValid"
        class="tracking-widest justify-center"
      >
        CREAR CUENTA
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

    <!-- Iniciar sesión -->
    <p class="mt-6 text-center text-sm text-muted">
      ¿Ya eres parte?
      <NuxtLink
        to="/sign-in"
        class="text-primary font-medium hover:underline"
      >
        Inicia sesión
      </NuxtLink>
    </p>
  </div>
</template>
