import { mount } from '@vue/test-utils'
import { describe, it, expect } from 'vitest'
// Usamos el alias @ definido en tu vitest.config.ts para mayor claridad
import StatCard from '@/components/StatCard.vue' 

describe('StatCard.vue', () => {
  const defaultProps = {
    title: 'Usuarios Totales',
    value: 1250,
    description: 'Incremento del 12% este mes',
    variant: 'blue' as const
  }

  it('renderiza correctamente las props recibidas', () => {
    const wrapper = mount(StatCard, {
      props: defaultProps
    })

    // Validamos que el título, valor y descripción aparezcan en el DOM
    expect(wrapper.find('h2').text()).toBe(defaultProps.title)
    expect(wrapper.find('p.text-2xl, p.text-3xl').text()).toBe(defaultProps.value.toString())
    expect(wrapper.find('p.text-xs').text()).toBe(defaultProps.description)
  })

  it('aplica las clases de color dinámicas según la variante', async () => {
    const variants = [
      { name: 'blue', expectedText: 'group-hover:text-blue-600' },
      { name: 'green', expectedText: 'group-hover:text-green-600' },
      { name: 'amber', expectedText: 'group-hover:text-amber-600' }
    ]

    for (const variant of variants) {
      const wrapper = mount(StatCard, {
        props: { ...defaultProps, variant: variant.name as any }
      })
      
      const valueParagraph = wrapper.find('p.font-bold')
      expect(valueParagraph.classes()).toContain(variant.expectedText)
    }
  })

  it('renderiza el contenido del slot "icon"', () => {
    const wrapper = mount(StatCard, {
      props: defaultProps,
      slots: {
        icon: '<div class="test-icon">🚀</div>'
      }
    })

    expect(wrapper.find('.test-icon').exists()).toBe(true)
    expect(wrapper.find('.test-icon').text()).toBe('🚀')
  })

  it('verifica que la escala del icono cambie al hacer hover (clase group-hover)', () => {
    const wrapper = mount(StatCard, {
      props: defaultProps
    })
    
    // Buscamos el contenedor del icono por sus clases base
    const iconContainer = wrapper.find('.rounded-xl.flex')
    expect(iconContainer.classes()).toContain('group-hover:scale-110')
  })
})