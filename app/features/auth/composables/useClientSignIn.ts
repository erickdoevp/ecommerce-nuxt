import type { SignInRequest, SignInResponse } from '../types/auth'

export const useClientSignIn = () => {
  const toast = useToast()

  const isLoading = ref<boolean>(false)
  const error = ref<string>('')
  const data = ref<SignInResponse | null>(null)

  async function signIn(body: SignInRequest): Promise<void> {
    try {
      isLoading.value = true
      error.value = ''
      data.value = null
      const response = await $fetch<SignInResponse>('https://ecommerce-13d7.onrender.com/api/v1/auth/login', {
        method: 'POST',
        body
      })
      data.value = response
    } catch (err) {
      error.value = extractApiError(err, 'No se pudo iniciar sesión')
      toast.add({
        title: 'Error',
        description: error.value,
        color: 'error',
        icon: 'i-lucide-circle-alert'
      })
    } finally {
      isLoading.value = false
    }
  }

  return {
    isLoading,
    error,
    data,
    signIn
  }
}
