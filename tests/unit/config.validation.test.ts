/**
 * @file        config.validation.test.ts
 * @description Config Validation Test - Verhindert Config Drift im CI
 * @version     3.0.0
 * @created     2026-01-07 20:00:00 CET
 * @updated     2026-01-13 00:00:00 CET
 * @author      Akki Scholze
 *
 * @description
 * Dieser Test stellt sicher, dass config.toml jederzeit mit dem Zod Schema übereinstimmt.
 * Bei Drift (missing/unknown/wrong types) failt Build/CI und zwingt zur Korrektur.
 *
 * ARCHITEKTUR:
 * - config.toml = App-Konfiguration mit Struktur A-I
 * - .env = Runtime-Variablen ONLY (Ports, Hosts, URLs, Secrets)
 * - Keine Runtime-Config in config.toml!
 *
 * @changelog
 *   3.0.0 - 2026-01-13 - COMPLETE RESTRUCTURE: Tests passen jetzt zur neuen config.toml Struktur A-I (theme/components/pages/content/navigation/layout)
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

  it('should have app metadata defined (Section A)', () => {
    expect(appConfig.app).toBeDefined();
    expect(appConfig.app.name).toBe('Material-Tracker');
    expect(appConfig.app.version).toBe('1.2.0');
    expect(typeof appConfig.app.version).toBe('string');
    
    expect(appConfig.auth).toBeDefined();
    expect(appConfig.auth.enabled).toBe(false);
    expect(appConfig.auth.mode).toBe('password_required');
  });

  it('should have theme primitives (Section B)', () => {
    expect(appConfig.theme).toBeDefined();
    expect(appConfig.theme.border).toBeDefined();
    expect(appConfig.theme.colors).toBeDefined();
    expect(appConfig.theme.shadows).toBeDefined();
    expect(appConfig.theme.sizes).toBeDefined();
    expect(appConfig.theme.typography).toBeDefined();
  });

  it('should have theme colors with all palettes', () => {
    expect(appConfig.theme.colors.black).toBeDefined();
    expect(appConfig.theme.colors.blue).toBeDefined();
    expect(appConfig.theme.colors.gray).toBeDefined();
    expect(appConfig.theme.colors.green).toBeDefined();
    expect(appConfig.theme.colors.gold).toBeDefined();
    expect(appConfig.theme.colors.red).toBeDefined();
    expect(appConfig.theme.colors.graublau).toBeDefined();
    
    // Semantic colors
    expect(appConfig.theme.colors.ui).toBeDefined();
    expect(appConfig.theme.colors.text).toBeDefined();
    expect(appConfig.theme.colors.button).toBeDefined();
    expect(appConfig.theme.colors.status).toBeDefined();
  });

  it('should validate hex colors in theme.colors palette', () => {
    const hexRegex = /^#[0-9a-fA-F]{6}$/;
    expect(appConfig.theme.colors.blue['500']).toMatch(hexRegex);
    expect(appConfig.theme.colors.gray['500']).toMatch(hexRegex);
  });

  it('should have base components (Section C)', () => {
    expect(appConfig.components).toBeDefined();
    expect(appConfig.components.table).toBeDefined();
    expect(appConfig.components.dialog).toBeDefined();
    expect(appConfig.components.button).toBeDefined();
    expect(appConfig.components.badge).toBeDefined();
    expect(appConfig.components.form).toBeDefined();
    expect(appConfig.components.divider).toBeDefined();
    expect(appConfig.components.infobox).toBeDefined();
  });

  it('should have table base config with progress gradient', () => {
    expect(appConfig.components.table.base).toBeDefined();
    expect(appConfig.components.table.base.rowHeightPx).toBe(50);
    expect(appConfig.components.table.base.cellFontMono).toBe(true);
    expect(appConfig.components.table.base.headerFontMono).toBe(true);
    
    // Progress gradient stops
    expect(appConfig.components.table.base.progress).toBeDefined();
    expect(appConfig.components.table.base.progress.gradientStops).toBeDefined();
    expect(appConfig.components.table.base.progress.gradientStops.length).toBe(10);
    
    // Bestand with inverted stops
    expect(appConfig.components.table.base.bestand).toBeDefined();
    expect(appConfig.components.table.base.bestand.invertProgressStops).toBe(true);
  });

  it('should have button config with all 5 types', () => {
    expect(appConfig.components.button.nav).toBeDefined();
    expect(appConfig.components.button.new).toBeDefined();
    expect(appConfig.components.button.act).toBeDefined();
    expect(appConfig.components.button.tab).toBeDefined();
    expect(appConfig.components.button.rect).toBeDefined();

    // Button rect has font properties
    expect(appConfig.components.button.rect.fontSize).toBe('16px');
    expect(appConfig.components.button.rect.fontWeight).toBe(500);
  });

  it('should have pages structure (Section D)', () => {
    expect(appConfig.pages).toBeDefined();
    expect(appConfig.pages.material).toBeDefined();
    expect(appConfig.pages.kunden).toBeDefined();
    expect(appConfig.pages.schuldner).toBeDefined();
    expect(appConfig.pages.glaeubiger).toBeDefined();
    expect(appConfig.pages.settings).toBeDefined();
    expect(appConfig.pages.titles).toBeDefined();
  });

  it('should have all table column definitions in pages', () => {
    // Material table
    expect(appConfig.pages.material.table.columns).toBeDefined();
    expect(appConfig.pages.material.table.columns.length).toBeGreaterThan(0);
    
    // Kunden tables (overview, mat, nomat)
    expect(appConfig.pages.kunden.overview.table.columns).toBeDefined();
    expect(appConfig.pages.kunden.mat.table.columns).toBeDefined();
    expect(appConfig.pages.kunden.nomat.table.columns).toBeDefined();
    
    // Schuldner & Gläubiger
    expect(appConfig.pages.schuldner.table.columns).toBeDefined();
    expect(appConfig.pages.glaeubiger.table.columns).toBeDefined();
  });

  it('should have content texts (Section E)', () => {
    expect(appConfig.content).toBeDefined();
    expect(appConfig.content.buttons).toBeDefined();
    expect(appConfig.content.dialog_titles).toBeDefined();
    expect(appConfig.content.labels).toBeDefined();
    expect(appConfig.content.messages).toBeDefined();
    expect(appConfig.content.input_limits).toBeDefined();
    expect(appConfig.content.empty_states).toBeDefined();
    expect(appConfig.content.errors).toBeDefined();
    expect(appConfig.content.status).toBeDefined();
    expect(appConfig.content.tooltips).toBeDefined();
    expect(appConfig.content.validation).toBeDefined();
  });

  it('should have navigation config (Section F)', () => {
    expect(appConfig.navigation).toBeDefined();
    expect(appConfig.navigation.items).toBeDefined();
    expect(appConfig.navigation.items.length).toBe(6); // material, kunden, schuldner, glaeubiger, settings, logout

    expect(appConfig.navigation.fontSize).toBe('14px');
    expect(appConfig.navigation.fontWeight).toBe(500);
    expect(appConfig.navigation.icon).toBeDefined();
    expect(appConfig.navigation.icon.rotateGlaeubiger).toBeDefined();
  });

  it('should have layout config (Sections G-I)', () => {
    expect(appConfig.layout).toBeDefined();
    expect(appConfig.layout.header).toBeDefined();
    expect(appConfig.layout.content).toBeDefined();
    expect(appConfig.layout.footer).toBeDefined();
    expect(appConfig.layout.rules).toBeDefined();
  });

  it('should have layout rules with responsive breakpoints (Section I)', () => {
    expect(appConfig.layout.rules.mobileBreakpointPx).toBe(767);
    expect(appConfig.layout.rules.desktopBreakpointPx).toBe(1024);
    expect(appConfig.layout.rules.sidebarCollapseBelowPx).toBe(767);
    expect(appConfig.layout.rules.tableHorizontalScrollBelowPx).toBe(767);
    expect(appConfig.layout.rules.contentMaxWidthPx).toBe(1600);
    expect(appConfig.layout.rules.bottomNavHeightPx).toBe(60);
    expect(appConfig.layout.rules.bottomNavPadding).toBe("80px");
  });

  it('should NOT have runtime-config (server/client/database come from .env)', () => {
    // Architektur-Regel: Runtime-Variablen sind NICHT in config.toml!
    // @ts-expect-error - checking that these properties don't exist
    expect(appConfig.server).toBeUndefined();
    // @ts-expect-error - checking that these properties don't exist
    expect(appConfig.client).toBeUndefined();
    // @ts-expect-error - checking that these properties don't exist
    expect(appConfig.database).toBeUndefined();
  });
});
