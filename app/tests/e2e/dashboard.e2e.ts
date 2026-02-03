import { test, expect } from '@playwright/test'

test.describe('Dashboard E2E Tests', () => {
  test.beforeEach(async ({ page }) => {
    // Login primero
    await page.goto('/login')
    await page.fill('input[type="email"]', 'admin@test.com')
    await page.fill('input[type="password"]', 'admin123')
    await page.click('button[type="submit"]')
    await page.waitForURL('/')
  })

  test('debería mostrar dashboard con información del usuario', async ({ page }) => {
    await expect(page.locator('h1')).toContainText('Dashboard')
    await expect(page.locator('text=Admin')).toBeVisible()
    await expect(page.locator('text=admin@test.com')).toBeVisible()
  })

  test('debería mostrar estadísticas', async ({ page }) => {
    await expect(page.locator('text=Total Activos')).toBeVisible()
    await expect(page.locator('text=Departamentos')).toBeVisible()
    await expect(page.locator('text=Usuarios')).toBeVisible()
  })

  test('debería mostrar acciones rápidas', async ({ page }) => {
    await expect(page.locator('text=Nuevo Activo')).toBeVisible()
    await expect(page.locator('text=Departamentos')).toBeVisible()
    await expect(page.locator('text=Responsables')).toBeVisible()
    await expect(page.locator('text=Mi Perfil')).toBeVisible()
  })

  test('debería navegar a activos', async ({ page }) => {
    await page.click('text=Nuevo Activo')
    await page.waitForURL('**/activo/add')
    await expect(page.locator('h1')).toBeVisible()
  })
})
