import tailwindcss from "@tailwindcss/vite";

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  
  // Configuración global del Head (Esto evita errores de tipos en componentes)
  app: {
    head: {
      htmlAttrs: {
        lang: 'es'
      },
      charset: 'utf-8',
      viewport: 'width=device-width, initial-scale=1',
      link: [
        { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }
      ]
    }
  },

  css: ['./app/assets/css/main.css'],
  modules: [
    '@nuxt/image',
    '@nuxtjs/seo',
    '@sidebase/nuxt-auth'
  ],
  
  typescript: {
    strict: true,
  },
  
  devServer: {
    port: 3001
  },

  runtimeConfig: {
    baseURL: process.env.NUXT_AUTH_BASE_URL ,
    apiBase: process.env.NUXT_PUBLIC_API_BASE ,
    authSecret: process.env.NUXT_AUTH_SECRET,
    authOrigin: process.env.NUXT_PUBLIC_AUTH_ORIGIN,
    public: {
      apiBase: process.env.NUXT_PUBLIC_API_BASE,
    }
  },

  auth: {
    baseURL: process.env.NUXT_PUBLIC_API_BASE,
    globalAppMiddleware: true,
    provider: {
      type: 'local',
      endpoints: {
        signIn: { path: '/api/auth/login', method: 'post' },
        signOut: { path: '/api/auth/logout', method: 'post' },
        getSession: { path: '/api/auth/session', method: 'get' },
        signUp: false,
      },
      token: {
        signInResponseTokenPointer: '/data/accessToken',
        type: 'Bearer',
        headerName: 'Authorization',
        maxAgeInSeconds: 420,
      },
      refresh: {
        isEnabled: true,
        endpoint: { path: '/api/auth/refresh', method: 'post' },
        refreshOnlyToken: true,
        token: {
          signInResponseRefreshTokenPointer: '/data/refreshToken',
          refreshRequestTokenPointer: '/data/refreshToken',
          maxAgeInSeconds: 604800,
        },
      },
      session: {
        dataType: {
          user: 'Record<string, any>',
        },
      },
    },
    events: {
      async onError({ error }: { error: any }) {
        console.error('Auth error:', error)
      }
    }
  },
  
  site: {
    url: 'https://activos.miempresa.com',
    name: 'Sistema de Gestión de Activos',
    description: 'Plataforma empresarial para la gestión, control y seguimiento de activos corporativos.',
    defaultLocale: 'es'
  },

  vite: {
    plugins: [tailwindcss()],
  },
})
