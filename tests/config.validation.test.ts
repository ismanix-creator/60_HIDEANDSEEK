/**
 * @file        config.validation.test.ts
 * @description Config validation test (prevents config drift in CI)
 * @version     2.1.0
 * @created     2026-01-07 20:00:00 CET
 * @updated     2026-01-10 04:24:56 CET
 * @author      Akki Scholze
 *
 * @changelog
 *   2.1.0 - 2026-01-10 - Entfernt server/client/database Tests (Runtime-Variablen, nicht in config.toml)
 *   2.0.0 - 2026-01-08 - Tests sind nun deterministisch (keine hardcoded Erwartungen)
 *   1.0.0 - 2026-01-07 - Initial drift enforcement test
 */

import { describe, it, expect } from 'vitest';
import { appConfig } from '@/config';

describe('Config Validation', () => {
  it('should load and validate config without errors', () => {
    // If Zod validation fails, load.ts throws and test fails
    expect(appConfig).toBeDefined();
  });

  it('should have required top-level sections (app-config only)', () => {
    expect(appConfig.app).toBeDefined();
    expect(appConfig.auth).toBeDefined();
    expect(appConfig.theme).toBeDefined();
    expect(appConfig.components).toBeDefined();
    expect(appConfig.ui).toBeDefined();
  });

  it('should have valid app metadata', () => {
    expect(appConfig.app.name).toBe('Material-Tracker');
    expect(appConfig.app.version).toMatch(/^\d+\.\d+\.\d+$/);
  });

  it('should NOT have runtime-config (server/client/database come from .env)', () => {
    // Runtime-Variablen (Ports, Hosts, URLs, DB-Pfad) kommen aus .env
    // config.toml enthält NUR App-Konfiguration (theme, ui, components, etc.)
    expect(appConfig.server).toBeUndefined();
    expect(appConfig.client).toBeUndefined();
    expect(appConfig.database).toBeUndefined();
  });

  it('should have valid theme structure', () => {
    expect(appConfig.theme.colors).toBeDefined();
    expect(appConfig.theme.typography).toBeDefined();
    expect(appConfig.theme.spacing).toBeDefined();
    expect(appConfig.theme.icons).toBeDefined();
    expect(appConfig.theme.breakpoints).toBeDefined();
    expect(appConfig.theme.borderRadius).toBeDefined();
    expect(appConfig.theme.shadows).toBeDefined();
  });
});
