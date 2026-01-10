/**
 * @file        config-validation.test.ts
 * @description ZERO TOLERANCE Tests für Config Schema Validation
 * @version     1.0.0
 * @created     2026-01-10 03:51:01 CET
 * @updated     2026-01-10 03:51:01 CET
 * @author      Akki Scholze
 *
 * @changelog
 *   1.0.0 - 2026-01-10 - Initial ZERO TOLERANCE tests (fehlende Felder, falsche Typen)
 */

/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */

import { describe, it, expect } from 'vitest';
import { ConfigSchema } from '../../src/config/schema/config.schema';
import { appConfig } from '../../src/config';

describe('Config Zero Tolerance', () => {
  describe('Valid Config', () => {
    it('should pass validation with complete config.toml', () => {
      expect(() => ConfigSchema.parse(appConfig)).not.toThrow();
    });
  });

  describe('ButtonVariant Schema Enforcement', () => {
    it('should FAIL if button.variants.outline.border is missing', () => {
      const invalidConfig = JSON.parse(JSON.stringify(appConfig));
      delete invalidConfig.components.button.variants.outline.border;

      expect(() => ConfigSchema.parse(invalidConfig)).toThrow();
    });

    it('should FAIL if button.variants.primary.border is missing', () => {
      const invalidConfig = JSON.parse(JSON.stringify(appConfig));
      delete invalidConfig.components.button.variants.primary.border;

      expect(() => ConfigSchema.parse(invalidConfig)).toThrow();
    });
  });

  describe('InputState Schema Enforcement', () => {
    it('should FAIL if input.states.focus.outline is missing', () => {
      const invalidConfig = JSON.parse(JSON.stringify(appConfig));
      delete invalidConfig.components.input.states.focus.outline;

      expect(() => ConfigSchema.parse(invalidConfig)).toThrow();
    });

    it('should FAIL if input.states.focus.text is missing', () => {
      const invalidConfig = JSON.parse(JSON.stringify(appConfig));
      delete invalidConfig.components.input.states.focus.text;

      expect(() => ConfigSchema.parse(invalidConfig)).toThrow();
    });

    it('should FAIL if input.states.disabled.text is missing', () => {
      const invalidConfig = JSON.parse(JSON.stringify(appConfig));
      delete invalidConfig.components.input.states.disabled.text;

      expect(() => ConfigSchema.parse(invalidConfig)).toThrow();
    });

    it('should FAIL if input.states.default.outline is missing', () => {
      const invalidConfig = JSON.parse(JSON.stringify(appConfig));
      delete invalidConfig.components.input.states.default.outline;

      expect(() => ConfigSchema.parse(invalidConfig)).toThrow();
    });
  });

  describe('Column Schema Enforcement', () => {
    it('should FAIL if column.monospace is missing', () => {
      const invalidConfig = JSON.parse(JSON.stringify(appConfig));
      delete invalidConfig.components.table.pages.material.columns[0].monospace;

      expect(() => ConfigSchema.parse(invalidConfig)).toThrow();
    });

    it('should FAIL if column.buttons is missing', () => {
      const invalidConfig = JSON.parse(JSON.stringify(appConfig));
      delete invalidConfig.components.table.pages.material.columns[0].buttons;

      expect(() => ConfigSchema.parse(invalidConfig)).toThrow();
    });

    it('should FAIL if monospace is string instead of boolean', () => {
      const invalidConfig = JSON.parse(JSON.stringify(appConfig));
      invalidConfig.components.table.pages.material.columns[0].monospace = 'false'; // wrong type

      expect(() => ConfigSchema.parse(invalidConfig)).toThrow();
    });

    it('should FAIL if buttons is string instead of array', () => {
      const invalidConfig = JSON.parse(JSON.stringify(appConfig));
      invalidConfig.components.table.pages.material.columns[0].buttons = 'edit,delete'; // wrong type

      expect(() => ConfigSchema.parse(invalidConfig)).toThrow();
    });
  });

  describe('TablePages Schema Enforcement', () => {
    it('should FAIL if table.pages.material is missing', () => {
      const invalidConfig = JSON.parse(JSON.stringify(appConfig));
      delete invalidConfig.components.table.pages.material;

      expect(() => ConfigSchema.parse(invalidConfig)).toThrow();
    });

    it('should FAIL if table.pages.kunden is missing', () => {
      const invalidConfig = JSON.parse(JSON.stringify(appConfig));
      delete invalidConfig.components.table.pages.kunden;

      expect(() => ConfigSchema.parse(invalidConfig)).toThrow();
    });

    it('should FAIL if table.pages.glaeubiger is missing', () => {
      const invalidConfig = JSON.parse(JSON.stringify(appConfig));
      delete invalidConfig.components.table.pages.glaeubiger;

      expect(() => ConfigSchema.parse(invalidConfig)).toThrow();
    });

    it('should FAIL if table.pages.schuldner is missing', () => {
      const invalidConfig = JSON.parse(JSON.stringify(appConfig));
      delete invalidConfig.components.table.pages.schuldner;

      expect(() => ConfigSchema.parse(invalidConfig)).toThrow();
    });
  });

  describe('Type Enforcement', () => {
    it('should FAIL if server.port is string instead of number', () => {
      const invalidConfig = JSON.parse(JSON.stringify(appConfig));
      invalidConfig.server.port = '3001'; // wrong type

      expect(() => ConfigSchema.parse(invalidConfig)).toThrow();
    });

    it('should FAIL if button.border is number instead of string', () => {
      const invalidConfig = JSON.parse(JSON.stringify(appConfig));
      invalidConfig.components.button.variants.outline.border = 2196; // wrong type

      expect(() => ConfigSchema.parse(invalidConfig)).toThrow();
    });
  });

  describe('Unknown Fields Enforcement (strict mode)', () => {
    it('should FAIL if unknown field is added to button variant', () => {
      const invalidConfig = JSON.parse(JSON.stringify(appConfig));
      invalidConfig.components.button.variants.primary.unknown_field = 'value';

      expect(() => ConfigSchema.parse(invalidConfig)).toThrow();
    });

    it('should FAIL if unknown field is added to input state', () => {
      const invalidConfig = JSON.parse(JSON.stringify(appConfig));
      invalidConfig.components.input.states.focus.unknown_field = 'value';

      expect(() => ConfigSchema.parse(invalidConfig)).toThrow();
    });
  });
});
