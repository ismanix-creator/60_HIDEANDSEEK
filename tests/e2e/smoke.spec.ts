// @file        tests/e2e/smoke.spec.ts
// @description E2E Smoke Test - Prüft, ob die App überhaupt lädt
// @version     1.0.0
// @created     2026-01-08 15:40:00 CET
// @updated     2026-01-08 15:40:00 CET
// @author      Akki Scholze
//
// @changelog
//   1.0.0 - 2026-01-08 - Smoke Test erstellt

import { test, expect } from '@playwright/test';

test.describe('Smoke Tests', () => {
  test('HTML lädt ohne Fehler', async ({ page }) => {
    const response = await page.goto('/');
    expect(response?.status()).toBe(200);
  });

  test('Root Element existiert', async ({ page }) => {
    await page.goto('/');
    const root = page.locator('#root');
    await expect(root).toBeAttached();
  });

  test('Keine kritischen JS-Fehler beim Laden', async ({ page }) => {
    const criticalErrors: string[] = [];
    page.on('console', (msg) => {
      if (msg.type() === 'error') {
        const text = msg.text();
        // Ignoriere bekannte nicht-kritische Fehler:
        // - 404 für Ressourcen
        // - API fetch errors (Server könnte nicht laufen)
        if (
          !text.includes('404') &&
          !text.includes('Failed to load resource') &&
          !text.includes('Failed to fetch') &&
          !text.includes('API fetch error')
        ) {
          criticalErrors.push(text);
        }
      }
    });
    page.on('pageerror', (error) => {
      // Ignoriere Netzwerk-/API-Fehler in pageerror
      const msg = error.message;
      if (!msg.includes('Failed to fetch') && !msg.includes('NetworkError')) {
        criticalErrors.push(msg);
      }
    });

    await page.goto('/');
    await page.waitForLoadState('networkidle');

    if (criticalErrors.length > 0) {
      console.log('Critical JS Errors:', criticalErrors);
      throw new Error(`Found ${criticalErrors.length} critical errors: ${criticalErrors.join(', ')}`);
    }
  });

  test('Body ist nicht leer', async ({ page }) => {
    await page.goto('/');
    await page.waitForTimeout(1000);
    const bodyText = await page.locator('body').textContent();
    expect(bodyText?.length || 0).toBeGreaterThan(0);
  });
});
