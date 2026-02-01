<template>
  <div class="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 to-slate-800 font-sans">
    <div class="w-full max-w-md p-8 bg-slate-800 rounded-lg shadow-2xl">
      
      <!-- Logo/Header -->
      <div class="flex items-center justify-center mb-8">
        <div class="bg-blue-600 p-3 rounded-lg">
          <svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
          </svg>
        </div>
      </div>

      <h1 class="text-2xl font-bold text-white text-center mb-2">Sistema de Gestión</h1>
      <p class="text-gray-400 text-center mb-8">Acceso Seguro con Autenticación JWT</p>

      <form class="space-y-6" @submit.prevent="handleSubmit">
        
        <!-- 📝 Formulario de Login -->
        <div v-if="!requires2FA" class="space-y-4">
          
          <!-- Email -->
          <div>
            <label class="block text-sm font-medium text-gray-300 mb-2">Email</label>
            <input 
              v-model="email"
              type="email" 
              placeholder="usuario@email.com"
              :disabled="isLoading"
              class="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:opacity-50"
            />
          </div>

          <!-- Password -->
          <div>
            <label class="block text-sm font-medium text-gray-300 mb-2">Contraseña</label>
            <input 
              v-model="password"
              type="password" 
              placeholder="••••••••"
              :disabled="isLoading"
              class="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:opacity-50"
            />
          </div>

        </div>

        <!-- 🔐 Formulario 2FA -->
        <div v-if="requires2FA" class="space-y-4">
          <div class="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4 mb-4">
            <p class="text-blue-300 text-sm">
              Se ha enviado un código de 6 dígitos a tu dispositivo autenticador.
            </p>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-300 mb-2">Código 2FA</label>
            <input 
              v-model="twoFactorCode"
              type="text" 
              placeholder="000000"
              maxlength="6"
              :disabled="isLoading"
              class="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-center text-2xl tracking-widest disabled:opacity-50"
            />
          </div>

          <button 
            type="button"
            @click="cancelTwoFactor"
            :disabled="isLoading"
            class="w-full px-4 py-2 text-sm text-gray-400 hover:text-gray-200 disabled:opacity-50"
          >
            ← Volver al login
          </button>
        </div>

        <!-- ⚠️ Mensajes de error -->
        <div v-if="errorMessage" class="bg-red-500/10 border border-red-500/30 rounded-lg p-3">
          <p class="text-red-400 text-sm">{{ errorMessage }}</p>
        </div>

        <!-- 📤 Botón submit -->
        <button 
          type="submit"
          :disabled="isLoading || (requires2FA && !twoFactorCode)"
          class="w-full px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 text-white font-medium rounded-lg transition-colors disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          <svg v-if="isLoading" class="animate-spin w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
          </svg>
          <span>
            {{ isLoading ? 'Verificando...' : requires2FA ? 'Verificar 2FA' : 'Iniciar Sesión' }}
          </span>
        </button>

      </form>

    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'

// Metadata de página
definePageMeta({
  layout: 'auth',
})

useHead({
  title: 'Login - Sistema de Gestión',
})

// Composables
const { signIn, status } = useAuth()
const router = useRouter()

// State
const email = ref('')
const password = ref('')
const twoFactorCode = ref('')
const errorMessage = ref<string | null>(null)
const isLoading = ref(false)
const isDev = ref(process.env.NODE_ENV === 'development')
const requires2FA = ref(false)

/**
 * 📤 Manejar submit del formulario
 */
const handleSubmit = async () => {
  errorMessage.value = null
  isLoading.value = true

  try {
    let result: any = null
    
    try {
      // Si estamos en flujo de 2FA
      if (requires2FA.value) {
        // Realizar login con código 2FA
        result = await signIn({
          email: email.value,
          password: password.value,
          twoFactorCode: twoFactorCode.value,
          redirect: false,
        } as any)
      } else {
        // Realizar login normal
        result = await signIn({
          email: email.value,
          password: password.value,
          redirect: false,
        } as any)
      }
    } catch (signInError: any) {
      // Ignorar el error de navegación de @sidebase/nuxt-auth
      // Si es un error de navegación, asumimos que el login fue exitoso
      if (signInError?.message?.includes('Navigating to an external URL')) {
        console.log('[Login] Navigation error (ignorado - login exitoso)')
        result = { ok: true }
      } else {
        throw signInError
      }
    }

    // Procesar resultado del login
    if (requires2FA.value && result?.ok) {
      // Login con 2FA exitoso
      await router.push('/')
    } else if (!requires2FA.value && result?.ok) {
      // Login normal exitoso
      await router.push('/')
    } else if (!requires2FA.value && result?.error?.includes('2FA')) {
      // Backend requiere 2FA
      requires2FA.value = true
      errorMessage.value = 'Ingresa el código de tu autenticador'
    } else if (requires2FA.value && !result?.ok) {
      // 2FA incorrecto
      errorMessage.value = 'El código es incorrecto. Intenta de nuevo'
    } else {
      // Login incorrecto
      errorMessage.value = 'Usuario o contraseña incorrectos'
    }
  } catch (error: any) {
    errorMessage.value = 'Algo salió mal. Por favor intenta de nuevo'
    console.error('[Login] Error:', error)
  } finally {
    isLoading.value = false
  }
}

/**
 * ❌ Cancelar 2FA y volver a login
 */
const cancelTwoFactor = () => {
  twoFactorCode.value = ''
  errorMessage.value = null
  requires2FA.value = false
  email.value = ''
  password.value = ''
}
</script>