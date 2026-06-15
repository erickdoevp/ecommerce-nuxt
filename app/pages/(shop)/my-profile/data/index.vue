<script setup lang="ts">
import AvatarUploadCard from '~/features/profile/components/AvatarUploadCard.vue'
import ChangePasswordSlideover from '~/features/profile/components/ChangePasswordSlideover.vue'
import { useClientProfile } from '~/features/profile/composables/useClientProfile'

definePageMeta({
  layout: 'account'
})

const {
  profile,
  fetchProfile,
  updateProfile,
  isSaving
} = useClientProfile()

const form = reactive({
  name: '',
  firstLastName: '',
  secondLastName: '',
  phoneNumber: ''
})

const avatarFile = ref<Blob | null>(null)

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
  const ok = await updateProfile({
    name: form.name,
    firstLastName: form.firstLastName,
    secondLastName: form.secondLastName,
    phoneNumber: form.phoneNumber
  }, avatarFile.value)
  if (ok) avatarFile.value = null
}

// ─── Cambio de contraseña ────────────────────────────────────────────────
const passwordOpen = ref(false)
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

      <AvatarUploadCard
        v-model:file="avatarFile"
        :current-url="profile?.avatarImgUrl ?? null"
        :name="profile?.name"
        class="mt-6"
      />

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
        @click="passwordOpen = true"
      >
        CAMBIAR CONTRASEÑA
      </UButton>
    </div>

    <ChangePasswordSlideover v-model:open="passwordOpen" />
  </div>
</template>
