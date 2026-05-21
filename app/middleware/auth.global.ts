import { useAuthStore } from '~/features/auth/store/auth'

export default defineNuxtRouteMiddleware((to) => {
  if (!to.path.startsWith('/admin')) return

  const authStore = useAuthStore()

  if (to.path === '/admin/login') {
    if (authStore.isAuthenticated) return navigateTo('/admin/product')
    return
  }

  if (!authStore.isAuthenticated) {
    return navigateTo('/admin/login')
  }
})
