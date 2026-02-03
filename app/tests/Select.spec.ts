import { mount } from '@vue/test-utils'
import { describe, it, expect } from 'vitest'
import Select from '@/components/common/Select.vue'

describe('Select.vue', () => {
  const options = [
    { id: 1, username: 'Usuario Uno' },
    { id: 2, username: 'Usuario Dos' }
  ]

  it('renderiza la etiqueta (label) si se proporciona', () => {
    const wrapper = mount(Select, {
      props: { 
        label: 'Asignar a:', 
        options,
        modelValue: null 
      }
    })
    
    const label = wrapper.find('label')
    expect(label.exists()).toBe(true)
    expect(label.text()).toBe('Asignar a:')
  })

  it('renderiza todas las opciones proporcionadas más el placeholder', () => {
    const placeholder = 'Selecciona un usuario'
    const wrapper = mount(Select, {
      props: { 
        options, 
        placeholder,
        modelValue: null
      }
    })

    const renderedOptions = wrapper.findAll('option')
    expect(renderedOptions).toHaveLength(options.length + 1)
    expect(renderedOptions.at(0)?.text()).toBe(placeholder)
    expect(renderedOptions.at(1)?.text()).toBe('Usuario Uno')
  })

  it('emite update:modelValue cuando cambia la selección', async () => {
    const wrapper = mount(Select, {
      props: { 
        options, 
        modelValue: '' 
      }
    })
    
    const select = wrapper.find('select')
    await select.setValue('2')

    // Obtenemos los eventos emitidos
    const emitted = wrapper.emitted('update:modelValue')
    
    // 1. Verificamos que el evento existe (esto quita el 'undefined' para TS)
    expect(emitted).toBeDefined()
    expect(emitted).toBeTruthy()

    // 2. Usamos el operador '!' porque ya hemos verificado que existe
    expect(emitted![0]).toEqual(['2'])
  })

  it('deshabilita el select cuando la prop disabled es true', () => {
    const wrapper = mount(Select, {
      props: { 
        options, 
        disabled: true,
        modelValue: null 
      }
    })
    
    // Usamos casting a HTMLSelectElement para acceder a la propiedad nativa
    const select = wrapper.find('select').element as HTMLSelectElement
    expect(select.disabled).toBe(true)
  })

  it('no renderiza el label si no se pasa como prop', () => {
    const wrapper = mount(Select, {
      props: { 
        options,
        modelValue: null
      }
    })
    
    expect(wrapper.find('label').exists()).toBe(false)
  })
})