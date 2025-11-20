// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  modules: [
    '@nuxt/eslint',
    '@nuxt/ui',
    '@vueuse/nuxt',
    'nuxt-auth-utils'
  ],

  devtools: {
    enabled: true
  },

  $production: {
    experimental: {
      checkOutdatedBuildInterval: 3600000 // 1h
    }
  },

  app: {
    layoutTransition: { name: 'layout', mode: 'out-in' }
  },

  css: ['~/assets/css/main.css'],

  ui: {
    fonts: false
  },

  routeRules: {
    '/api/**': {
      cors: true
    }
  },

  compatibilityDate: '2024-07-11',

  eslint: {
    config: {
      stylistic: {
        commaDangle: 'never',
        braceStyle: '1tbs'
      }
    }
  }
})
