import { defineConfig } from 'vitest/config'
import vue from '@vitejs/plugin-vue'
import { resolve } from 'path'

export default defineConfig({
  plugins: [vue()],
  test: {
    // Ambiente de prueba
    environment: 'happy-dom',
    
    // Habilitar globals (describe, it, expect sin imports)
    globals: true,
    
    // Transformador para archivos Vue
    include: ['**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}'],
    exclude: ['node_modules', 'dist', '.idea', '.git', '.cache'],
    
    // Coverage
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      include: ['app/**/*.{js,ts,vue}'],
      exclude: [
        'node_modules/',
        'dist/',
        'app/**/*.spec.ts',
        'app/**/*.test.ts'
      ]
    },
    
    // Configuración de pruebas
    testTimeout: 10000,
    hookTimeout: 10000,
  },
  
  // Alias de resolución de paths (igual a Nuxt)
  resolve: {
    alias: {
      '#app': resolve(__dirname, './'),
      '~': resolve(__dirname, './'),
      '@': resolve(__dirname, './app')
    }
  }
})
