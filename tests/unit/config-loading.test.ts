/**
 * Config Loading Tests - Phase 1.3.4
 *
 * Tests für neue Config-Sektionen (theme.shadows, components.*, ui.*)
 * und Zod-Validation mit strict() Enforcement.
 *
 * @version 1.0.1
 * @created 2026-01-09
 * @updated 2026-01-09 23:11 CET
 *
 * @changelog
 *   1.0.1 - 2026-01-09 - Version assertion korrigiert (0.0.0 → 1.2.0)
 *   1.0.0 - 2026-01-09 - Initial test suite
 */

import { describe, it, expect } from 'vitest';
import { appConfig } from '@/config';

describe('Config Loading - Phase 1 Extensions', () => {
  describe('Theme Extensions', () => {
    it('should load theme.shadows', () => {
      expect(appConfig.theme.shadows).toBeDefined();
      expect(appConfig.theme.shadows.sm).toBe('0 1px 2px 0 rgba(0, 0, 0, 0.05)');
      expect(appConfig.theme.shadows.md).toBe('0 4px 6px -1px rgba(0, 0, 0, 0.1)');
      expect(appConfig.theme.shadows.lg).toBe('0 10px 15px -3px rgba(0, 0, 0, 0.1)');
      expect(appConfig.theme.shadows.xl).toBe('0 20px 25px -5px rgba(0, 0, 0, 0.1)');
      expect(appConfig.theme.shadows.none).toBe('none');
    });

    it('should load theme.borderRadius', () => {
      expect(appConfig.theme.borderRadius).toBeDefined();
      expect(appConfig.theme.borderRadius.sm).toBe('0.125rem');
      expect(appConfig.theme.borderRadius.md).toBe('0.25rem');
      expect(appConfig.theme.borderRadius.full).toBe('9999px');
    });

    it('should load theme.breakpoints with devices', () => {
      expect(appConfig.theme.breakpoints).toBeDefined();
      expect(appConfig.theme.breakpoints.xs).toBe('320px');
      expect(appConfig.theme.breakpoints.xxl).toBe('1536px');
      expect(appConfig.theme.breakpoints.devices).toBeDefined();
      expect(appConfig.theme.breakpoints.devices.samsungS24.width).toBe(360);
      expect(appConfig.theme.breakpoints.devices.iPhone15.height).toBe(852);
    });

    it('should load theme.responsive', () => {
      expect(appConfig.theme.responsive).toBeDefined();
      expect(appConfig.theme.responsive.touchMinSize).toBe(44);
      expect(appConfig.theme.responsive.sidebarWidth).toBe('200px');
    });

    it('should load theme.spacing.mobile', () => {
      expect(appConfig.theme.spacing.mobile).toBeDefined();
      expect(appConfig.theme.spacing.mobile.xs).toBe('0.125rem');
      expect(appConfig.theme.spacing.mobile.xxl).toBe('1.5rem');
    });
  });

  describe('Component Configs', () => {
    it('should load components.badge', () => {
      expect(appConfig.components.badge).toBeDefined();
      expect(appConfig.components.badge.base.fontSize).toBe('0.75rem');
      expect(appConfig.components.badge.variants.success.bg).toBe('#27ae60');
    });

    it('should load components.button', () => {
      expect(appConfig.components.button).toBeDefined();
      expect(appConfig.components.button.variants.primary.bg).toBe('#2196f3');
      expect(appConfig.components.button.sizes.md.height).toBe('2.5rem');
    });

    it('should load components.dialog', () => {
      expect(appConfig.components.dialog).toBeDefined();
      expect(appConfig.components.dialog.overlay.bg).toBe('rgba(0, 0, 0, 0.75)');
      expect(appConfig.components.dialog.container.shadow).toBe('xl');
    });

    it('should load components.input', () => {
      expect(appConfig.components.input).toBeDefined();
      expect(appConfig.components.input.states.focus.border).toBe('#2196f3');
      expect(appConfig.components.input.types.email.type).toBe('email');
    });

    it('should load components.table', () => {
      expect(appConfig.components.table).toBeDefined();
      expect(appConfig.components.table.rowHeight).toBe('40px');
      expect(appConfig.components.table.cellFontFamily).toBe('base');
    });
  });

  describe('UI Texts', () => {
    it('should load ui.buttons', () => {
      expect(appConfig.ui.buttons).toBeDefined();
      expect(appConfig.ui.buttons.save).toBe('Speichern');
      expect(appConfig.ui.buttons.cancel).toBe('Abbrechen');
    });

    it('should load ui.labels', () => {
      expect(appConfig.ui.labels).toBeDefined();
      expect(appConfig.ui.labels.date).toBe('Datum');
      expect(appConfig.ui.labels.designation).toBe('Bezeichnung');
    });

    it('should load ui.tooltips', () => {
      expect(appConfig.ui.tooltips).toBeDefined();
      expect(appConfig.ui.tooltips.bar_transaction).toBe('BAR');
      expect(appConfig.ui.tooltips.edit).toBe('Bearbeiten');
    });

    it('should load ui.page_titles', () => {
      expect(appConfig.ui.page_titles).toBeDefined();
      expect(appConfig.ui.page_titles.material).toBe('Material');
    });

    it('should load ui.dialog_titles', () => {
      expect(appConfig.ui.dialog_titles).toBeDefined();
      expect(appConfig.ui.dialog_titles.new_material).toBe('Neues Material');
    });

    it('should load ui.validation', () => {
      expect(appConfig.ui.validation).toBeDefined();
      expect(appConfig.ui.validation.date_required).toBe('Datum erforderlich');
    });

    it('should load ui.errors', () => {
      expect(appConfig.ui.errors).toBeDefined();
      expect(appConfig.ui.errors.network_error).toBe('Netzwerkfehler');
    });
  });

  describe('Config Structure Validation', () => {
    it('should have all required top-level sections', () => {
      expect(appConfig).toHaveProperty('app');
      expect(appConfig).toHaveProperty('theme');
      expect(appConfig).toHaveProperty('components');
      expect(appConfig).toHaveProperty('ui');
    });

    it('should have correct app metadata', () => {
      expect(appConfig.app.name).toBe('Material-Tracker');
      expect(appConfig.app.version).toBe('1.2.0');
    });

    it('should have all component sections', () => {
      expect(appConfig.components).toHaveProperty('badge');
      expect(appConfig.components).toHaveProperty('button');
      expect(appConfig.components).toHaveProperty('dialog');
      expect(appConfig.components).toHaveProperty('input');
      expect(appConfig.components).toHaveProperty('table');
    });

    it('should have all ui text sections', () => {
      expect(appConfig.ui).toHaveProperty('buttons');
      expect(appConfig.ui).toHaveProperty('labels');
      expect(appConfig.ui).toHaveProperty('tooltips');
      expect(appConfig.ui).toHaveProperty('page_titles');
      expect(appConfig.ui).toHaveProperty('dialog_titles');
      expect(appConfig.ui).toHaveProperty('validation');
      expect(appConfig.ui).toHaveProperty('errors');
    });
  });
});
