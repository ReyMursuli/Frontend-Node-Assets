import tailwindcss from "@tailwindcss/vite";
// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  css: ['./app/assets/css/main.css'],
  modules: [
    '@nuxt/image',
    '@nuxtjs/seo',],
  runtimeConfig: {
    public: {
      apiBase: process.env.NUXT_PUBLIC_API_BASE || 'http://localhost:3000',
    }
  },
  image: {
    domains: ['localhost']
  },
  vite:{
    plugins:[
      tailwindcss(),
    ],
  },
})
