import { useAuthStore } from '~/features/auth/store/auth'
import { extractApiError } from '~/utils/api-error'

export function createAdminApi() {
  const authStore = useAuthStore()
  const toast = useToast()

  return $fetch.create({
    baseURL: 'https://ecommerce-13d7.onrender.com/api/v1',
    onRequest({ options }) {
      if (authStore.token) {
        options.headers = {
          ...options.headers,
          Authorization: `Bearer ${authStore.token}`
        }
      }
    },
    onResponseError({ response }) {
      if (response.status === 401) {
        authStore.logout()
        return
      }
      toast.add({
        title: 'Error',
        description: extractApiError(response._data),
        color: 'error',
        icon: 'i-lucide-circle-alert'
      })
    },
  })
}
