<template>
  <div class="max-w-2xl mx-auto pt-8">
    <h1 class="text-2xl font-bold mb-6 text-[#004aad]">Agregar Responsable</h1>
    
    <ResponsableForm 
      v-model="formData" 
      :preview-image="previewImage || undefined"
      :loading="isSubmitting"
      @submit="submitForm"
      @image-change="handleImageUpload"
    />
  </div>
</template>

<script setup lang="ts">
import { onMounted, watch } from 'vue'

// 1. Instanciamos el composable de API
const api = useApi()
const { addToast } = useToast()

const { 
  formData, 
  previewImage, 
  isSubmitting, 
  validate, 
  handleImageUpload, 
  loadDraft, 
  saveDraft, 
  clearDraft
} = useResponsableForm('responsable-add-draft')

onMounted(() => loadDraft())
watch(() => formData.value, () => saveDraft(), { deep: true })

const submitForm = async () => {
  if (!validate()) return
  
  isSubmitting.value = true
  try {
    // Preparamos el FormData igual que antes
    const body = new FormData()
    body.append('username', formData.value.username)
    body.append('email', formData.value.email)
    body.append('password', formData.value.password)
    body.append('role', formData.value.rol)
    
    if (formData.value.foto) {
      body.append('profileImage', formData.value.foto)
    }

    // 2. Usamos api.fetch. 
    // Nota: No es necesario pasar headers de Content-Type, 
    // el navegador lo hace automáticamente al detectar FormData.
    const response = await api.fetch('/api/users/create', { 
      method: 'POST', 
      body 
    })
    
    addToast('¡Responsable creado con éxito!', 'success')
    clearDraft()
    
    setTimeout(() => {
      navigateTo('/responsable')
    }, 500)

  } catch (e: any) {
    const errorMsg = e?.data?.message || e?.message || 'Error al crear el responsable'
    addToast(errorMsg, 'error')
  } finally {
    isSubmitting.value = false
  }
}
</script>