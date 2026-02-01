<template>
  <section>
    <div class="flex justify-between items-center mb-4">
      <h1 class="text-2xl font-semibold text-[#004aad]">Activos</h1>
      <NuxtLink
        to="/activo/add"
        class="flex items-center gap-1 px-4 py-2 rounded-md bg-[#004aad] text-white hover:bg-[#003d8f] transition-colors"
      >
        <span>+</span> Agregar Activo
      </NuxtLink>
    </div>
    
    <div class="grid gap-4 md:grid-cols-2 mb-6">
      <div class="rounded-lg bg-white shadow p-4">
        <h2 class="font-medium mb-2">Resumen</h2>
        <p class="text-sm text-slate-600">Total de activos: <span class="font-semibold">{{ activos.length }}</span></p>
      </div>
    </div>

    <div class="mt-6 rounded-lg bg-white shadow">
      <div class="border-b px-4 py-3 font-medium">Listado</div>
      <div class="p-4 overflow-x-auto">
        <div v-if="pending" class="flex justify-center py-4 text-slate-600">
          <div class="animate-spin rounded-full h-6 w-6 border-b-2 border-[#004aad] mr-2"></div>
          Cargando activos...
        </div>

        <div v-else-if="error" class="text-red-600 p-4 bg-red-50 rounded">
          Error al cargar activos: {{ error.message }}
        </div>

        <div v-else>
          <table class="w-full text-sm text-left">
            <thead>
              <tr class="text-slate-600 border-b">
                <th class="py-2 px-2">Nombre</th>
                <th class="py-2 px-2">Código</th>
                <th class="py-2 px-2">Rótulo</th>
                <th class="py-2 px-2">Valor inicial</th>
                <th class="py-2 px-2">Valor residual</th>
                <th class="py-2 px-2">Dep. acumulada</th>
                <th class="py-2 px-2">Departamento</th>
                <th class="py-2 px-2 text-center">Acciones</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="a in activos" :key="a.id" class="border-t hover:bg-slate-50 transition-colors">
                <td class="py-3 px-2">{{ a.nombre }}</td>
                <td class="py-3 px-2 font-mono text-xs">{{ a.codigo }}</td>
                <td class="py-3 px-2">{{ a.rotulo }}</td>
                <td class="py-3 px-2">${{ a.val_inicial }}</td>
                <td class="py-3 px-2">${{ a.val_residual }}</td>
                <td class="py-3 px-2 text-red-500">{{ a.dep_acomulada }}</td>
                <td class="py-3 px-2">
                  <span class="px-2 py-1 bg-slate-100 rounded text-xs">
                    {{ a.departamentId ?? 'Sin asignar' }}
                  </span>
                </td>
                <td class="py-3 px-2">
                  <div class="flex gap-2 justify-center">
                    <NuxtLink
                      :to="`/activo/update/${a.id}`"
                      class="px-2 py-1 text-xs rounded border bg-white hover:bg-blue-50 text-blue-600"
                      title="Editar"
                    >
                      ✏️
                    </NuxtLink>
                    <button
                      @click="onDeleteActivo(a)"
                      class="px-2 py-1 text-xs rounded border bg-white hover:bg-red-50 text-red-600"
                      title="Eliminar"
                    >
                      🗑️
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>

          <div v-if="activos.length === 0" class="text-center py-10 text-slate-400">
            No hay activos registrados.
          </div>
        </div>
      </div>
    </div>

    <div class="fixed bottom-4 right-4 space-y-2 z-50">
      <TransitionGroup name="list">
        <div 
          v-for="toast in toasts" 
          :key="toast.id"
          :class="[
            'px-4 py-2 rounded shadow-lg text-white text-sm min-w-[200px]',
            toast.type === 'success' ? 'bg-green-500' : 'bg-red-500'
          ]"
        >
          {{ toast.message }}
        </div>
      </TransitionGroup>
    </div>
  </section>
</template>

<script setup lang="ts">
// 1. Tipos de datos (ID obligatorio para evitar errores de TS)
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

// 2. Setup de Hooks (Usando useApi para el token JWT)
const { fetch: apiFetch } = useApi()

// 3. Petición de datos con useAsyncData + apiFetch
const { data, pending, error, refresh } = await useAsyncData<Asset[]>(
  'assets-list',
  () => apiFetch<Asset[]>('/api/assets'),
  { server: false }
)

const activos = computed(() => (data.value ?? []) as Asset[])

// 4. Acción de eliminar con apiFetch (lleva el token DELETE)
async function onDeleteActivo(activo: Asset) {
  if (!confirm(`¿Estás seguro de eliminar el activo ${activo.nombre}?`)) return
  
  try {
    await apiFetch(`/api/assets/${activo.id}`, { method: 'DELETE' })
    await refresh()
    showToast('Activo eliminado correctamente', 'success')
  } catch (e: any) {
    console.error('Error al eliminar:', e)
    showToast('Error al eliminar el activo', 'error')
  }
}

// 5. Sistema de Notificaciones (Toasts)
const toasts = ref<{id: number, message: string, type: 'success' | 'error'}[]>([])

function showToast(message: string, type: 'success' | 'error') {
  const id = Date.now() + Math.random()
  toasts.value.push({ id, message, type })
  setTimeout(() => {
    toasts.value = toasts.value.filter(t => t.id !== id)
  }, 3000)
}
</script>

<style scoped>
.list-enter-active, .list-leave-active {
  transition: all 0.5s ease;
}
.list-enter-from, .list-leave-to {
  opacity: 0;
  transform: translateX(30px);
}
</style>


