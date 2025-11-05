<template>
  <section>
    <h1 class="text-2xl font-semibold text-[\#004aad] mb-4">Departamentos</h1>
    <div class="rounded-lg bg-white shadow">
      <div class="border-b px-4 py-3 font-medium">Listado</div>
      <div class="p-4">
        <div v-if="pending" class="text-slate-600">Cargando departamentos...</div>
        <div v-else-if="error" class="text-red-600">Error al cargar departamentos</div>
        <ul v-else class="list-disc list-inside space-y-1 text-slate-700">
          <li v-for="d in departamentos" :key="d.id">
            <span class="font-medium">{{ d.nombre }}</span>
            <span class="text-slate-500"> · código: {{ d.codigo }}</span>
          </li>
        </ul>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
type Departamento = { id: number | string; nombre: string; codigo: string }
const API_BASE = 'http://localhost:3000'
const { data, pending, error } = await useAsyncData<Departamento[]>('departamentos', () =>
  $fetch<Departamento[]>(`${API_BASE}/departments`)
)
const departamentos = computed<Departamento[]>(() => (data.value ?? []))
</script>


