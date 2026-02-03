import { defineConfig } from 'vitest/config'
import { resolve } from 'path'

export default defineConfig({
  test: {
    environment: 'jsdom',
    setupFiles: ['./app/tests/e2e/setup.ts'],
    include: ['./app/tests/e2e/*.e2e.spec.ts'],
    exclude: ['./app/tests/e2e/setup.ts'],
    globals: true,
    testTimeout: 15000,
    hookTimeout: 15000,
  },
  resolve: {
    alias: {
      '~': resolve(__dirname, './app'),
      '@': resolve(__dirname, './app'),
      '~~': resolve(__dirname, '.'),
      '@@': resolve(__dirname, '.'),
    },
  },
})