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
        <p class="text-sm text-slate-600">Total de activos: <span class="font-semibold">{{ activos?.length ?? 0 }}</span></p>
      </div>
    </div>
    <div class="mt-6 rounded-lg bg-white shadow">
      <div class="border-b px-4 py-3 font-medium">Listado</div>
      <div class="p-4">
        <div v-if="pending" class="text-slate-600">Cargando activos...</div>
        <div v-else-if="error" class="text-red-600">Error al cargar activos</div>
        <div v-else>
          <table class="w-full text-sm">
            <thead>
              <tr class="text-left text-slate-600">
                <th class="py-2">Nombre</th>
                <th class="py-2">Código</th>
                <th class="py-2">Rótulo</th>
                <th class="py-2">Valor inicial</th>
                <th class="py-2">Valor residual</th>
                <th class="py-2">Dep. acumulada</th>
                <th class="py-2">Departamento</th>
                <th class="py-2">Acciones</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="a in activos" :key="a.id" class="border-t">
                <td class="py-2">{{ a.nombre }}</td>
                <td class="py-2">{{ a.codigo }}</td>
                <td class="py-2">{{ a.rotulo }}</td>
                <td class="py-2">{{ a.val_inicial }}</td>
                <td class="py-2">{{ a.val_residual }}</td>
                <td class="py-2">{{ a.dep_acomulada }}</td>
                <td class="py-2">{{ a.departamentId ?? '—' }}</td>
                <td class="py-2">
                  <div class="flex gap-2">
                    <NuxtLink
                      :to="`/activo/update/${a.id}`"
                      class="px-2 py-1 text-xs rounded border bg-white hover:bg-slate-50"
                    >
                      ✏️
                    </NuxtLink>
                    <button
                      @click="onDeleteActivo(a)"
                      class="px-2 py-1 text-xs rounded border bg-white hover:bg-red-50 text-red-600"
                    >
                      🗑️
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
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
type Asset = {
  id: number | string;
  nombre: string;
  codigo: string;
  rotulo: string;
  val_inicial: string | number;
  val_residual: string | number;
  dep_acomulada: string | number;
  departamentId?: number | string;
}
const { public: { apiBase } } = useRuntimeConfig()
const { data, pending, error, refresh } = await useFetch<Asset[]>(`${apiBase}/assets`)

const activos = computed<Asset[]>(() => (data.value ?? []))

async function onDeleteActivo(activo: Asset) {
  if (!confirm(`¿Estás seguro de eliminar el activo ${activo.nombre}?`)) return
  try {
    await $fetch(`${apiBase}/assets/delete/${activo.id}`, { method: 'DELETE' })
    await refresh()
    showToast('Activo eliminado correctamente', 'success')
  } catch (e) {
    showToast('Error al eliminar el activo', 'error')
  }
}

// Toast function
const toasts = ref<{id: number, message: string, type: 'success' | 'error'}[]>([])

function showToast(message: string, type: 'success' | 'error') {
  const id = Date.now() + Math.random()
  toasts.value.push({ id, message, type })
  setTimeout(() => {
    toasts.value = toasts.value.filter(t => t.id !== id)
  }, 3000)
}
</script>


