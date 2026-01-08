<template>
  <section class="space-y-6">
    <header class="flex items-center justify-between pb-3 border-b">
      <h1 class="text-xl font-bold">Dashboard Principal</h1>
      <div class="flex items-center gap-3">
        <div class="w-10 h-10 rounded-full bg-[\#004aad] text-white flex items-center justify-center font-bold">U</div>
        <span>Usuario</span>
      </div>
    </header>

    <div class="grid gap-4 md:grid-cols-3">
      <div class="rounded-xl bg-white shadow p-5">
        <h2 class="text-[\#004aad] font-semibold mb-2">Activos Totales</h2>
        <p class="text-3xl font-bold">{{ totalActivos }}</p>
      </div>
      <div class="md:col-span-2 rounded-xl bg-white shadow p-5">
        <h2 class="text-[\#004aad] font-semibold mb-2">Departamentos</h2>
        <div v-if="pendingDeps" class="text-slate-600">Cargando...</div>
        <div v-else-if="errorDeps" class="text-red-600">Error al cargar departamentos</div>
        <ul v-else class="grid sm:grid-cols-2 md:grid-cols-3 gap-2">
          <li v-for="d in departamentos" :key="d.id" class="px-3 py-2 rounded border">{{ d.nombre }}</li>
        </ul>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
type Asset = { id: number | string }
type Departamento = { id: number | string; nombre: string }
const { public: { apiBase } } = useRuntimeConfig()
const { data: assetsData, pending: pendingAssets, error: errorAssets } = await useFetch<Asset[]>(`${apiBase}/assets`)
const { data: depsData, pending: pendingDeps, error: errorDeps } = await useFetch<Departamento[]>(`${apiBase}/departments`)

const totalActivos = computed(() => (assetsData.value?.length ?? 0))
const departamentos = computed(() => (depsData.value ?? []))
</script>