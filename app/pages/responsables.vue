<template>
  <section>
    <h1 class="text-2xl font-semibold text-[\#004aad] mb-4">Responsables</h1>
    <div class="rounded-lg bg-white shadow">
      <div class="border-b px-4 py-3 flex items-center justify-between">
        <span class="font-medium">Total de usuarios <span class="text-slate-500 font-normal">(Total: {{ usuarios.length }})</span></span>
        <button
          class="px-3 py-1.5 rounded-full bg-white border text-slate-800 hover:bg-slate-50"
          @click="openAddForm"
        >
          Agregar usuario
        </button>
      </div>
      <div class="p-4">
        <div v-if="pending" class="text-slate-600">Cargando responsables...</div>
        <div v-else-if="error" class="text-red-600">Error al cargar responsables</div>
        <div v-else class="grid gap-3 md:grid-cols-2">
          <div
            v-for="u in usuarios"
            :key="u.id"
            class="rounded-lg border bg-white px-4 py-3"
          >
            <div class="flex items-center justify-between gap-3">
              <button type="button" class="px-4 py-2 rounded-full border bg-white hover:bg-slate-50 text-slate-800 font-medium">
                {{ u.username ?? u.nombre ?? 'Sin nombre' }}
              </button>
              <div class="flex items-center gap-2">
                <button
                  class="px-3 py-1 rounded-full border bg-white hover:bg-slate-50 text-slate-700 text-sm"
                  @click="openEditForm(u)"
                >Actualizar</button>
                <button
                  class="px-3 py-1 rounded-full border bg-white hover:bg-red-50 text-red-600 text-sm"
                  @click="onDeleteUser(u)"
                >Eliminar</button>
              </div>
            </div>
            <p class="text-xs text-slate-600 mt-2">Email: {{ u.email ?? '—' }}</p>
            <p class="text-xs text-slate-600">Activos a cargo: {{ activosPorUsuario[u.id] ?? 0 }}</p>
          </div>
        </div>
      </div>
    </div>

    <div v-if="showForm" class="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div class="w-full max-w-md rounded-xl bg-white shadow p-5">
        <h3 class="text-lg font-semibold mb-4">{{ isEditing ? 'Actualizar usuario' : 'Agregar usuario' }}</h3>
        <form @submit.prevent="submitForm" class="space-y-3">
          <div>
            <label class="block text-sm font-medium mb-1">Usuario</label>
            <input v-model.trim="form.username" type="text" class="w-full rounded-md border p-2 focus:outline-none focus:ring-2 focus:ring-[#004aad]" :class="{ 'border-red-500': errors.username }" />
            <p v-if="errors.username" class="mt-1 text-xs text-red-600">{{ errors.username }}</p>
          </div>
          <div>
            <label class="block text-sm font-medium mb-1">Email</label>
            <input v-model.trim="form.email" type="email" class="w-full rounded-md border p-2 focus:outline-none focus:ring-2 focus:ring-[#004aad]" :class="{ 'border-red-500': errors.email }" />
            <p v-if="errors.email" class="mt-1 text-xs text-red-600">{{ errors.email }}</p>
          </div>
          <div>
            <label class="block text-sm font-medium mb-1">Rol</label>
            <select v-model="form.role" class="w-full rounded-md border p-2 focus:outline-none focus:ring-2 focus:ring-[#004aad]">
              <option value="admin">admin</option>
              <option value="responsable">responsable</option>
            </select>
            <p v-if="errors.role" class="mt-1 text-xs text-red-600">{{ errors.role }}</p>
          </div>
          <div class="flex justify-end gap-2 pt-2">
            <button type="button" class="px-4 py-2 rounded-md border bg-white hover:bg-slate-50" @click="closeForm" :disabled="submitting">Cancelar</button>
            <button type="submit" class="px-4 py-2 rounded-md bg-[#004aad] text-white hover:opacity-90 disabled:opacity-60" :disabled="submitting">{{ isEditing ? 'Actualizar' : 'Agregar' }}</button>
          </div>
        </form>
      </div>
    </div>

    <Toasts :toasts="toasts" />
  </section>
</template>

<script setup lang="ts">
type Usuario = { id: number | string; username?: string; nombre?: string; email?: string }
type Departamento = { id: number | string; nombre: string; responsableId?: number | string }
type Asset = { id: number | string; departamentId?: number | string }
const API_BASE = 'http://localhost:3000'
const { data, pending, error, refresh } = await useAsyncData<Usuario[]>('usuarios', () =>
  $fetch<Usuario[]>(`${API_BASE}/usuarios`)
)
const usuarios = computed<Usuario[]>(() => (data.value ?? []))

// Traer departamentos y activos para computar activos por responsable
const { data: deps } = await useAsyncData<Departamento[]>('usuarios-deps', () =>
  $fetch<Departamento[]>(`${API_BASE}/departments`)
)
const { data: assets } = await useAsyncData<Asset[]>('usuarios-assets', () =>
  $fetch<Asset[]>(`${API_BASE}/assets`)
)

const activosPorUsuario = computed<Record<string | number, number>>(() => {
  const mapa: Record<string | number, number> = {}
  const departamentos = deps.value ?? []
  const activos = assets.value ?? []
  for (const d of departamentos) {
    const depId = d.id
    const respId = d.responsableId as string | number | undefined
    if (!respId) continue
    const count = activos.filter(a => a.departamentId === depId).length
    mapa[respId] = (mapa[respId] ?? 0) + count
  }
  return mapa
})

// Formulario modal
const showForm = ref(false)
const isEditing = ref(false)
const editingUserId = ref<string | number | null>(null)
const form = reactive<{ username: string; email: string; role: 'admin' | 'responsable' }>({ username: '', email: '', role: 'responsable' })
const errors = reactive<{ username?: string; email?: string; role?: string }>({})
const submitting = ref(false)

function openAddForm() {
  isEditing.value = false
  editingUserId.value = null
  form.username = ''
  form.email = ''
  form.role = 'responsable'
  showForm.value = true
}

function openEditForm(u: Usuario) {
  isEditing.value = true
  editingUserId.value = u.id
  form.username = (u.username ?? u.nombre ?? '')
  form.email = (u.email ?? '')
  form.role = 'responsable'
  showForm.value = true
}

function closeForm() {
  showForm.value = false
}

async function submitForm() {
  // Validación simple
  errors.username = !form.username ? 'El usuario es obligatorio' : ''
  const emailRegex = /.+@.+\..+/
  errors.email = !form.email ? 'El email es obligatorio' : (!emailRegex.test(form.email) ? 'Email inválido' : '')
  errors.role = (form.role !== 'admin' && form.role !== 'responsable') ? 'Rol inválido' : ''
  if (errors.username || errors.email || errors.role) return

  submitting.value = true
  try {
    if (isEditing.value && editingUserId.value != null) {
      await $fetch(`${API_BASE}/usuarios/update/${editingUserId.value}`, {
        method: 'PUT',
        body: { username: form.username, email: form.email, role: form.role },
      })
      showToast('Usuario actualizado', 'success')
    } else {
      await $fetch(`${API_BASE}/usuarios/create`, {
        method: 'POST',
        body: { username: form.username, email: form.email, role: form.role },
      })
      showToast('Usuario creado', 'success')
    }
    showForm.value = false
    await refresh()
  } catch (e) {
    showToast('Error al guardar usuario', 'error')
  } finally {
    submitting.value = false
  }
}

async function onDeleteUser(u: Usuario) {
  if (!confirm(`Eliminar a ${u.username ?? u.nombre ?? 'este usuario'}?`)) return
  try {
    await $fetch(`${API_BASE}/usuarios/delete/${u.id}`, { method: 'DELETE' })
    await refresh()
    showToast('Usuario eliminado', 'success')
  } catch (e) {
    showToast('Error al eliminar usuario', 'error')
  }
}

// Toast simple
import type { Toast as ToastType } from '~/components/Toasts.vue'
const toasts = ref<ToastType[]>([])
function showToast(message: string, type: 'success' | 'error') {
  const id = Date.now() + Math.random()
  toasts.value.push({ id, message, type })
  setTimeout(() => {
    toasts.value = toasts.value.filter(t => t.id !== id)
  }, 2500)
}
</script>


