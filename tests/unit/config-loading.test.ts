/**
 * Config Loading Tests - Phase 1.3.4
 *
 * Tests für neue Config-Sektionen (theme.shadows, components.*, ui.*)
 * und Zod-Validation mit strict() Enforcement.
 *
 * @version 1.0.2
 * @created 2026-01-09
 * @updated 2026-01-11 01:58:38 CET
 *
 * @changelog
 *   1.0.2 - 2026-01-11 01:58:38 CET - Updated for 'sizes.btn' → 'sizes.rect' rename
 *   1.0.1 - 2026-01-09 - Version assertion korrigiert (0.0.0 → 1.2.0)
 *   1.0.0 - 2026-01-09 - Initial test suite
 */

import { describe, it, expect } from 'vitest';
import { appConfig } from '@/config';

describe('Config Loading - Phase 1 Extensions', () => {
  describe('Theme Extensions', () => {
    it('should load theme.shadows', () => {
      expect(appConfig.shadows).toBeDefined();
      expect(appConfig.shadows.sm).toBe('0 1px 2px 0 rgba(0, 0, 0, 0.05)');
      expect(appConfig.shadows.md).toBe('0 4px 6px -1px rgba(0, 0, 0, 0.1)');
      expect(appConfig.shadows.lg).toBe('0 10px 15px -3px rgba(0, 0, 0, 0.1)');
      expect(appConfig.shadows.xl).toBe('0 20px 25px -5px rgba(0, 0, 0, 0.1)');
      expect(appConfig.shadows.none).toBe('none');
    });

    it('should load theme.borderRadius', () => {
      expect(appConfig.borderRadius).toBeDefined();
      expect(appConfig.borderRadius.sm).toBe('0.125rem');
      expect(appConfig.borderRadius.md).toBe('0.25rem');
      expect(appConfig.borderRadius.full).toBe('9999px');
    });

    it('should load theme.breakpoints with devices', () => {
      expect(appConfig.breakpoints).toBeDefined();
      expect(appConfig.breakpoints.xs).toBe('320px');
      expect(appConfig.breakpoints.xxl).toBe('1536px');
      expect(appConfig.breakpoints.devices).toBeDefined();
      expect(appConfig.breakpoints.devices.samsungS24.width).toBe(360);
      expect(appConfig.breakpoints.devices.iPhone15.height).toBe(852);
    });

    it('should load theme.responsive', () => {
      expect(appConfig.responsive).toBeDefined();
      expect(appConfig.responsive.touchMinSize).toBe(44);
      expect(appConfig.responsive.sidebarWidth).toBe('200px');
    });

    it('should load theme.spacing.mobile', () => {
      expect(appConfig.spacing.mobile).toBeDefined();
      expect(appConfig.spacing.mobile.xs).toBe('0.125rem');
      expect(appConfig.spacing.mobile.xxl).toBe('1.5rem');
    });
  });

  describe('Component Configs', () => {
    it('should load badge', () => {
      expect(appConfig.badge).toBeDefined();
      expect(appConfig.badge.base.fontSize).toBe('12px');
      expect(appConfig.badge.variants.success.bg).toBe('{green.600}');
    });

    it('should load button', () => {
      expect(appConfig.button).toBeDefined();
      expect(appConfig.button.rect.bg).toBe('{black.700}');
      expect(appConfig.button.rect.height).toBe('2.5rem');
      expect(appConfig.button.nav.iconSize).toBe('48px');
      expect(appConfig.button.new.iconSize).toBe('32px');
      expect(appConfig.button.act.iconSize).toBe('20px');
    });

    it('should load dialog', () => {
      expect(appConfig.dialog).toBeDefined();
      expect(appConfig.dialog.overlay.bg).toBe('{opacity.75}');
      expect(appConfig.dialog.container.shadow).toBe('xl');
    });

    it('should load input', () => {
      expect(appConfig.input).toBeDefined();
      expect(appConfig.input.base.fontSize).toBe('14px');
      expect(appConfig.input.states.focus.border).toBe('{blue.500}');
    });

    it('should load table', () => {
      expect(appConfig.table).toBeDefined();
      expect(appConfig.table.rowHeight).toBe('40px');
      expect(appConfig.table.cellFontMono).toBe(true);
    });
  });

  describe('UI Texts', () => {
    it('should load buttons', () => {
      expect(appConfig.buttons).toBeDefined();
      expect(appConfig.buttons.save).toBe('Speichern');
      expect(appConfig.buttons.cancel).toBe('Abbrechen');
    });

    it('should load labels', () => {
      expect(appConfig.labels).toBeDefined();
      expect(appConfig.labels.date).toBe('Datum');
      expect(appConfig.labels.designation).toBe('Bezeichnung');
    });

    it('should load tooltips', () => {
      expect(appConfig.tooltips).toBeDefined();
      expect(appConfig.tooltips.bar_transaction).toBe('BAR');
      expect(appConfig.tooltips.edit).toBe('Bearbeiten');
    });

    it('should load page_titles', () => {
      expect(appConfig.page_titles).toBeDefined();
      expect(appConfig.page_titles.material).toBe('Material');
    });

    it('should load dialog_titles', () => {
      expect(appConfig.dialog_titles).toBeDefined();
      expect(appConfig.dialog_titles.new_material).toBe('Neues Material');
    });

    it('should load validation', () => {
      expect(appConfig.validation).toBeDefined();
      expect(appConfig.validation.date_required).toBe('Datum erforderlich');
    });

    it('should load errors', () => {
      expect(appConfig.errors).toBeDefined();
      expect(appConfig.errors.network_error).toBe('Netzwerkfehler');
    });
  });

  describe('Config Structure Validation', () => {
    it('should have all required top-level sections', () => {
      expect(appConfig).toHaveProperty('app');
      expect(appConfig).toHaveProperty('typography');
      expect(appConfig).toHaveProperty('spacing');
      expect(appConfig).toHaveProperty('breakpoints');
    });

    it('should have correct app metadata', () => {
      expect(appConfig.app.name).toBe('Material-Tracker');
      expect(appConfig.app.version).toBe('1.2.0');
    });

    it('should have all component sections', () => {
      expect(appConfig).toHaveProperty('badge');
      expect(appConfig).toHaveProperty('button');
      expect(appConfig).toHaveProperty('dialog');
      expect(appConfig).toHaveProperty('input');
      expect(appConfig).toHaveProperty('table');
    });

    it('should have all ui text sections', () => {
      expect(appConfig).toHaveProperty('buttons');
      expect(appConfig).toHaveProperty('labels');
      expect(appConfig).toHaveProperty('tooltips');
      expect(appConfig).toHaveProperty('page_titles');
      expect(appConfig).toHaveProperty('dialog_titles');
      expect(appConfig).toHaveProperty('validation');
      expect(appConfig).toHaveProperty('errors');
    });
  });
});
