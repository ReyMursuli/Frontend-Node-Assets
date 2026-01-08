<template>
  <aside class="fixed left-0 top-0 h-screen w-[250px] md:w-[250px] sm:w-[70px] bg-[#004aad] text-white overflow-y-auto">
    <div class="px-5 py-6 border-b border-white/10 flex items-center justify-center">
      <NuxtLink to="/" class="block">
        <div class="w-[100px] h-[100px] rounded-full bg-white text-[#004aad] font-bold text-lg shadow overflow-hidden border-4 border-white mx-auto hover:scale-105 " >
          <NuxtImg :src="logoUrl" alt="Logo" width="100" height="100" class="w-full h-full object-cover mask-radial-from-60% mask-radial-to-90%"  />
        </div>
      </NuxtLink>
    </div>
    <nav class="px-2 py-4">
      <ul class="space-y-2">
        <li>
          <NuxtLink
            to="/activo"
            class="flex items-center px-4 py-3 rounded-full hover:bg-white/10 transition-colors"
            exact-active-class="bg-white/20 font-semibold"
          >
            <span class="mr-3 text-xl">📊</span>
            <span class="nav-text">Activos</span>
          </NuxtLink>
        </li>
        <li>
          <NuxtLink
            to="/departamentos"
            class="flex items-center px-4 py-3 rounded-full hover:bg-white/10 transition-colors"
            exact-active-class="bg-white/20 font-semibold"
          >
            <span class="mr-3 text-xl">🏢</span>
            <span class="nav-text">Departamentos</span>
          </NuxtLink>
        </li>
        <li>
          <NuxtLink
            to="/responsable"
            class="flex items-center px-4 py-3 rounded-full hover:bg-white/10 transition-colors"
            exact-active-class="bg-white/20 font-semibold"
          >
            <span class="mr-3 text-xl">👥</span>
            <span class="nav-text">Responsables</span>
          </NuxtLink>
        </li>
      </ul>

      <button
        type="button"
        class="mt-4 mx-2 w-[calc(100%-16px)] border border-white/30 rounded-full px-4 py-3 hover:bg-white/10 transition-colors"
      >
        <span>Cerrar Sesión</span>
      </button>
    </nav>
  </aside>
</template>

<script setup lang="ts">
// Importar logo desde app/public (no es público por defecto, por eso se importa)
// Queda disponible como URL transformada por Vite
// Import estático para usar con NuxtImg
import logoUrl from '/logo.jpg'
</script>



<style scoped>
@media (max-width: 768px) {
  .nav-text { display: none; }
}
</style>


