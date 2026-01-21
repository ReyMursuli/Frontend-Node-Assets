import { ref } from 'vue'

export type Toast = { id: number; message: string; type: 'success' | 'error' }

const toasts = ref<Toast[]>([])

export const useToast = () => {
  const addToast = (message: string, type: 'success' | 'error') => {
    const id = Date.now()
    toasts.value.push({ id, message, type })

    // Se quita solo tras 3 segundos
    setTimeout(() => {
      toasts.value = toasts.value.filter(t => t.id !== id)
    }, 3000)
  }

  return { toasts, addToast }
}