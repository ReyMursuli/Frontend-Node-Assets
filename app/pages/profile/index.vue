<template>
  <div class="min-h-screen bg-slate-100">
    <header class="bg-white shadow-sm border-b border-slate-200">
      <div class="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
        <div>
          <h1 class="text-2xl font-bold text-slate-900">Mi Perfil</h1>
          <p class="text-sm text-slate-600">Gestiona tu información personal</p>
        </div>
        <NuxtLink to="/" class="text-sm font-medium text-blue-600 hover:text-blue-700">
          ← Volver al Dashboard
        </NuxtLink>
      </div>
    </header>

    <main class="max-w-4xl mx-auto px-4 py-10">
      <div v-if="pending" class="text-center py-10">
        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
      </div>

      <div v-else-if="user" class="space-y-6">
        <div class="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
          <div class="h-32 bg-gradient-to-r from-blue-600 to-indigo-700"></div>
          <div class="px-6 pb-6">
            <div class="relative flex justify-between items-end -mt-12">
              <div class="relative">
                <div class="w-32 h-32 rounded-full border-4 border-white bg-slate-200 overflow-hidden flex items-center justify-center shadow-md">
                  <img v-if="user.profileImage" :src="`http://localhost:3000/${user.profileImage}`" class="w-full h-full object-cover" />
                  <span v-else class="text-4xl font-bold text-slate-400">{{ user.username?.[0]?.toUpperCase() }}</span>
                </div>
              </div>
              <div class="pb-2 flex gap-2">
                <button 
                  @click="isEditing ? handleSave() : isEditing = true"
                  class="px-4 py-2 rounded-lg text-sm font-medium transition-all shadow-sm"
                  :class="isEditing ? 'bg-green-600 text-white hover:bg-green-700' : 'bg-blue-600 text-white hover:bg-blue-700'"
                >
                  {{ isEditing ? 'Guardar Cambios' : 'Editar Perfil' }}
                </button>
                <button v-if="isEditing" @click="cancelEdit" class="px-4 py-2 bg-slate-200 text-slate-700 rounded-lg text-sm hover:bg-slate-300">
                  Cancelar
                </button>
              </div>
            </div>
            <div class="mt-6">
              <h2 class="text-2xl font-bold text-slate-900">{{ user.username }}</h2>
              <p class="text-slate-500">{{ user.departamentoResponsable?.nombre || 'Sin Departamento' }}</p>
            </div>
          </div>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div class="md:col-span-2">
            <div class="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
              <h3 class="text-lg font-semibold text-slate-900 mb-4">Información Personal</h3>
              <div class="space-y-4">
                <div>
                  <label class="block text-sm font-medium text-slate-700 mb-1">Nombre de Usuario</label>
                  <input v-model="form.username" :disabled="!isEditing" class="w-full px-4 py-2 rounded-lg border transition-all" :class="isEditing ? 'border-blue-400 ring-2 ring-blue-50' : 'bg-slate-50 border-slate-200'" />
                </div>
                <div>
                  <label class="block text-sm font-medium text-slate-700 mb-1">Correo Electrónico</label>
                  <input v-model="form.email" :disabled="!isEditing" class="w-full px-4 py-2 rounded-lg border transition-all" :class="isEditing ? 'border-blue-400 ring-2 ring-blue-50' : 'bg-slate-50 border-slate-200'" />
                </div>
                <div v-if="isEditing" class="pt-4 border-t">
                  <label class="block text-sm font-medium text-slate-700 mb-1">Nueva Contraseña</label>
                  <input v-model="form.password" type="password" placeholder="Mínimo 6 caracteres (dejar en blanco para no cambiar)" class="w-full px-4 py-2 rounded-lg border border-blue-400 ring-2 ring-blue-50" />
                </div>
              </div>
            </div>
          </div>

          <div class="space-y-6">
            <div class="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
              <h3 class="text-sm font-bold text-slate-400 uppercase tracking-wider mb-4">Seguridad</h3>
              <div class="space-y-4">
                <div class="flex items-center justify-between p-3 bg-slate-50 rounded-lg text-sm">
                  <span class="text-slate-600">Estado 2FA</span>
                  <span :class="user.twoFactorEnabled ? 'text-green-600 font-bold' : 'text-red-500 font-bold'">
                    {{ user.twoFactorEnabled ? 'ACTIVO' : 'INACTIVO' }}
                  </span>
                </div>
                <NuxtLink to="/profile/seguridad" class="w-full flex items-center justify-center px-4 py-2.5 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700 transition-colors shadow-sm">
                  Configurar 2FA / Seguridad
                </NuxtLink>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'

const { fetch: apiFetch } = useApi()
const { error: toastError, success: toastSuccess, loading: toastLoading, resolveLoading } = useToast()

const user = ref(null)
const pending = ref(true)
const isEditing = ref(false)

const form = ref({
  username: '',
  email: '',
  password: ''
})

const fetchProfile = async () => {
  try {
    pending.value = true
    const response = await apiFetch('/api/users/profile')
    if (response.success) {
      user.value = response.user
      form.value.username = response.user.username
      form.value.email = response.user.email
      form.value.password = ''
    }
  } catch (err) {
    toastError('Error al cargar datos')
  } finally {
    pending.value = false
  }
}

const handleSave = async () => {
  if (form.value.password && form.value.password.length < 6) {
    return toastError('La contraseña debe tener al menos 6 caracteres')
  }

  const loadId = toastLoading('Actualizando perfil...')
  try {
    const response = await apiFetch('/api/users/profile/update', {
      method: 'PUT',
      body: form.value
    })
    
    if (response.success) {
      resolveLoading(loadId, '¡Perfil actualizado con éxito!')
      isEditing.value = false
      await fetchProfile() // Recargar datos frescos
    }
  } catch (err) {
    resolveLoading(loadId, '', 'No se pudo actualizar el perfil')
  }
}

const cancelEdit = () => {
  isEditing.value = false
  form.value.username = user.value.username
  form.value.email = user.value.email
  form.value.password = ''
}

onMounted(fetchProfile)
</script>