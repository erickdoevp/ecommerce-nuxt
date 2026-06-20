// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  modules: [
    '@nuxt/eslint',
    '@nuxt/ui',
    '@pinia/nuxt',
    '@nuxtjs/turnstile',
    '@nuxtjs/seo'
  ],

  // url se toma de NUXT_SITE_URL (ver .env); name fija el nombre del sitio
  site: {
    name: 'LA BENDITA'
  },

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
      crawlLinks: false,
      ignore: ['/admin/**', '/my-profile/**']
    },
    // En dev el driver fs colisiona: la clave de payload de "/" se guarda como
    // archivo y las rutas hijas la necesitan como carpeta (ENOTDIR). memory lo evita.
    devStorage: {
      cache: { driver: 'memory' }
    }
  },

  routeRules: {
    // Públicas (SEO): SSR cacheado con revalidación cada 5 min
    '/': { swr: 300 },
    '/products/**': { swr: 300 },
    '/categories/**': { swr: 300 },
    '/collections/**': { swr: 300 },
    // Admin: SPA, sin SSR ni indexación
    '/admin': { redirect: '/admin/login' },
    '/admin/**': { ssr: false, robots: false },
    // Privadas/auth: sin SEO ni indexación
    '/my-profile/**': { ssr: false, robots: false },
    '/sign-in': { robots: false },
    '/sign-up': { robots: false },
    '/first-order': { robots: false, static: true },
    '/free-shipment': { robots: false, static: true },
    '/history': { robots: false, static: true },
    '/shipment': { robots: false, static: true },
    '/product-exchange': { robots: false, static: true },
    '/size-guide': { robots: false, static: true },
    '/contact': { robots: false, static: true }
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
