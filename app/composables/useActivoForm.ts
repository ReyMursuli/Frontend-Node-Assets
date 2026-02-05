import { ref } from 'vue'

export const useActivoForm = (storageKey: string = 'activo-draft') => {
  const { addToast } = useToast()

  const formData = ref({
    nombre: '',
    codigo: '',
    rotulo: '',
    val_inicial: 0,
    val_residual: 0,
    dep_acomulada: 0,
    departamentId: null as number | null
  })

  const isSubmitting = ref(false)
  const loadingCatalogos = ref(true)
  const departamentos = ref<any[]>([])

  const saveDraft = () => localStorage.setItem(storageKey, JSON.stringify(formData.value))
  const loadDraft = () => {
    const saved = localStorage.getItem(storageKey)
    if (saved) formData.value = JSON.parse(saved)
  }
  const clearDraft = () => localStorage.removeItem(storageKey)

  // Carga de departamentos usando el cliente api inyectado
  const fetchCatalogos = async (api: any) => {
    loadingCatalogos.value = true
    try {
      const data: any = await api.fetch('/api/departments')
      const raw = Array.isArray(data) ? data : (data.departments || [])
      
      // Mapeamos 'nombre' a 'username' porque Select.vue busca option.username
      departamentos.value = raw.map((d: any) => ({
        id: d.id,
        username: d.nombre 
      }))
    } catch (e) {
      addToast('Error al cargar departamentos', { type: 'error' } as any)
    } finally {
      loadingCatalogos.value = false
    }
  }

  const validate = () => {
    const f = formData.value
    if (!f.nombre || !f.codigo || !f.rotulo || !f.departamentId) {
      addToast('Los campos con * son obligatorios', { type: 'error' } as any)
      return false
    }
    return true
  }

  return {
    formData, isSubmitting, loadingCatalogos, departamentos,
    validate, saveDraft, loadDraft, clearDraft, fetchCatalogos, addToast
  }
}