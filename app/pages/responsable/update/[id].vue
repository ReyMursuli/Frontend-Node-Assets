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

    <Toasts />
  </section>
</template>

<script setup lang="ts">
import { watch } from 'vue'

const route = useRoute()
const id = route.params.id

// 1. Instanciamos el composable de API y Toasts
const api = useApi()
const { addToast } = useToast()

const { 
  formData, 
  previewImage, 
  isSubmitting, 
  validate, 
  handleImageUpload 
} = useResponsableForm(`edit-user-${id}`)

// 2. Obtener los datos actuales usando api.fetch
// Usamos useAsyncData para envolver api.fetch y manejar el estado de carga (pending)
const { data: response, pending, error: fetchError } = await useAsyncData(
  `user-data-${id}`,
  () => api.fetch<any>(`/api/users/${id}`),
  { server: false }
)

watch(fetchError, (e) => {
  if (e) {
    addToast('No se pudieron cargar los datos del responsable', 'error')
  }
}, { immediate: true })

// 3. Llenar el formulario con los datos recibidos
watch(response, (newData) => {
  if (newData && newData.user) {
    const u = newData.user
    formData.value.username = u.username
    formData.value.email = u.email
    formData.value.rol = u.role
    
    if (u.profileImage) {
      // Nota: Si usas una URL absoluta para la vista previa, 
      // asegúrate de que coincida con tu configuración de backend
      previewImage.value = `http://localhost:3000/${u.profileImage}`
    }
  }
}, { immediate: true })

// 4. Lógica de Actualización (PUT)
const handleUpdate = async () => {
  if (!validate()) {
    addToast('Revisa los campos requeridos antes de actualizar', 'error')
    return
  }

  isSubmitting.value = true
  
  try {
    const body = new FormData()
    body.append('username', formData.value.username)
    body.append('email', formData.value.email)
    body.append('role', formData.value.rol)
    
    if (formData.value.foto) {
      body.append('profileImage', formData.value.foto)
    }

    // Usamos api.fetch con el método PUT y la URL relativa
    await api.fetch(`/api/users/update/${id}`, {
      method: 'PUT',
      body
    })

    addToast('Responsable actualizado correctamente', 'success')

    setTimeout(() => {
      navigateTo('/responsable')
    }, 500)
    
  } catch (err: any) {
    const errorMsg = err.data?.message || 'Error al comunicarse con el servidor'
    addToast(`No se pudo actualizar: ${errorMsg}`, 'error')
  } finally {
    isSubmitting.value = false
  }
}
</script>