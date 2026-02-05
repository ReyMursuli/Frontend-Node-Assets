<template>
  <section class="space-y-6">
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

    <main class="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
      <div class="px-4 sm:px-6 py-4 border-b border-slate-200">
        <h2 class="text-lg font-semibold text-slate-900 flex items-center gap-2">
          <span class="w-2 h-2 bg-[#004aad] rounded-full"></span>
          Listado de Activos
        </h2>
      </div>
      
      <div class="overflow-x-auto">
        <div v-if="pending" class="flex flex-col items-center justify-center py-12">
          <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-[#004aad] mb-4"></div>
          <p class="text-sm text-slate-600">Cargando activos...</p>
        </div>

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

        <div v-else class="min-w-full">
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
                    {{ departamentosMap[a.departamentId || ''] || 'Sin asignar' }}
                  </span>
                </td>
                <td class="px-4 py-4">
                  <div class="flex items-center justify-center gap-2">
                    <NuxtLink
                      :to="`/activo/update/${a.id}`"
                      class="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                      title="Editar"
                    >
                      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                    </NuxtLink>
                    <button
                      @click="triggerDelete(a)"
                      class="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
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

          <div v-if="activos.length === 0" class="text-center py-12">
            <div class="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span class="text-2xl">📦</span>
            </div>
            <h3 class="text-lg font-medium text-slate-900 mb-1">No hay activos registrados</h3>
            <NuxtLink to="/activo/add" class="inline-flex items-center gap-2 mt-4 px-4 py-2 bg-[#004aad] text-white rounded-lg">+ Agregar Primer Activo</NuxtLink>
          </div>
        </div>
      </div>
    </main>

    <CommonConfirmModal 
      :show="showDeleteModal"
      title="Eliminar Activo"
      :message="`¿Estás seguro de que deseas eliminar el activo '${selectedActivo?.nombre}'? Esta acción no se puede deshacer.`"
      @confirm="confirmDelete"
      @cancel="cancelDelete"
    />

    <Teleport to="body">
      <div class="fixed bottom-4 right-4 z-50 space-y-2">
        <TransitionGroup name="toast">
          <div 
            v-for="toast in toasts" 
            :key="toast.id"
            :class="[
              'px-4 py-3 rounded-lg shadow-lg text-white text-sm min-w-[250px] flex items-center gap-3',
              toast.type === 'success' ? 'bg-green-600' : 'bg-red-600'
            ]"
          >
            <span>{{ toast.type === 'success' ? '✅' : '❌' }}</span>
            <span>{{ toast.message }}</span>
          </div>
        </TransitionGroup>
      </div>
    </Teleport>
  </section>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'

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

interface Department {
  id: number | string;
  nombre: string;
}

// SEO
useSeoMeta({ title: 'Activos | Sistema de Gestión' })

// Hooks
const api = useApi()

// Estado de Departamentos
const departamentosMap = ref<Record<string | number, string>>({})

// Función para cargar departamentos y crear un mapa { id: nombre }
async function fetchDepartments() {
  try {
    const response = await api.fetch<Department[]>('/api/departments')
    const map: Record<string | number, string> = {}
    response.forEach(dept => {
      map[dept.id] = dept.nombre
    })
    departamentosMap.value = map
  } catch (e) {
    console.error("Error al cargar departamentos", e)
  }
}

// Estado de Datos de Activos
const { data, pending, error, refresh } = await useAsyncData<Asset[]>(
  'assets-list',
  () => api.fetch<Asset[]>('/api/assets'),
  { server: false }
)

const activos = computed(() => (data.value ?? []) as Asset[])

// Cargar departamentos al montar el componente
onMounted(() => {
  fetchDepartments()
})

// --- LÓGICA DE ELIMINACIÓN CON MODAL ---
const showDeleteModal = ref(false)
const selectedActivo = ref<Asset | null>(null)
const isDeleting = ref(false)

function triggerDelete(activo: Asset) {
  selectedActivo.value = activo
  showDeleteModal.value = true
}

function cancelDelete() {
  showDeleteModal.value = false
  selectedActivo.value = null
}

async function confirmDelete() {
  if (!selectedActivo.value) return
  
  isDeleting.value = true
  try {
    await api.fetch(`/api/assets/delete/${selectedActivo.value.id}`, { 
      method: 'DELETE' 
    })
    
    await refresh()
    showToast(`Activo "${selectedActivo.value.nombre}" eliminado`, 'success')
  } catch (e: any) {
    const msg = e.data?.message || 'Error al eliminar el activo'
    showToast(msg, 'error')
  } finally {
    isDeleting.value = false
    cancelDelete()
  }
}

// --- UTILIDADES ---
const formatNumber = (value: string | number) => Number(value).toLocaleString()

const totalValorInicial = computed(() => {
  return activos.value.reduce((acc, a) => acc + (Number(a.val_inicial) || 0), 0).toLocaleString()
})

const uniqueDepartments = computed(() => {
  return new Set(activos.value.map(a => a.departamentId).filter(Boolean)).size
})

// Sistema de Toasts
const toasts = ref<{id: number, message: string, type: 'success' | 'error'}[]>([])
function showToast(message: string, type: 'success' | 'error') {
  const id = Date.now()
  toasts.value.push({ id, message, type })
  setTimeout(() => { toasts.value = toasts.value.filter(t => t.id !== id) }, 4000)
}
</script>

<style scoped>
.toast-enter-active, .toast-leave-active { transition: all 0.3s ease; }
.toast-enter-from, .toast-leave-to { opacity: 0; transform: translateX(100%); }
</style>


