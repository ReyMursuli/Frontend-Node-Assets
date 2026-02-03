<script setup lang="ts">
// SEO mejorado: Solo propiedades de contenido admitidas por UseSeoMetaInput
useSeoMeta({
  title: 'Sistema de Gestión de Activos | Dashboard',
  description: 'Sistema empresarial para la gestión, control y seguimiento de activos corporativos.',
  keywords: 'gestión de activos, control empresarial, administración, activos corporativos, dashboard',
  author: 'Sistema de Gestión de Activos',
  robots: 'noindex, nofollow',
  
  // Open Graph
  ogTitle: 'Sistema de Gestión de Activos',
  ogDescription: 'Plataforma empresarial para la administración eficiente de activos corporativos',
  ogType: 'website',
  ogSiteName: 'Gestión de Activos',
  ogImage: '/logo.jpg',
  ogImageAlt: 'Logo Sistema de Gestión de Activos',
  ogUrl: 'https://activos.miempresa.com',
  
  // Twitter Card
  twitterCard: 'summary_large_image',
  twitterTitle: 'Sistema de Gestión de Activos',
  twitterDescription: 'Plataforma empresarial para la administración eficiente de activos corporativos',
  twitterImage: '/logo.jpg',
})

// Configuración de cabecera para links dinámicos o específicos
useHead({
  link: [
    {
      rel: 'canonical',
      href: 'https://activos.miempresa.com'
    }
  ]
})
</script>

<template>
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
</template>