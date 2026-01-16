/**
 * @file        vitest.config.ts
 * @description Vitest-Konfiguration für Unit-Tests
 * @version     1.0.1
 * @created     2026-01-08 16:00:00 CET
 * @updated     2026-01-08 15:20:04 CET
 * @author      Akki Scholze
 *
 * @changelog
 *   1.0.0 - 2026-01-08 - Vitest Config erstellt, E2E-Tests ausgeschlossen
 *   1.0.1 - 2026-01-08 - Test-Globs fuer DB/API/Property erweitert
 */

import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src')
    }
  },
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./tests/setup.ts'],
    include: [
      'tests/unit/**/*.test.{ts,tsx}',
      'tests/integration/**/*.test.{ts,tsx}',
      'tests/db/**/*.test.ts',
      'tests/api/**/*.test.ts',
      'tests/property/**/*.test.ts',
      'tests/*.test.ts'
    ],
    environmentMatchGlobs: [
      ['tests/db/**/*.test.ts', 'node'],
      ['tests/api/**/*.test.ts', 'node'],
      ['tests/property/**/*.test.ts', 'node']
    ],
    exclude: ['tests/e2e/**', 'node_modules', 'dist'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      exclude: ['node_modules/', 'tests/', 'dist/', '**/*.d.ts', '**/*.config.*', '**/mockData/*']
    }
  }
});
