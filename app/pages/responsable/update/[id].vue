<template>
  <section class="min-h-screen bg-gray-50 flex flex-col items-center justify-start pt-8">
    <div class="w-full max-w-2xl px-4 mb-6">
      <h1 class="text-2xl font-semibold text-[#004aad]">Actualizar Responsable</h1>
      <p class="text-gray-600">Modifique la información del usuario seleccionado</p>
    </div>

    <div class="w-full max-w-2xl px-4">
      <div class="rounded-lg bg-white shadow p-6">
        <div v-if="pending" class="py-12 flex justify-center">
          <div class="animate-spin rounded-full h-10 w-10 border-b-2 border-[#004aad]"></div>
        </div>

        <ResponsableForm
          v-else
          v-model="formData"
          :preview-image="previewImage ?? undefined"
          :loading="isSubmitting"
          :is-editing="true"
          @submit="handleUpdate"
          @image-change="handleImageUpload"
        />
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { watch } from 'vue'

const route = useRoute()
const { public: { apiBase } } = useRuntimeConfig()
const id = route.params.id

// 1. Inicializamos la lógica del formulario
// Usamos un ID único para el borrador de edición
const { 
  formData, 
  previewImage, 
  isSubmitting, 
  validate, 
  handleImageUpload 
} = useResponsableForm(`edit-user-${id}`)

// 2. Obtener los datos actuales del backend
// Según tu ruta: GET /usuarios/:id
const { data: response, pending } = await useFetch<any>(`${apiBase}/usuarios/${id}`, {
  key: `user-data-${id}`
})

// 3. Llenar el formulario con los datos recibidos
watch(response, (newData) => {
  if (newData && newData.user) {
    const u = newData.user
    formData.value.username = u.username
    formData.value.email = u.email
    formData.value.rol = u.role // Mapeamos 'role' del back a 'rol' del front
    
    // Si tiene imagen, formamos la URL (ajusta el puerto si es necesario)
    if (u.profileImage) {
      previewImage.value = `http://localhost:3000/${u.profileImage}`
    }
  }
}, { immediate: true })

// 4. Lógica de Envío (Update)
const handleUpdate = async () => {
  if (!validate()) return

  isSubmitting.value = true
  
  try {
    // Usamos FormData porque tu backend usa Multer (upload.single)
    const body = new FormData()
    
    // Tu backend exige: username, role, email en el req.body
    body.append('username', formData.value.username)
    body.append('email', formData.value.email)
    body.append('role', formData.value.rol) // Enviamos como 'role' para tu backend
    
    // Solo adjuntamos la imagen si el usuario seleccionó una nueva
    if (formData.value.foto) {
      body.append('profileImage', formData.value.foto)
    }

    // Petición PUT a /usuarios/update/:id
    await $fetch(`${apiBase}/usuarios/update/${id}`, {
      method: 'PUT',
      body
    })

    // Si todo sale bien, volvemos al listado
    navigateTo('/responsable')
    
  } catch (err: any) {
    console.error('Error al actualizar:', err)
    const errorMsg = err.data?.message || 'Error al comunicarse con el servidor'
    alert(`No se pudo actualizar: ${errorMsg}`)
  } finally {
    isSubmitting.value = false
  }
}
</script>