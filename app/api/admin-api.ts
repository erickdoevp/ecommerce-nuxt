// import { useAuthStore } from '~/store/admin/auth/authStore'

export function createAdminApi() {
  // const config = useRuntimeConfig()
  //   const authStore = useAuthStore()

  return $fetch.create({
    baseURL: `https://ecommerce-13d7.onrender.com/api/v1`,
    onRequest({ options }) {
      const token = 'eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJhZG1pbiIsImlhdCI6MTc3OTE1MDk1MCwiZXhwIjoxNzc5MTUxNTUwfQ.5uWI4PnwKwqIb4Q_eAX8vQQcipEF31sRWGXBM-XX6zE'
      // const existing = options.headers instanceof Headers
      //   ? Object.fromEntries((options.headers as Headers).entries())
      //   : { ...(options.headers as Record<string, string> ?? {}) }

      options.headers = {
      // ...existing,
        Authorization: `Bearer ${token}`
      }
    }
  })
}
