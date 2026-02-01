<template>
  <form @submit.prevent="$emit('submit')" class="space-y-6">
    <div class="flex flex-col items-center mb-6 group">
      <div class="relative mb-4">
        <div class="relative w-32 h-32 overflow-hidden rounded-full border-4 border-gray-200 transition-all duration-300 group-hover:border-[#004aad]/50 shadow-sm flex items-center justify-center">
          <img v-if="previewImage" :src="previewImage" class="w-full h-full object-cover">
          <div v-else class="w-full h-full bg-gray-100 flex items-center justify-center">
            <svg class="w-14 h-14 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
              <path d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" />
            </svg>
          </div>
          <div @click="fileInput?.click()" class="absolute inset-0 bg-black/20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
            <svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"/><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"/></svg>
          </div>
        </div>
      </div>
      <input type="file" ref="fileInput" @change="onFileChange" class="hidden" accept="image/*">
      <button 
        type="button" 
        @click="fileInput?.click()" 
        class="text-sm font-medium text-[#004aad] hover:text-[#003a8a] transition-colors underline-offset-4 hover:underline"
      >
        {{ previewImage ? 'Cambiar fotografía' : 'Añadir fotografía' }}
      </button>
    </div>

    <div class="space-y-4">
      <div>
        <label class="block text-sm font-semibold text-gray-700 mb-1">Username *</label>
        <input 
          v-model="modelValue.username" 
          type="text" 
          :disabled="isEditing" 
          placeholder="nombre.usuario"
          class="w-full px-4 py-2.5 border rounded-lg transition-all outline-none focus:ring-2 focus:ring-[#004aad]/20 focus:border-[#004aad] border-gray-300 shadow-sm"
          :class="isEditing ? 'bg-gray-50 text-gray-500 cursor-not-allowed border-gray-200' : 'hover:border-gray-400'"
        >
      </div>

      <div>
        <label class="block text-sm font-semibold text-gray-700 mb-1">Correo electrónico *</label>
        <input 
          v-model="modelValue.email" 
          type="email" 
          placeholder="ejemplo@correo.com"
          class="w-full px-4 py-2.5 border rounded-lg transition-all outline-none focus:ring-2 focus:ring-[#004aad]/20 focus:border-[#004aad] border-gray-300 hover:border-gray-400 shadow-sm"
        >
      </div>

      <div v-if="!isEditing">
        <label class="block text-sm font-semibold text-gray-700 mb-1">Contraseña *</label>
        <input 
          v-model="modelValue.password" 
          type="password" 
          placeholder="Mínimo 6 caracteres"
          class="w-full px-4 py-2.5 border rounded-lg transition-all outline-none focus:ring-2 focus:ring-[#004aad]/20 focus:border-[#004aad] border-gray-300 hover:border-gray-400 shadow-sm"
        >
      </div>
    </div>

    <div>
      <label class="block text-sm font-semibold text-gray-700 mb-3">Asignar Rol *</label>
      <div class="grid grid-cols-2 gap-4">
        <label 
          v-for="role in ['admin', 'responsable']" 
          :key="role" 
          class="relative border-2 rounded-xl p-4 cursor-pointer transition-all duration-200 flex flex-col items-center justify-center gap-2 group"
          :class="modelValue.rol === role 
            ? 'border-[#004aad] bg-blue-50/50 ring-4 ring-blue-50' 
            : 'border-gray-100 hover:border-gray-300 hover:bg-gray-50'"
        >
          <input type="radio" v-model="modelValue.rol" :value="role" class="sr-only">
          
          <div :class="modelValue.rol === role ? 'text-[#004aad]' : 'text-gray-400'" class="transition-colors">
            <svg v-if="role === 'admin'" class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"/></svg>
            <svg v-else class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/></svg>
          </div>

          <span class="capitalize font-bold text-sm" :class="modelValue.rol === role ? 'text-[#004aad]' : 'text-gray-600'">
            {{ role }}
          </span>

          <div v-if="modelValue.rol === role" class="absolute top-2 right-2 text-[#004aad]">
            <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" /></svg>
          </div>
        </label>
      </div>
    </div>

    <div class="flex justify-end space-x-4 pt-8 border-t border-gray-100">
      <button 
        type="button" 
        @click="navigateTo('/responsable')" 
        class="px-6 py-2.5 text-sm font-semibold text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-all"
      >
        Cancelar
      </button>
      <button 
        type="submit" 
        :disabled="loading" 
        class="px-8 py-2.5 rounded-lg font-bold text-white shadow-lg shadow-[#004aad]/20 transition-all duration-300 transform active:scale-95 flex items-center gap-2"
        :class="loading 
          ? 'bg-gray-400 cursor-wait' 
          : 'bg-[#004aad] hover:bg-[#003580] hover:shadow-[#003580]/30'"
      >
        <span v-if="loading" class="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
        {{ loading ? 'Guardando...' : (isEditing ? 'Actualizar Datos' : 'Registrar Responsable') }}
      </button>
    </div>
  </form>
</template>

<script setup lang="ts">
import { ref } from 'vue' 
  
const props = defineProps({
  modelValue: { type: Object, required: true },
  previewImage: { type: String, default: null },
  loading: { type: Boolean, default: false },
  isEditing: { type: Boolean, default: false }
})

const emit = defineEmits(['submit', 'image-change'])

const fileInput = ref<HTMLInputElement | null>(null)

const onFileChange = (e: Event) => {
  const target = e.target as HTMLInputElement
  const file = target.files?.[0]
  if (file) emit('image-change', file)
}
</script>