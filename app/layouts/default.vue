<template>
  <div class="min-h-screen bg-[#ebe4e1] text-slate-900">
    <!-- Sidebar -->
    <Sidebar />
    
    <!-- Main Content -->
    <main 
      class="transition-all duration-300 ease-in-out"
      :class="mainContentClass"
      role="main"
    >
      <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-8">
        <!-- Header superior opcional para móvil -->
        <header 
          class="lg:hidden bg-white rounded-lg shadow-sm p-4 mb-6 flex items-center justify-between"
          role="banner"
        >
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 bg-[#004aad] text-white rounded-lg flex items-center justify-center font-bold">
              📊
            </div>
            <div>
              <h1 class="text-lg font-semibold text-slate-900">Gestión de Activos</h1>
              <p class="text-xs text-slate-500">Sistema empresarial</p>
            </div>
          </div>
          
          <!-- Botón menú móvil -->
          <button 
            @click="toggleMobileMenu"
            class="p-2 rounded-lg hover:bg-slate-100 transition-colors"
            aria-label="Toggle menú"
            :aria-expanded="isMobileMenuOpen"
          >
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </header>

        <!-- Page Content -->
        <slot />
      </div>
    </main>

    <!-- Overlay para móvil -->
    <div 
      v-if="isMobileMenuOpen"
      class="fixed inset-0 bg-black/50 z-40 lg:hidden"
      @click="toggleMobileMenu"
      aria-hidden="true"
    ></div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, onMounted, onUnmounted } from 'vue'

// Estado para menú móvil
const isMobileMenuOpen = ref(false)

// Detectar tamaño de pantalla
const isMobile = ref(false)

const checkScreenSize = () => {
  isMobile.value = window.innerWidth < 1024
  if (!isMobile.value) {
    isMobileMenuOpen.value = false
  }
}

// Clase dinámica para el main content
const mainContentClass = computed(() => {
  if (isMobile.value) {
    return 'ml-0' // En móvil no hay margen izquierdo
  }
  return 'ml-16 sm:ml-20 md:ml-64 lg:ml-72' // Mismo ancho que sidebar
})

// Toggle menú móvil
const toggleMobileMenu = () => {
  isMobileMenuOpen.value = !isMobileMenuOpen.value
}

// Manejar resize
onMounted(() => {
  checkScreenSize()
  window.addEventListener('resize', checkScreenSize)
})

onUnmounted(() => {
  window.removeEventListener('resize', checkScreenSize)
})

// Meta tags para el layout
useHead({
  meta: [
    { name: 'viewport', content: 'width=device-width, initial-scale=1' }
  ]
})
</script>

<style scoped>
/* Mejorar experiencia en móviles */
@media (max-width: 1023px) {
  main {
    padding-top: 1rem;
  }
}

/* Transiciones suaves */
.transition-all {
  transition-property: all;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
}
</style>


