import { useClientAuthStore } from '~/features/auth/store/client-auth'

const PROTECTED_PREFIX = '/my-profile'
const GUEST_ONLY = ['/sign-in', '/sign-up']

export default defineNuxtRouteMiddleware((to) => {
  const clientAuth = useClientAuthStore()

  // Rutas solo para invitados: si ya hay sesión, al perfil.
  if (GUEST_ONLY.includes(to.path)) {
    if (clientAuth.isAuthenticated) return navigateTo('/my-profile')
    return
  }

  // Rutas protegidas: requieren sesión de cliente.
  if (to.path === PROTECTED_PREFIX || to.path.startsWith(`${PROTECTED_PREFIX}/`)) {
    if (!clientAuth.isAuthenticated) return navigateTo('/sign-in')
  }
})
