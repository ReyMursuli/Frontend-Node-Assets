// useToast.ts - Sistema de notificaciones optimizado
import { ref, nextTick } from 'vue'

export interface Toast {
  id: number
  message: string
  type: 'success' | 'error' | 'warning' | 'info'
  duration?: number
  persistent?: boolean
  action?: {
    label: string
    handler: () => void
  }
}

export interface ToastOptions {
  type?: Toast['type']
  duration?: number
  persistent?: boolean
  action?: Toast['action']
}

// Estado global de toasts
const toasts = ref<Toast[]>([])
const toastId = ref(0)

export const useToast = () => {
  // Generador de IDs únicos
  const generateId = (): number => {
    return Date.now() + Math.random()
  }

  // Agregar toast con opciones avanzadas
  const addToast = (message: string, options: ToastOptions = {}): number => {
    const id = generateId()
    const toast: Toast = {
      id,
      message,
      type: options.type || 'info',
      duration: options.duration ?? 4000,
      persistent: options.persistent || false,
      action: options.action
    }

    toasts.value.push(toast)

    // Auto-eliminar si no es persistente
    if (!toast.persistent && toast.duration && toast.duration > 0) {
      setTimeout(() => {
        removeToast(id)
      }, toast.duration)
    }

    return id
  }

  // Métodos convenience para diferentes tipos
  const success = (message: string, options?: Omit<ToastOptions, 'type'>) => 
    addToast(message, { ...options, type: 'success' })

  const error = (message: string, options?: Omit<ToastOptions, 'type'>) => 
    addToast(message, { ...options, type: 'error', duration: 6000 })

  const warning = (message: string, options?: Omit<ToastOptions, 'type'>) => 
    addToast(message, { ...options, type: 'warning', duration: 5000 })

  const info = (message: string, options?: Omit<ToastOptions, 'type'>) => 
    addToast(message, { ...options, type: 'info' })

  // Remover toast específico
  const removeToast = (id: number): void => {
    const index = toasts.value.findIndex(toast => toast.id === id)
    if (index > -1) {
      toasts.value.splice(index, 1)
    }
  }

  // Limpiar todos los toasts
  const clearToasts = (): void => {
    toasts.value = []
  }

  // Limpiar toasts por tipo
  const clearToastsByType = (type: Toast['type']): void => {
    toasts.value = toasts.value.filter(toast => toast.type !== type)
  }

  // Actualizar toast existente
  const updateToast = (id: number, updates: Partial<Toast>): boolean => {
    const toast = toasts.value.find(t => t.id === id)
    if (toast) {
      Object.assign(toast, updates)
      return true
    }
    return false
  }

  // Toast con acción de deshacer
  const withAction = (
    message: string, 
    actionLabel: string, 
    actionHandler: () => void,
    options?: Omit<ToastOptions, 'action'>
  ): number => {
    return addToast(message, {
      ...options,
      action: {
        label: actionLabel,
        handler: actionHandler
      }
    })
  }

  // Toast de carga (persistente hasta que se complete)
  const loading = (message: string = 'Cargando...'): number => {
    return addToast(message, {
      type: 'info',
      persistent: true,
      duration: 0
    })
  }

  // Actualizar toast de carga a success/error
  const resolveLoading = (
    loadingId: number, 
    successMessage: string, 
    errorMessage?: string
  ): void => {
    const toast = toasts.value.find(t => t.id === loadingId)
    if (toast) {
      if (errorMessage) {
        updateToast(loadingId, {
          message: errorMessage,
          type: 'error',
          persistent: false,
          duration: 5000
        })
      } else {
        updateToast(loadingId, {
          message: successMessage,
          type: 'success',
          persistent: false,
          duration: 3000
        })
      }
    }
  }

  // Manejador de acción para toast
  const handleToastAction = (toast: Toast): void => {
    if (toast.action) {
      toast.action.handler()
      if (!toast.persistent) {
        removeToast(toast.id)
      }
    }
  }

  return {
    // Estado
    toasts: readonly(toasts),
    
    // Métodos principales
    addToast,
    removeToast,
    updateToast,
    clearToasts,
    clearToastsByType,
    handleToastAction,
    
    // Métodos convenience
    success,
    error,
    warning,
    info,
    withAction,
    loading,
    resolveLoading
  }
}

// Plugin global para usar en cualquier parte
export const toastPlugin = {
  install(app: any) {
    const toast = useToast()
    app.config.globalProperties.$toast = toast
    app.provide('toast', toast)
  }
}