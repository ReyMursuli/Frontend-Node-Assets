import { beforeAll, afterAll, beforeEach, afterEach } from 'vitest'

// Configuración global para tests e2e
beforeAll(async () => {
  // Configurar variables de entorno para tests
  process.env.NODE_ENV = 'test'
  process.env.NUXT_PUBLIC_API_BASE_URL = 'http://localhost:3000/api'
})

beforeEach(async () => {
  // Limpiar localStorage antes de cada test (solo si existe)
  if (typeof window !== 'undefined') {
    localStorage.clear()
    sessionStorage.clear()
  }
})

afterEach(() => {
  // Limpiar después de cada test (solo si existe)
  if (typeof window !== 'undefined') {
    localStorage.clear()
    sessionStorage.clear()
  }
})

afterAll(() => {
  // Cleanup final
})

// Mock de useAuth para tests con tipado correcto
;(globalThis as any).mockAuth = {
  signIn: async ({ email, password }: { email: string; password: string }) => {
    if (email === 'admin@test.com' && password === 'admin123') {
      return { ok: true, data: { user: { email: 'admin@test.com', username: 'Admin', role: 'admin' } } }
    }
    return { ok: false, error: 'Invalid credentials' }
  },
  signOut: async () => ({ ok: true }),
  data: { user: { email: 'admin@test.com', username: 'Admin', role: 'admin' } },
  status: 'authenticated'
}

// Mock de useApi para tests con tipado correcto
;(globalThis as any).mockApi = {
  fetch: async (url: string) => {
    // Mock responses para diferentes endpoints
    if (url.includes('/count')) {
      return { total: Math.floor(Math.random() * 100) }
    }
    if (url.includes('/assets')) {
      return { data: [], total: 0 }
    }
    if (url.includes('/departments')) {
      return { data: [], total: 0 }
    }
    return { data: [] }
  }
}
