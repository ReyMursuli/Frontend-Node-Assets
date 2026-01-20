<template>
  <section>
    <div class="flex justify-between items-center mb-6">
      <h1 class="text-2xl font-semibold text-[#004aad]">Responsables</h1>
      <NuxtLink
        to="/responsable/add"
        class="flex items-center gap-1 px-4 py-2 rounded-md bg-[#004aad] text-white hover:bg-[#003d8f] transition-colors"
      >
        <span>+</span> Agregar usuario
      </NuxtLink>
    </div>
    <div class="rounded-lg bg-white shadow">
      <div class="border-b px-4 py-3">
        <span class="font-medium">Total de usuarios <span class="text-slate-500 font-normal">(Total: {{ usuarios.length }})</span></span>
      </div>
      <div class="p-4">
        <div v-if="pending" class="text-slate-600">Cargando responsables...</div>
        <div v-else-if="error" class="text-red-600">Error al cargar responsables</div>
        <div v-else class="grid gap-3 md:grid-cols-2">
          <div
            v-for="u in usuarios"
            :key="u.id"
            class="rounded-lg border bg-white px-4 py-3"
          >
            <div class="flex items-center justify-between gap-3">
              <button type="button" class="px-4 py-2 rounded-full border bg-white hover:bg-slate-50 text-slate-800 font-medium">
                {{ u.username ?? u.nombre ?? 'Sin nombre' }}
              </button>
              <div class="flex items-center gap-2">
                <NuxtLink
                  :to="`/responsable/update/${u.id}`"
                  class="px-3 py-1 rounded-full border bg-white hover:bg-slate-50 text-slate-700 text-sm"
                >Actualizar</NuxtLink>
                <button
                  class="px-3 py-1 rounded-full border bg-white hover:bg-red-50 text-red-600 text-sm"
                  @click="onDeleteUser(u)"
                >Eliminar</button>
              </div>
            </div>
            <p class="text-xs text-slate-600 mt-2">Email: {{ u.email ?? '—' }}</p>
            <p class="text-xs text-slate-600">Activos a cargo: {{ activosPorUsuario[u.id] ?? 0 }}</p>
          </div>
        </div>
      </div>
    </div>

    

    <Toasts :toasts="toasts" />
  </section>
</template>

<script setup lang="ts">
type Usuario = { id: number | string; username?: string; nombre?: string; email?: string }
type Departamento = { id: number | string; nombre: string; responsableId?: number | string }
type Asset = { id: number | string; departamentId?: number | string }
const { public: { apiBase } } = useRuntimeConfig()
const { data, pending, error, refresh } = await useFetch<Usuario[]>(`${apiBase}/usuarios`)
const usuarios = computed<Usuario[]>(() => (data.value ?? []))

// Traer departamentos y activos para computar activos por responsable
const { data: deps } = await useFetch<Departamento[]>(`${apiBase}/departments`)
const { data: assets } = await useFetch<Asset[]>(`${apiBase}/assets`)

const activosPorUsuario = computed<Record<string | number, number>>(() => {
  const mapa: Record<string | number, number> = {}
  const departamentos = deps.value ?? []
  const activos = assets.value ?? []
  for (const d of departamentos) {
    const depId = d.id
    const respId = d.responsableId as string | number | undefined
    if (!respId) continue
    const count = activos.filter(a => a.departamentId === depId).length
    mapa[respId] = (mapa[respId] ?? 0) + count
  }
  return mapa
})

 
 
async function onDeleteUser(u: Usuario) {
  if (!confirm(`Eliminar a ${u.username ?? u.nombre ?? 'este usuario'}?`)) return
  try {
    await $fetch(`${apiBase}/usuarios/delete/${u.id}`, { method: 'DELETE' })
    await refresh()
    showToast('Usuario eliminado', 'success')
  } catch (e) {
    showToast('Error al eliminar usuario', 'error')
  }
}

// Toast simple
import type { Toast as ToastType } from '~/components/Toasts.vue'
const toasts = ref<ToastType[]>([])
function showToast(message: string, type: 'success' | 'error') {
  const id = Date.now() + Math.random()
  toasts.value.push({ id, message, type })
  setTimeout(() => {
    toasts.value = toasts.value.filter(t => t.id !== id)
  }, 2500)
}
</script>


