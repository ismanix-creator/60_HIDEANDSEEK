/**
 * @file        config.validation.test.ts
 * @description Config validation test (prevents config drift in CI)
 * @version     3.0.0
 * @created     2026-01-07 20:00:00 CET
 * @updated     2026-01-11 08:05:57 CET
 * @author      Akki Scholze
 *
 * @changelog
 *   3.0.0 - 2026-01-11 08:05:57 CET - Anpassung an neue config.toml Struktur (kein theme Objekt mehr, alles top-level: app, auth, navigation, badge, borderRadius, breakpoints, button, colors)
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

  it('should have required top-level sections', () => {
    // config.toml hat KEINE theme/components/ui wrapper mehr
    // Alles ist top-level: app, auth, navigation, badge, borderRadius, breakpoints, button, colors, etc.
    expect(appConfig.app).toBeDefined();
    expect(appConfig.auth).toBeDefined();
    expect(appConfig.navigation).toBeDefined();
    expect(appConfig.badge).toBeDefined();
    expect(appConfig.borderRadius).toBeDefined();
    expect(appConfig.breakpoints).toBeDefined();
    expect(appConfig.button).toBeDefined();
    expect(appConfig.colors).toBeDefined();
  });

  it('should have valid app metadata', () => {
    expect(appConfig.app.name).toBe('Material-Tracker');
    expect(appConfig.app.version).toBe('1.2.0');
    expect(typeof appConfig.app.version).toBe('string');
  });

  it('should NOT have runtime-config (server/client/database come from .env)', () => {
    // Runtime-Variablen (Ports, Hosts, URLs, DB-Pfad) kommen aus .env
    // config.toml enthält NUR App-Konfiguration (app, auth, navigation, badge, etc.)
    expect((appConfig as Record<string, unknown>).server).toBeUndefined();
    expect((appConfig as Record<string, unknown>).client).toBeUndefined();
    expect((appConfig as Record<string, unknown>).database).toBeUndefined();
  });

  it('should have valid auth config', () => {
    expect(appConfig.auth).toBeDefined();
    expect(typeof appConfig.auth.enabled).toBe('boolean');
    expect(appConfig.auth.mode).toBeDefined();
  });

  it('should have valid navigation config', () => {
    expect(appConfig.navigation).toBeDefined();
    expect(appConfig.navigation.items).toBeDefined();
    expect(Array.isArray(appConfig.navigation.items)).toBe(true);
    expect(appConfig.navigation.items.length).toBeGreaterThan(0);
    // Navigation Items haben key, label, path, icon
    appConfig.navigation.items.forEach((item) => {
      expect(item.key).toBeDefined();
      expect(item.label).toBeDefined();
      expect(item.path).toBeDefined();
      expect(item.icon).toBeDefined();
    });
  });

  it('should have valid badge config', () => {
    expect(appConfig.badge).toBeDefined();
    expect(appConfig.badge.base).toBeDefined();
    expect(appConfig.badge.variants).toBeDefined();
    // Badge variants: success, error, warning, info, pending, neutral
    expect(appConfig.badge.variants.success).toBeDefined();
    expect(appConfig.badge.variants.error).toBeDefined();
    expect(appConfig.badge.variants.warning).toBeDefined();
    expect(appConfig.badge.variants.info).toBeDefined();
  });

  it('should have valid borderRadius config', () => {
    expect(appConfig.borderRadius).toBeDefined();
    expect(appConfig.borderRadius.none).toBeDefined();
    expect(appConfig.borderRadius.sm).toBeDefined();
    expect(appConfig.borderRadius.md).toBeDefined();
    expect(appConfig.borderRadius.lg).toBeDefined();
  });

  it('should have valid breakpoints config', () => {
    expect(appConfig.breakpoints).toBeDefined();
    expect(appConfig.breakpoints.mobile).toBeDefined();
    expect(appConfig.breakpoints.desktop).toBeDefined();
    expect(typeof appConfig.breakpoints.mobile).toBe('number');
    expect(typeof appConfig.breakpoints.desktop).toBe('number');
  });

  it('should have valid button config with nav/new/act/tab/rect types', () => {
    expect(appConfig.button).toBeDefined();
    // Button types: nav, new, act, tab, rect
    expect(appConfig.button.nav).toBeDefined();
    expect(appConfig.button.new).toBeDefined();
    expect(appConfig.button.act).toBeDefined();
    expect(appConfig.button.tab).toBeDefined();
    expect(appConfig.button.rect).toBeDefined();
    // Each button type has iconSize
    expect(appConfig.button.nav.iconSize).toBeDefined();
    expect(appConfig.button.new.iconSize).toBeDefined();
    expect(appConfig.button.act.iconSize).toBeDefined();
  });

  it('should have valid colors config', () => {
    expect(appConfig.colors).toBeDefined();
    // Core color palettes
    expect(appConfig.colors.black).toBeDefined();
    expect(appConfig.colors.white).toBeDefined();
    expect(appConfig.colors.gray).toBeDefined();
    expect(appConfig.colors.blue).toBeDefined();
    expect(appConfig.colors.red).toBeDefined();
    expect(appConfig.colors.green).toBeDefined();
    // Semantic colors
    expect(appConfig.colors.text).toBeDefined();
    expect(appConfig.colors.ui).toBeDefined();
    expect(appConfig.colors.button).toBeDefined();
    expect(appConfig.colors.status).toBeDefined();
    expect(appConfig.colors.error).toBeDefined();
    expect(appConfig.colors.warning).toBeDefined();
    expect(appConfig.colors.success).toBeDefined();
    expect(appConfig.colors.info).toBeDefined();
  });
});
