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

  </nav>
</template>

<script setup lang="ts">
const { signOut } = useAuth()

const handleLogout = async () => {
  try {
    await signOut({ redirect: true, callbackUrl: '/login' })
  } catch (error: any) {
    console.error('Error al cerrar sesión:', error)
    // Redirigir a login aunque falle
    await navigateTo('/login')
  }
}
</script>


