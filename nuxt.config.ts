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
    globalAppMiddleware: false,
    provider: {
      type: 'local',
      endpoints: {
        signIn: { path: '/api/auth/login', method: 'post' },
        signOut: { path: '/api/auth/logout', method: 'post' },
        getSession: { path: '/api/auth/session', method: 'get' },
        signUp: false,
      },
      token: {
        // CORRECCIÓN: Apuntamos a /data/ ya que el backend lo envía ahí
        signInResponseTokenPointer: '/data/accessToken', 
        type: 'Bearer',
        headerName: 'Authorization',
        maxAgeInSeconds: 3600,
      },
      refresh: {
        isEnabled: true,
        endpoint: { path: '/api/auth/refresh', method: 'post' },
        refreshOnlyToken: true,
        token: {
          
          signInResponseRefreshTokenPointer: '/data/refreshToken',
          refreshRequestTokenPointer: '/refreshToken', 
          maxAgeInSeconds: 604800,
        },
      },
      session: {
        dataType: {
          user: 'Record<string, any>',
        },
        
        dataResponsePointer: '/', 
      },
    },
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
