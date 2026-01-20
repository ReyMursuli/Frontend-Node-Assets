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
        <div v-if="pending" class="text-slate-600">Cargando departamentos...</div>
        <div v-else-if="error" class="text-red-600">Error al cargar departamentos</div>
        <ul v-else class="space-y-2">
          <li 
            v-for="d in departamentos" 
            :key="d.id" 
            class="flex justify-between items-center p-3 hover:bg-slate-50 rounded"
          >
            <div>
              <span class="font-medium">{{ d.nombre }}</span>
              <span class="text-slate-500 text-sm ml-2">· código: {{ d.codigo }}</span>
            </div>
            <div class="flex gap-2">
              <NuxtLink
                :to="`/departamentos/update/${d.id}`"
                class="px-2 py-1 text-xs rounded border bg-white hover:bg-slate-50"
              >
                ✏️
              </NuxtLink>
              <button
                @click="onDeleteDepartamento(d)"
                class="px-2 py-1 text-xs rounded border bg-white hover:bg-red-50 text-red-600"
                :disabled="hasActivosAsociados(d.id)"
                :class="{'opacity-50 cursor-not-allowed': hasActivosAsociados(d.id)}"
              >
                🗑️
              </button>
            </div>
          </li>
        </ul>
      </div>
    </div>

    <!-- Toasts -->
    <div class="fixed bottom-4 right-4 space-y-2 z-50">
      <div 
        v-for="toast in toasts" 
        :key="toast.id"
        :class="[
          'px-4 py-2 rounded shadow-lg text-white',
          toast.type === 'success' ? 'bg-green-500' : 'bg-red-500'
        ]"
      >
        {{ toast.message }}
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
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

const { public: { apiBase } } = useRuntimeConfig()
const { data: departamentosData, pending, error, refresh } = await useFetch<Departamento[]>(`${apiBase}/departments`)
const { data: activos } = await useFetch<Asset[]>(`${apiBase}/assets`)

const departamentos = computed<Departamento[]>(() => (departamentosData.value ?? []))

function hasActivosAsociados(departamentoId: number | string) {
  return activos.value?.some(a => a.departamentId === departamentoId)
}

async function onDeleteDepartamento(departamento: Departamento) {
  if (hasActivosAsociados(departamento.id)) {
    showToast('No se puede eliminar un departamento con activos asociados', 'error')
    return
  }

  if (!confirm(`¿Estás seguro de eliminar el departamento ${departamento.nombre}?`)) return
  
  try {
    await $fetch(`${apiBase}/departments/delete/${departamento.id}`, { method: 'DELETE' })
    await refresh()
    showToast('Departamento eliminado correctamente', 'success')
  } catch (e) {
    showToast('Error al eliminar el departamento', 'error')
  }
}

// Toast system
const toasts = ref<{id: number, message: string, type: 'success' | 'error'}[]>([])

function showToast(message: string, type: 'success' | 'error') {
  const id = Date.now() + Math.random()
  toasts.value.push({ id, message, type })
  setTimeout(() => {
    toasts.value = toasts.value.filter(t => t.id !== id)
  }, 3000)
}
</script>