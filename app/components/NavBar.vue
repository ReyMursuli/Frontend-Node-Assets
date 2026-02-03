<template>
  <nav 
    class="flex items-center gap-2 sm:gap-4 flex-wrap"
    role="navigation"
    aria-label="Navegación principal"
  >
    <NuxtLink
      to="/activo"
      class="px-3 py-2 sm:px-4 sm:py-2.5 rounded-lg text-sm sm:text-base font-medium hover:bg-white/10 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-white/50 group"
      :aria-current="route.path === '/activo' ? 'page' : undefined"
    >
      <span class="flex items-center gap-2">
        <span class="text-base sm:text-lg group-hover:scale-110 transition-transform">📊</span>
        <span class="hidden sm:inline">Activos</span>
      </span>
    </NuxtLink>
    
    <NuxtLink
      to="/departamentos"
      class="px-3 py-2 sm:px-4 sm:py-2.5 rounded-lg text-sm sm:text-base font-medium hover:bg-white/10 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-white/50 group"
      :aria-current="route.path === '/departamentos' ? 'page' : undefined"
    >
      <span class="flex items-center gap-2">
        <span class="text-base sm:text-lg group-hover:scale-110 transition-transform">🏢</span>
        <span class="hidden sm:inline">Departamentos</span>
      </span>
    </NuxtLink>
    
    <NuxtLink
      to="/responsable"
      class="px-3 py-2 sm:px-4 sm:py-2.5 rounded-lg text-sm sm:text-base font-medium hover:bg-white/10 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-white/50 group"
      :aria-current="route.path === '/responsable' ? 'page' : undefined"
    >
      <span class="flex items-center gap-2">
        <span class="text-base sm:text-lg group-hover:scale-110 transition-transform">👥</span>
        <span class="hidden sm:inline">Responsables</span>
      </span>
    </NuxtLink>

    <!-- Botón de logout -->
    <button
      @click="handleLogout"
      class="ml-auto px-3 py-2 sm:px-4 sm:py-2.5 rounded-lg bg-red-600/80 hover:bg-red-700 text-white text-sm sm:text-base font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-red-500/50 group"
      aria-label="Cerrar sesión"
      title="Cerrar sesión"
    >
      <span class="flex items-center gap-2">
        <svg class="w-4 h-4 sm:w-5 sm:h-5 group-hover:rotate-12 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
        </svg>
        <span class="hidden sm:inline">Salir</span>
      </span>
    </button>
  </nav>
</template>

<script setup lang="ts">
import { useRoute } from 'vue-router'

const route = useRoute()
const { signOut } = useAuth()

const handleLogout = async () => {
  try {
    await signOut({ redirect: true, callbackUrl: '/login' })
  } catch (error: any) {
    console.error('Error al cerrar sesión:', error)
    // Mostrar notificación de error (podrías usar un toast system)
    await navigateTo('/login')
  }
}

// Meta tags para el componente
useHead({
  meta: [
    { name: 'description', content: 'Navegación principal del sistema de gestión de activos' }
  ]
})
</script>

<style scoped>
/* Mejorar accesibilidad con focus visible */
.focus\:ring-2:focus {
  outline: none;
  box-shadow: 0 0 0 2px rgba(255, 255, 255, 0.5);
}

/* Transiciones suaves */
.transition-all {
  transition-property: all;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
}
</style>


