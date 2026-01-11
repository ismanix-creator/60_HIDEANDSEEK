/**
 * @file        playwright.config.ts
 * @description Playwright Konfiguration fuer E2E Tests
 * @version     1.3.0
 * @created     2026-01-08 15:20:04 CET
 * @updated     2026-01-12 10:45:00 CET
 * @author      codex
 *
 * @changelog
 *   1.3.0 - 2026-01-12 - Stabilisiert baseURL-Handling (lokaler Fallback, PLAYWRIGHT_BASE_URL-Unterstuetzung) um ngrok-Warnseiten zu vermeiden
 *   1.2.0 - 2026-01-08 - Explizites dotenv/config laden fuer .env Support
 *   1.1.0 - 2026-01-08 - Entfernt hardcoded Fallback (ENV MUSS vorhanden sein)
 *   1.0.0 - 2026-01-08 - Env BaseURL und Header hinzugefuegt
 */

import 'dotenv/config';
import { defineConfig, devices } from '@playwright/test';

const DEFAULT_BASE_URL = 'http://127.0.0.1:5173';

const resolveBaseURL = () => {
  const candidate = (process.env.PLAYWRIGHT_BASE_URL ?? process.env.VITE_APP_BASE_URL)?.trim();

  if (!candidate) {
    console.warn(`[playwright.config] Kein baseURL in ENV gefunden - nutze lokalen Fallback ${DEFAULT_BASE_URL}`);
    return DEFAULT_BASE_URL;
  }

  const isNgrokHost = /ngrok/i.test(candidate);
  if (isNgrokHost) {
    console.warn(
      `[playwright.config] baseURL zeigt auf ngrok (${candidate}) - fuer stabile E2E Tests wird lokal auf ${DEFAULT_BASE_URL} zurueckgefallen`
    );
    return DEFAULT_BASE_URL;
  }

  return candidate;
};

const baseURL = resolveBaseURL();

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
