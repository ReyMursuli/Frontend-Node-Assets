<template>
  <div class="max-w-2xl mx-auto pt-8 px-4">
    <h1 class="text-2xl font-bold mb-6 text-[#004aad]">Agregar Departamento</h1>
    
    <div class="bg-white rounded-lg shadow p-6">
      <form @submit.prevent="submitForm" class="space-y-6">
        <div class="space-y-4">
          <div>
            <label class="block text-sm font-semibold text-gray-700 mb-1">Nombre del Departamento *</label>
            <input 
              v-model="formData.nombre" 
              type="text" 
              placeholder="Ej: Recursos Humanos" 
              class="w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-[#004aad]/20 focus:border-[#004aad] border-gray-300 shadow-sm"
            >
          </div>

          <div>
            <label class="block text-sm font-semibold text-gray-700 mb-1">Código *</label>
            <input 
              v-model="formData.codigo" 
              type="text" 
              placeholder="Ej: RRHH-01" 
              class="w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-[#004aad]/20 focus:border-[#004aad] border-gray-300 shadow-sm"
            >
          </div>

          <CommonSelect 
            v-model="formData.responsableId"
            label="Responsable del Departamento"
            :options="usuarios"
            :disabled="loadingUsers"
            placeholder="Seleccione un responsable"
          />
          <p v-if="loadingUsers" class="text-xs text-gray-500 italic">Cargando lista de usuarios...</p>
        </div>

        <div class="flex justify-end space-x-4 pt-8 border-t border-gray-100">
          <button 
            type="button" 
            @click="navigateTo('/departamentos')" 
            class="px-6 py-2.5 text-sm font-semibold text-gray-600 hover:bg-gray-100 rounded-lg"
          >
            Cancelar
          </button>
          <button 
            type="submit" 
            :disabled="isSubmitting" 
            class="px-8 py-2.5 rounded-lg font-bold text-white bg-[#004aad] hover:bg-[#003580] disabled:bg-gray-400"
          >
            {{ isSubmitting ? 'Guardando...' : 'Registrar Departamento' }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, watch } from 'vue'

// 1. Instanciamos el cliente de API (useApi.ts)
// Este cliente inyecta automáticamente el Token Bearer y la URL Base
const api = useApi()

// 2. Desestructuramos el composable del formulario
const { 
  formData, 
  isSubmitting, 
  loadingUsers, 
  usuarios, 
  validate, 
  loadDraft, 
  saveDraft, 
  clearDraft, 
  fetchUsers, 
  addToast 
} = useDepartmentForm('dept-add-draft')

// 3. Carga inicial: Borrador y lista de usuarios desde el backend
onMounted(() => {
  loadDraft()
  fetchUsers(api) // Se le pasa 'api' para que use el $fetch configurado con auth
})

// 4. Guardado automático de borrador en LocalStorage
watch(() => formData.value, () => saveDraft(), { deep: true })

/**
 * Lógica de envío del formulario
 */
const submitForm = async () => {
  // Validación local (nombre y código obligatorios)
  if (!validate()) return

  isSubmitting.value = true
  try {
    // Petición POST al endpoint de creación definido en Express
    await api.fetch('/api/departments/create', { 
      method: 'POST', 
      body: formData.value 
    })
    
    // Notificación de éxito usando objeto de opciones para evitar error de TS
    addToast('¡Departamento creado con éxito!', { type: 'success' } as any)
    
    // Limpieza y redirección
    clearDraft() 
    setTimeout(() => navigateTo('/departamentos'), 500)
    
  } catch (e: any) {
    console.error("Error al crear departamento:", e)
    // Notificación de error con mensaje desde el backend si existe
    addToast(e.data?.message || 'Error al crear el departamento', { type: 'error' } as any)
  } finally {
    isSubmitting.value = false
  }
}
</script>