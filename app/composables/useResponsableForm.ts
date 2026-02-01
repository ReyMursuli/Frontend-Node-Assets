import { ref, watch, onMounted } from 'vue'

export const useResponsableForm = (storageKey = 'form-responsable-draft') => {
  
  const formData = ref({
    username: '',
    email: '',
    password: '',
    rol: '',
    foto: null as File | null
  })

  const previewImage = ref<string | null>(null)
  const isSubmitting = ref(false)
  const errors = ref<Record<string, string>>({})

  // Validaciones
  const validate = () => {
    errors.value = {}
    if (!formData.value.username.trim()) errors.value.username = 'El username es requerido'
    if (!formData.value.email.includes('@')) errors.value.email = 'Email inválido'
    if (!formData.value.password.trim()) errors.value.password = 'La contraseña es requerida'
    if (formData.value.password.length < 6) errors.value.password = 'La contraseña debe tener al menos 6 caracteres'
    if (!formData.value.rol) errors.value.rol = 'Debe seleccionar un rol'
    return Object.keys(errors.value).length === 0
  }

  // Manejo de Imagen
  const handleImageUpload = (file: File) => {
    if (!file.type.startsWith('image/')) return 'Por favor, selecciona una imagen válida'
    if (file.size > 5 * 1024 * 1024) return 'La imagen no debe superar los 5MB'
    
    formData.value.foto = file
    const reader = new FileReader()
    reader.onload = (e) => previewImage.value = e.target?.result as string
    reader.readAsDataURL(file)
    return null
  }

  // LocalStorage (Borradores)
  const saveDraft = () => {
    if (process.server) return
    localStorage.setItem(storageKey, JSON.stringify({
      ...formData.value,
      foto: null // No guardamos el File object en localStorage
    }))
  }

  const loadDraft = () => {
    if (process.server) return
    const saved = localStorage.getItem(storageKey)
    if (saved) {
      const parsed = JSON.parse(saved)
      Object.assign(formData.value, parsed)
      return true
    }
    return false
  }

  const clearDraft = () => {
    if (process.server) return
    localStorage.removeItem(storageKey)
  }

  return {
    formData,
    previewImage,
    isSubmitting,
    errors,
    validate,
    handleImageUpload,
    saveDraft,
    loadDraft,
    clearDraft
  }
}