<template>
  <section class="space-y-6">
    <header class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
      <div>
        <h1 class="text-2xl sm:text-3xl font-bold text-[#004aad] mb-1">Responsables</h1>
        <p v-if="userEmail" class="text-sm text-slate-600">Sesión: {{ userEmail }}</p>
      </div>
      
      <NuxtLink
        to="/responsable/add"
        class="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-[#004aad] hover:bg-[#003d8f] text-white font-medium transition-all shadow-sm"
      >
        <span>+ Agregar usuario</span>
      </NuxtLink>
    </header>

    <main class="rounded-xl bg-white shadow-sm border border-slate-200 overflow-hidden">
      <div class="border-b px-6 py-4 bg-slate-50/50 font-medium">
        Usuarios en el sistema (Total: {{ usuarios.length }})
      </div>
      
      <div class="p-6">
        <div v-if="pending" class="flex flex-col items-center justify-center py-12">
          <div class="animate-spin rounded-full h-10 w-10 border-b-2 border-[#004aad] mb-4"></div>
          <p class="text-slate-600">Cargando datos...</p>
        </div>

        <div v-else-if="error" class="p-6 bg-red-50 border border-red-200 rounded-xl text-red-700">
          <p class="font-bold">Error de conexión</p>
          <button @click="refreshAll" class="mt-2 text-xs underline">Reintentar</button>
        </div>

        <div v-else-if="usuarios.length > 0" class="grid gap-4 md:grid-cols-2">
          <div
            v-for="u in usuarios"
            :key="u.id"
            class="rounded-xl border border-slate-200 bg-white p-5 hover:border-[#004aad]/30 transition-all"
          >
            <div class="flex items-start justify-between">
              <div>
                <span class="text-lg font-bold text-slate-800">{{ u.username || u.nombre }}</span>
                <p class="text-xs text-slate-500 italic">{{ u.email }}</p>
              </div>
              
              <div class="flex gap-2">
                <NuxtLink :to="`/responsable/update/${u.id}`" class="p-2 text-blue-600 hover:bg-blue-50 rounded-lg">
                  ✏️
                </NuxtLink>
                <button @click="triggerDelete(u)" class="p-2 text-red-600 hover:bg-red-50 rounded-lg">
                  🗑️
                </button>
              </div>
            </div>

            <div class="mt-4 pt-4 border-t border-slate-100 flex justify-between items-center">
              <span class="text-xs font-semibold text-slate-400 uppercase">Responsable</span>
              <p class="text-sm font-bold text-[#004aad]">
                📦 {{ getActivosCount(u.id) }} activos
              </p>
            </div>
          </div>
        </div>

        <div v-else class="text-center py-20 text-slate-400">
          No hay responsables registrados.
        </div>
      </div>
    </main>

    <CommonConfirmModal 
      :show="showDeleteModal"
      title="Eliminar Responsable"
      :message="`¿Eliminar a ${selectedUser?.username || 'este usuario'}?`"
      @confirm="confirmDelete"
      @cancel="cancelDelete"
    />

    <Teleport to="body">
      <div class="fixed bottom-4 right-4 z-[100] space-y-2">
        <TransitionGroup name="toast">
          <div 
            v-for="toast in toasts" :key="toast.id"
            :class="['px-5 py-3 rounded-xl shadow-lg text-white text-sm', toast.type === 'success' ? 'bg-green-600' : 'bg-red-600']"
          >
            {{ toast.message }}
          </div>
        </TransitionGroup>
      </div>
    </Teleport>
  </section>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'

interface Usuario { id: number | string; username?: string; nombre?: string; email?: string }
interface Departamento { id: number | string; nombre: string; responsableId?: number | string }
interface Asset { id: number | string; departamentId?: number | string }

const { data: session } = useAuth()
const { fetch: apiFetch } = useApi()
const userEmail = computed(() => session.value?.user?.email ?? null)

// LLAVES ÚNICAS PARA ESTA PÁGINA (Esto evita el error de "Incompatible options")
const { data: rawUsers, pending, error, refresh: refreshUsers } = await useAsyncData<Usuario[]>(
  'resp-idx-users', 
  () => apiFetch('/api/users'), 
  { server: false }
)

const { data: rawDeps, refresh: refreshDeps } = await useAsyncData<Departamento[]>(
  'resp-idx-deps', 
  () => apiFetch('/api/departments'), 
  { server: false }
)

const { data: rawAssets, refresh: refreshAssets } = await useAsyncData<Asset[]>(
  'resp-idx-assets', 
  () => apiFetch('/api/assets'), 
  { server: false }
)

const usuarios = computed(() => rawUsers.value || [])
const departamentos = computed(() => rawDeps.value || [])
const activos = computed(() => rawAssets.value || [])

// Modal de eliminación
const showDeleteModal = ref(false)
const selectedUser = ref<Usuario | null>(null)

function triggerDelete(u: Usuario) {
  selectedUser.value = u
  showDeleteModal.value = true
}

function cancelDelete() {
  showDeleteModal.value = false
  selectedUser.value = null
}

async function confirmDelete() {
  if (!selectedUser.value) return
  try {
    await apiFetch(`/api/users/delete/${selectedUser.value.id}`, { method: 'DELETE' })
    await refreshUsers()
    showToast(`Usuario eliminado`, 'success')
  } catch (err: any) {
    showToast('Error al eliminar', 'error')
  } finally {
    cancelDelete()
  }
}

// Cálculo de activos (Blindado contra nulos)
function getActivosCount(userId: number | string | undefined) {
  // 1. Si el userId no existe, retornamos 0 de inmediato
  if (!userId || !departamentos.value.length || !activos.value.length) return 0
  
  // 2. Filtramos departamentos asegurando que comparamos strings
  const deptsDelUser = departamentos.value
    .filter(d => d && d.responsableId !== undefined && String(d.responsableId) === String(userId))
    .map(d => d.id)

  // 3. Filtramos activos asegurando que el departamentId sea válido para .includes()
  return activos.value.filter(a => {
    return a && a.departamentId !== undefined && deptsDelUser.includes(a.departamentId)
  }).length
}
async function refreshAll() {
  await Promise.all([refreshUsers(), refreshDeps(), refreshAssets()])
}

// Toasts
const toasts = ref<{id: number, message: string, type: 'success' | 'error'}[]>([])
function showToast(message: string, type: 'success' | 'error') {
  const id = Date.now()
  toasts.value.push({ id, message, type })
  setTimeout(() => { toasts.value = toasts.value.filter(t => t.id !== id) }, 3000)
}
</script>

<style scoped>
.toast-enter-active, .toast-leave-active { transition: all 0.3s ease; }
.toast-enter-from { opacity: 0; transform: translateY(20px); }
.toast-leave-to { opacity: 0; transform: translateX(100%); }
</style>