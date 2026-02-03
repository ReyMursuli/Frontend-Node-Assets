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
                Incluso si alguien roba tu contraseña, <strong>no podrá entrar</strong> sin el código físico de tu aplicación (como Google Authenticator).
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

            <div class="bg-yellow-50 p-4 rounded-lg border border-yellow-100">
              <p class="text-sm text-yellow-800 leading-relaxed">
                <strong>Importante:</strong> Guarda el código secreto en un lugar seguro. Una vez activado, será obligatorio para iniciar sesión.
              </p>
            </div>

            <button 
              @click="showSetup = false"
              class="w-full py-3 text-slate-600 font-medium hover:bg-slate-50 rounded-xl transition-colors border border-slate-200"
            >
              Finalizar configuración
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const api = useApi()
const loading = ref(false)
const showSetup = ref(false)
const qrData = ref({ qrCode: '', secret: '' })

const init2FASetup = async () => {
  loading.value = true
  try {
    // El backend genera el secreto y devuelve el QR
    const response = await api.fetch('/api/auth/2fa/setup', {
      method: 'POST'
    })
    
    if (response.success) {
      qrData.value = response.data
      showSetup.value = true
    }
  } catch (error) {
    console.error("Error configurando 2FA:", error)
    alert("No se pudo iniciar la configuración de 2FA. Intenta de nuevo.")
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.animate-fade-in {
  animation: fadeIn 0.4s ease-out;
}
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(15px); }
  to { opacity: 1; transform: translateY(0); }
}
</style>