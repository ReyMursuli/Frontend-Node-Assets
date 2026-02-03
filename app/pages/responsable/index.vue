<<template>
  <section>
    <div class="flex justify-between items-center mb-6">
      <div>
        <h1 class="text-2xl font-semibold text-[#004aad]">Responsables</h1>
        <p v-if="userEmail" class="text-sm text-gray-600 mt-1">Sesión: {{ userEmail }}</p>
      </div>
      <div class="flex items-center gap-2">
        <NuxtLink
          to="/responsable/add"
          class="flex items-center gap-1 px-4 py-2 rounded-md bg-[#004aad] text-white hover:bg-[#003d8f] transition-colors"
        >
          <span>+</span> Agregar usuario
        </NuxtLink>
      </div>
    </div>

    <div class="rounded-lg bg-white shadow">
      <div class="border-b px-4 py-3">
        <span class="font-medium">Usuarios en el sistema <span class="text-slate-500 font-normal">(Total: {{ usuarios.length }})</span></span>
      </div>
      
      <div class="p-4">
        <div v-if="pending" class="flex items-center justify-center py-10">
          <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-[#004aad]"></div>
          <span class="ml-3 text-slate-600">Cargando datos seguros...</span>
        </div>

        <div v-else-if="error" class="p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
          <p class="font-bold">Error de Autenticación o Conexión</p>
          <p class="text-sm">No se pudo validar tu sesión o el servidor no responde.</p>
          <button @click="refreshAll" class="mt-2 text-xs underline">Reintentar</button>
        </div>

        <div v-else-if="usuarios.length > 0" class="grid gap-3 md:grid-cols-2">
          <div
            v-for="u in usuarios"
            :key="u.id"
            class="rounded-lg border bg-white px-4 py-3 hover:shadow-md transition-shadow"
          >
            <div class="flex items-center justify-between gap-3">
              <span class="px-3 py-1.5 rounded-md bg-slate-100 text-slate-700 font-semibold text-sm">
                {{ u.username || u.nombre || 'Sin nombre' }}
              </span>
              <div class="flex items-center gap-2">
                <NuxtLink
                  :to="`/responsable/update/${u.id}`"
                  class="px-3 py-1 rounded-full border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs"
                >Actualizar</NuxtLink>
                <button
                  class="px-3 py-1 rounded-full border border-red-100 hover:bg-red-50 text-red-600 text-xs"
                  @click="onDeleteUser(u)"
                >Eliminar</button>
              </div>
            </div>
            <div class="mt-3 space-y-1">
              <p class="text-xs text-slate-500 italic">{{ u.email || 'Sin correo' }}</p>
              <p class="text-xs font-medium text-[#004aad]">
                Activos bajo su cargo: {{ getActivosCount(u.id) }}
              </p>
            </div>
          </div>
        </div>

        <div v-else class="text-center py-10 text-slate-400">
          No se encontraron responsables registrados.
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
// 1. Tipos
interface Usuario { id: number | string; username?: string; nombre?: string; email?: string }
interface Departamento { id: number | string; nombre: string; responsableId?: number | string }
interface Asset { id: number | string; departamentId?: number | string }

// 2. Setup de Hooks
const { data: session } = useAuth()
// Extraemos la función 'fetch' de tu composable useApi
const { fetch: apiFetch } = useApi()

const userEmail = computed(() => session.value?.user?.email ?? null)

// 3. Peticiones de datos usando apiFetch (que inyecta el token)
const { data: rawUsers, pending, error, refresh: refreshUsers } = await useAsyncData<Usuario[]>(
  'users-list', 
  () => apiFetch('/api/users'), // USAMOS apiFetch
  { server: false }
)

const { data: rawDeps, refresh: refreshDeps } = await useAsyncData<Departamento[]>(
  'deps-list', 
  () => apiFetch('/api/departments'), // USAMOS apiFetch para evitar el 401
  { server: false }
)

const { data: rawAssets, refresh: refreshAssets } = await useAsyncData<Asset[]>(
  'assets-list', 
  () => apiFetch('/api/assets'), // USAMOS apiFetch
  { server: false }
)

// Computed Properties
const usuarios = computed(() => rawUsers.value ?? [])
const departamentos = computed(() => rawDeps.value ?? [])
const activos = computed(() => rawAssets.value ?? [])

// 4. Lógica de cálculo
function getActivosCount(userId: number | string) {
  const deptsDelUser = departamentos.value
    .filter(d => String(d.responsableId) === String(userId))
    .map(d => d.id)

  return activos.value.filter(a => deptsDelUser.includes(a.departamentId)).length
}

async function refreshAll() {
  await Promise.all([refreshUsers(), refreshDeps(), refreshAssets()])
}

// 5. Acciones
async function onDeleteUser(u: Usuario) {
  const nombre = u.username ?? u.nombre ?? 'este usuario'
  if (!confirm(`¿Estás seguro de que deseas eliminar a ${nombre}?`)) return
  
  try {
    // Usamos apiFetch para el DELETE
    await apiFetch(`/api/users/delete/${u.id}`, { method: 'DELETE' })
    await refreshUsers()
  } catch (err: any) {
    console.error('Error al eliminar:', err)
  }
}
</script>