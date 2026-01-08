<template>
  <section class="min-h-screen bg-gray-50 flex flex-col items-center justify-start pt-8">
    <div class="w-full max-w-2xl px-4 mb-6">
      <div class="flex justify-between items-center">
        <div>
          <h1 class="text-2xl font-semibold text-[#004aad]">Agregar responsable</h1>
          <p class="text-gray-600 mt-2">Complete los datos del nuevo responsable</p>
        </div>
        
        <div 
          v-if="hasDraftSaved" 
          class="bg-blue-50 border border-blue-200 rounded-lg px-3 py-2"
        >
          <div class="flex items-center text-sm text-blue-700">
            <svg class="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"/>
            </svg>
            <span>Borrador guardado</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Formulario Centrado -->
    <div class="w-full max-w-2xl px-4">
      <div class="rounded-lg bg-white shadow p-6">
        <form @submit.prevent="handleSubmit" class="space-y-6">
          <!-- Foto de perfil -->
          <div class="flex flex-col items-center mb-4">
            <div class="relative mb-4">
              <div 
                v-if="!previewImage"
                class="w-32 h-32 rounded-full bg-gray-200 border-4 border-gray-300 flex items-center justify-center"
              >
                <svg class="w-16 h-16 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clip-rule="evenodd" />
                </svg>
              </div>
              
              <div v-else class="relative">
                <img 
                  :src="previewImage" 
                  alt="Preview de foto de perfil" 
                  class="w-32 h-32 rounded-full object-cover border-4 border-gray-300"
                >
                <button
                  type="button"
                  @click="removeImage"
                  class="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                >
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>
            
            <label class="cursor-pointer">
              <input
                type="file"
                ref="fileInput"
                @change="handleImageUpload"
                accept="image/*"
                class="hidden"
              >
              <span class="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors">
                <svg class="w-5 h-5 inline-block mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                </svg>
                {{ previewImage ? 'Cambiar foto' : 'Subir foto de perfil' }}
              </span>
              <p class="text-xs text-gray-500 mt-2 text-center">
                PNG, JPG o GIF (Max. 5MB)
              </p>
            </label>
          </div>

          <!-- Username -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">
              Username *
            </label>
            <div class="relative">
              <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg class="h-5 w-5 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clip-rule="evenodd" />
                </svg>
              </div>
              <input
                v-model="formData.username"
                type="text"
                required
                class="pl-10 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#004aad] focus:border-transparent"
                placeholder="juan.perez"
              >
            </div>
            <p class="text-xs text-gray-500 mt-1">
              Nombre único para iniciar sesión
            </p>
          </div>

          <!-- Email -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">
              Correo electrónico *
            </label>
            <div class="relative">
              <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg class="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89-4.26a2 2 0 011.78 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <input
                v-model="formData.email"
                type="email"
                required
                class="pl-10 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#004aad] focus:border-transparent"
                placeholder="juan.perez@empresa.com"
              >
            </div>
          </div>

          <!-- Rol -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-3">
              Rol *
            </label>
            <div class="grid grid-cols-2 gap-3">
              <label 
                :class="[
                  'border rounded-md p-4 cursor-pointer transition-all',
                  formData.rol === 'admin' 
                    ? 'border-[#004aad] bg-blue-50 ring-2 ring-[#004aad] ring-opacity-20' 
                    : 'border-gray-300 hover:border-gray-400'
                ]"
              >
                <input
                  v-model="formData.rol"
                  type="radio"
                  value="admin"
                  required
                  class="sr-only"
                >
                <div class="flex items-center">
                  <div class="flex-shrink-0">
                    <div class="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                      <svg class="w-5 h-5 text-[#004aad]" fill="currentColor" viewBox="0 0 20 20">
                        <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z" clip-rule="evenodd" />
                      </svg>
                    </div>
                  </div>
                  <div class="ml-3">
                    <p class="text-sm font-medium text-gray-900">Admin</p>
                    <p class="text-xs text-gray-500">Acceso completo</p>
                  </div>
                </div>
              </label>

              <label 
                :class="[
                  'border rounded-md p-4 cursor-pointer transition-all',
                  formData.rol === 'responsable' 
                    ? 'border-[#004aad] bg-blue-50 ring-2 ring-[#004aad] ring-opacity-20' 
                    : 'border-gray-300 hover:border-gray-400'
                ]"
              >
                <input
                  v-model="formData.rol"
                  type="radio"
                  value="responsable"
                  required
                  class="sr-only"
                >
                <div class="flex items-center">
                  <div class="flex-shrink-0">
                    <div class="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center">
                      <svg class="w-5 h-5 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                        <path fill-rule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clip-rule="evenodd" />
                      </svg>
                    </div>
                  </div>
                  <div class="ml-3">
                    <p class="text-sm font-medium text-gray-900">Responsable</p>
                    <p class="text-xs text-gray-500">Gestión limitada</p>
                  </div>
                </div>
              </label>
            </div>
          </div>

          <!-- Botones -->
          <div class="flex justify-between items-center pt-6 border-t">
            <button
              type="button"
              @click="clearDraft"
              class="text-sm text-gray-500 hover:text-gray-700"
              v-if="hasDraftSaved"
            >
              <svg class="w-4 h-4 inline mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
              </svg>
              Eliminar borrador
            </button>
            <div class="flex space-x-3" :class="hasDraftSaved ? 'ml-auto' : 'ml-auto'">
              <button
                type="button"
                @click="onCancel"
                class="px-5 py-2.5 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500 transition-colors"
              >
                Cancelar
              </button>
              <button
                type="submit"
                :disabled="isSubmitting || !formData.rol"
                :class="[
                  'px-5 py-2.5 rounded-md focus:outline-none focus:ring-2 focus:ring-[#004aad] transition-colors',
                  isSubmitting || !formData.rol
                    ? 'bg-gray-400 text-gray-300 cursor-not-allowed'
                    : 'bg-[#004aad] text-white hover:bg-[#003a8a]'
                ]"
              >
                <span v-if="isSubmitting" class="flex items-center">
                  <svg class="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/>
                    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/>
                  </svg>
                  Creando...
                </span>
                <span v-else>Crear responsable</span>
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>

    <Toasts :toasts="toasts" />
  </section>
</template>

<script setup lang="ts">
import type { Toast as ToastType } from '~/components/Toasts.vue'
import { ref, watch, onMounted, computed } from 'vue'
import { navigateTo } from 'nuxt/app'
const { public: { apiBase } } = useRuntimeConfig()

const STORAGE_KEY = 'form-responsable-creacion'

const formData = ref({
  username: '',
  email: '',
  rol: '',
  foto: null as File | null
})

const previewImage = ref<string | null>(null)
const fileInput = ref<HTMLInputElement>()
const isSubmitting = ref(false)
const toasts = ref<ToastType[]>([])

// Funciones localStorage
function saveToLocalStorage() {
  if (typeof window === 'undefined') return
  try {
    const dataToSave = {
      username: formData.value.username,
      email: formData.value.email,
      rol: formData.value.rol,
      hasFoto: !!formData.value.foto
    }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(dataToSave))
  } catch (error) {
    console.error('Error guardando:', error)
  }
}

function loadFromLocalStorage() {
  if (typeof window === 'undefined') return
  try {
    const savedData = localStorage.getItem(STORAGE_KEY)
    if (savedData) {
      const parsedData = JSON.parse(savedData)
      formData.value.username = parsedData.username || ''
      formData.value.email = parsedData.email || ''
      formData.value.rol = parsedData.rol || ''
      if (parsedData.username || parsedData.email) {
        showToast('Datos recuperados del borrador', 'success')
      }
    }
  } catch (error) {
    console.error('Error cargando:', error)
  }
}

function clearLocalStorage() {
  if (typeof window === 'undefined') return
  try {
    localStorage.removeItem(STORAGE_KEY)
  } catch (error) {
    console.error('Error limpiando:', error)
  }
}

const hasDraftSaved = computed(() => {
  if (typeof window === 'undefined') return false
  try {
    const savedData = localStorage.getItem(STORAGE_KEY)
    if (!savedData) return false
    const parsedData = JSON.parse(savedData)
    return !!(parsedData.username || parsedData.email || parsedData.rol)
  } catch {
    return false
  }
})

function clearDraft() {
  if (confirm('¿Estás seguro de eliminar el borrador guardado?')) {
    clearLocalStorage()
    showToast('Borrador eliminado', 'success')
    formData.value = {
      username: '',
      email: '',
      rol: '',
      foto: null
    }
    previewImage.value = null
    if (fileInput.value) {
      fileInput.value.value = ''
    }
  }
}

function handleImageUpload(event: Event) {
  const target = event.target as HTMLInputElement
  const file = target.files?.[0]
  
  if (!file) return
  
  if (!file.type.startsWith('image/')) {
    showToast('Por favor, selecciona una imagen válida', 'error')
    return
  }
  
  if (file.size > 5 * 1024 * 1024) {
    showToast('La imagen no debe superar los 5MB', 'error')
    return
  }
  
  formData.value.foto = file
  
  const reader = new FileReader()
  reader.onload = (e) => {
    previewImage.value = e.target?.result as string
  }
  reader.readAsDataURL(file)
  
  saveToLocalStorage()
}

function removeImage() {
  formData.value.foto = null
  previewImage.value = null
  if (fileInput.value) {
    fileInput.value.value = ''
  }
  saveToLocalStorage()
}

function showToast(message: string, type: 'success' | 'error') {
  const id = Date.now() + Math.random()
  toasts.value.push({ id, message, type })
  setTimeout(() => { 
    toasts.value = toasts.value.filter(t => t.id !== id) 
  }, 2500)
}

async function handleSubmit() {
  if (isSubmitting.value || !formData.value.rol) return
  
  try {
    isSubmitting.value = true
    
    if (!formData.value.username.trim()) {
      showToast('El username es requerido', 'error')
      isSubmitting.value = false
      return
    }
    
    if (!formData.value.email.includes('@')) {
      showToast('Email inválido', 'error')
      isSubmitting.value = false
      return
    }
    
    const formDataToSend = new FormData()
    formDataToSend.append('username', formData.value.username)
    formDataToSend.append('email', formData.value.email)
    formDataToSend.append('rol', formData.value.rol)
    
    if (formData.value.foto) {
      formDataToSend.append('foto', formData.value.foto)
    }
await $fetch(`${apiBase}/usuarios/create`, {
  method: 'POST',
  body: formDataToSend, // Usa FormData para enviar archivos
  headers: {
    // Los headers para FormData se generan automáticamente
  }
})
    
    showToast('Responsable creado exitosamente', 'success')
    clearLocalStorage()
    
    formData.value = {
      username: '',
      email: '',
      rol: '',
      foto: null
    }
    previewImage.value = null
    if (fileInput.value) {
      fileInput.value.value = ''
    }
    
    setTimeout(() => {
      navigateTo('/responsable')
    }, 1500)
    
  } catch (error) {
    console.error('Error:', error)
    showToast('Error al crear el responsable. Intenta nuevamente.', 'error')
  } finally {
    isSubmitting.value = false
  }
}

function onCancel() {
  const hasData = formData.value.username || formData.value.email || formData.value.rol
    
  navigateTo('/responsable')
}

// Hooks
onMounted(() => {
  loadFromLocalStorage()
})

watch(
  () => [formData.value.username, formData.value.email, formData.value.rol],
  () => {
    const timer = setTimeout(() => {
      saveToLocalStorage()
    }, 500)
    return () => clearTimeout(timer)
  },
  { deep: true }
)
</script>

<style scoped>
input[type="radio"]:checked + div {
  border-color: #004aad;
}
</style>