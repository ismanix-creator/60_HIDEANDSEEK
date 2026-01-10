/**
 * @file        config.validation.test.ts
 * @description Config Validation Test - Verhindert Config Drift im CI
 * @version     2.0.0
 * @created     2026-01-07 20:00:00 CET
 * @updated     2026-01-10 04:24:56 CET
 * @author      Akki Scholze
 *
 * @description
 * Dieser Test stellt sicher, dass config.toml jederzeit mit dem Zod Schema übereinstimmt.
 * Bei Drift (missing/unknown/wrong types) failt Build/CI und zwingt zur Korrektur.
 *
 * ARCHITEKTUR:
 * - config.toml = App-Konfiguration ONLY (theme, ui, components, etc.)
 * - .env = Runtime-Variablen ONLY (Ports, Hosts, URLs, Secrets)
 * - Keine Runtime-Config in config.toml!
 *
 * @changelog
 *   2.0.0 - 2026-01-10 - Entfernt server/client/database Tests (kommen aus .env, nicht config.toml)
 *   1.0.0 - 2026-01-07 - Initial drift enforcement test
 */

import { describe, it, expect } from 'vitest';
import { appConfig } from '@/config';

describe('Config Validation (Drift Prevention)', () => {
  it('should successfully load and validate config.toml via Zod strict schema', () => {
    // appConfig wird beim Import bereits validiert (loadConfig() in load.ts)
    // Bei Schema-Fehlern würde load.ts einen Error werfen und Test failen
    expect(appConfig).toBeDefined();
  });

  it('should have app metadata defined', () => {
    expect(appConfig.app).toBeDefined();
    expect(appConfig.app.name).toBe('Material-Tracker');
    expect(appConfig.app.version).toMatch(/^\d+\.\d+\.\d+$/);
  });

  it('should NOT have runtime-config (server/client/database come from .env)', () => {
    // Architektur-Change: Runtime-Variablen sind NICHT in config.toml!
    expect(appConfig.server).toBeUndefined();
    expect(appConfig.client).toBeUndefined();
    expect(appConfig.database).toBeUndefined();
  });

  it('should have complete theme config defined', () => {
    expect(appConfig.theme).toBeDefined();
    expect(appConfig.theme.colors).toBeDefined();
    expect(appConfig.theme.typography).toBeDefined();
    expect(appConfig.theme.spacing).toBeDefined();
    expect(appConfig.theme.icons).toBeDefined();
    expect(appConfig.theme.breakpoints).toBeDefined();
    expect(appConfig.theme.borderRadius).toBeDefined();
    expect(appConfig.theme.shadows).toBeDefined();
  });

  it('should have components config defined', () => {
    expect(appConfig.components).toBeDefined();
    expect(appConfig.components.pageHeader).toBeDefined();
  });

  it('should validate hex colors in theme.colors.primary', () => {
    const hexRegex = /^#[0-9a-fA-F]{6}$/;
    expect(appConfig.theme.colors.primary['500']).toMatch(hexRegex);
    expect(appConfig.theme.colors.ui.background).toMatch(hexRegex);
  });

  it('should have strict breakpoint values', () => {
    expect(appConfig.theme.breakpoints.mobile).toBeTypeOf('number');
    expect(appConfig.theme.breakpoints.desktop).toBeTypeOf('number');
    expect(appConfig.theme.breakpoints.mobile).toBe(767);
  });
});
