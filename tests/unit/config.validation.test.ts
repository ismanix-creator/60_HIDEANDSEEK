/**
 * @file        config.validation.test.ts
 * @description Config Validation Test - Verhindert Config Drift im CI
 * @version     3.0.0
 * @created     2026-01-07 20:00:00 CET
 * @updated     2026-01-11 20:15:00 CET
 * @author      Akki Scholze
 *
 * @description
 * Dieser Test stellt sicher, dass config.toml jederzeit mit dem Zod Schema übereinstimmt.
 * Bei Drift (missing/unknown/wrong types) failt Build/CI und zwingt zur Korrektur.
 *
 * ARCHITEKTUR:
 * - config.toml = App-Konfiguration ONLY (flache Struktur ohne Präfixe)
 * - .env = Runtime-Variablen ONLY (Ports, Hosts, URLs, Secrets)
 * - Keine Runtime-Config in config.toml!
 *
 * @changelog
 *   3.0.0 - 2026-01-11 - Migriert auf flache Config-Struktur (ohne theme/components/ui Präfixe), neue Tabellen-Strukturen, Font-Dezentralisierung
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
    expect(appConfig.app.version).toBe('1.2.0');
    expect(typeof appConfig.app.version).toBe('string');
  });

  it('should NOT have runtime-config (server/client/database come from .env)', () => {
    // Architektur-Change: Runtime-Variablen sind NICHT in config.toml!
    // @ts-expect-error - checking that these properties don't exist
    expect(appConfig.server).toBeUndefined();
    // @ts-expect-error - checking that these properties don't exist
    expect(appConfig.client).toBeUndefined();
    // @ts-expect-error - checking that these properties don't exist
    expect(appConfig.database).toBeUndefined();
  });

  it('should NOT have old nested structure (theme/components/ui prefixes removed)', () => {
    // Nach Config-Refactoring v2.7.0: keine theme.*/components.*/ui.* Präfixe mehr
    // @ts-expect-error - checking that these properties don't exist
    expect(appConfig.theme).toBeUndefined();
    // @ts-expect-error - checking that these properties don't exist
    expect(appConfig.components).toBeUndefined();
    // @ts-expect-error - checking that these properties don't exist
    expect(appConfig.ui).toBeUndefined();
  });

  it('should have flat structure config (typography, spacing, breakpoints, etc.)', () => {
    // Neue flache Struktur
    expect(appConfig.typography).toBeDefined();
    expect(appConfig.spacing).toBeDefined();
    expect(appConfig.breakpoints).toBeDefined();
    expect(appConfig.borderRadius).toBeDefined();
    expect(appConfig.shadows).toBeDefined();
  });

  it('should have navigation config with font properties', () => {
    expect(appConfig.navigation).toBeDefined();
    expect(appConfig.navigation.items).toBeDefined();
    expect(appConfig.navigation.items.length).toBe(6); // material, kunden, schuldner, glaeubiger, settings, logout

    // Font-Dezentralisierung: Navigation hat eigene Font-Properties
    expect(appConfig.navigation.fontSize).toBe('14px');
    expect(appConfig.navigation.fontWeight).toBe(500);
    expect(appConfig.navigation.fontMono).toBe(false);
  });

  it('should have button config with all 5 types', () => {
    expect(appConfig.button).toBeDefined();
    expect(appConfig.button.nav).toBeDefined();
    expect(appConfig.button.new).toBeDefined();
    expect(appConfig.button.act).toBeDefined();
    expect(appConfig.button.tab).toBeDefined();
    expect(appConfig.button.rect).toBeDefined();

    // Button rect hat Font-Properties
    expect(appConfig.button.rect.fontSize).toBe('16px');
    expect(appConfig.button.rect.fontWeight).toBe(500);
    expect(appConfig.button.rect.fontMono).toBe(false);
  });

  it('should have colors in flat structure', () => {
    expect(appConfig.colors).toBeDefined();
    expect(appConfig.colors.blue).toBeDefined();
    expect(appConfig.colors.gray).toBeDefined();
    expect(appConfig.colors.green).toBeDefined();
    expect(appConfig.colors.red).toBeDefined();
    expect(appConfig.colors.gold).toBeDefined();
  });

  it('should validate hex colors in colors palette', () => {
    const hexRegex = /^#[0-9a-fA-F]{6}$/;
    expect(appConfig.colors.blue['500']).toMatch(hexRegex);
    expect(appConfig.colors.gray['500']).toMatch(hexRegex);
  });

  it('should have strict breakpoint values', () => {
    expect(appConfig.breakpoints.mobile).toBeTypeOf('number');
    expect(appConfig.breakpoints.desktop).toBeTypeOf('number');
    expect(appConfig.breakpoints.mobile).toBe(767);
  });

  it('should have table config with color definitions', () => {
    expect(appConfig.table).toBeDefined();

    // Basis-Layout
    expect(appConfig.table.rowHeight).toBe('40px');
    expect(appConfig.table.cellFontMono).toBe(true);
    expect(appConfig.table.headerFontMono).toBe(true);

    // Bestand Colors (9 Stufen)
    expect(appConfig.table.bestand.colors).toBeDefined();
    expect(appConfig.table.bestand.colors.green_high).toBeDefined();
    expect(appConfig.table.bestand.colors.yellow_mid).toBeDefined();
    expect(appConfig.table.bestand.colors.red_low).toBeDefined();
    expect(appConfig.table.bestand.colors.zero_paid).toBeDefined();

    // Progress Colors (Universal: 9-stufige Skala)
    expect(appConfig.table.progress.colors).toBeDefined();
    expect(appConfig.table.progress.colors.green_high).toBeDefined();
    expect(appConfig.table.progress.colors.yellow_mid).toBeDefined();
    expect(appConfig.table.progress.colors.red_low).toBeDefined();
    expect(appConfig.table.progress.colors.zero_paid).toBeDefined();

    // Fortschritt Colors (alle Tabellen nutzen table.progress.colors)
    expect(appConfig.table.material.fortschritt.colors).toBeDefined();
    expect(appConfig.table.material.fortschritt.colors.green_high).toBeDefined();
    expect(appConfig.table.material.fortschritt.colors.yellow_mid).toBeDefined();
    expect(appConfig.table.material.fortschritt.colors.red_low).toBeDefined();
  });

  it('should have all 6 table structures defined', () => {
    expect(appConfig.table.material).toBeDefined();
    expect(appConfig.table.material.columns).toBeDefined();

    expect(appConfig.table.kunden).toBeDefined();
    expect(appConfig.table.kunden.columns).toBeDefined();

    // Neue Kunden-Tabellen
    expect(appConfig.table.kunden.mat).toBeDefined();
    expect(appConfig.table.kunden.mat.columns).toBeDefined();
    expect(appConfig.table.kunden.nomat).toBeDefined();
    expect(appConfig.table.kunden.nomat.columns).toBeDefined();

    expect(appConfig.table.schuldner).toBeDefined();
    expect(appConfig.table.schuldner.columns).toBeDefined();

    expect(appConfig.table.glaeubiger).toBeDefined();
    expect(appConfig.table.glaeubiger.columns).toBeDefined();
  });

  it('should have font properties in all text components', () => {
    // Badge
    expect(appConfig.badge.base.fontSize).toBe('12px');
    expect(appConfig.badge.base.fontWeight).toBe(500);
    expect(appConfig.badge.base.fontMono).toBe(false);

    // Dialog
    expect(appConfig.dialog.header.fontSize).toBe('20px');
    expect(appConfig.dialog.header.fontWeight).toBe(600);
    expect(appConfig.dialog.header.fontMono).toBe(false);

    // Input
    expect(appConfig.input.base.fontSize).toBe('14px');
    expect(appConfig.input.base.fontWeight).toBe(400);
    expect(appConfig.input.base.fontMono).toBe(false);
  });
});
