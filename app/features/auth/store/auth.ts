import { defineStore } from 'pinia'
import type { LoginRequest, LoginResponse } from '~/features/auth/types/auth'

const API_BASE = 'https://ecommerce-13d7.onrender.com/api/v1'

export const useAuthStore = defineStore('auth', () => {
  const token = useCookie<string | null>('admin_token', {
    maxAge: 60 * 60 * 8, // 8 hours — aligns with JWT exp
    sameSite: 'strict',
    secure: import.meta.env.PROD
  })
  const isAuthenticated = computed(() => !!token.value)

  async function login(credentials: LoginRequest): Promise<void> {
    const response = await $fetch<LoginResponse>(`${API_BASE}/auth/login`, {
      method: 'POST',
      body: credentials
    })
    token.value = response.accessToken
  }

  async function logout(): Promise<void> {
    token.value = null
    await navigateTo('/admin/login')
  }

  return {
    token,
    isAuthenticated,
    login,
    logout
  }
})
