<script setup lang="ts">
import { useClientProfile } from '~/features/profile/composables/useClientProfile'

definePageMeta({
  layout: 'account'
})

const {
  profile,
  fetchProfile,
  updateProfile,
  isSaving,
  changePassword,
  isChangingPassword
} = useClientProfile()

const form = reactive({
  name: '',
  firstLastName: '',
  secondLastName: '',
  phoneNumber: ''
})

watchEffect(() => {
  if (profile.value) {
    form.name = profile.value.name
    form.firstLastName = profile.value.firstLastName
    form.secondLastName = profile.value.secondLastName
    form.phoneNumber = profile.value.phoneNumber
  }
})

onMounted(() => fetchProfile())

async function onSave() {
  await updateProfile({
    name: form.name,
    firstLastName: form.firstLastName,
    secondLastName: form.secondLastName,
    phoneNumber: form.phoneNumber
  })
}

// ─── Cambio de contraseña ────────────────────────────────────────────────
const passwordOpen = ref(false)
const passwordForm = reactive({
  currentPassword: '',
  newPassword: '',
  confirmPassword: ''
})

const passwordError = computed(() => {
  if (passwordForm.newPassword && passwordForm.newPassword.length < 6) {
    return 'La nueva contraseña debe tener al menos 6 caracteres.'
  }
  if (passwordForm.confirmPassword && passwordForm.newPassword !== passwordForm.confirmPassword) {
    return 'Las contraseñas no coinciden.'
  }
  return ''
})

const canSubmitPassword = computed(() =>
  passwordForm.currentPassword !== ''
  && passwordForm.newPassword.length >= 6
  && passwordForm.newPassword === passwordForm.confirmPassword
)

function openPassword() {
  passwordForm.currentPassword = ''
  passwordForm.newPassword = ''
  passwordForm.confirmPassword = ''
  passwordOpen.value = true
}

async function onChangePassword() {
  if (!canSubmitPassword.value) return
  const ok = await changePassword({
    currentPassword: passwordForm.currentPassword,
    newPassword: passwordForm.newPassword
  })
  if (ok) passwordOpen.value = false
}
</script>

<template>
  <div>
    <h2 class="font-serif text-3xl text-highlighted">
      Mis datos
    </h2>

    <!-- Información personal -->
    <div class="mt-6 rounded-xl border border-default bg-muted p-8">
      <h3 class="font-serif text-xl text-highlighted">
        Información personal
      </h3>

      <form
        class="mt-6 space-y-5"
        @submit.prevent="onSave"
      >
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <div>
            <label class="block text-[11px] tracking-widest text-muted mb-2">
              NOMBRE
            </label>
            <UInput
              v-model="form.name"
              type="text"
              size="xl"
              class="w-full"
            />
          </div>
          <div>
            <label class="block text-[11px] tracking-widest text-muted mb-2">
              APELLIDO PATERNO
            </label>
            <UInput
              v-model="form.firstLastName"
              type="text"
              size="xl"
              class="w-full"
            />
          </div>
          <div>
            <label class="block text-[11px] tracking-widest text-muted mb-2">
              APELLIDO MATERNO
            </label>
            <UInput
              v-model="form.secondLastName"
              type="text"
              size="xl"
              class="w-full"
            />
          </div>
          <div>
            <label class="block text-[11px] tracking-widest text-muted mb-2">
              TELÉFONO
            </label>
            <UInput
              v-model="form.phoneNumber"
              type="tel"
              size="xl"
              class="w-full"
            />
          </div>
        </div>

        <div>
          <label class="block text-[11px] tracking-widest text-muted mb-2">
            CORREO ELECTRÓNICO
          </label>
          <UInput
            :model-value="profile?.email ?? ''"
            type="email"
            disabled
            size="xl"
            class="w-full"
          />
          <p class="mt-1.5 text-xs text-dimmed">
            El correo no se puede modificar.
          </p>
        </div>

        <UButton
          type="submit"
          size="lg"
          :loading="isSaving"
          class="rounded-full tracking-widest px-8"
        >
          GUARDAR CAMBIOS
        </UButton>
      </form>
    </div>

    <!-- Contraseña -->
    <div class="mt-6 rounded-xl border border-default bg-muted p-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div>
        <h3 class="font-serif text-xl text-highlighted">
          Contraseña
        </h3>
        <p class="mt-1 text-sm text-muted">
          Mantén tu cuenta segura con una contraseña actualizada.
        </p>
      </div>
      <UButton
        color="neutral"
        variant="outline"
        size="lg"
        class="rounded-full tracking-widest shrink-0"
        @click="openPassword"
      >
        CAMBIAR CONTRASEÑA
      </UButton>
    </div>

    <!-- Modal cambiar contraseña -->
    <UModal
      v-model:open="passwordOpen"
      title="Cambiar contraseña"
      :ui="{ footer: 'justify-end' }"
    >
      <template #body>
        <div class="space-y-4">
          <UFormField
            label="Contraseña actual"
            name="currentPassword"
          >
            <UInput
              v-model="passwordForm.currentPassword"
              type="password"
              autocomplete="current-password"
              class="w-full"
            />
          </UFormField>
          <UFormField
            label="Nueva contraseña"
            name="newPassword"
          >
            <UInput
              v-model="passwordForm.newPassword"
              type="password"
              autocomplete="new-password"
              class="w-full"
            />
          </UFormField>
          <UFormField
            label="Confirmar nueva contraseña"
            name="confirmPassword"
          >
            <UInput
              v-model="passwordForm.confirmPassword"
              type="password"
              autocomplete="new-password"
              class="w-full"
            />
          </UFormField>
          <p
            v-if="passwordError"
            class="text-xs text-error"
          >
            {{ passwordError }}
          </p>
        </div>
      </template>

      <template #footer="{ close }">
        <UButton
          color="neutral"
          variant="ghost"
          @click="close"
        >
          Cancelar
        </UButton>
        <UButton
          :loading="isChangingPassword"
          :disabled="!canSubmitPassword"
          @click="onChangePassword"
        >
          Guardar
        </UButton>
      </template>
    </UModal>
  </div>
</template>
