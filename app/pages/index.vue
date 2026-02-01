<template>
  <div class="min-h-screen bg-slate-100">
    <header class="bg-white shadow-sm border-b border-slate-200">
      <div class="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
        <div>
          <h1 class="text-2xl font-bold text-slate-900">Dashboard</h1>
          <p class="text-sm text-slate-600">Bienvenido al Sistema de Gestión de Activos</p>
        </div>

        <div class="flex items-center gap-4">
          <div class="text-right">
            <p class="text-sm font-medium text-slate-900">{{ session?.user?.username || 'Usuario' }}</p>
            <p class="text-xs text-slate-500 capitalize">{{ session?.user?.role || 'Sin rol' }}</p>
          </div>

          <div class="w-10 h-10 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold">
            {{ (session?.user?.email?.[0] || 'U').toUpperCase() }}
          </div>

          <button
            @click="handleLogout"
            class="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg text-sm font-medium transition-colors"
          >
            Cerrar Sesión
          </button>
        </div>
      </div>
    </header>

    <main class="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div class="grid gap-6 md:grid-cols-3 mb-8">
        
        <div class="bg-white rounded-lg shadow-sm p-6 border border-slate-200">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm font-medium text-slate-600">Total Activos</p>
              <p class="text-3xl font-bold text-slate-900 mt-2">{{ statistics.totalAssets }}</p>
            </div>
            <div class="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <svg class="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m0 0l8-4m0 0l8 4m0 0v10l-8 4m0-10L4 7m8 0v10m8-10v10l-8 4" />
              </svg>
            </div>
          </div>
        </div>

        <div class="bg-white rounded-lg shadow-sm p-6 border border-slate-200">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm font-medium text-slate-600">Departamentos</p>
              <p class="text-3xl font-bold text-slate-900 mt-2">{{ statistics.totalDepartments }}</p>
            </div>
            <div class="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <svg class="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-2a6 6 0 0112 0v2h12v-2a6 6 0 00-9-5.657V4.354" />
              </svg>
            </div>
          </div>
        </div>

        <div class="bg-white rounded-lg shadow-sm p-6 border border-slate-200">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm font-medium text-slate-600">Usuarios</p>
              <p class="text-3xl font-bold text-slate-900 mt-2">{{ statistics.totalUsers }}</p>
            </div>
            <div class="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
              <svg class="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.856-1.487M15 10a3 3 0 11-6 0 3 3 0 016 0zM9 20H4v-2a6 6 0 0112 0v2H9z" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      <div class="bg-white rounded-lg shadow-sm p-6 border border-slate-200 mb-8">
        <h2 class="text-lg font-semibold text-slate-900 mb-4">Acciones Rápidas</h2>
        <div class="grid gap-4 sm:grid-cols-2 md:grid-cols-4">
          <NuxtLink to="/activo/add" class="px-4 py-3 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-lg font-medium transition-colors text-center">
            ➕ Nuevo Activo
          </NuxtLink>
          <NuxtLink to="/departamentos" class="px-4 py-3 bg-green-50 hover:bg-green-100 text-green-700 rounded-lg font-medium transition-colors text-center">
            🏢 Departamentos
          </NuxtLink>
          <NuxtLink to="/responsable" class="px-4 py-3 bg-purple-50 hover:bg-purple-100 text-purple-700 rounded-lg font-medium transition-colors text-center">
            👤 Responsables
          </NuxtLink>
          <NuxtLink to="/perfil" class="px-4 py-3 bg-amber-50 hover:bg-amber-100 text-amber-700 rounded-lg font-medium transition-colors text-center">
            ⚙️ Mi Perfil
          </NuxtLink>
        </div>
      </div>

      <div class="bg-white rounded-lg shadow-sm p-6 border border-slate-200">
        <h2 class="text-lg font-semibold text-slate-900 mb-4">Actividad Reciente</h2>
        <div v-if="isLoading" class="text-center py-8">Cargando datos...</div>
        <div v-else class="text-center text-slate-500 py-8">
          <p>No hay actividad reciente</p>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">

/**
 * 🛠️ CONFIGURACIÓN
 */
const { data: session, signOut } = useAuth()
const { fetch: apiFetch } = useApi()
const router = useRouter()

definePageMeta({
  middleware: "sidebase-auth"
})

useHead({
  title: 'Dashboard - Sistema de Gestión',
})

/**
 * 📋 TIPADO Y ESTADO
 */
interface ApiResponse<T> {
  success: boolean;
  data: T[];
  message?: string;
}

const isLoading = ref(false)
const statistics = ref({
  totalAssets: 0,
  totalDepartments: 0,
  totalUsers: 0,
})

/**
 * 📥 CARGAR DATOS
 */
const loadStatistics = async () => {
  isLoading.value = true
  try {
    // Usamos apiFetch que ya sabe la URL base y lleva el token inyectado
    const [assets, depts, users] = await Promise.all([
      apiFetch<ApiResponse<any>>('/api/assets'),
      apiFetch<ApiResponse<any>>('/api/departments'),
      apiFetch<ApiResponse<any>>('/api/users'),
    ])

    statistics.value.totalAssets = assets?.data?.length || 0
    statistics.value.totalDepartments = depts?.data?.length || 0
    statistics.value.totalUsers = users?.data?.length || 0

  } catch (error: any) {
    console.error('[Dashboard] Error loading statistics:', error)
    // Si el error es 401, el token probablemente expiró
    if (error.response?.status === 401) {
      handleLogout()
    }
  } finally {
    isLoading.value = false
  }
}

/**
 * 📤 LOGOUT
 */
const handleLogout = async () => {
  try {
    await signOut({ callbackUrl: '/login' })
  } catch (error) {
    await router.push('/login')
  }
}

onMounted(() => {
  loadStatistics()
})
</script>
