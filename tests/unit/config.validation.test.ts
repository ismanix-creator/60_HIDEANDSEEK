/**
 * @file        config.validation.test.ts
 * @description Config Validation Test - Verhindert Config Drift im CI
 * @version     1.0.0
 * @created     2026-01-07 20:00:00 CET
 * @updated     2026-01-07 20:00:00 CET
 * @author      Akki Scholze
 *
 * @description
 * Dieser Test stellt sicher, dass config.toml jederzeit mit dem Zod Schema übereinstimmt.
 * Bei Drift (missing/unknown/wrong types) failt Build/CI und zwingt zur Korrektur.
 *
 * @changelog
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

  it('should have server config defined', () => {
    expect(appConfig.server).toBeDefined();
    expect(appConfig.server.port).toBeTypeOf('number');
    expect(appConfig.server.host).toBeTypeOf('string');
  });

  it('should have client config defined', () => {
    expect(appConfig.client).toBeDefined();
    expect(appConfig.client.port).toBeTypeOf('number');
    expect(appConfig.client.apiUrl).toMatch(/^https?:\/\//);
  });

  it('should have database config defined', () => {
    expect(appConfig.database).toBeDefined();
    expect(appConfig.database.type).toBeTypeOf('string');
    expect(appConfig.database.path).toBeTypeOf('string');
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
