// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  modules: [
    '@nuxt/eslint',
    '@element-plus/nuxt',
    '@pinia/nuxt'
  ],

  devtools: {
    enabled: true
  },

  app: {
    head: {
      viewport: 'width=device-width, initial-scale=1.0, maximum-scale=1.0',
      link: [{ rel: 'icon', type: 'image/x-icon', href: '/favicon/favicon.ico' }]
    }
  },

  css: ['~/assets/css/main.scss'],

  routeRules: {
    '/': { prerender: true }
  },

  compatibilityDate: '2025-01-15',

  vite: {
    css: {
      preprocessorOptions: {
        scss: {
          additionalData: '@use "~/assets/css/mixins.scss" as *;'
        }
      }
    }
  },

  eslint: {
    config: {
      stylistic: {
        commaDangle: 'never',
        braceStyle: '1tbs',
        quotes: 'single',
        semi: false
      }
    },
    rules: {
      '@typescript-eslint/no-namespace': 'off'
    }
  }
})
