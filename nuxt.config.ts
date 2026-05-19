// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  modules: [
    '@nuxt/eslint',
    '@nuxt/ui'
  ],

  devtools: {
    enabled: true
  },

  css: ['~/assets/css/main.css'],

  nitro: {
    prerender: {
      crawlLinks: true,
      ignore: ['/admin/**'],
    },
  },

  routeRules: {
    '/': { prerender: true },
    '/admin': { redirect: '/admin/login' },
    '/admin/**': { ssr: false }
  },

  public: {
    baseUrl: process.env.NUXT_PUBLIC_BASE_URL
  },

  compatibilityDate: '2025-01-15',

  eslint: {
    config: {
      stylistic: {
        commaDangle: 'never',
        braceStyle: '1tbs'
      }
    }
  }
})
