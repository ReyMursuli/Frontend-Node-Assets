<template>
  <section>
    <h1 class="text-2xl font-semibold text-[\#004aad] mb-4">Activos</h1>
    <div class="grid gap-4 md:grid-cols-2">
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
              </tr>
            </tbody>
          </table>
        </div>
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
const API_BASE = 'http://localhost:3000'
const { data, pending, error } = await useAsyncData<Asset[]>('activos', () =>
  $fetch<Asset[]>(`${API_BASE}/assets`)
)

const activos = computed<Asset[]>(() => (data.value ?? []))
</script>


