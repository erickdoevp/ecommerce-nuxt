import type { SignUpRequest, SignUpResponse } from '../types/auth'

export const useClientSignUp = () => {
  const toast = useToast()

  const isLoading = ref<boolean>(false)
  const error = ref<string>('')
  const data = ref<SignUpResponse | null>(null)

  async function signUp(body: SignUpRequest): Promise<void> {
    try {
      isLoading.value = true
      error.value = ''
      data.value = null
      const response = await $fetch<SignUpResponse>('https://ecommerce-13d7.onrender.com/api/v1/auth/register', {
        method: 'POST',
        body
      })
      data.value = response
    } catch (err) {
      error.value = extractApiError(err, 'No se pudo crear la cuenta')
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
    signUp
  }
}
