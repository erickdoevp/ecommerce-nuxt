// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  modules: [
    '@nuxt/eslint',
    '@nuxt/ui',
    '@pinia/nuxt',
    '@nuxtjs/turnstile'
  ],

  devtools: {
    enabled: true
  },

  colorMode: {
    preference: 'light',
    fallback: 'light'
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

  runtimeConfig: {
    public: {
      baseUrl: ''
    }
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
