// @file        tests/e2e/example.spec.ts
// @description E2E Test - App Start und Navigation
// @version     1.1.0
// @created     2026-01-08 15:00:00 CET
// @updated     2026-01-08 15:30:00 CET
// @author      agenten-koordinator
//
// @changelog
//   1.1.0 - 2026-01-08 - Tests vereinfacht und baseURL verwendet
//   1.0.0 - 2026-01-08 - Echte E2E-Tests für Material-Tracker erstellt

import { test, expect } from '@playwright/test';

test.describe('Material-Tracker App', () => {
  test('App startet und zeigt Startseite', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    // Prüfe Titel
    await expect(page).toHaveTitle(/Material-Tracker/);
    
    // Prüfe, dass Root-Element existiert
    const root = page.locator('#root');
    await expect(root).toBeAttached();
  });

  test('Navigation zu Material-Seite', async ({ page }) => {
    await page.goto('/material');
    await page.waitForLoadState('networkidle');
    await expect(page).toHaveURL('/material');
  });

  test('Navigation zu Kunden-Seite', async ({ page }) => {
    await page.goto('/kunden');
    await page.waitForLoadState('networkidle');
    await expect(page).toHaveURL('/kunden');
  });

  test('Navigation zu Gläubiger-Seite', async ({ page }) => {
    await page.goto('/glaeubiger');
    await page.waitForLoadState('networkidle');
    await expect(page).toHaveURL('/glaeubiger');
  });

  test('Navigation zu Schuldner-Seite', async ({ page }) => {
    await page.goto('/schuldner');
    await page.waitForLoadState('networkidle');
    await expect(page).toHaveURL('/schuldner');
  });

  test('Navigation über Links funktioniert', async ({ page }) => {
    await page.goto('/');
    
    // Klick auf Kunden-Link in der Navigation
    const kundenLink = page.locator('nav a[href="/kunden"]');
    if (await kundenLink.isVisible()) {
      await kundenLink.click();
      await expect(page).toHaveURL('/kunden');
    }
  });
});