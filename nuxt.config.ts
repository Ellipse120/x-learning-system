// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  modules: [
    '@nuxt/eslint',
    '@nuxt/ui',
    '@vueuse/nuxt',
    'nuxt-auth-utils'
  ],

  $production: {
    experimental: {
      checkOutdatedBuildInterval: 3600000 // 1h
    }
  },

  devtools: {
    enabled: true
  },

  app: {
    layoutTransition: { name: 'layout', mode: 'out-in' }
  },

  css: ['~/assets/css/main.css'],

  ui: {
    fonts: false
  },

  runtimeConfig: {
    jwtSecret: process.env.JWT_SECRET,
    defaultPassword: process.env.DEFAULT_PASSWORD
  },

  routeRules: {
    // '/api/**': {
    //   cors: true
    // },
    '/admin/**': { appMiddleware: 'auth' },
    '/teacher/**': { appMiddleware: 'auth' },
    '/student/**': { appMiddleware: 'auth' }
  },

  compatibilityDate: '2024-07-11',

  nitro: {
    imports: {
      dirs: ['shared/zschema']
    }
  },

  eslint: {
    config: {
      stylistic: {
        commaDangle: 'never',
        braceStyle: '1tbs'
      }
    }
  }
})
