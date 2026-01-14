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
    // Neue Struktur: theme, components, pages, content, navigation, layout
    expect(appConfig.app).toBeDefined();
    expect(appConfig.auth).toBeDefined();
    expect(appConfig.theme).toBeDefined();
    expect(appConfig.components).toBeDefined();
    expect(appConfig.pages).toBeDefined();
    expect(appConfig.content).toBeDefined();
    expect(appConfig.navigation).toBeDefined();
    expect(appConfig.layout).toBeDefined();
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
    expect(appConfig.components.badge).toBeDefined();
    expect(appConfig.components.badge.base).toBeDefined();
    expect(appConfig.components.badge.variants).toBeDefined();
    // Badge variants: success, error, warning, info, pending, neutral
    expect(appConfig.components.badge.variants.success).toBeDefined();
    expect(appConfig.components.badge.variants.error).toBeDefined();
    expect(appConfig.components.badge.variants.warning).toBeDefined();
    expect(appConfig.components.badge.variants.info).toBeDefined();
  });

  it('should have valid borderRadius config', () => {
    expect(appConfig.theme.border).toBeDefined();
    expect(appConfig.theme.border.radius_none).toBeDefined();
    expect(appConfig.theme.border.radius_sm).toBeDefined();
    expect(appConfig.theme.border.radius_md).toBeDefined();
    expect(appConfig.theme.border.radius_lg).toBeDefined();
  });

  it('should have valid breakpoints config', () => {
    expect(appConfig.layout.rules).toBeDefined();
    expect(appConfig.layout.rules.mobileBreakpointPx).toBeDefined();
    expect(appConfig.layout.rules.desktopBreakpointPx).toBeDefined();
    expect(typeof appConfig.layout.rules.mobileBreakpointPx).toBe('number');
    expect(typeof appConfig.layout.rules.desktopBreakpointPx).toBe('number');
  });

  it('should have valid button config with nav/new/act/tab/rect types', () => {
    expect(appConfig.components.button).toBeDefined();
    // Button types: nav, new, act, tab, rect, back
    expect(appConfig.components.button.nav).toBeDefined();
    expect(appConfig.components.button.new).toBeDefined();
    expect(appConfig.components.button.act).toBeDefined();
    expect(appConfig.components.button.tab).toBeDefined();
    expect(appConfig.components.button.rect).toBeDefined();
    expect(appConfig.components.button.back).toBeDefined();
    // Each button type has iconSize
    expect(appConfig.components.button.nav.iconSize).toBeDefined();
    expect(appConfig.components.button.new.iconSize).toBeDefined();
    expect(appConfig.components.button.act.iconSize).toBeDefined();
  });

  it('should have valid colors config', () => {
    expect(appConfig.theme.colors).toBeDefined();
    // Core color palettes
    expect(appConfig.theme.colors.black).toBeDefined();
    expect(appConfig.theme.colors.gray).toBeDefined();
    expect(appConfig.theme.colors.blue).toBeDefined();
    expect(appConfig.theme.colors.red).toBeDefined();
    expect(appConfig.theme.colors.green).toBeDefined();
    // Semantic colors
    expect(appConfig.theme.colors.text).toBeDefined();
    expect(appConfig.theme.colors.ui).toBeDefined();
    expect(appConfig.theme.colors.button).toBeDefined();
    expect(appConfig.theme.colors.status).toBeDefined();
    expect(appConfig.theme.colors.error).toBeDefined();
    expect(appConfig.theme.colors.warning).toBeDefined();
    expect(appConfig.theme.colors.success).toBeDefined();
    expect(appConfig.theme.colors.info).toBeDefined();
  });
});
