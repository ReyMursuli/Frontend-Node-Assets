<template>
  <div class="min-h-screen bg-slate-100 py-10">
    <div class="max-w-2xl mx-auto px-4">
      <NuxtLink to="/profile" class="text-sm text-slate-600 hover:text-blue-600 flex items-center mb-6">
        ← Volver a Mi Perfil
      </NuxtLink>

      <div class="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        <div class="p-8">
          <h1 class="text-2xl font-bold text-slate-900 mb-2">Autenticación de Dos Factores (2FA)</h1>
          <p class="text-slate-600 mb-8">Añade una capa extra de seguridad a tu cuenta usando una aplicación de autenticación.</p>

          <div v-if="!showSetup" class="mb-8 grid grid-cols-1 md:grid-cols-2 gap-4">
            <div class="p-4 bg-slate-50 rounded-xl border border-slate-100">
              <h3 class="text-sm font-bold text-slate-800 flex items-center mb-2">
                <span class="p-1 bg-blue-100 text-blue-600 rounded mr-2">1</span>
                ¿Qué es?
              </h3>
              <p class="text-xs text-slate-600 leading-relaxed">
                Es un método de seguridad que requiere <strong>dos formas de identificación</strong> para acceder a tu cuenta: tu contraseña y un código generado en tu celular.
              </p>
            </div>
            <div class="p-4 bg-slate-50 rounded-xl border border-slate-100">
              <h3 class="text-sm font-bold text-slate-800 flex items-center mb-2">
                <span class="p-1 bg-blue-100 text-blue-600 rounded mr-2">2</span>
                ¿Por qué usarlo?
              </h3>
              <p class="text-xs text-slate-600 leading-relaxed">
                Incluso si alguien roba tu contraseña, <strong>no podrá entrar</strong> sin el código físico de tu aplicación.
              </p>
            </div>
          </div>

          <div v-if="!showSetup" class="flex flex-col items-center py-6 border-t border-slate-100">
            <div class="bg-blue-50 p-4 rounded-full mb-4">
              <svg class="w-12 h-12 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
            <button 
              @click="init2FASetup"
              :disabled="loading"
              class="px-8 py-3 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition-all shadow-md active:transform active:scale-95 disabled:opacity-50"
            >
              {{ loading ? 'Generando...' : 'Configurar 2FA ahora' }}
            </button>
          </div>

          <div v-else class="space-y-6 animate-fade-in">
            <div class="bg-slate-50 p-6 rounded-xl border border-dashed border-slate-300 flex flex-col items-center">
              <p class="text-sm font-medium text-slate-700 mb-4 text-center">
                Escanea este código QR con Google Authenticator o Authy:
              </p>
              
              <div class="bg-white p-4 rounded-lg shadow-sm mb-4">
                <img :src="qrData.qrCode" alt="QR Code" class="w-48 h-48" />
              </div>

              <div class="w-full">
                <p class="text-xs text-slate-500 mb-1 uppercase font-bold">Código secreto manual:</p>
                <code class="block bg-white p-2 rounded border text-center font-mono text-blue-600 break-all">
                  {{ qrData.secret }}
                </code>
              </div>
            </div>

            <div class="space-y-3">
              <label class="block text-sm font-bold text-slate-700 text-center">Introduce el código de 6 dígitos de tu app:</label>
              <input 
                v-model="verificationCode"
                type="text"
                maxlength="6"
                placeholder="000000"
                class="w-full px-4 py-3 bg-white border border-slate-300 rounded-xl text-center text-2xl tracking-widest focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>

            <div class="bg-yellow-50 p-4 rounded-lg border border-yellow-100">
              <p class="text-sm text-yellow-800 leading-relaxed">
                <strong>Importante:</strong> Al confirmar, el 2FA será obligatorio para tu próximo inicio de sesión.
              </p>
            </div>

            <div class="flex gap-3">
              <button 
                @click="showSetup = false"
                class="flex-1 py-3 text-slate-600 font-medium hover:bg-slate-50 rounded-xl transition-colors border border-slate-200"
              >
                Cancelar
              </button>
              <button 
                @click="verifyAndActivate"
                :disabled="loading || verificationCode.length < 6"
                class="flex-[2] py-3 bg-green-600 text-white font-bold rounded-xl hover:bg-green-700 transition-colors shadow-md disabled:opacity-50"
              >
                {{ loading ? 'Verificando...' : 'Activar y Finalizar' }}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const api = useApi()
const router = useRouter()
const loading = ref(false)
const showSetup = ref(false)
const qrData = ref({ qrCode: '', secret: '' })
const verificationCode = ref('')

const init2FASetup = async () => {
  loading.value = true
  try {
    const response = await api.fetch('/api/auth/2fa/setup', {
      method: 'POST'
    })
    if (response.success) {
      qrData.value = response.data
      showSetup.value = true
    }
  } catch (error) {
    alert("No se pudo iniciar la configuración.")
  } finally {
    loading.value = false
  }
}

const verifyAndActivate = async () => {
  loading.value = true
  try {
    // Llamamos al nuevo endpoint de verificación
    const response = await api.fetch('/api/auth/2fa/verify', {
      method: 'POST',
      body: { token: verificationCode.value }
    })
    
    if (response.success) {
      alert("¡2FA activado correctamente!")
      router.push('/profile')
    }
  } catch (error) {
    alert(error.data?.message || "Código incorrecto. Inténtalo de nuevo.")
  } finally {
    loading.value = false
  }
}
</script>