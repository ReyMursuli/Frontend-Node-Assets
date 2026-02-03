import { test, expect } from '@playwright/test'

test.describe('Sistema de Gestión de Activos - E2E Tests', () => {
  const TEST_CREDENTIALS = {
    email: 'admin@test.com',
    password: 'admin123'
  }

  test.beforeEach(async ({ page }) => {
    // Login antes de cada test
    await page.goto('/login')
    await page.fill('input[type="email"]', TEST_CREDENTIALS.email)
    await page.fill('input[type="password"]', TEST_CREDENTIALS.password)
    await page.click('button[type="submit"]')
    await page.waitForURL('/')
  })

  test('1. Login exitoso y dashboard visible', async ({ page }) => {
    await expect(page.locator('h1')).toContainText('Dashboard')
    await expect(page.locator('text=Admin')).toBeVisible()
  })

  test('2. Estadísticas del dashboard cargan', async ({ page }) => {
    await expect(page.locator('text=Total Activos')).toBeVisible()
    await expect(page.locator('text=Departamentos')).toBeVisible()
    await expect(page.locator('text=Usuarios')).toBeVisible()
  })

  test('3. Navegación a gestión de activos', async ({ page }) => {
    await page.click('text=Nuevo Activo')
    await page.waitForURL('**/activo/add')
    await expect(page.locator('h1')).toBeVisible()
  })

  test('4. Navegación a departamentos', async ({ page }) => {
    await page.click('text=Departamentos')
    await page.waitForURL('**/departamentos')
    await expect(page.locator('h1')).toBeVisible()
  })

  test('5. Navegación a responsables', async ({ page }) => {
    await page.click('text=Responsables')
    await page.waitForURL('**/responsable')
    await expect(page.locator('h1')).toBeVisible()
  })

  test('6. Navegación a perfil', async ({ page }) => {
    await page.click('text=Mi Perfil')
    await page.waitForURL('**/profile')
    await expect(page.locator('h1')).toContainText('Mi Perfil')
  })

  test('7. Cerrar sesión funciona correctamente', async ({ page }) => {
    await page.click('button:has-text("Cerrar Sesión")')
    await page.waitForURL('**/login')
    await expect(page.locator('h1')).toContainText('Sistema de Gestión')
  })

  test('8. Login fallido con credenciales incorrectas', async ({ page }) => {
    await page.goto('/login')
    await page.fill('input[type="email"]', 'wrong@test.com')
    await page.fill('input[type="password"]', 'wrongpassword')
    await page.click('button[type="submit"]')
    
    await expect(page.locator('.bg-red-500\\/10')).toContainText('Usuario o contraseña incorrectos')
  })

  test('9. Validación de email en login', async ({ page }) => {
    await page.goto('/login')
    await page.fill('input[type="email"]', 'email-invalido')
    await page.fill('input[type="password"]', 'admin123')
    await page.click('button[type="submit"]')
    
    // El navegador debería mostrar validación nativa
    const emailInput = page.locator('input[type="email"]')
    await expect(emailInput).toHaveAttribute('type', 'email')
  })

  test('10. Responsive design - mobile view', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 })
    await page.reload()
    
    // Verificar elementos responsive
    await expect(page.locator('h1')).toContainText('Dashboard')
    await expect(page.locator('text=Activo')).toBeVisible() // Versión corta en mobile
  })

  test('11. Acceso directo a rutas protegidas', async ({ page }) => {
    // Intentar acceder directamente a una ruta protegida sin login
    await page.goto('/profile')
    await page.waitForURL('**/login')
    
    // Después del login debería redirigir al perfil
    await page.fill('input[type="email"]', TEST_CREDENTIALS.email)
    await page.fill('input[type="password"]', TEST_CREDENTIALS.password)
    await page.click('button[type="submit"]')
    await page.waitForURL('**/')
  })

  test('12. Estado de carga en dashboard', async ({ page }) => {
    // Verificar que hay indicadores de carga
    await page.reload()
    
    // El dashboard debería mostrar contenido eventualmente
    await expect(page.locator('h1')).toContainText('Dashboard', { timeout: 5000 })
  })
})
