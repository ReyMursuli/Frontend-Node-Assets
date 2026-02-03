<template>
  <aside 
    class="fixed left-0 top-0 h-screen bg-[#004aad] text-white overflow-y-auto transition-all duration-300 ease-in-out z-50 shadow-xl"
    :class="sidebarWidthClass"
    role="navigation"
    aria-label="Menú principal de navegación"
  >
    <!-- Logo y header -->
    <header class="px-3 sm:px-5 py-4 sm:py-6 border-b border-white/10">
      <NuxtLink 
        to="/" 
        class="block group"
        aria-label="Ir al dashboard principal"
      >
        <div
          class="w-16 h-16 sm:w-[100px] sm:h-[100px] rounded-full bg-white text-[#004aad] font-bold text-sm sm:text-lg shadow-lg overflow-hidden border-3 sm:border-4 border-white mx-auto hover:scale-105 transition-transform duration-200 flex items-center justify-center"
        >
          <NuxtImg
            src="/logo.jpg"
            alt="Logo Sistema de Gestión de Activos"
            width="100"
            height="100"
            class="w-full h-full object-contain p-1 sm:p-2"
          />
        </div>
        <span 
          class="text-xs sm:text-sm text-white/80 text-center mt-2 block font-medium sidebar-text"
          aria-hidden="true"
        >
          Gestión de Activos
        </span>
      </NuxtLink>
    </header>

    <!-- Navegación principal -->
    <nav class="px-2 sm:px-3 py-4" role="navigation" aria-label="Menú de secciones">
      <ul class="space-y-1 sm:space-y-2">
        <li>
          <NuxtLink
            to="/activo"
            class="flex items-center px-3 sm:px-4 py-2.5 sm:py-3 rounded-lg sm:rounded-full hover:bg-white/10 transition-all duration-200 group"
            exact-active-class="bg-white/20 font-semibold shadow-sm"
            aria-label="Ver activos"
          >
            <span class="text-lg sm:text-xl flex-shrink-0 group-hover:scale-110 transition-transform">📊</span>
            <span class="ml-3 sidebar-text text-sm sm:text-base">Activos</span>
          </NuxtLink>
        </li>
        <li>
          <NuxtLink
            to="/departamentos"
            class="flex items-center px-3 sm:px-4 py-2.5 sm:py-3 rounded-lg sm:rounded-full hover:bg-white/10 transition-all duration-200 group"
            exact-active-class="bg-white/20 font-semibold shadow-sm"
            aria-label="Ver departamentos"
          >
            <span class="text-lg sm:text-xl flex-shrink-0 group-hover:scale-110 transition-transform">🏢</span>
            <span class="ml-3 sidebar-text text-sm sm:text-base">Departamentos</span>
          </NuxtLink>
        </li>
        <li>
          <NuxtLink
            to="/responsable"
            class="flex items-center px-3 sm:px-4 py-2.5 sm:py-3 rounded-lg sm:rounded-full hover:bg-white/10 transition-all duration-200 group"
            exact-active-class="bg-white/20 font-semibold shadow-sm"
            aria-label="Ver responsables"
          >
            <span class="text-lg sm:text-xl flex-shrink-0 group-hover:scale-110 transition-transform">👥</span>
            <span class="ml-3 sidebar-text text-sm sm:text-base">Responsables</span>
          </NuxtLink>
        </li>
      </ul>
    </nav>

    <!-- Footer del sidebar -->
    <footer class="absolute bottom-0 left-0 right-0 p-3 sm:p-4 border-t border-white/10">
      <div class="text-center">
        <p class="text-xs text-white/60 sidebar-text">v1.0.0</p>
      </div>
    </footer>
  </aside>
</template>

<script setup lang="ts">
import { computed } from 'vue'

// Responsive sidebar width
const sidebarWidthClass = computed(() => {
  return 'w-16 sm:w-20 md:w-64 lg:w-72'
})
</script>

<style scoped>
/* Ocultar texto en móviles y tablets pequeñas */
@media (max-width: 640px) {
  .sidebar-text { 
    display: none; 
  }
}

/* Mejorar scroll en móviles */
@media (max-width: 768px) {
  aside {
    -webkit-overflow-scrolling: touch;
  }
}

/* Animaciones suaves */
* {
  transition-property: color, background-color, border-color, transform, opacity;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
}
</style>


