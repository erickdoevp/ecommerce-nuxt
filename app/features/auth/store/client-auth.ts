import { defineStore } from 'pinia'

const API_BASE = 'https://ecommerce-13d7.onrender.com/api/v1'

export const useClientAuthStore = defineStore('client-auth', () => {
  const token = useCookie<string | null>('client_token', {
    maxAge: 60 * 60 * 8, // 8 horas — alineado con el exp del JWT
    sameSite: 'strict',
    secure: import.meta.env.PROD
  })
  const refreshToken = useCookie<string | null>('client_refresh_token', {
    maxAge: 60 * 60 * 24 * 30, // 30 días
    sameSite: 'strict',
    secure: import.meta.env.PROD
  })
  const isAuthenticated = computed(() => !!token.value)

  function setToken(accessToken: string): void {
    token.value = accessToken
  }

  function setSession(accessToken: string, refresh: string): void {
    token.value = accessToken
    refreshToken.value = refresh
  }

  function clearSession(): void {
    token.value = null
    refreshToken.value = null
  }

  // Revoca el refresh en BD. Idempotente y silencioso (siempre 204); best-effort:
  // si falla la red igual cerramos sesión localmente.
  async function revoke(path: string): Promise<void> {
    const refresh = refreshToken.value
    if (!refresh) return
    await $fetch(`${API_BASE}${path}`, {
      method: 'POST',
      body: { refreshToken: refresh }
    }).catch(() => {})
  }

  async function logout(): Promise<void> {
    await revoke('/auth/logout')
    clearSession()
    await navigateTo('/sign-in')
  }

  async function logoutAll(): Promise<void> {
    await revoke('/auth/logout-all')
    clearSession()
    await navigateTo('/sign-in')
  }

  return {
    token,
    refreshToken,
    isAuthenticated,
    setToken,
    setSession,
    clearSession,
    logout,
    logoutAll
  }
})
