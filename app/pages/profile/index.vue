<template>
  <div class="min-h-screen bg-slate-100">
    <header class="bg-white shadow-sm border-b border-slate-200">
      <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
        <div>
          <h1 class="text-2xl font-bold text-slate-900">Mi Perfil</h1>
          <p class="text-sm text-slate-600">Gestiona tu información personal y seguridad</p>
        </div>
        <NuxtLink to="/" class="text-sm font-medium text-blue-600 hover:text-blue-700">
          ← Volver al Dashboard
        </NuxtLink>
      </div>
    </header>

    <main class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div class="space-y-6">
        
        <div class="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
          <div class="h-32 bg-gradient-to-r from-blue-600 to-indigo-700"></div>
          <div class="px-6 pb-6">
            <div class="relative flex justify-between items-end -mt-12">
              <div class="relative">
                <div class="w-32 h-32 rounded-full border-4 border-white bg-slate-200 overflow-hidden flex items-center justify-center shadow-md">
                  <img v-if="user.photo" :src="user.photo" class="w-full h-full object-cover" />
                  <span v-else class="text-4xl font-bold text-slate-400">
                    {{ user.name?.[0]?.toUpperCase() }}
                  </span>
                </div>
                <button class="absolute bottom-1 right-1 bg-white p-2 rounded-full shadow-lg border border-slate-200 hover:bg-slate-50 transition-colors">
                  <svg class="w-4 h-4 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </button>
              </div>
              <div class="pb-2">
                <button @click="saveChanges" class="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors shadow-sm">
                  Guardar Cambios
                </button>
              </div>
            </div>
            
            <div class="mt-6">
              <h2 class="text-2xl font-bold text-slate-900">{{ user.name }}</h2>
              <p class="text-slate-500">{{ user.department }} • {{ user.role }}</p>
            </div>
          </div>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          <div class="md:col-span-2 space-y-6">
            <div class="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
              <h3 class="text-lg font-semibold text-slate-900 mb-4">Información Personal</h3>
              <div class="grid grid-cols-1 gap-4">
                <div>
                  <label class="block text-sm font-medium text-slate-700 mb-1">Nombre Completo</label>
                  <input v-model="user.name" type="text" class="w-full px-4 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all" />
                </div>
                <div>
                  <label class="block text-sm font-medium text-slate-700 mb-1">Departamento</label>
                  <select v-model="user.department" class="w-full px-4 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500 outline-none transition-all bg-white">
                    <option>Sistemas</option>
                    <option>Recursos Humanos</option>
                    <option>Contabilidad</option>
                    <option>Logística</option>
                  </select>
                </div>
              </div>
            </div>

            <div class="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
              <div class="flex items-center justify-between mb-4">
                <h3 class="text-lg font-semibold text-slate-900">Seguridad</h3>
                <NuxtLink 
                  to="/profile/seguridad" 
                  class="inline-flex items-center px-3 py-1.5 text-sm font-medium text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors"
                >
                  <svg class="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                  Configurar 2FA
                </NuxtLink>
              </div>
              <div class="space-y-4">
                <div>
                  <label class="block text-sm font-medium text-slate-700 mb-1">Nueva Contraseña</label>
                  <input type="password" placeholder="••••••••" class="w-full px-4 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500 outline-none transition-all" />
                </div>
                <p class="text-xs text-slate-500">Deja este espacio en blanco si no deseas cambiar tu contraseña.</p>
              </div>
            </div>
          </div>

          <div class="space-y-6">
            <div class="bg-blue-50 rounded-xl p-6 border border-blue-100">
              <h3 class="text-sm font-bold text-blue-900 uppercase tracking-wider mb-4">Estado de Cuenta</h3>
              <div class="space-y-3">
                <div class="flex items-center text-sm text-blue-800">
                  <span class="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                  Usuario Activo
                </div>
                <div class="text-xs text-blue-600">
                  Miembro desde: <br>
                  <span class="font-semibold text-blue-800">15 de Enero, 2024</span>
                </div>
              </div>
            </div>

            <button class="w-full py-3 text-red-600 bg-red-50 hover:bg-red-100 rounded-xl font-medium transition-colors border border-red-100">
              Eliminar Cuenta
            </button>
          </div>

        </div>
      </div>
    </main>
  </div>
</template>

<script setup>
import { ref } from 'vue'

// Importamos useApi para futuras integraciones en esta vista
const api = useApi()

// Datos de ejemplo para simular la sesión
const user = ref({
  name: 'Juan Pérez',
  department: 'Sistemas',
  role: 'Administrador',
  photo: null, 
})

const saveChanges = async () => {
  // Aquí podrías usar api.fetch para actualizar los datos básicos del usuario
  console.log('Guardando cambios del usuario...')
}

const handleLogout = () => {
  // lógica de logout heredada
}
</script>

<style scoped>
/* Estilos adicionales para mejorar la transición visual */
.transition-all {
  transition-property: all;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  transition-duration: 150ms;
}
</style>