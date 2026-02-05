<template>
  <section>
    <div class="flex justify-between items-center mb-6">
      <h1 class="text-2xl font-semibold text-[#004aad]">Departamentos</h1>
      <NuxtLink
        to="/departamentos/add"
        class="flex items-center gap-1 px-4 py-2 rounded-md bg-[#004aad] text-white hover:bg-[#003d8f] transition-colors"
      >
        <span>+</span> Agregar departamento
      </NuxtLink>
    </div>

    <div class="rounded-lg bg-white shadow">
      <div class="border-b px-4 py-3 font-medium text-slate-700">Listado de Departamentos</div>
      <div class="p-4">
        <div v-if="pending" class="flex items-center gap-2 text-slate-600 py-4">
          <div class="animate-spin h-4 w-4 border-2 border-[#004aad] border-t-transparent rounded-full"></div>
          Cargando departamentos...
        </div>
        <div v-else-if="error" class="text-red-600 py-4 text-sm font-medium">
          ⚠️ Error al cargar departamentos
        </div>

        <ul v-else class="space-y-2">
          <li 
            v-for="d in departamentos" 
            :key="d.id" 
            class="flex justify-between items-center p-4 hover:bg-slate-50 border border-transparent hover:border-slate-100 rounded-lg transition-all"
          >
            <div>
              <span class="font-semibold text-slate-800">{{ d.nombre }}</span>
              <span class="text-slate-500 text-sm ml-2 px-2 py-0.5 bg-slate-100 rounded">
                Código: {{ d.codigo }}
              </span>
            </div>
            <div class="flex gap-2">
              <NuxtLink
                :to="`/departamentos/update/${d.id}`"
                class="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors border border-transparent hover:border-blue-100"
                title="Editar"
              >
                ✏️
              </NuxtLink>
              <button
                @click="triggerDelete(d)"
                class="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors border border-transparent hover:border-red-100"
                :disabled="hasActivosAsociados(d.id)"
                :class="{'opacity-30 cursor-not-allowed filter grayscale': hasActivosAsociados(d.id)}"
                :title="hasActivosAsociados(d.id) ? 'No se puede eliminar: tiene activos' : 'Eliminar'"
              >
                🗑️
              </button>
            </div>
          </li>
          
          <li v-if="departamentos.length === 0" class="text-center py-10 text-slate-400">
            No se encontraron departamentos registrados.
          </li>
        </ul>
      </div>
    </div>

    <CommonConfirmModal 
      :show="showDeleteModal"
      title="Eliminar Departamento"
      :message="`¿Estás seguro de que deseas eliminar el departamento '${selectedDept?.nombre}'? Esta acción es irreversible.`"
      @confirm="confirmDelete"
      @cancel="cancelDelete"
    />

    <Teleport to="body">
      <div class="fixed bottom-4 right-4 space-y-2 z-50">
        <TransitionGroup name="toast">
          <div 
            v-for="toast in toasts" 
            :key="toast.id"
            :class="[
              'px-4 py-3 rounded-lg shadow-xl text-white text-sm flex items-center gap-3 min-w-[280px]',
              toast.type === 'success' ? 'bg-green-600' : 'bg-red-600'
            ]"
          >
            <span>{{ toast.type === 'success' ? '✅' : '❌' }}</span>
            <span class="font-medium">{{ toast.message }}</span>
          </div>
        </TransitionGroup>
      </div>
    </Teleport>
  </section>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'

type Departamento = { 
  id: number | string; 
  nombre: string; 
  codigo: string;
  responsableId?: number | string 
}

type Asset = {
  id: number | string;
  departamentId?: number | string;
}

// Hooks y API
const { fetch: apiFetch } = useApi()

// Carga de datos
const { data: departamentosData, pending, error, refresh: refreshDepts } = await useAsyncData(
  'departments',
  () => apiFetch<Departamento[]>('/api/departments')
)

const { data: activos, refresh: refreshAssets } = await useAsyncData(
  'assets',
  () => apiFetch<Asset[]>('/api/assets')
)

const departamentos = computed<Departamento[]>(() => (departamentosData.value ?? []))

// Validación
function hasActivosAsociados(departamentoId: number | string) {
  return activos.value?.some(a => Number(a.departamentId) === Number(departamentoId))
}

// --- LÓGICA DEL MODAL DE ELIMINACIÓN ---
const showDeleteModal = ref(false)
const selectedDept = ref<Departamento | null>(null)

// 1. Abrir modal
function triggerDelete(dept: Departamento) {
  if (hasActivosAsociados(dept.id)) {
    showToast('No se puede eliminar un departamento con activos asociados', 'error')
    return
  }
  selectedDept.value = dept
  showDeleteModal.value = true
}

// 2. Cerrar modal
function cancelDelete() {
  showDeleteModal.value = false
  selectedDept.value = null
}

// 3. Confirmar eliminación
async function confirmDelete() {
  if (!selectedDept.value) return
  
  try {
    // Usamos el ID del departamento seleccionado
    // Nota: Según tu backend anterior, la ruta es /api/departments/:id para el DELETE
    await apiFetch(`/api/departments/${selectedDept.value.id}`, { 
      method: 'DELETE' 
    })
    
    await refreshDepts() // Refresca la lista de departamentos
    await refreshAssets() // Refresca los activos por si acaso
    showToast('Departamento eliminado correctamente', 'success')
  } catch (e: any) {
    const errorMsg = e.data?.message || 'Error al eliminar el departamento'
    showToast(errorMsg, 'error')
  } finally {
    cancelDelete() // Cierra el modal pase lo que pase
  }
}

// --- SISTEMA DE TOASTS ---
const toasts = ref<{id: number, message: string, type: 'success' | 'error'}[]>([])

function showToast(message: string, type: 'success' | 'error') {
  const id = Date.now() + Math.random()
  toasts.value.push({ id, message, type })
  setTimeout(() => {
    toasts.value = toasts.value.filter(t => t.id !== id)
  }, 3500)
}
</script>

<style scoped>
/* Transiciones para Toasts */
.toast-enter-active, .toast-leave-active {
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
}
.toast-enter-from {
  opacity: 0;
  transform: translateY(20px) scale(0.9);
}
.toast-leave-to {
  opacity: 0;
  transform: translateX(100%);
}
</style>