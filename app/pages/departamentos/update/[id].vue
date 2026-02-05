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
            placeholder="Seleccione un responsable"
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
import { ref, onMounted, watch } from 'vue'

const route = useRoute()
const id = route.params.id
const api = useApi()

const { 
  formData, isSubmitting, loadingUsers, usuarios, 
  validate, loadDraft, saveDraft, clearDraft, fetchUsers, addToast 
} = useDepartmentForm(`dept-edit-draft-${id}`)

const pendingData = ref(true)

onMounted(async () => {
  // 1. Cargamos la lista de usuarios para el select
  await fetchUsers(api)
  
  try {
    // 2. Intentamos cargar borrador local
    loadDraft()
    
    // 3. Si no hay borrador, pedimos los datos reales al servidor
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
    addToast('No se pudo cargar la información', { type: 'error' } as any)
  } finally {
    pendingData.value = false
  }
})

// Guardado automático del borrador durante la edición
watch(() => formData.value, () => saveDraft(), { deep: true })

const handleUpdate = async () => {
  if (!validate()) return

  isSubmitting.value = true
  try {
    // 4. Petición PUT al endpoint de actualización
    await api.fetch(`/api/departments/${id}`, { 
      method: 'PUT', 
      body: formData.value 
    })
    
    addToast('Departamento actualizado correctamente', { type: 'success' } as any)
    clearDraft() 
    setTimeout(() => navigateTo('/departamentos'), 500)
  } catch (e: any) {
    addToast(e.data?.message || 'Error al actualizar', { type: 'error' } as any)
  } finally {
    isSubmitting.value = false
  }
}
</script>