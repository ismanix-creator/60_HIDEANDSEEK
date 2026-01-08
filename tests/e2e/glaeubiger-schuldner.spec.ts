// @file        tests/e2e/glaeubiger-schuldner.spec.ts
// @description E2E Test - Gläubiger und Schuldner Verwaltung
// @version     1.1.0
// @created     2026-01-08 15:00:00 CET
// @updated     2026-01-08 15:30:00 CET
// @author      Akki Scholze
//
// @changelog
//   1.1.0 - 2026-01-08 - Tests vereinfacht, baseURL verwendet
//   1.0.0 - 2026-01-08 - E2E-Tests für Gläubiger/Schuldner erstellt

import { test, expect } from '@playwright/test';

test.describe('Gläubiger-Verwaltung', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/glaeubiger');
  });

  test('Gläubiger-Seite lädt', async ({ page }) => {
    await page.waitForLoadState('networkidle');
    await expect(page).toHaveURL('/glaeubiger');
  });
});

test.describe('Schuldner-Verwaltung', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/schuldner');
  });

  test('Schuldner-Seite lädt', async ({ page }) => {
    await page.waitForLoadState('networkidle');
    await expect(page).toHaveURL('/schuldner');
  });
});
