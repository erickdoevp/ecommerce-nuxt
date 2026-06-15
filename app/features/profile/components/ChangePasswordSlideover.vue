<script setup lang="ts">
import { useClientProfile } from '~/features/profile/composables/useClientProfile'
import { useClientAuthStore } from '~/features/auth/store/client-auth'

const open = defineModel<boolean>('open', { default: false })

const { changePassword, isChangingPassword } = useClientProfile()
const clientAuth = useClientAuthStore()

// Modal de éxito bloqueante: solo se cierra al pulsar "Aceptar", que redirige.
const successOpen = ref(false)

const form = reactive({
  currentPassword: '',
  newPassword: '',
  confirmPassword: ''
})

const showCurrent = ref(false)
const showNew = ref(false)

// Reglas de complejidad (validación de cliente; el backend solo exige ≥6).
const rules = computed(() => [
  { label: 'Mínimo 12 caracteres', ok: form.newPassword.length >= 12 },
  { label: 'Una letra mayúscula (A–Z)', ok: /[A-Z]/.test(form.newPassword) },
  { label: 'Una letra minúscula (a–z)', ok: /[a-z]/.test(form.newPassword) },
  { label: 'Un número (0–9)', ok: /\d/.test(form.newPassword) },
  { label: 'Un carácter especial (!@#$…)', ok: /[^A-Za-z0-9\s]/.test(form.newPassword) }
])

const score = computed(() => rules.value.filter(r => r.ok).length)

const strengthLabel = computed(() => {
  if (!form.newPassword) return '—'
  if (score.value <= 2) return 'Débil'
  if (score.value <= 4) return 'Media'
  return 'Fuerte'
})

const confirmMismatch = computed(() =>
  form.confirmPassword !== '' && form.newPassword !== form.confirmPassword
)

const canSubmit = computed(() =>
  form.currentPassword !== ''
  && score.value === rules.value.length
  && form.newPassword === form.confirmPassword
)

function reset() {
  form.currentPassword = ''
  form.newPassword = ''
  form.confirmPassword = ''
  showCurrent.value = false
  showNew.value = false
}

watch(open, (isOpen) => {
  if (isOpen) reset()
})

async function onSubmit() {
  if (!canSubmit.value) return
  const ok = await changePassword({
    currentPassword: form.currentPassword,
    newPassword: form.newPassword
  })
  if (ok) {
    open.value = false
    successOpen.value = true
  }
}

// Aceptar: cierra sesión (revoca + limpia) y redirige a /sign-in.
function onAccept() {
  clientAuth.logout()
}
</script>

<template>
  <USlideover
    v-model:open="open"
    :ui="{ content: 'max-w-lg' }"
  >
    <template #header>
      <div class="flex items-start justify-between gap-4 w-full">
        <div>
          <p class="text-[11px] tracking-[0.2em] uppercase text-muted">
            Seguridad
          </p>
          <h2 class="mt-1 font-serif text-2xl text-highlighted">
            Cambiar contraseña
          </h2>
        </div>
        <UButton
          icon="i-lucide-x"
          color="neutral"
          variant="ghost"
          class="rounded-full shrink-0"
          @click="open = false"
        />
      </div>
    </template>

    <template #body>
      <div class="space-y-6">
        <!-- Contraseña actual -->
        <div>
          <label class="block text-[11px] tracking-widest uppercase text-muted mb-2">
            Contraseña actual
          </label>
          <UInput
            v-model="form.currentPassword"
            :type="showCurrent ? 'text' : 'password'"
            size="xl"
            autocomplete="current-password"
            class="w-full"
          >
            <template #trailing>
              <button
                type="button"
                class="text-[11px] tracking-widest uppercase text-muted hover:text-highlighted transition-colors"
                @click="showCurrent = !showCurrent"
              >
                {{ showCurrent ? 'Ocultar' : 'Mostrar' }}
              </button>
            </template>
          </UInput>
        </div>

        <div class="border-t border-default" />

        <!-- Nueva contraseña -->
        <div>
          <label class="block text-[11px] tracking-widest uppercase text-muted mb-2">
            Nueva contraseña
          </label>
          <UInput
            v-model="form.newPassword"
            :type="showNew ? 'text' : 'password'"
            size="xl"
            autocomplete="new-password"
            class="w-full"
          >
            <template #trailing>
              <button
                type="button"
                class="text-[11px] tracking-widest uppercase text-muted hover:text-highlighted transition-colors"
                @click="showNew = !showNew"
              >
                {{ showNew ? 'Ocultar' : 'Mostrar' }}
              </button>
            </template>
          </UInput>
        </div>

        <!-- Confirmar nueva contraseña -->
        <div>
          <label class="block text-[11px] tracking-widest uppercase text-muted mb-2">
            Confirmar nueva contraseña
          </label>
          <UInput
            v-model="form.confirmPassword"
            type="password"
            size="xl"
            autocomplete="new-password"
            class="w-full"
          />
          <p
            v-if="confirmMismatch"
            class="mt-1.5 text-xs text-error"
          >
            Las contraseñas no coinciden.
          </p>
        </div>

        <!-- Fortaleza y requisitos -->
        <div class="rounded-xl border border-default bg-muted p-5 space-y-4">
          <div class="flex items-center gap-3">
            <div class="flex-1 flex gap-1.5">
              <span
                v-for="i in rules.length"
                :key="i"
                class="h-1 flex-1 rounded-full transition-colors"
                :class="i <= score ? 'bg-primary' : 'bg-accented'"
              />
            </div>
            <span class="text-[11px] tracking-widest uppercase text-muted w-12 text-right">
              {{ strengthLabel }}
            </span>
          </div>

          <ul class="space-y-2">
            <li
              v-for="rule in rules"
              :key="rule.label"
              class="flex items-center gap-2.5 text-sm"
            >
              <span
                class="w-5 h-5 rounded-full flex items-center justify-center shrink-0"
                :class="rule.ok ? 'bg-primary text-inverted' : 'bg-accented text-muted'"
              >
                <UIcon
                  :name="rule.ok ? 'i-lucide-check' : 'i-lucide-dot'"
                  class="w-3.5 h-3.5"
                />
              </span>
              <span :class="rule.ok ? 'text-highlighted' : 'text-muted'">
                {{ rule.label }}
              </span>
            </li>
          </ul>
        </div>
      </div>
    </template>

    <template #footer>
      <div class="w-full space-y-4">
        <p class="flex items-start gap-2 text-xs text-muted">
          <UIcon
            name="i-lucide-info"
            class="w-4 h-4 shrink-0 mt-px"
          />
          <span>
            Por seguridad, al cambiar tu contraseña se cerrará tu sesión y
            deberás iniciar sesión de nuevo.
          </span>
        </p>
        <UButton
          block
          size="lg"
          :loading="isChangingPassword"
          :disabled="!canSubmit"
          class="rounded-full tracking-widest"
          @click="onSubmit"
        >
          Actualizar contraseña
        </UButton>
      </div>
    </template>
  </USlideover>

  <!-- Confirmación bloqueante: no se cierra hasta pulsar Aceptar -->
  <UModal
    v-model:open="successOpen"
    title="Contraseña actualizada"
    :dismissible="false"
    :close="false"
    :ui="{ footer: 'justify-end' }"
  >
    <template #body>
      <div class="flex items-start gap-3">
        <UIcon
          name="i-lucide-circle-check"
          class="w-6 h-6 text-primary shrink-0"
        />
        <p class="text-sm text-muted">
          Tu contraseña se cambió correctamente. Por seguridad, se cerró tu
          sesión y debes iniciar sesión de nuevo.
        </p>
      </div>
    </template>

    <template #footer>
      <UButton
        class="rounded-full tracking-widest px-8"
        @click="onAccept"
      >
        Aceptar
      </UButton>
    </template>
  </UModal>
</template>
