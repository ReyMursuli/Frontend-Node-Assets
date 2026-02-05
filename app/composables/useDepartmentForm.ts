import { ref } from 'vue'

interface UserOption {
  id: number;
  username: string;
}

export const useDepartmentForm = (storageKey: string = 'department-draft') => {
  const { addToast } = useToast()

  const formData = ref({
    nombre: '',
    codigo: '',
    responsableId: null as number | null
  })

  const isSubmitting = ref(false)
  const loadingUsers = ref(true)
  const usuarios = ref<UserOption[]>([])

  const saveDraft = () => {
    localStorage.setItem(storageKey, JSON.stringify(formData.value))
  }

  const loadDraft = () => {
    const saved = localStorage.getItem(storageKey)
    if (saved) {
      try {
        formData.value = JSON.parse(saved)
      } catch (e) {
        console.error("Error al cargar borrador", e)
      }
    }
  }

  const clearDraft = () => {
    localStorage.removeItem(storageKey)
  }

  const fetchUsers = async (api: any) => {
    loadingUsers.value = true
    try {
      const data: any = await api.fetch('/api/users')
      const rawUsers = Array.isArray(data) ? data : (data.users || [])
      
      // Mapeamos para que Select.vue lea 'id' y 'username'
      usuarios.value = rawUsers.map((u: any) => ({ 
        id: u.id, 
        username: u.username 
      }))
    } catch (e) {
      addToast('Error al cargar la lista de usuarios', { type: 'error' } as any)
    } finally {
      loadingUsers.value = false
    }
  }

  const validate = () => {
    if (!formData.value.nombre || !formData.value.codigo) {
      addToast('Nombre y código son obligatorios', { type: 'error' } as any)
      return false
    }
    return true
  }

  return {
    formData, isSubmitting, loadingUsers, usuarios,
    validate, saveDraft, loadDraft, clearDraft, fetchUsers, addToast
  }
}