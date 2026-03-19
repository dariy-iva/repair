// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  modules: [
    '@nuxt/eslint',
    '@element-plus/nuxt',
    '@pinia/nuxt',
    ...(process.env.NODE_ENV === 'production' ? ['@vite-pwa/nuxt'] : [])
  ],

  devtools: {
    enabled: true
  },

  app: {
    head: {
      viewport: 'width=device-width, initial-scale=1.0, maximum-scale=1.0',
      link: [
        { rel: 'icon', type: 'image/x-icon', href: '/favicon/favicon.ico' },
        { rel: 'apple-touch-icon', href: '/favicon/apple-touch-icon.png' }
      ]
    },
    pageTransition: { name: 'page', mode: 'out-in' }
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

  pwa: {
    registerType: 'autoUpdate',
    manifest: {
      name: 'Мой ремонт',
      short_name: 'Ремонт',
      description: 'Отслеживайте и управляйте расходами на ремонт',
      lang: 'ru',
      theme_color: '#0052a2',
      background_color: '#ffffff',
      display: 'standalone',
      start_url: '/',
      icons: [
        {
          src: '/favicon/pwa-192x192.png',
          sizes: '192x192',
          type: 'image/png'
        },
        {
          src: '/favicon/pwa-512x512.png',
          sizes: '512x512',
          type: 'image/png'
        },
        {
          src: '/favicon/pwa-512x512.png',
          sizes: '512x512',
          type: 'image/png',
          purpose: 'maskable'
        }
      ]
    },
    workbox: {
      navigateFallback: '/',
      navigateFallbackDenylist: [/^\/docs\//],
      globPatterns: ['**/*.{js,css,html,png,webp,ico,svg,woff,woff2}'],
      runtimeCaching: [
        {
          urlPattern: /^https:\/\/fonts\.googleapis\.com\/.*/i,
          handler: 'CacheFirst',
          options: {
            cacheName: 'google-fonts-cache',
            expiration: { maxEntries: 10, maxAgeSeconds: 60 * 60 * 24 * 365 }
          }
        }
      ]
    },
    devOptions: {
      enabled: false
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
