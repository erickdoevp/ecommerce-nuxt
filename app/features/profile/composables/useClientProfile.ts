import { createClientApi } from '~/api/client-api'
import type {
  UserDetailResponse,
  UpdateProfileRequest,
  ChangePasswordRequest
} from '~/features/profile/types/profile'

// Estado compartido (singleton a nivel de módulo): el banner del layout y la
// página "Mis datos" leen el mismo perfil.
const profile = ref<UserDetailResponse | null>(null)
const isLoading = ref(false)
const isSaving = ref(false)
const isChangingPassword = ref(false)

export const useClientProfile = () => {
  const toast = useToast()

  async function fetchProfile(force = false): Promise<void> {
    if (profile.value && !force) return
    const api = createClientApi()
    isLoading.value = true
    try {
      profile.value = await api<UserDetailResponse>('/users/me')
    } finally {
      isLoading.value = false
    }
  }

  async function updateProfile(data: UpdateProfileRequest, image?: Blob | null): Promise<boolean> {
    const api = createClientApi()
    const formData = new FormData()
    formData.append('data', new Blob([JSON.stringify(data)], { type: 'application/json' }))
    if (image) formData.append('image', image, 'avatar.jpg')

    isSaving.value = true
    try {
      await api('/users/me', { method: 'PATCH', body: formData })
      await fetchProfile(true)
      toast.add({ title: 'Datos actualizados', color: 'success', icon: 'i-lucide-check-circle' })
      return true
    } catch {
      // createClientApi ya muestra el toast de error.
      return false
    } finally {
      isSaving.value = false
    }
  }

  async function changePassword(body: ChangePasswordRequest): Promise<boolean> {
    const api = createClientApi()
    isChangingPassword.value = true
    try {
      await api('/users/me/password', { method: 'PATCH', body })
      toast.add({ title: 'Contraseña actualizada', color: 'success', icon: 'i-lucide-check-circle' })
      return true
    } catch {
      return false
    } finally {
      isChangingPassword.value = false
    }
  }

  return {
    profile,
    isLoading,
    isSaving,
    isChangingPassword,
    fetchProfile,
    updateProfile,
    changePassword
  }
}
