/**
 * @file        config.validation.test.ts
 * @description Config validation test (prevents config drift in CI)
 * @version     1.0.0
 * @created     2026-01-07 20:00:00 CET
 * @updated     2026-01-07 20:00:00 CET
 * @author      Akki Scholze
 *
 * @changelog
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
    expect(appConfig.server.port).toBe(3001);
    expect(appConfig.server.host).toBe('localhost');
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
