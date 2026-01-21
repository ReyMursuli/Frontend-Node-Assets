import { ref } from 'vue'

export const useActivoForm = (storageKey: string = 'activo-add-draft') => {
  const { public: { apiBase } } = useRuntimeConfig()
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
  const departamentos = ref([])

  // --- Lógica de LocalStorage ---
  const saveDraft = () => {
    localStorage.setItem(storageKey, JSON.stringify(formData.value))
  }

  const loadDraft = () => {
    const saved = localStorage.getItem(storageKey)
    if (saved) {
      try {
        formData.value = JSON.parse(saved)
      } catch (e) {
        console.error("Error al cargar borrador de activo", e)
      }
    }
  }

  const clearDraft = () => {
    localStorage.removeItem(storageKey)
  }

  // --- Carga de Departamentos ---
  const fetchCatalogos = async () => {
    loadingCatalogos.value = true
    try {
      const data: any = await $fetch(`${apiBase}/departments`)
      // Si el API devuelve array directo, lo asignamos; si no, buscamos la propiedad
      departamentos.value = Array.isArray(data) ? data : (data.departments || [])
    } catch (e) {
      addToast('Error al cargar la lista de departamentos', 'error')
    } finally {
      loadingCatalogos.value = false
    }
  }

  const validate = () => {
    const f = formData.value
    if (!f.nombre || !f.codigo || !f.rotulo || !f.departamentId) {
      addToast('Por favor rellene todos los campos obligatorios y seleccione un departamento', 'error')
      return false
    }
    if (f.val_inicial < 0 || f.val_residual < 0) {
      addToast('Los valores monetarios deben ser positivos', 'error')
      return false
    }
    return true
  }

  return {
    formData,
    isSubmitting,
    loadingCatalogos,
    departamentos,
    apiBase,
    addToast,
    validate,
    saveDraft,
    loadDraft,
    clearDraft,
    fetchCatalogos
  }
}