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

// 1. Importamos el sistema de Toasts
const { addToast } = useToast()

const { 
  formData, 
  previewImage, 
  isSubmitting, 
  validate, 
  handleImageUpload, 
  loadDraft, 
  saveDraft, 
  clearDraft, 
  apiBase 
} = useResponsableForm('responsable-add-draft')

onMounted(() => loadDraft())
watch(() => formData.value, () => saveDraft(), { deep: true })

const submitForm = async () => {
  if (!validate()) return
  
  isSubmitting.value = true
  try {
    const body = new FormData()
    body.append('username', formData.value.username)
    body.append('email', formData.value.email)
    
    // IMPORTANTE: Tu backend espera 'role' (con e)
    body.append('role', formData.value.rol)
    
    if (formData.value.foto) {
      body.append('profileImage', formData.value.foto)
    }

    await $fetch(`${apiBase}/usuarios/create`, { 
      method: 'POST', 
      body 
    })
    
    addToast('¡Responsable creado con éxito!', 'success')
    
    clearDraft()
    
    setTimeout(() => {
      navigateTo('/responsable')
    }, 500)

  } catch (e: any) {
    console.error('Error en el registro:', e)
    
    const errorMsg = e.data?.message || 'Error al crear el responsable'
    addToast(errorMsg, 'error')
    
  } finally {
    isSubmitting.value = false
  }
}
</script>