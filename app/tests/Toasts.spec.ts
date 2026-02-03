import { mount } from '@vue/test-utils'
import { describe, it, expect, vi } from 'vitest'
import Toasts from '@/components/Toasts.vue'
import { ref } from 'vue'

// Simulamos el auto-import de Nuxt para useToast
vi.stubGlobal('useToast', () => ({
  toasts: ref([
    { id: 1, message: 'Éxito!', type: 'success' },
    { id: 2, message: 'Error fatal', type: 'error' }
  ])
}))
 
describe('Toasts.vue', () => {
  it('renderiza la lista de notificaciones correctamente', () => {
    const wrapper = mount(Toasts)
    
    const toastElements = wrapper.findAll('.rounded-md')
    expect(toastElements).toHaveLength(2)
    
    // El "!" le confirma a TS que el elemento en esa posición EXISTE
    expect(toastElements[0]!.text()).toContain('Éxito!')
    expect(toastElements[1]!.text()).toContain('Error fatal')
  })

  it('aplica la clase de color correcta según el tipo', () => {
    const wrapper = mount(Toasts)
    const toastElements = wrapper.findAll('.rounded-md')

    // Lo mismo aquí, añadimos el "!" antes de llamar al método
    expect(toastElements[0]!.classes()).toContain('bg-emerald-600')
    expect(toastElements[1]!.classes()).toContain('bg-red-600')
  })

  it('no renderiza nada si la lista de toasts está vacía', () => {
    // Re-definimos el mock para este test específico con lista vacía
    vi.stubGlobal('useToast', () => ({
      toasts: ref([])
    }))
    
    const wrapper = mount(Toasts)
    expect(wrapper.findAll('.rounded-md')).toHaveLength(0)
  })
})