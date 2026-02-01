<template>
  <div class="max-w-2xl mx-auto pt-8 px-4">
    <h1 class="text-2xl font-bold mb-6 text-[#004aad]">Actualizar Departamento</h1>
    
    <div class="bg-white rounded-lg shadow p-6">
      <div v-if="pendingData" class="py-12 flex flex-col items-center">
        <div class="animate-spin rounded-full h-10 w-10 border-b-2 border-[#004aad] mb-4"></div>
        <p class="text-gray-400">Cargando información del departamento...</p>
      </div>

      <form v-else @submit.prevent="handleUpdate" class="space-y-6">
        <div class="space-y-4">
          <div>
            <label class="block text-sm font-semibold text-gray-700 mb-1">Nombre del Departamento *</label>
            <input v-model="formData.nombre" type="text" class="w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-[#004aad]/20 focus:border-[#004aad] border-gray-300 shadow-sm">
          </div>

          <div>
            <label class="block text-sm font-semibold text-gray-700 mb-1">Código *</label>
            <input v-model="formData.codigo" type="text" class="w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-[#004aad]/20 focus:border-[#004aad] border-gray-300 shadow-sm">
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
          <button type="submit" :disabled="isSubmitting" class="px-8 py-2.5 rounded-lg font-bold text-white bg-[#004aad] hover:bg-[#003580] disabled:bg-gray-400 flex items-center gap-2">
            <span v-if="isSubmitting" class="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
            {{ isSubmitting ? 'Guardando cambios...' : 'Actualizar Departamento' }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
const route = useRoute()
const id = route.params.id
const api = useApi() //

// 1. Usamos un prefijo único para el localStorage de edición para evitar choques con el "Add"
const { 
  formData, isSubmitting, loadingUsers, usuarios, 
  validate, loadDraft, saveDraft, clearDraft, fetchUsers, addToast 
} = useDepartmentForm(`dept-edit-draft-${id}`)

const pendingData = ref(true)

onMounted(async () => {

  await fetchUsers()
  
  try {
    loadDraft()
    const hasData = formData.value.nombre || formData.value.codigo
    
    if (!hasData) {
      const data: any = await api.fetch(`/api/departments/${id}`)
      
      if (data) {
        formData.value = {
          nombre: data.nombre,
          codigo: data.codigo,
          responsableId: data.responsableId
        }
      }
    }
  } catch (e: any) {
    addToast('No se pudo cargar la información del departamento', 'error')
  } finally {
    pendingData.value = false
  }
})

// Persistencia automática en LocalStorage mientras el usuario edita
watch(() => formData.value, () => saveDraft(), { deep: true })

const handleUpdate = async () => {
  if (!validate()) return

  isSubmitting.value = true
  try {
    // Usamos api.fetch con método PUT
    await api.fetch(`/api/departments/update/${id}`, { 
      method: 'PUT', 
      body: formData.value 
    })
    
    addToast('Departamento actualizado correctamente', 'success')
    clearDraft() // Limpiamos el localStorage al tener éxito
    setTimeout(() => navigateTo('/departamentos'), 500)
  } catch (e: any) {
    addToast(e.data?.message || 'Error al actualizar el departamento', 'error')
  } finally {
    isSubmitting.value = false
  }
}
</script>