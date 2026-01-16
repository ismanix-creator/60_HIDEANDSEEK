/**
 * @file        config.validation.test.ts
 * @description Config validation test (prevents config drift in CI)
 * @version     4.0.0
 * @created     2026-01-07 20:00:00 CET
 * @updated     2026-01-15 00:00:00 CET
 * @author      Akki Scholze
 *
 * @changelog
 *   4.0.0 - 2026-01-15 - Anpassung an config.toml v4.0.0 (app/permissions/theme/components/navigation/ui)
 *   3.0.0 - 2026-01-11 - Anpassung an neue config.toml Struktur (kein theme Objekt mehr)
 *   2.1.0 - 2026-01-10 - Entfernt server/client/database Tests (Runtime-Variablen, nicht in config.toml)
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
    // Struktur v4.0.0: app, permissions, theme, components, navigation, ui
    expect(appConfig.app).toBeDefined();
    expect(appConfig.permissions).toBeDefined();
    expect(appConfig.theme).toBeDefined();
    expect(appConfig.components).toBeDefined();
    expect(appConfig.navigation).toBeDefined();
    expect(appConfig.ui).toBeDefined();
  });

  // ============================================================
  // APP
  // ============================================================

  it('should have valid app metadata', () => {
    expect(appConfig.app.meta).toBeDefined();
    expect(appConfig.app.meta.name).toBe('Material Tracker');
    expect(appConfig.app.meta.version).toBe('0.1.0');
    expect(typeof appConfig.app.meta.version).toBe('string');
    expect(appConfig.app.meta.lastUpdated).toBeDefined();
  });

  it('should have valid app locale', () => {
    expect(appConfig.app.locale).toBeDefined();
    expect(appConfig.app.locale.language).toBe('de-DE');
    expect(appConfig.app.locale.currency).toBe('EUR');
    expect(appConfig.app.locale.timezone).toBe('Europe/Berlin');
    expect(appConfig.app.locale.dateFormat).toBeDefined();
    expect(appConfig.app.locale.timeFormat).toBeDefined();
  });

  it('should have valid app database config', () => {
    expect(appConfig.app.database).toBeDefined();
    expect(appConfig.app.database.name).toBe('material-tracker.db');
    expect(appConfig.app.database.version).toBe(1);
  });

  it('should have valid app server config', () => {
    expect(appConfig.app.server).toBeDefined();
    expect(appConfig.app.server.host).toBe('127.0.0.1');
    expect(appConfig.app.server.port).toBe(3001);
  });

  // ============================================================
  // PERMISSIONS
  // ============================================================

  it('should have valid permissions config', () => {
    expect(appConfig.permissions).toBeDefined();
    expect(appConfig.permissions.roles).toBeDefined();
    expect(appConfig.permissions.features).toBeDefined();
    expect(appConfig.permissions.scopes).toBeDefined();
  });

  it('should have valid permission roles', () => {
    expect(appConfig.permissions.roles.admin).toBeDefined();
    expect(appConfig.permissions.roles.admin.label).toBe('Administrator (PC)');
    expect(appConfig.permissions.roles.admin.permissions).toContain('*');

    expect(appConfig.permissions.roles.customer).toBeDefined();
    expect(appConfig.permissions.roles.customer.label).toBe('Kunde (Self-Service)');
  });

  it('should have valid permission features', () => {
    expect(appConfig.permissions.features['kunden.view']).toBeDefined();
    expect(appConfig.permissions.features['kunden.view'].roles).toContain('admin');
    expect(appConfig.permissions.features['kunden.create']).toBeDefined();
    expect(appConfig.permissions.features['kunden.edit']).toBeDefined();
  });

  // ============================================================
  // THEME
  // ============================================================

  it('should have valid theme colors', () => {
    expect(appConfig.theme.colors).toBeDefined();
    // Primitive colors
    expect(appConfig.theme.colors.black).toBeDefined();
    expect(appConfig.theme.colors.white).toBeDefined();
    expect(appConfig.theme.colors.red).toBeDefined();
    expect(appConfig.theme.colors.green).toBeDefined();
    expect(appConfig.theme.colors.eisgraublau).toBeDefined();
    // Color scales have 50-900
    expect(appConfig.theme.colors.black['50']).toBeDefined();
    expect(appConfig.theme.colors.black['900']).toBeDefined();
    // Extended scales have 350, 650
    expect(appConfig.theme.colors.red['350']).toBeDefined();
    expect(appConfig.theme.colors.red['650']).toBeDefined();
  });

  it('should have valid semantic colors', () => {
    // Background colors
    expect(appConfig.theme.colors.bg).toBeDefined();
    expect(appConfig.theme.colors.bg.main).toBe('eisgraublau.800');
    expect(appConfig.theme.colors.bg.dialog).toBe('eisgraublau.800');

    // Text colors
    expect(appConfig.theme.colors.text).toBeDefined();
    expect(appConfig.theme.colors.text.active).toBe('white.900');
    expect(appConfig.theme.colors.text.error).toBe('red.650');

    // Table colors
    expect(appConfig.theme.colors.table).toBeDefined();
    expect(appConfig.theme.colors.table.headerBg).toBeDefined();
    expect(appConfig.theme.colors.table.row).toBeDefined();

    // Button colors
    expect(appConfig.theme.colors.buttons).toBeDefined();
    expect(appConfig.theme.colors.buttons.rect).toBeDefined();
    expect(appConfig.theme.colors.buttons.icon).toBeDefined();
    expect(appConfig.theme.colors.buttons.tab).toBeDefined();
  });

  it('should have valid theme typography', () => {
    expect(appConfig.theme.typography).toBeDefined();
    expect(appConfig.theme.typography.font).toBeDefined();
    expect(appConfig.theme.typography.font.base).toBe('Inter');
    expect(appConfig.theme.typography.font.mono).toBe('JetBrains Mono');

    expect(appConfig.theme.typography.fontWeight).toBeDefined();
    expect(appConfig.theme.typography.fontWeight.normal).toBe(400);
    expect(appConfig.theme.typography.fontWeight.bold).toBe(700);

    expect(appConfig.theme.typography.fontSize).toBeDefined();
    expect(appConfig.theme.typography.fontSize.headerTitle).toBeDefined();
    expect(appConfig.theme.typography.fontSize.bodyText).toBeDefined();
  });

  it('should have valid theme spacing', () => {
    expect(appConfig.theme.spacing).toBeDefined();
    expect(appConfig.theme.spacing.layout).toBeDefined();
    expect(appConfig.theme.spacing.layout.pagePadding).toBe('16px');
    expect(appConfig.theme.spacing.table).toBeDefined();
    expect(appConfig.theme.spacing.dialog).toBeDefined();
    expect(appConfig.theme.spacing.buttons).toBeDefined();
    expect(appConfig.theme.spacing.entry).toBeDefined();
  });

  it('should have valid theme border', () => {
    expect(appConfig.theme.border).toBeDefined();
    expect(appConfig.theme.border.sizes).toBeDefined();
    expect(appConfig.theme.border.sizes.thin).toBe('1px');
    expect(appConfig.theme.border.radius).toBeDefined();
    expect(appConfig.theme.border.radius.buttonsRect).toBe('12px');
  });

  it('should have valid theme shadows and breakpoints', () => {
    expect(appConfig.theme.shadows).toBeDefined();
    expect(appConfig.theme.shadows.area).toBeDefined();
    expect(appConfig.theme.shadows.dialog).toBeDefined();

    expect(appConfig.theme.breakpoints).toBeDefined();
    expect(appConfig.theme.breakpoints.smartphoneMaxWidth).toBe('767px');
    expect(appConfig.theme.breakpoints.pcMinWidth).toBe('768px');
  });

  it('should have valid theme z-index', () => {
    expect(appConfig.theme.zIndex).toBeDefined();
    expect(appConfig.theme.zIndex.navigation).toBe(100);
    expect(appConfig.theme.zIndex.dialog).toBe(200);
    expect(appConfig.theme.zIndex.tooltip).toBe(300);
  });

  // ============================================================
  // COMPONENTS
  // ============================================================

  it('should have valid icon component config', () => {
    expect(appConfig.components.icon).toBeDefined();
    expect(appConfig.components.icon.home).toBe('home');
    expect(appConfig.components.icon.kunden).toBe('users');
    expect(appConfig.components.icon.material).toBe('boxes');

    expect(appConfig.components.icon.nav).toBeDefined();
    expect(appConfig.components.icon.nav.buttonsSize).toBe('48px');
    expect(appConfig.components.icon.nav.iconSize).toBe('36px');

    expect(appConfig.components.icon.dash).toBeDefined();
    expect(appConfig.components.icon.act).toBeDefined();
  });

  it('should have valid progressbar component config', () => {
    expect(appConfig.components.progressbar).toBeDefined();
    expect(appConfig.components.progressbar.height).toBe('18px');
    expect(appConfig.components.progressbar.radius).toBe('12px');

    expect(appConfig.components.progressbar.scale).toBeDefined();
    expect(appConfig.components.progressbar.scale.progressPercent).toBeDefined();
    expect(appConfig.components.progressbar.scale.progressPercent.min).toBe(0);
    expect(appConfig.components.progressbar.scale.progressPercent.max).toBe(100);
    expect(appConfig.components.progressbar.scale.progressPercent.direction).toBe('normal');
  });

  it('should have valid entry component config', () => {
    expect(appConfig.components.entry).toBeDefined();
    expect(appConfig.components.entry.height).toBe('44px');
    expect(appConfig.components.entry.width).toBe('200px');
    expect(appConfig.components.entry.radius).toBe('12px');
  });

  it('should have valid table component config', () => {
    expect(appConfig.components.table).toBeDefined();
    expect(appConfig.components.table.headerHeight).toBe('52px');
    expect(appConfig.components.table.rowHeight).toBe('48px');

    expect(appConfig.components.table.columns).toBeDefined();
    expect(appConfig.components.table.columns.material).toBeDefined();
    expect(appConfig.components.table.columns.material.order).toBeDefined();
    expect(Array.isArray(appConfig.components.table.columns.material.order)).toBe(true);
    expect(appConfig.components.table.columns.material.labels).toBeDefined();

    expect(appConfig.components.table.format).toBeDefined();
    expect(appConfig.components.table.format.moneyEur).toBeDefined();
    expect(appConfig.components.table.format.moneyEur.type).toBe('money');
    expect(appConfig.components.table.format.moneyEur.currency).toBe('EUR');
  });

  it('should have valid status component config', () => {
    expect(appConfig.components.status).toBeDefined();
    expect(appConfig.components.status.common).toBeDefined();
    expect(appConfig.components.status.common.order).toBeDefined();
    expect(appConfig.components.status.common.order).toContain('wartend');
    expect(appConfig.components.status.common.order).toContain('erledigt');

    expect(appConfig.components.status.common.rule).toBeDefined();
    expect(appConfig.components.status.common.rule.wartend).toBeDefined();
    expect(appConfig.components.status.common.rule.wartend.when).toBeDefined();

    expect(appConfig.components.status.material).toBeDefined();
    expect(appConfig.components.status.material.order).toContain('bestand_0_aber_aussenstaende');
  });

  it('should have valid dialog component config', () => {
    expect(appConfig.components.dialog).toBeDefined();
    expect(appConfig.components.dialog.version).toBe(1);

    expect(appConfig.components.dialog.entryType).toBeDefined();
    expect(appConfig.components.dialog.entryType.date).toBeDefined();
    expect(appConfig.components.dialog.entryType.date.control).toBe('date');
    expect(appConfig.components.dialog.entryType.moneyEur).toBeDefined();
    expect(appConfig.components.dialog.entryType.kundeSelect).toBeDefined();

    expect(appConfig.components.dialog.grid).toBeDefined();
    expect(appConfig.components.dialog.grid.oneColumn).toBeDefined();
    expect(appConfig.components.dialog.grid.oneColumn.columns).toBe(1);

    expect(appConfig.components.dialog.form).toBeDefined();
    expect(appConfig.components.dialog.form.material).toBeDefined();
    expect(appConfig.components.dialog.form.material.order).toBeDefined();
    expect(appConfig.components.dialog.form.material.field).toBeDefined();
  });

  // ============================================================
  // NAVIGATION
  // ============================================================

  it('should have valid navigation config', () => {
    expect(appConfig.navigation).toBeDefined();
    expect(appConfig.navigation.items).toBeDefined();
    expect(Array.isArray(appConfig.navigation.items)).toBe(true);
    expect(appConfig.navigation.items).toContain('dashboard');
    expect(appConfig.navigation.items).toContain('material');
    expect(appConfig.navigation.items).toContain('kunden');

    expect(appConfig.navigation.item).toBeDefined();
    expect(Array.isArray(appConfig.navigation.item)).toBe(true);

    const dashboardItem = appConfig.navigation.item.find((item) => item.key === 'dashboard');
    expect(dashboardItem).toBeDefined();
    expect(dashboardItem?.label).toBe('Dashboard');
    expect(dashboardItem?.path).toBe('/');
    expect(dashboardItem?.icon).toBe('home');
  });

  // ============================================================
  // UI
  // ============================================================

  it('should have valid UI labels', () => {
    expect(appConfig.ui.labels).toBeDefined();
    expect(appConfig.ui.labels.datum).toBe('Datum');
    expect(appConfig.ui.labels.name).toBe('Name');
    expect(appConfig.ui.labels.status).toBe('Status');
  });

  it('should have valid UI titles', () => {
    expect(appConfig.ui.titles).toBeDefined();
    expect(appConfig.ui.titles.dashboard).toBe('Dashboard');
    expect(appConfig.ui.titles.material).toBe('Material');
    expect(appConfig.ui.titles.kunden).toBe('Kunden');

    expect(appConfig.ui.titles.dialog).toBeDefined();
    expect(appConfig.ui.titles.dialog.newMaterial).toBe('Neues Material');
    expect(appConfig.ui.titles.dialog.editKunde).toBe('Kunde bearbeiten');
  });

  it('should have valid UI buttons', () => {
    expect(appConfig.ui.buttons).toBeDefined();
    expect(appConfig.ui.buttons.speichern).toBe('Speichern');
    expect(appConfig.ui.buttons.abbrechen).toBe('Abbrechen');
    expect(appConfig.ui.buttons.loeschen).toBe('Löschen');
  });

  it('should have valid UI messages', () => {
    expect(appConfig.ui.messages).toBeDefined();

    expect(appConfig.ui.messages.confirm).toBeDefined();
    expect(appConfig.ui.messages.confirm.deleteMaterial).toBeDefined();

    expect(appConfig.ui.messages.success).toBeDefined();
    expect(appConfig.ui.messages.success.created).toBe('Erfolgreich erstellt');

    expect(appConfig.ui.messages.error).toBeDefined();
    expect(appConfig.ui.messages.error.networkError).toBe('Netzwerkfehler');

    expect(appConfig.ui.messages.validation).toBeDefined();
    expect(appConfig.ui.messages.validation.required).toBe('Pflichtfeld');
  });

  it('should have valid UI empty states', () => {
    expect(appConfig.ui.empty).toBeDefined();
    expect(appConfig.ui.empty.material).toBe('Keine Materialien vorhanden');
    expect(appConfig.ui.empty.kunden).toBe('Keine Kunden vorhanden');
  });

  it('should have valid UI loading states', () => {
    expect(appConfig.ui.loading).toBeDefined();
    expect(appConfig.ui.loading.default).toBe('Wird geladen...');
    expect(appConfig.ui.loading.saving).toBe('Wird gespeichert...');
  });

  it('should have valid UI descriptions', () => {
    expect(appConfig.ui.descriptions).toBeDefined();
    expect(appConfig.ui.descriptions.material).toBeDefined();
    expect(appConfig.ui.descriptions.kunden).toBeDefined();
  });
});
