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
      expect(appConfig.theme.shadows).toBeDefined();
      expect(appConfig.theme.shadows.sm).toBe('0 1px 2px 0 rgba(0, 0, 0, 0.05)');
      expect(appConfig.theme.shadows.md).toBe('0 4px 6px -1px rgba(0, 0, 0, 0.1)');
      expect(appConfig.theme.shadows.lg).toBe('0 10px 15px -3px rgba(0, 0, 0, 0.1)');
      expect(appConfig.theme.shadows.xl).toBe('0 20px 25px -5px rgba(0, 0, 0, 0.1)');
      expect(appConfig.theme.shadows.none).toBe('none');
    });

    it('should load theme.border (borderRadius)', () => {
      expect(appConfig.theme.border).toBeDefined();
      expect(appConfig.theme.border.radius_sm).toBe('0.125rem');
      expect(appConfig.theme.border.radius_md).toBe('0.25rem');
      expect(appConfig.theme.border.radius_full).toBe('9999px');
    });

    it('should load layout.rules (breakpoints)', () => {
      expect(appConfig.layout.rules).toBeDefined();
      expect(appConfig.layout.rules.mobileBreakpointPx).toBeDefined();
      expect(appConfig.layout.rules.desktopBreakpointPx).toBeDefined();
      expect(typeof appConfig.layout.rules.mobileBreakpointPx).toBe('number');
      expect(typeof appConfig.layout.rules.desktopBreakpointPx).toBe('number');
    });
  });

  describe('Component Configs', () => {
    it('should load badge', () => {
      expect(appConfig.components.badge).toBeDefined();
      expect(appConfig.components.badge.base.fontSize).toBe('12px');
      expect(appConfig.components.badge.variants.success.bg).toBe('{green.600}');
    });

    it('should load button', () => {
      expect(appConfig.components.button).toBeDefined();
      expect(appConfig.components.button.rect.bg).toBe('{black.700}');
      expect(appConfig.components.button.rect.height).toBe('2.5rem');
      expect(appConfig.components.button.nav.iconSize).toBe('48px');
      expect(appConfig.components.button.new.iconSize).toBe('32px');
      expect(appConfig.components.button.act.iconSize).toBe('20px');
    });

    it('should load dialog', () => {
      expect(appConfig.components.dialog).toBeDefined();
      expect(appConfig.components.dialog.base.overlay.bg).toBe('{opacity.75}');
      expect(appConfig.components.dialog.base.container.shadow).toBe('xl');
    });

    it('should load table', () => {
      expect(appConfig.components.table).toBeDefined();
      expect(appConfig.components.table.base).toBeDefined();
      expect(appConfig.components.table.base.wrapperBorder).toBeDefined();
    });
  });

  describe('UI Texts', () => {
    it('should load buttons', () => {
      expect(appConfig.content.buttons).toBeDefined();
      expect(appConfig.content.buttons.save).toBe('Speichern');
      expect(appConfig.content.buttons.cancel).toBe('Abbrechen');
    });

    it('should load labels', () => {
      expect(appConfig.content.labels).toBeDefined();
      expect(appConfig.content.labels.date).toBe('Datum');
      expect(appConfig.content.labels.designation).toBe('Bezeichnung');
    });

    it('should load tooltips', () => {
      expect(appConfig.content.tooltips).toBeDefined();
      expect(appConfig.content.tooltips.bar_transaction).toBe('BAR');
      expect(appConfig.content.tooltips.edit).toBe('Bearbeiten');
    });

    it('should load page_titles', () => {
      expect(appConfig.pages.titles).toBeDefined();
      expect(appConfig.pages.titles.material).toBe('Material');
    });

    it('should load dialog_titles', () => {
      expect(appConfig.content.dialog_titles).toBeDefined();
      expect(appConfig.content.dialog_titles.new_material).toBe('Neues Material');
    });

    it('should load validation', () => {
      expect(appConfig.content.validation).toBeDefined();
      expect(appConfig.content.validation.date_required).toBe('Datum erforderlich');
    });

    it('should load errors', () => {
      expect(appConfig.content.errors).toBeDefined();
      expect(appConfig.content.errors.network_error).toBe('Netzwerkfehler');
    });
  });

  describe('Config Structure Validation', () => {
    it('should have all required top-level sections', () => {
      expect(appConfig).toHaveProperty('app');
      expect(appConfig).toHaveProperty('theme');
      expect(appConfig).toHaveProperty('components');
      expect(appConfig).toHaveProperty('content');
      expect(appConfig).toHaveProperty('pages');
      expect(appConfig).toHaveProperty('navigation');
      expect(appConfig).toHaveProperty('layout');
    });

    it('should have correct app metadata', () => {
      expect(appConfig.app.name).toBe('Material-Tracker');
      expect(appConfig.app.version).toBe('1.2.0');
    });

    it('should have all component sections under components', () => {
      expect(appConfig.components).toHaveProperty('badge');
      expect(appConfig.components).toHaveProperty('button');
      expect(appConfig.components).toHaveProperty('dialog');
      expect(appConfig.components).toHaveProperty('table');
    });

    it('should have all ui text sections under content and pages', () => {
      expect(appConfig.content).toHaveProperty('buttons');
      expect(appConfig.content).toHaveProperty('labels');
      expect(appConfig.content).toHaveProperty('tooltips');
      expect(appConfig.pages).toHaveProperty('titles');
      expect(appConfig.content).toHaveProperty('dialog_titles');
      expect(appConfig.content).toHaveProperty('validation');
      expect(appConfig.content).toHaveProperty('errors');
    });
  });
});
