<template>
  <section>
    <h1 class="text-2xl font-semibold text-[#004aad] mb-4">Actualizar responsable</h1>
    <div class="rounded-lg bg-white shadow p-5 max-w-xl">
      <div v-if="pending" class="text-slate-600">Cargando usuario...</div>
      <div v-else-if="error" class="text-red-600">No fue posible cargar el usuario</div>
      <div v-else>
        <UserForm
          :isEditing="true"
          :userId="id"
          :initialValues="initialValues"
          @success="onSuccess"
          @cancel="onCancel"
        />
      </div>
    </div>

    <div class="mt-4">
      <NuxtLink to="/responsable" class="text-[#004aad] underline">Volver</NuxtLink>
    </div>

    <Toasts :toasts="toasts" />
  </section>
</template>

<script setup lang="ts">
import type { Toast as ToastType } from '~/components/Toasts.vue'
import { navigateTo } from 'nuxt/app'

const route = useRoute()
const id = route.params.id as string
const { public: { apiBase } } = useRuntimeConfig()

const { data, pending, error } = await useFetch(`${apiBase}/usuarios/${id}`)

const initialValues = reactive<{ username: string; email: string; role: 'admin' | 'responsable' }>(
  { username: '', email: '', role: 'responsable' }
)

watchEffect(() => {
  const u = (data.value as any)?.user ?? (data.value as any) ?? null
  if (u) {
    initialValues.username = u.username ?? u.nombre ?? ''
    initialValues.email = u.email ?? ''
    initialValues.role = (u.role === 'admin' ? 'admin' : 'responsable')
  }
})

const toasts = ref<ToastType[]>([])
function showToast(message: string, type: 'success' | 'error') {
  const id = Date.now() + Math.random()
  toasts.value.push({ id, message, type })
  setTimeout(() => { toasts.value = toasts.value.filter(t => t.id !== id) }, 2500)
}

function onSuccess(msg?: string) {
  showToast(msg || 'Usuario actualizado', 'success')
}

function onCancel() {
  navigateTo('/responsable')
}
</script>
