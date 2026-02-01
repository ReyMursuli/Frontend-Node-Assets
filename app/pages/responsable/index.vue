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
      <div class="border-b px-4 py-3 font-medium">Listado</div>
      <div class="p-4">
        <div v-if="pending || status === 'loading'" class="flex items-center gap-3 text-slate-600">
          <div class="animate-spin h-5 w-5 border-2 border-[#004aad] border-t-transparent rounded-full"></div>
          Cargando datos desde sesión segura...
        </div>

        <div v-else-if="error" class="text-red-600 p-3 bg-red-50 rounded-md">
          Error al validar credenciales o cargar datos. Reintenta refrescando la página.
        </div>

        <ul v-else class="space-y-2">
          <li v-for="d in departamentos" :key="d.id" class="flex justify-between items-center p-3 hover:bg-slate-50 rounded">
            <div>
              <span class="font-medium">{{ d.nombre }}</span>
              <span class="text-slate-500 text-sm ml-2">· código: {{ d.codigo }}</span>
            </div>
            <div class="flex gap-2">
              <NuxtLink :to="`/departamentos/update/${d.id}`" class="px-2 py-1 text-xs rounded border hover:bg-white">✏️</NuxtLink>
              <button
                @click="onDeleteDepartamento(d)"
                class="px-2 py-1 text-xs rounded border text-red-600 hover:bg-red-50 disabled:opacity-30"
                :disabled="hasActivos(d.id)"
                :title="hasActivos(d.id) ? 'No se puede eliminar: tiene activos asociados' : ''"
              >🗑️</button>
            </div>
          </li>
          <li v-if="departamentos.length === 0" class="text-center py-4 text-slate-400">
            No se encontraron departamentos.
          </li>
        </ul>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">

interface Departamento { id: string | number; nombre: string; codigo: string }
interface Asset { departamentId?: string | number }


const { fetch: apiFetch } = useApi()
const { status } = useAuth() 


const { data: depsData, pending: pendingDeps, error, refresh: refreshDeps } = await useAsyncData(
  'deps-list', 
  () => apiFetch<Departamento[]>('/api/departments'), 
  { 
    server: false,
    watch: [status] 
  }
)

const { data: assetsData, pending: pendingAssets, refresh: refreshAssets } = await useAsyncData(
  'assets-check', 
  () => apiFetch<Asset[]>('/api/assets'), 
  { 
    server: false,
    watch: [status] 
  }
)

// Combinamos los estados de carga
const pending = computed(() => pendingDeps.value || pendingAssets.value)

// 4. Datos computados
const departamentos = computed(() => (depsData.value ?? []) as Departamento[])
const activos = computed(() => (assetsData.value ?? []) as Asset[])

// 5. Métodos
function hasActivos(id: string | number) {
  return activos.value.some(a => String(a.departamentId) === String(id))
}

async function refreshAll() {
  await Promise.all([refreshDeps(), refreshAssets()])
}

async function onDeleteDepartamento(d: Departamento) {
  if (!confirm(`¿Eliminar ${d.nombre}?`)) return
  try {
    await apiFetch(`/api/departments/${d.id}`, { method: 'DELETE' })
    await refreshAll()
  } catch (e) { 
    console.error("Error al eliminar departamento:", e) 
  }
}
</script>