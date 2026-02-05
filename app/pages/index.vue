<template>
  <section class="space-y-6 sm:space-y-8">
    <header class="bg-white rounded-xl shadow-sm border border-slate-200 p-4 sm:p-6">
      <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 class="text-2xl sm:text-3xl font-bold text-slate-900 mb-1">Dashboard</h1>
          <p class="text-sm sm:text-base text-slate-600">Bienvenido al Sistema de Gestión de Activos</p>
        </div>

        <div class="flex items-center gap-3 sm:gap-4">
          <div class="text-right hidden sm:block">
            <p class="text-sm font-medium text-slate-900">{{ userDisplayName }}</p>
            <p class="text-xs text-slate-500 capitalize">{{ userRole }}</p>
          </div>

          <div class="relative group">
            <div class="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-gradient-to-br from-blue-600 to-blue-700 text-white flex items-center justify-center font-bold text-sm sm:text-base shadow-lg group-hover:shadow-xl transition-all duration-200">
              {{ userInitial }}
            </div>
            <div class="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
          </div>

          <button
            @click="handleLogout"
            class="p-2 sm:px-4 sm:py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg text-sm font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-red-500/50 group"
          >
            <svg class="w-5 h-5 sm:hidden group-hover:rotate-12 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            <span class="hidden sm:inline">Cerrar Sesión</span>
          </button>
        </div>
      </div>
    </header>

    <div class="grid gap-4 sm:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
      <StatCard 
        title="Total Activos" 
        :value="statistics.totalAssets" 
        description="Registrados en el sistema"
        variant="blue"
      >
        <template #icon>
          <svg class="w-6 h-6 sm:w-7 sm:h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m0 0l8-4m0 0l8 4m0 0v10l-8 4m0-10L4 7m8 0v10m8-10v10l-8 4" />
          </svg>
        </template>
      </StatCard>

      <StatCard 
        title="Departamentos" 
        :value="statistics.totalDepartments" 
        description="Áreas organizativas"
        variant="green"
      >
        <template #icon>
          <svg class="w-6 h-6 sm:w-7 sm:h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-2a6 6 0 0112 0v2h12v-2a6 6 0 00-9-5.657V4.354" />
          </svg>
        </template>
      </StatCard>

      <StatCard 
        title="Usuarios" 
        :value="statistics.totalUsers" 
        description="Usuarios activos"
        variant="purple"
      >
        <template #icon>
          <svg class="w-6 h-6 sm:w-7 sm:h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.856-1.487M15 10a3 3 0 11-6 0 3 3 0 016 0zM9 20H4v-2a6 6 0 0112 0v2H9z" />
          </svg>
        </template>
      </StatCard>
    </div>

    <section class="bg-white rounded-xl shadow-sm border border-slate-200 p-4 sm:p-6">
      <h2 class="text-lg font-semibold text-slate-900 mb-4 flex items-center gap-2">
        <span class="w-2 h-2 bg-blue-600 rounded-full"></span>
        Acciones Rápidas
      </h2>
      <div class="grid gap-3 sm:gap-4 grid-cols-2 lg:grid-cols-4">
        <NuxtLink to="/activo/add" class="group px-4 py-3 bg-gradient-to-r from-blue-50 to-blue-100 hover:from-blue-100 hover:to-blue-200 text-blue-700 rounded-xl font-medium transition-all duration-200 text-center hover:shadow-md">
          <span class="flex items-center justify-center gap-2">
            <span class="text-lg group-hover:scale-110 transition-transform">➕</span>
            <span class="hidden sm:inline">Nuevo Activo</span>
            <span class="sm:hidden">Activo</span>
          </span>
        </NuxtLink>
        <NuxtLink to="/departamentos" class="group px-4 py-3 bg-gradient-to-r from-green-50 to-green-100 hover:from-green-100 hover:to-green-200 text-green-700 rounded-xl font-medium transition-all duration-200 text-center hover:shadow-md">
          <span class="flex items-center justify-center gap-2">
            <span class="text-lg group-hover:scale-110 transition-transform">🏢</span>
            <span class="hidden sm:inline">Departamentos</span>
            <span class="sm:hidden">Dptos</span>
          </span>
        </NuxtLink>
        <NuxtLink to="/responsable" class="group px-4 py-3 bg-gradient-to-r from-purple-50 to-purple-100 hover:from-purple-100 hover:to-purple-200 text-purple-700 rounded-xl font-medium transition-all duration-200 text-center hover:shadow-md">
          <span class="flex items-center justify-center gap-2">
            <span class="text-lg group-hover:scale-110 transition-transform">👤</span>
            <span class="hidden sm:inline">Responsables</span>
            <span class="sm:hidden">Resp</span>
          </span>
        </NuxtLink>
        <NuxtLink to="/profile" class="group px-4 py-3 bg-gradient-to-r from-amber-50 to-amber-100 hover:from-amber-100 hover:to-amber-200 text-amber-700 rounded-xl font-medium transition-all duration-200 text-center hover:shadow-md">
          <span class="flex items-center justify-center gap-2">
            <span class="text-lg group-hover:scale-110 transition-transform">⚙️</span>
            <span class="hidden sm:inline">Mi Perfil</span>
            <span class="sm:hidden">Perfil</span>
          </span>
        </NuxtLink>
      </div>
    </section>

    <section class="bg-white rounded-xl shadow-sm border border-slate-200 p-4 sm:p-6">
      <h2 class="text-lg font-semibold text-slate-900 mb-4 flex items-center gap-2">
        <span class="w-2 h-2 bg-green-600 rounded-full"></span>
        Actividad Reciente
      </h2>
      <div v-if="isLoading" class="flex flex-col items-center justify-center py-8 sm:py-12">
        <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mb-4"></div>
        <p class="text-sm text-slate-600">Cargando datos...</p>
      </div>
      <div v-else class="text-center py-8 sm:py-12">
        <div class="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg class="w-8 h-8 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <p class="text-slate-500 font-medium">No hay actividad reciente</p>
        <p class="text-sm text-slate-400 mt-1">Las acciones aparecerán aquí</p>
      </div>
    </section>
  </section>
</template>

<script setup lang="ts">
import { computed, ref, onMounted, onUnmounted } from 'vue'

const { data: session, signOut } = useAuth()
const { fetch: apiFetch } = useApi()
const router = useRouter()

definePageMeta({ middleware: "sidebase-auth" })
useSeoMeta({
  title: 'Dashboard | Sistema de Gestión de Activos',
  description: 'Panel principal del sistema de gestión de activos.',
})

interface CountResponse { total: number; }

const isLoading = ref(false)
const statistics = ref({
  totalAssets: 0,
  totalDepartments: 0,
  totalUsers: 0,
})

const userDisplayName = computed(() => {
  const user = session.value?.user as any
  return user?.username || user?.name || user?.email?.split('@')[0] || 'Usuario'
})


const userRole = computed(() => {
  const user = session.value?.user as any
  return user?.role || 'Sin rol'
})

const userInitial = computed(() => {
  return userDisplayName.value.charAt(0).toUpperCase()
})

const loadStatistics = async () => {
  if (isLoading.value) return
  isLoading.value = true
  try {
    const [assetsRes, deptsRes, usersRes] = await Promise.all([
      apiFetch<CountResponse>('/api/assets/count').catch(() => ({ total: 0 })),
      apiFetch<CountResponse>('/api/departments/count').catch(() => ({ total: 0 })),
      apiFetch<CountResponse>('/api/users/count').catch(() => ({ total: 0 })),
    ])
    statistics.value.totalAssets = assetsRes?.total || 0
    statistics.value.totalDepartments = deptsRes?.total || 0
    statistics.value.totalUsers = usersRes?.total || 0
  } catch (error: any) {
    if (error.response?.status === 401) await handleLogout()
  } finally {
    isLoading.value = false
  }
}

const handleLogout = async () => {
  try {
    await signOut({ callbackUrl: '/login' })
  } catch (error) {
    await router.push('/login')
  }
}

onMounted(() => {
  loadStatistics()
  const handleVisibilityChange = () => { if (!document.hidden) loadStatistics() }
  document.addEventListener('visibilitychange', handleVisibilityChange)
  onUnmounted(() => document.removeEventListener('visibilitychange', handleVisibilityChange))
})
</script>