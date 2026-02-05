<template>
  <div class="max-w-3xl mx-auto pt-8 px-4 pb-12">
    <div class="mb-6">
      <h1 class="text-2xl font-bold text-[#004aad]">Actualizar Activo</h1>
      <p class="text-gray-500 text-sm">ID del activo: {{ id }}</p>
    </div>

    <div class="bg-white rounded-xl shadow-sm border border-gray-100 p-6 md:p-8">
      <div v-if="pendingData || loadingCatalogos" class="py-12 flex flex-col items-center">
        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-[#004aad] mb-4"></div>
        <p class="text-gray-400">Cargando información...</p>
      </div>

      <form v-else @submit.prevent="handleUpdate" class="space-y-6">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label class="block text-sm font-semibold text-gray-700 mb-1">Nombre del Activo *</label>
            <input v-model="formData.nombre" type="text" class="w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-[#004aad]/20 focus:border-[#004aad] border-gray-300 outline-none">
          </div>
          <div>
            <label class="block text-sm font-semibold text-gray-700 mb-1">Código de Inventario *</label>
            <input v-model="formData.codigo" type="text" class="w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-[#004aad]/20 focus:border-[#004aad] border-gray-300 outline-none">
          </div>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label class="block text-sm font-semibold text-gray-700 mb-1">Rótulo / Etiqueta *</label>
            <input v-model="formData.rotulo" type="text" class="w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-[#004aad]/20 focus:border-[#004aad] border-gray-300 outline-none">
          </div>
          <CommonSelect 
            v-model="formData.departamentId"
            label="Departamento Asignado *"
            :options="departamentos"
            placeholder="Seleccione un departamento"
          />
        </div>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4">
          <div>
            <label class="block text-sm font-semibold text-gray-700 mb-1">Valor Inicial ($)</label>
            <input v-model.number="formData.val_inicial" type="number" step="0.01" class="w-full px-4 py-2.5 border rounded-lg border-gray-300 outline-none">
          </div>
          <div>
            <label class="block text-sm font-semibold text-gray-700 mb-1">Valor Residual ($)</label>
            <input v-model.number="formData.val_residual" type="number" step="0.01" class="w-full px-4 py-2.5 border rounded-lg border-gray-300 outline-none">
          </div>
          <div>
            <label class="block text-sm font-semibold text-gray-700 mb-1">Dep. Acumulada ($)</label>
            <input v-model.number="formData.dep_acomulada" type="number" step="0.01" class="w-full px-4 py-2.5 border rounded-lg border-gray-300 outline-none">
          </div>
        </div>

        <div class="flex justify-end space-x-4 pt-8 border-t border-gray-100">
          <button type="button" @click="navigateTo('/activo')" class="px-6 py-2.5 text-sm font-semibold text-gray-600 hover:bg-gray-100 rounded-lg transition-all">Cancelar</button>
          <button type="submit" :disabled="isSubmitting" class="px-8 py-2.5 rounded-lg font-bold text-white bg-[#004aad] hover:bg-[#003580] shadow-lg shadow-[#004aad]/20 flex items-center gap-2">
            <span v-if="isSubmitting" class="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
            {{ isSubmitting ? 'Actualizando...' : 'Guardar Cambios' }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'

const api = useApi()
const route = useRoute()
const id = route.params.id

const { 
  formData, isSubmitting, loadingCatalogos, departamentos, 
  validate, fetchCatalogos, addToast 
} = useActivoForm(`activo-edit-${id}`)

const pendingData = ref(true)

onMounted(async () => {
  // 1. Cargamos departamentos pasando el cliente api
  await fetchCatalogos(api)
  
  try {
    // 2. Cargamos los datos actuales del activo
    const data: any = await api.fetch(`/api/assets/${id}`)
    
    if (data) {
      formData.value = {
        nombre: data.nombre,
        codigo: data.codigo,
        rotulo: data.rotulo,
        val_inicial: Number(data.val_inicial),
        val_residual: Number(data.val_residual),
        dep_acomulada: Number(data.dep_acomulada),
        departamentId: data.departamentId
      }
    }
  } catch (e: any) {
    addToast('No se pudo cargar la información del activo', { type: 'error' } as any)
  } finally {
    pendingData.value = false
  }
})

const handleUpdate = async () => {
  if (!validate()) return
  isSubmitting.value = true
  
  try {
    // 3. PUT a /api/assets/:id (según tus assetRoutes.js)
    await api.fetch(`/api/assets/update/${id}`, {
      method: 'PUT',
      body: formData.value
    })
    
    addToast('Activo actualizado con éxito', { type: 'success' } as any)
    setTimeout(() => navigateTo('/activo'), 500)
  } catch (err: any) {
    addToast(err.data?.message || 'Error al actualizar', { type: 'error' } as any)
  } finally {
    isSubmitting.value = false
  }
}
</script>