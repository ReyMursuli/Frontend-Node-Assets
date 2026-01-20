<template>
  <section class="min-h-screen bg-gray-50 flex flex-col items-center justify-start pt-8">
    <div class="w-full max-w-3xl px-4 mb-6">
      <div class="flex justify-between items-center">
        <div>
          <h1 class="text-2xl font-semibold text-[#004aad]">Agregar Activo</h1>
          <p class="text-gray-600 mt-2">Complete los datos del nuevo activo</p>
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

    <div class="w-full max-w-3xl px-4">
      <div class="rounded-lg bg-white shadow p-6">
        <form @submit.prevent="handleSubmit" class="space-y-6">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">
                Nombre del Activo *
              </label>
              <input
                v-model="formData.name"
                type="text"
                required
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#004aad]"
                placeholder="Ej: Computadora Dell XPS"
              >
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">
                Código *
              </label>
              <input
                v-model="formData.code"
                type="text"
                required
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#004aad]"
                placeholder="Ej: ACT-001"
              >
            </div>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">
                Rótulo *
              </label>
              <input
                v-model="formData.label"
                type="text"
                required
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#004aad]"
                placeholder="Ej: ROT-2024-001"
              >
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">
                Departamento
              </label>
              <select
                v-model="formData.departmentId"
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#004aad]"
              >
                <option value="">Seleccionar departamento</option>
                <option v-for="department in departments" :key="department.id" :value="department.id">
                  {{ department.nombre }}
                </option>
              </select>
            </div>
          </div>

          <div class="bg-gray-50 p-4 rounded-lg">
            <h3 class="text-lg font-medium text-gray-900 mb-4">Valores Financieros</h3>
            <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">
                  Valor Inicial *
                </label>
                <div class="relative">
                  <span class="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-500">
                    $
                  </span>
                  <input
                    v-model="formData.initialValue"
                    type="number"
                    step="0.01"
                    min="0"
                    required
                    class="pl-8 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#004aad]"
                    placeholder="0.00"
                  >
                </div>
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">
                  Valor Residual *
                </label>
                <div class="relative">
                  <span class="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-500">
                    $
                  </span>
                  <input
                    v-model="formData.residualValue"
                    type="number"
                    step="0.01"
                    min="0"
                    required
                    class="pl-8 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#004aad]"
                    placeholder="0.00"
                  >
                </div>
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">
                  Depreciación Acumulada
                </label>
                <div class="relative">
                  <span class="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-500">
                    $
                  </span>
                  <input
                    v-model="formData.accumulatedDepreciation"
                    type="number"
                    step="0.01"
                    min="0"
                    class="pl-8 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#004aad]"
                    placeholder="0.00"
                  >
                </div>
                <p class="text-xs text-gray-500 mt-1">Se calculará automáticamente si se deja en 0</p>
              </div>
            </div>

            <div class="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-md">
              <div class="flex justify-between items-center">
                <span class="text-sm font-medium text-blue-800">Valor Neto:</span>
                <span class="text-lg font-bold text-blue-900">
                  ${{ netValue.toLocaleString('es-ES', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) }}
                </span>
              </div>
              <p class="text-xs text-blue-600 mt-1">
                (Valor Inicial - Depreciación Acumulada)
              </p>
            </div>
          </div>

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
                class="px-5 py-2.5 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
              >
                Cancelar
              </button>
              <button
                type="submit"
                :disabled="isSubmitting || !isFormValid"
                :class="[
                  'px-5 py-2.5 rounded-md',
                  isSubmitting || !isFormValid
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
                <span v-else>Crear Activo</span>
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
import type { Toast } from '~/components/Toasts.vue'

const { public: { apiBase } } = useRuntimeConfig()
const STORAGE_KEY = 'form-activo-creacion'

interface Department {
  id: number | string
  nombre: string
  responsableId?: number | string
}

const formData = ref({
  name: '',
  code: '',
  label: '',
  initialValue: 0,
  residualValue: 0,
  accumulatedDepreciation: 0,
  departmentId: null as number | null
})

const { data: departmentsData } = await useFetch<Department[]>(`${apiBase}/departments`)
const departments = computed(() => departmentsData.value ?? [])

const netValue = computed(() => {
  const initial = parseFloat(formData.value.initialValue.toString()) || 0
  const depreciation = parseFloat(formData.value.accumulatedDepreciation.toString()) || 0
  return initial - depreciation
})

const isFormValid = computed(() => {
  return (
    formData.value.name.trim() !== '' &&
    formData.value.code.trim() !== '' &&
    formData.value.label.trim() !== '' &&
    formData.value.initialValue > 0 &&
    formData.value.residualValue >= 0
  )
})

const isSubmitting = ref(false)
const toasts = ref<Toast[]>([])

const hasDraftSaved = computed(() => {
  if (typeof window === 'undefined') return false
  try {
    const savedData = localStorage.getItem(STORAGE_KEY)
    if (!savedData) return false
    const parsedData = JSON.parse(savedData)
    return Object.values(parsedData).some(value => 
      (typeof value === 'string' && value.trim() !== '') ||
      (typeof value === 'number' && value > 0)
    )
  } catch {
    return false
  }
})

function saveToLocalStorage() {
  if (typeof window === 'undefined') return
  localStorage.setItem(STORAGE_KEY, JSON.stringify(formData.value))
}

function loadFromLocalStorage() {
  if (typeof window === 'undefined') return
  const savedData = localStorage.getItem(STORAGE_KEY)
  if (savedData) {
    const parsedData = JSON.parse(savedData)
    Object.assign(formData.value, parsedData)
  }
}

function clearLocalStorage() {
  if (typeof window === 'undefined') return
  localStorage.removeItem(STORAGE_KEY)
}

function clearDraft() {
  if (confirm('¿Estás seguro de eliminar el borrador guardado?')) {
    clearLocalStorage()
    formData.value = {
      name: '',
      code: '',
      label: '',
      initialValue: 0,
      residualValue: 0,
      accumulatedDepreciation: 0,
      departmentId: null
    }
  }
}

function showToast(message: string, type: 'success' | 'error') {
  const id = Date.now()
  toasts.value.push({ id, message, type })
  setTimeout(() => {
    toasts.value = toasts.value.filter(t => t.id !== id)
  }, 2500)
}

async function handleSubmit() {
  if (isSubmitting.value || !isFormValid.value) return
  
  try {
    isSubmitting.value = true
    
    if (formData.value.residualValue > formData.value.initialValue) {
      showToast('El valor residual no puede ser mayor al valor inicial', 'error')
      isSubmitting.value = false
      return
    }
    
    if (formData.value.accumulatedDepreciation > formData.value.initialValue) {
      showToast('La depreciación no puede ser mayor al valor inicial', 'error')
      isSubmitting.value = false
      return
    }
    
    const response = await $fetch(`${apiBase}/assets/create`, {
      method: 'POST',
      body: {
        nombre: formData.value.name.trim(),
        codigo: formData.value.code.trim().toUpperCase(),
        rotulo: formData.value.label.trim(),  
        val_inicial: parseFloat(formData.value.initialValue.toString()),  
        val_residual: parseFloat(formData.value.residualValue.toString()),  
        dep_acomulada: parseFloat(formData.value.accumulatedDepreciation.toString()),  
        departamentId: formData.value.departmentId ?? null
      },
      headers: {
        'Content-Type': 'application/json'
      }
    })
    
    console.log('Respuesta del servidor:', response)
    
    showToast('Activo creado exitosamente', 'success')
    clearLocalStorage()
    
    formData.value = {
      name: '',
      code: '',
      label: '',
      initialValue: 0,
      residualValue: 0,
      accumulatedDepreciation: 0,
      departmentId: null
    }
    
    setTimeout(() => {
      navigateTo('/activo')
    }, 1500)
    
  } catch (error: any) {
    console.error('Error al crear activo:', error)
    
    if (error?.response) {
      console.error('Response status:', error.response.status)
      console.error('Response data:', error.response._data)
    }
    
    if (error?.status === 409) {
      showToast('El código ya existe. Por favor, usa otro código.', 'error')
    } else if (error?.status === 404) {
      showToast('Endpoint no encontrado. Verifica la URL del backend.', 'error')
    } else if (error?.status === 500) {
      showToast('Error interno del servidor. Intenta nuevamente.', 'error')
    } else {
      showToast('Error al crear el activo. Intenta nuevamente.', 'error')
    }
  } finally {
    isSubmitting.value = false
  }
}

function onCancel() {
  navigateTo('/activo')
}

onMounted(() => {
  loadFromLocalStorage()
})

watch(formData, () => {
  const timer = setTimeout(() => {
    saveToLocalStorage()
  }, 500)
  return () => clearTimeout(timer)
}, { deep: true })
</script>

<style>
.w-full {
  width: 100% !important;
}

input:focus, select:focus {
  box-shadow: 0 0 0 2px rgba(0, 74, 173, 0.2);
}
</style>