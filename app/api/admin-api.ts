import { useAuthStore } from '~/features/auth/store/auth'


export function createAdminApi() {
  const authStore = useAuthStore()

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
      }
    },
  })
}
