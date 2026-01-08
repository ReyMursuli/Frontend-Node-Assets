<template>
  <nav class="flex items-center gap-2">
    <NuxtLink
      to="/activo"
      class="px-3 py-1.5 rounded-md text-sm font-medium hover:bg-white/10 transition-colors aria-[current=page]:bg-white/20"
      aria-current="page"
    >
      Activos
    </NuxtLink>
    <NuxtLink
      to="/departamentos"
      class="px-3 py-1.5 rounded-md text-sm font-medium hover:bg-white/10 transition-colors"
    >
      Departamentos
    </NuxtLink>
    <NuxtLink
      to="/responsable"
      class="px-3 py-1.5 rounded-md text-sm font-medium hover:bg-white/10 transition-colors"
    >
      Responsables
    </NuxtLink>
    <button
      type="button"
      class="ml-2 px-3 py-1.5 rounded-md text-sm font-semibold bg-white text-[\#004aad] hover:bg-white/90 transition-colors"
    >
      Cerrar sesión
    </button>
  </nav>
</template>

<script setup lang="ts">
// Botón visible pero sin acción por petición del usuario
</script>


