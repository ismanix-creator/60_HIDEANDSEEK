/**
 * @file        playwright.config.ts
 * @description Playwright Konfiguration fuer E2E Tests
 * @version     1.0.0
 * @created     2026-01-08 15:20:04 CET
 * @updated     2026-01-08 15:20:04 CET
 * @author      codex
 *
 * @changelog
 *   1.0.0 - 2026-01-08 - Env BaseURL und Header hinzugefuegt
 */

import { defineConfig, devices } from '@playwright/test';

const baseURL = process.env.VITE_APP_BASE_URL || 'http://localhost:5173';

export default defineConfig({
  testDir: 'tests/e2e',
  timeout: 30000,
  expect: {
    timeout: 5000
  },
  reporter: 'html',
  use: {
    baseURL,
    trace: 'on-first-retry',
    ...devices['Desktop Chrome']
  },
  webServer: {
    command: 'pnpm dev',
    url: baseURL,
    reuseExistingServer: true
  }
});
