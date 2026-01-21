import { ref, watch, onMounted } from 'vue'

export const useDepartmentForm = (storageKey: string = 'department-draft') => {
  const { public: { apiBase } } = useRuntimeConfig()
  const { addToast } = useToast()

  // Estado del formulario
  const formData = ref({
    nombre: '',
    codigo: '',
    responsableId: null as number | null
  })

  const isSubmitting = ref(false)
  const loadingUsers = ref(true)
  const usuarios = ref([])

  // --- Lógica de LocalStorage (Borrador) ---
  
  const saveDraft = () => {
    localStorage.setItem(storageKey, JSON.stringify(formData.value))
  }

  const loadDraft = () => {
    const saved = localStorage.getItem(storageKey)
    if (saved) {
      try {
        formData.value = JSON.parse(saved)
      } catch (e) {
        console.error("Error al parsear el borrador", e)
      }
    }
  }

  const clearDraft = () => {
    localStorage.removeItem(storageKey)
  }

  // --- Lógica de API ---

  const fetchUsers = async () => {
    loadingUsers.value = true
    try {
      const data: any = await $fetch(`${apiBase}/usuarios`)
      usuarios.value = Array.isArray(data) ? data : (data.users || [])
    } catch (e) {
      console.error("Error cargando usuarios", e)
    } finally {
      loadingUsers.value = false
    }
  }

  // Validaciones básicas
  const validate = () => {
    if (!formData.value.nombre || !formData.value.codigo) {
      addToast('Nombre y código son obligatorios', 'error')
      return false
    }
    return true
  }

  return {
    formData,
    isSubmitting,
    loadingUsers,
    usuarios,
    apiBase,
    validate,
    saveDraft,
    loadDraft,
    clearDraft,
    fetchUsers,
    addToast
  }
}