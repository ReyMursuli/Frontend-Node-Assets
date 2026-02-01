import { ref } from 'vue'

export const useActivoForm = (storageKey: string = 'activo-add-draft') => {
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
      const apiBase = useApiBase()
      const data: any = await $fetch(`${apiBase}/api/departments`)
      // El backend devuelve array directo o con propiedades
      departamentos.value = Array.isArray(data) 
        ? data.map(d => ({ id: d.id, label: d.nombre, value: d.id }))
        : (data.departments || []).map((d: any) => ({ id: d.id, label: d.nombre, value: d.id }))
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
    addToast,
    validate,
    saveDraft,
    loadDraft,
    clearDraft,
    fetchCatalogos
  }
}