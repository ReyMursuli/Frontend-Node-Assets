<template>
  <section class="min-h-screen bg-gray-50 flex flex-col items-center justify-start pt-8">
    <!-- Título con indicador de borrador -->
    <div class="w-full max-w-2xl px-4 mb-6">
      <div class="flex justify-between items-center">
        <div>
          <h1 class="text-2xl font-semibold text-[#004aad]">Agregar Departamento</h1>
          <p class="text-gray-600 mt-2">Complete los datos del nuevo departamento</p>
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
          <!-- Información del Departamento -->
          <div class="space-y-4">
            <!-- Nombre -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">
                Nombre del Departamento *
              </label>
              <input
                v-model="formData.nombre"
                type="text"
                required
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#004aad] focus:border-transparent"
                placeholder="Ej: Recursos Humanos"
              >
            </div>

            <!-- Código -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">
                Código Único *
              </label>
              <div class="relative">
                <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg class="h-5 w-5 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M5 2a1 1 0 011 1v1h1a1 1 0 010 2H6v1a1 1 0 01-2 0V6H3a1 1 0 010-2h1V3a1 1 0 011-1zm0 10a1 1 0 011 1v1h1a1 1 0 110 2H6v1a1 1 0 11-2 0v-1H3a1 1 0 110-2h1v-1a1 1 0 011-1zM12 2a1 1 0 01.967.744L14.146 7.2 17.5 9.134a1 1 0 010 1.732l-3.354 1.935-1.18 4.455a1 1 0 01-1.933 0L9.854 12.2 6.5 10.266a1 1 0 010-1.732l3.354-1.935 1.18-4.455A1 1 0 0112 2z" clip-rule="evenodd"/>
                  </svg>
                </div>
                <input
                  v-model="formData.codigo"
                  type="text"
                  required
                  :class="[
                    'pl-10 w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#004aad] focus:border-transparent',
                    codigoError ? 'border-red-300' : 'border-gray-300'
                  ]"
                  placeholder="Ej: DEP-RH-001"
                  @input="validateCodigo"
                >
              </div>
              <p v-if="codigoError" class="text-xs text-red-500 mt-1">
                {{ codigoError }}
              </p>
              <p v-else class="text-xs text-gray-500 mt-1">
                Código único para identificar el departamento
              </p>
            </div>

            <!-- Responsable -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">
                Responsable
              </label>
              <div class="relative">
                <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg class="h-5 w-5 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clip-rule="evenodd"/>
                  </svg>
                </div>
                <select
                  v-model="formData.responsableId"
                  class="pl-10 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#004aad] focus:border-transparent"
                >
                  <option value="">Seleccionar responsable</option>
                  <option v-for="user in usuarios" :key="user.id" :value="user.id">
                    {{ user.username }} - {{ user.email }}
                  </option>
                </select>
              </div>
              <p class="text-xs text-gray-500 mt-1">
                Persona encargada del departamento (opcional)
              </p>
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
                :disabled="isSubmitting || !isFormValid || codigoError"
                :class="[
                  'px-5 py-2.5 rounded-md focus:outline-none focus:ring-2 focus:ring-[#004aad] transition-colors',
                  isSubmitting || !isFormValid || codigoError
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
                <span v-else>Crear Departamento</span>
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

const STORAGE_KEY = 'form-departamento-creacion'

// Estado del formulario según tu modelo Departament
const formData = ref({
  nombre: '',
  codigo: '',
  responsableId: null as number | null
})

const codigoError = ref('')
const isSubmitting = ref(false)
const toasts = ref<ToastType[]>([])

// Computed para validaciones
const isFormValid = computed(() => {
  return (
    formData.value.nombre.trim() !== '' &&
    formData.value.codigo.trim() !== ''
  )
})

// Validar formato del código
function validateCodigo() {
  const codigo = formData.value.codigo.trim()
  
  if (codigo.length === 0) {
    codigoError.value = ''
    return
  }
  
  // Validar formato (ejemplo: DEP-XXX-001, RH-2024, etc.)
  const regex = /^[A-Za-z0-9\-_]+$/
  
  if (!regex.test(codigo)) {
    codigoError.value = 'Solo se permiten letras, números, guiones y guiones bajos'
  } else if (codigo.length < 3) {
    codigoError.value = 'El código debe tener al menos 3 caracteres'
  } else if (codigo.length > 50) {
    codigoError.value = 'El código no puede exceder 50 caracteres'
  } else {
    codigoError.value = ''
  }
}

// Funciones localStorage
function saveToLocalStorage() {
  if (typeof window === 'undefined') return
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(formData.value))
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
      Object.assign(formData.value, parsedData)
      validateCodigo() // Revalidar el código al cargar
      showToast('Datos del borrador recuperados', 'success')
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
    return Object.values(parsedData).some(value => 
      (typeof value === 'string' && value.trim() !== '') ||
      value !== null
    )
  } catch {
    return false
  }
})

function clearDraft() {
  if (confirm('¿Estás seguro de eliminar el borrador guardado?')) {
    clearLocalStorage()
    formData.value = {
      nombre: '',
      codigo: '',
      responsableId: null
    }
    codigoError.value = ''
    showToast('Borrador eliminado', 'success')
  }
}

function showToast(message: string, type: 'success' | 'error') {
  const id = Date.now() + Math.random()
  toasts.value.push({ id, message, type })
  setTimeout(() => { 
    toasts.value = toasts.value.filter(t => t.id !== id) 
  }, 2500)
}

async function handleSubmit() {
  if (isSubmitting.value || !isFormValid.value || codigoError.value) return
  
  try {
    isSubmitting.value = true
    
    // Preparar datos para enviar
    const departamentoData = {
      nombre: formData.value.nombre.trim(),
      codigo: formData.value.codigo.trim().toUpperCase(),
      responsableId: formData.value.responsableId
    }
    
    await $fetch(`${apiBase}/departments/create`, {
  method: 'POST',
  body: {
    nombre: formData.value.nombre.trim(),
    codigo: formData.value.codigo.trim().toUpperCase(),
    responsableId: formData.value.responsableId ?? null
  }
})
    
    showToast('Departamento creado exitosamente', 'success')
    clearLocalStorage()
    
    // Limpiar formulario
    formData.value = {
      nombre: '',
      codigo: '',
      responsableId: null
    }
    codigoError.value = ''
    
    // Redirigir después de 1.5 segundos
    setTimeout(() => {
      navigateTo('/departments')
    }, 1500)
    
  } catch (error: any) {
    console.error('Error al crear departamento:', error)
    
    // Manejo de errores específicos
    if (error.status === 409) {
      showToast('El código ya existe. Por favor, usa otro código.', 'error')
      codigoError.value = 'Este código ya está en uso'
    } else {
      showToast('Error al crear el departamento. Intenta nuevamente.', 'error')
    }
  } finally {
    isSubmitting.value = false
  }
}

function onCancel() {
  navigateTo('/departamentos')
}

// Hooks
onMounted(() => {
  loadFromLocalStorage()
})

watch(
  formData,
  () => {
    const timer = setTimeout(() => {
      saveToLocalStorage()
    }, 500)
    return () => clearTimeout(timer)
  },
  { deep: true }
)

// Validar código al cambiar
watch(
  () => formData.value.codigo,
  () => {
    validateCodigo()
  }
)
</script>

<style scoped>
/* Estilos personalizados */
</style>