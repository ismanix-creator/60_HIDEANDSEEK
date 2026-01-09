/**
 * @file        config.validation.test.ts
 * @description Config validation test (prevents config drift in CI)
 * @version     2.0.0
 * @created     2026-01-07 20:00:00 CET
 * @updated     2026-01-08 20:00:00 CET
 * @author      Akki Scholze
 *
 * @changelog
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

  it('should have required top-level sections', () => {
    expect(appConfig.app).toBeDefined();
    expect(appConfig.server).toBeDefined();
    expect(appConfig.client).toBeDefined();
    expect(appConfig.database).toBeDefined();
    expect(appConfig.theme).toBeDefined();
    expect(appConfig.components).toBeDefined();
  });

  it('should have valid app metadata', () => {
    expect(appConfig.app.name).toBe('Material-Tracker');
    expect(appConfig.app.version).toMatch(/^\d+\.\d+\.\d+$/);
  });

  it('should have valid server config', () => {
    // Deterministic: validate type and range, not hardcoded values
    expect(appConfig.server.port).toBeTypeOf('number');
    expect(appConfig.server.port).toBeGreaterThan(0);
    expect(appConfig.server.port).toBeLessThanOrEqual(65535);
    expect(appConfig.server.host).toBeTypeOf('string');
    expect(appConfig.server.host.length).toBeGreaterThan(0);
  });

  it('should have valid database config', () => {
    expect(appConfig.database.type).toBe('sqlite');
    expect(appConfig.database.path).toBeTypeOf('string');
    expect(appConfig.database.path.length).toBeGreaterThan(0);
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
