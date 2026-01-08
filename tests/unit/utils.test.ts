/**
 * @file        tests/unit/utils.test.ts
 * @description Unit-Tests für Utility-Funktionen
 * @version     1.0.0
 * @created     2026-01-08 16:10:00 CET
 * @updated     2026-01-08 16:10:00 CET
 * @author      agenten-koordinator
 *
 * @changelog
 *   1.0.0 - 2026-01-08 - Erster funktionierender Vitest Test
 */

import { describe, it, expect } from 'vitest';
import { formatCurrency, formatDate } from '@/utils/format';

describe('formatCurrency', () => {
  it('sollte Beträge korrekt formatieren', () => {
    expect(formatCurrency(1234.56)).toBe('1.234,56\u00A0€');
    expect(formatCurrency(0)).toBe('0,00\u00A0€');
    expect(formatCurrency(999)).toBe('999,00\u00A0€');
  });

  it('sollte negative Beträge korrekt formatieren', () => {
    const result = formatCurrency(-50.75);
    expect(result).toContain('-');
    expect(result).toContain('50,75');
    expect(result).toContain('€');
  });
});

describe('formatDate', () => {
  it('sollte Datum korrekt formatieren', () => {
    const date = '2026-01-08';
    const result = formatDate(date);
    expect(result).toContain('08.01.2026');
  });
});
