<template>
  <section class="space-y-6">
    <!-- Header -->
    <header class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
      <div>
        <h1 class="text-2xl sm:text-3xl font-bold text-[#004aad] mb-1">Activos</h1>
        <p class="text-sm text-slate-600">Gestiona el inventario de activos empresariales</p>
      </div>
      
      <NuxtLink
        to="/activo/add"
        class="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-[#004aad] hover:bg-[#003d8f] text-white font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-[#004aad]/50 group"
        aria-label="Agregar nuevo activo"
      >
        <span class="text-lg group-hover:rotate-90 transition-transform">+</span>
        <span class="hidden sm:inline">Agregar Activo</span>
        <span class="sm:hidden">Agregar</span>
      </NuxtLink>
    </header>
    
    <!-- Resumen -->
    <div class="grid gap-4 sm:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
      <article class="bg-white rounded-xl shadow-sm border border-slate-200 p-4 sm:p-6">
        <div class="flex items-center gap-3">
          <div class="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
            <span class="text-lg">📊</span>
          </div>
          <div>
            <h2 class="text-sm font-medium text-slate-600">Total Activos</h2>
            <p class="text-xl font-bold text-slate-900">{{ activos.length }}</p>
          </div>
        </div>
      </article>
      
      <article class="bg-white rounded-xl shadow-sm border border-slate-200 p-4 sm:p-6">
        <div class="flex items-center gap-3">
          <div class="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
            <span class="text-lg">✅</span>
          </div>
          <div>
            <h2 class="text-sm font-medium text-slate-600">Activos Activos</h2>
            <p class="text-xl font-bold text-slate-900">{{ activos.length }}</p>
          </div>
        </div>
      </article>
      
      <article class="bg-white rounded-xl shadow-sm border border-slate-200 p-4 sm:p-6">
        <div class="flex items-center gap-3">
          <div class="w-10 h-10 bg-amber-100 rounded-lg flex items-center justify-center">
            <span class="text-lg">💰</span>
          </div>
          <div>
            <h2 class="text-sm font-medium text-slate-600">Valor Total</h2>
            <p class="text-xl font-bold text-slate-900">${{ totalValorInicial }}</p>
          </div>
        </div>
      </article>
      
      <article class="bg-white rounded-xl shadow-sm border border-slate-200 p-4 sm:p-6">
        <div class="flex items-center gap-3">
          <div class="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
            <span class="text-lg">🏢</span>
          </div>
          <div>
            <h2 class="text-sm font-medium text-slate-600">Departamentos</h2>
            <p class="text-xl font-bold text-slate-900">{{ uniqueDepartments }}</p>
          </div>
        </div>
      </article>
    </div>

    <!-- Tabla de Activos -->
    <main class="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
      <div class="px-4 sm:px-6 py-4 border-b border-slate-200">
        <h2 class="text-lg font-semibold text-slate-900 flex items-center gap-2">
          <span class="w-2 h-2 bg-[#004aad] rounded-full"></span>
          Listado de Activos
        </h2>
      </div>
      
      <div class="overflow-x-auto">
        <!-- Estado de carga -->
        <div v-if="pending" class="flex flex-col items-center justify-center py-12">
          <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-[#004aad] mb-4"></div>
          <p class="text-sm text-slate-600">Cargando activos...</p>
        </div>

        <!-- Estado de error -->
        <div v-else-if="error" class="p-6">
          <div class="bg-red-50 border border-red-200 rounded-lg p-4">
            <div class="flex items-center gap-3">
              <div class="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                <span class="text-red-600">⚠️</span>
              </div>
              <div>
                <h3 class="font-medium text-red-900">Error al cargar activos</h3>
                <p class="text-sm text-red-700 mt-1">{{ error.message }}</p>
              </div>
            </div>
          </div>
        </div>

        <!-- Tabla de datos -->
        <div v-else class="min-w-full">
          <!-- Vista Desktop -->
          <table class="w-full hidden sm:table">
            <thead class="bg-slate-50 border-b border-slate-200">
              <tr>
                <th class="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Nombre</th>
                <th class="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Código</th>
                <th class="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Rótulo</th>
                <th class="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Valor Inicial</th>
                <th class="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Valor Residual</th>
                <th class="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Dep. Acumulada</th>
                <th class="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Departamento</th>
                <th class="px-4 py-3 text-center text-xs font-medium text-slate-500 uppercase tracking-wider">Acciones</th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-slate-200">
              <tr 
                v-for="a in activos" 
                :key="a.id" 
                class="hover:bg-slate-50 transition-colors"
              >
                <td class="px-4 py-4 text-sm font-medium text-slate-900">{{ a.nombre }}</td>
                <td class="px-4 py-4 text-sm font-mono text-slate-600">{{ a.codigo }}</td>
                <td class="px-4 py-4 text-sm text-slate-600">{{ a.rotulo }}</td>
                <td class="px-4 py-4 text-sm text-slate-900">${{ formatNumber(a.val_inicial) }}</td>
                <td class="px-4 py-4 text-sm text-slate-900">${{ formatNumber(a.val_residual) }}</td>
                <td class="px-4 py-4 text-sm text-red-600 font-medium">{{ formatNumber(a.dep_acomulada) }}</td>
                <td class="px-4 py-4">
                  <span class="px-2 py-1 bg-slate-100 text-slate-700 text-xs rounded-full">
                    {{ a.departamentId ?? 'Sin asignar' }}
                  </span>
                </td>
                <td class="px-4 py-4">
                  <div class="flex items-center justify-center gap-2">
                    <NuxtLink
                      :to="`/activo/update/${a.id}`"
                      class="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                      aria-label="Editar activo"
                      title="Editar"
                    >
                      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                    </NuxtLink>
                    <button
                      @click="onDeleteActivo(a)"
                      class="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      aria-label="Eliminar activo"
                      title="Eliminar"
                    >
                      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>

          <!-- Vista Mobile -->
          <div class="sm:hidden divide-y divide-slate-200">
            <div 
              v-for="a in activos" 
              :key="a.id" 
              class="p-4 space-y-3 hover:bg-slate-50 transition-colors"
            >
              <div class="flex items-start justify-between">
                <div class="flex-1">
                  <h3 class="font-medium text-slate-900">{{ a.nombre }}</h3>
                  <p class="text-sm text-slate-600 font-mono">{{ a.codigo }}</p>
                </div>
                <div class="flex items-center gap-1">
                  <NuxtLink
                    :to="`/activo/update/${a.id}`"
                    class="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                    aria-label="Editar activo"
                  >
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                  </NuxtLink>
                  <button
                    @click="onDeleteActivo(a)"
                    class="p-1.5 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    aria-label="Eliminar activo"
                  >
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              </div>
              
              <div class="grid grid-cols-2 gap-2 text-sm">
                <div>
                  <span class="text-slate-500">Valor Inicial:</span>
                  <span class="ml-1 font-medium">${{ formatNumber(a.val_inicial) }}</span>
                </div>
                <div>
                  <span class="text-slate-500">Valor Residual:</span>
                  <span class="ml-1 font-medium">${{ formatNumber(a.val_residual) }}</span>
                </div>
                <div>
                  <span class="text-slate-500">Dep. Acumulada:</span>
                  <span class="ml-1 font-medium text-red-600">{{ formatNumber(a.dep_acomulada) }}</span>
                </div>
                <div>
                  <span class="text-slate-500">Departamento:</span>
                  <span class="ml-1 font-medium">{{ a.departamentId ?? 'Sin asignar' }}</span>
                </div>
              </div>
            </div>
          </div>

          <!-- Estado vacío -->
          <div v-if="activos.length === 0" class="text-center py-12">
            <div class="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span class="text-2xl">📦</span>
            </div>
            <h3 class="text-lg font-medium text-slate-900 mb-1">No hay activos registrados</h3>
            <p class="text-sm text-slate-500">Comienza agregando tu primer activo al sistema</p>
            <NuxtLink
              to="/activo/add"
              class="inline-flex items-center gap-2 mt-4 px-4 py-2 bg-[#004aad] hover:bg-[#003d8f] text-white rounded-lg font-medium transition-colors"
            >
              <span>+</span> Agregar Primer Activo
            </NuxtLink>
          </div>
        </div>
      </div>
    </main>

    <!-- Sistema de Notificaciones -->
    <Teleport to="body">
      <div class="fixed bottom-4 right-4 z-50 space-y-2">
        <TransitionGroup name="toast">
          <div 
            v-for="toast in toasts" 
            :key="toast.id"
            :class="[
              'px-4 py-3 rounded-lg shadow-lg text-white text-sm min-w-[250px] max-w-sm flex items-center gap-3',
              toast.type === 'success' ? 'bg-green-600' : 'bg-red-600'
            ]"
            role="alert"
            :aria-live="toast.type === 'error' ? 'assertive' : 'polite'"
          >
            <span class="flex-shrink-0">
              {{ toast.type === 'success' ? '✅' : '❌' }}
            </span>
            <span class="flex-1">{{ toast.message }}</span>
          </div>
        </TransitionGroup>
      </div>
    </Teleport>
  </section>
</template>

<script setup lang="ts">
import { computed } from 'vue'

// 1. Tipos de datos mejorados
interface Asset {
  id: number | string;
  nombre: string;
  codigo: string;
  rotulo: string;
  val_inicial: string | number;
  val_residual: string | number;
  dep_acomulada: string | number;
  departamentId?: number | string;
}

// 2. SEO y meta tags
useSeoMeta({
  title: 'Activos | Sistema de Gestión',
  description: 'Gestiona el inventario completo de activos empresariales. Agrega, edita y elimina activos con control total.',
  keywords: 'activos, inventario, gestión empresarial, control de activos',
  author: 'Sistema de Gestión de Activos'
})

// 3. Setup de Hooks
const { fetch: apiFetch } = useApi()

// 4. Petición de datos con useAsyncData + apiFetch
const { data, pending, error, refresh } = await useAsyncData<Asset[]>(
  'assets-list',
  () => apiFetch<Asset[]>('/api/assets'),
  { server: false }
)

const activos = computed(() => (data.value ?? []) as Asset[])

// 5. Computed properties para estadísticas
const totalValorInicial = computed(() => {
  return activos.value.reduce((total, asset) => {
    const valor = Number(asset.val_inicial) || 0
    return total + valor
  }, 0).toLocaleString()
})

const uniqueDepartments = computed(() => {
  const departments = new Set(
    activos.value
      .map(asset => asset.departamentId)
      .filter(Boolean)
  )
  return departments.size
})

// 6. Utilidad para formatear números
const formatNumber = (value: string | number): string => {
  const num = Number(value) || 0
  return num.toLocaleString()
}

// 7. Acción de eliminar con confirmación mejorada
async function onDeleteActivo(activo: Asset) {
  const confirmMessage = `¿Estás seguro de eliminar el activo "${activo.nombre}"? Esta acción no se puede deshacer.`
  
  if (!confirm(confirmMessage)) return
  
  try {
    await apiFetch(`/api/assets/${activo.id}`, { method: 'DELETE' })
    await refresh()
    showToast(`Activo "${activo.nombre}" eliminado correctamente`, 'success')
  } catch (e: any) {
    console.error('Error al eliminar activo:', e)
    const errorMessage = e?.response?.data?.message || 'Error al eliminar el activo'
    showToast(errorMessage, 'error')
  }
}

// 8. Sistema de Notificaciones mejorado
const toasts = ref<{id: number, message: string, type: 'success' | 'error'}[]>([])

function showToast(message: string, type: 'success' | 'error') {
  const id = Date.now() + Math.random()
  toasts.value.push({ id, message, type })
  
  // Auto-eliminar después de 4 segundos
  setTimeout(() => {
    toasts.value = toasts.value.filter(t => t.id !== id)
  }, 4000)
}

// 9. Manejo de teclas para accesibilidad
onMounted(() => {
  const handleKeydown = (e: KeyboardEvent) => {
    // Ctrl/Cmd + K para buscar (futuro implementación)
    if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
      e.preventDefault()
      // TODO: Implementar búsqueda
      console.log('Búsqueda de activos')
    }
  }
  
  document.addEventListener('keydown', handleKeydown)
  
  onUnmounted(() => {
    document.removeEventListener('keydown', handleKeydown)
  })
})
</script>

<style scoped>
/* Animaciones para toasts */
.toast-enter-active,
.toast-leave-active {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.toast-enter-from {
  opacity: 0;
  transform: translateX(100%) scale(0.8);
}

.toast-leave-to {
  opacity: 0;
  transform: translateX(100%) scale(0.8);
}

.toast-move {
  transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

/* Mejorar scroll en móviles */
@media (max-width: 640px) {
  .overflow-x-auto {
    -webkit-overflow-scrolling: touch;
  }
}

/* Focus visible para accesibilidad */
*:focus-visible {
  outline: 2px solid #004aad;
  outline-offset: 2px;
}
</style>


