import { defineStore } from 'pinia'

export const useClientAuthStore = defineStore('client-auth', () => {
  const token = useCookie<string | null>('client_token', {
    maxAge: 60 * 60 * 8, // 8 horas — alineado con el exp del JWT
    sameSite: 'strict',
    secure: import.meta.env.PROD
  })
  const isAuthenticated = computed(() => !!token.value)

  function setToken(accessToken: string): void {
    token.value = accessToken
  }

  async function logout(): Promise<void> {
    token.value = null
    await navigateTo('/sign-in')
  }

  return {
    token,
    isAuthenticated,
    setToken,
    logout
  }
})
