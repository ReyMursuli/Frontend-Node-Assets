<template>
  <div class="max-w-3xl mx-auto pt-8 px-4 pb-12">
    <h1 class="text-2xl font-bold mb-6 text-[#004aad]">Registrar Nuevo Activo</h1>
    
    <div class="bg-white rounded-xl shadow-sm border border-gray-100 p-6 md:p-8">
      <form @submit.prevent="submitForm" class="space-y-6">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label class="block text-sm font-semibold text-gray-700 mb-1">Nombre del Activo *</label>
            <input v-model="formData.nombre" type="text" placeholder="Ej: Laptop Dell Latitude" class="w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-[#004aad]/20 focus:border-[#004aad] border-gray-300 outline-none">
          </div>
          <div>
            <label class="block text-sm font-semibold text-gray-700 mb-1">Código de Inventario *</label>
            <input v-model="formData.codigo" type="text" placeholder="Ej: ACT-001" class="w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-[#004aad]/20 focus:border-[#004aad] border-gray-300 outline-none">
          </div>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label class="block text-sm font-semibold text-gray-700 mb-1">Rótulo / Etiqueta *</label>
            <input v-model="formData.rotulo" type="text" placeholder="Número de serie o placa" class="w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-[#004aad]/20 focus:border-[#004aad] border-gray-300 outline-none">
          </div>
          <CommonSelect 
            v-model="formData.departamentId"
            label="Departamento Asignado *"
            placeholder="Seleccione departamento"
            :options="departamentos"
            :disabled="loadingCatalogos"
          />
        </div>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4">
          <div>
            <label class="block text-sm font-semibold text-gray-700 mb-1">Valor Inicial ($)</label>
            <input v-model.number="formData.val_inicial" type="number" step="0.01" class="w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-[#004aad]/20 focus:border-[#004aad] border-gray-300 outline-none">
          </div>
          <div>
            <label class="block text-sm font-semibold text-gray-700 mb-1">Valor Residual ($)</label>
            <input v-model.number="formData.val_residual" type="number" step="0.01" class="w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-[#004aad]/20 focus:border-[#004aad] border-gray-300 outline-none">
          </div>
          <div>
            <label class="block text-sm font-semibold text-gray-700 mb-1">Dep. Acumulada ($)</label>
            <input v-model.number="formData.dep_acomulada" type="number" step="0.01" class="w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-[#004aad]/20 focus:border-[#004aad] border-gray-300 outline-none">
          </div>
        </div>

        <div class="flex justify-end space-x-4 pt-8 border-t border-gray-100">
          <button type="button" @click="navigateTo('/activo')" class="px-6 py-2.5 text-sm font-semibold text-gray-600 hover:bg-gray-100 rounded-lg transition-all">Cancelar</button>
          <button type="submit" :disabled="isSubmitting" class="px-8 py-2.5 rounded-lg font-bold text-white bg-[#004aad] hover:bg-[#003580] shadow-lg shadow-[#004aad]/20 disabled:bg-gray-400 flex items-center gap-2">
            <span v-if="isSubmitting" class="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
            {{ isSubmitting ? 'Guardando...' : 'Registrar Activo' }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
const { 
  formData, isSubmitting, loadingCatalogos, departamentos, 
  validate, loadDraft, saveDraft, clearDraft, fetchCatalogos, apiBase, addToast 
} = useActivoForm('activo-add-draft')

onMounted(() => {
  loadDraft()
  fetchCatalogos()
})

watch(() => formData.value, () => saveDraft(), { deep: true })

const submitForm = async () => {
  if (!validate()) return

  isSubmitting.value = true
  try {
    await $fetch(`${apiBase}/assets/create`, {
      method: 'POST',
      body: formData.value
    })
    addToast('Activo registrado correctamente', 'success')
    clearDraft()
    setTimeout(() => navigateTo('/activo'), 500)
  } catch (e: any) {
    addToast(e.data?.message || 'Error al registrar el activo', 'error')
  } finally {
    isSubmitting.value = false
  }
}
</script>