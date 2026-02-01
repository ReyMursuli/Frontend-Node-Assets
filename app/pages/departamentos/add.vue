<template>
  <div class="max-w-2xl mx-auto pt-8 px-4">
    <h1 class="text-2xl font-bold mb-6 text-[#004aad]">Agregar Departamento</h1>
    
    <div class="bg-white rounded-lg shadow p-6">
      <form @submit.prevent="submitForm" class="space-y-6">
        <div class="space-y-4">
          <div>
            <label class="block text-sm font-semibold text-gray-700 mb-1">Nombre del Departamento *</label>
            <input v-model="formData.nombre" type="text" placeholder="Ej: Recursos Humanos" class="w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-[#004aad]/20 focus:border-[#004aad] border-gray-300 shadow-sm">
          </div>

          <div>
            <label class="block text-sm font-semibold text-gray-700 mb-1">Código *</label>
            <input v-model="formData.codigo" type="text" placeholder="Ej: RRHH-01" class="w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-[#004aad]/20 focus:border-[#004aad] border-gray-300 shadow-sm">
          </div>

          <CommonSelect 
            v-model="formData.responsableId"
            label="Responsable del Departamento"
            :options="usuarios"
            :disabled="loadingUsers"
          />
        </div>

        <div class="flex justify-end space-x-4 pt-8 border-t border-gray-100">
          <button type="button" @click="navigateTo('/departamentos')" class="px-6 py-2.5 text-sm font-semibold text-gray-600 hover:bg-gray-100 rounded-lg">Cancelar</button>
          <button type="submit" :disabled="isSubmitting" class="px-8 py-2.5 rounded-lg font-bold text-white bg-[#004aad] hover:bg-[#003580] disabled:bg-gray-400">
            {{ isSubmitting ? 'Guardando...' : 'Registrar Departamento' }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
// 1. Instanciamos el composable de API para manejar auth y baseURL automáticamente
const api = useApi()

const { 
  formData, isSubmitting, loadingUsers, usuarios, 
  validate, loadDraft, saveDraft, clearDraft, fetchUsers, addToast 
} = useDepartmentForm('dept-add-draft')

onMounted(() => {
  loadDraft()
  fetchUsers()
})

// Guardar borrador automáticamente al cambiar cualquier campo
watch(() => formData.value, () => saveDraft(), { deep: true })

const submitForm = async () => {
  if (!validate()) return

  isSubmitting.value = true
  try {
    // 2. Usamos api.fetch en lugar del $fetch global. 
    // Esto inyecta automáticamente el header 'Authorization'.
    await api.fetch('/api/departments/create', { 
      method: 'POST', 
      body: formData.value 
    })
    
    addToast('¡Creado con éxito!', 'success')
    clearDraft() 
    setTimeout(() => navigateTo('/departamentos'), 500)
  } catch (e: any) {
    // 3. El error se captura de la misma forma, pero con la seguridad de que
    // la petición fue enviada con las credenciales correctas.
    addToast(e.data?.message || 'Error al crear', 'error')
  } finally {
    isSubmitting.value = false
  }
}
</script>