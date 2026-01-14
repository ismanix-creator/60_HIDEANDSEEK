/**
 * @file        tests/unit/utils.test.ts
 * @description Unit-Tests für Utility-Funktionen
 * @version     1.1.0
 * @created     2026-01-08 16:10:00 CET
 * @updated     2026-01-12 15:50:00 CET
 * @author      Akki Scholze
 *
 * @changelog
 *   1.1.0 - 2026-01-12 - Tests für Truncate-Formatter (Currency/Number) hinzugefügt
 *   1.0.0 - 2026-01-08 - Erster funktionierender Vitest Test
 */

import { describe, it, expect } from 'vitest';
import { formatCurrency, formatCurrencyTruncate, formatDate, formatNumberTruncate } from '@/utils/format';

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

describe('formatCurrencyTruncate', () => {
  it('sollte nicht runden, sondern abschneiden (2 Nachkommastellen)', () => {
    expect(formatCurrencyTruncate(1.239, 2)).toBe('1,23\u00A0€');
    expect(formatCurrencyTruncate(1.231, 2)).toBe('1,23\u00A0€');
  });

  it('sollte ohne Nachkommastellen abschneiden', () => {
    expect(formatCurrencyTruncate(1234.99, 0)).toBe('1.234\u00A0€');
    expect(formatCurrencyTruncate(999.1, 0)).toBe('999\u00A0€');
  });
});

describe('formatNumberTruncate', () => {
  it('sollte ganze Zahlen ohne Rundung formatieren', () => {
    expect(formatNumberTruncate(1234.9)).toBe('1.234');
    expect(formatNumberTruncate(12.9)).toBe('12');
  });

  it('sollte Nachkommastellen abschneiden, nicht runden', () => {
    expect(formatNumberTruncate(1.239, 2)).toBe('1,23');
    expect(formatNumberTruncate(1.235, 2)).toBe('1,23');
  });
});

describe('formatDate', () => {
  it('sollte Datum korrekt formatieren', () => {
    const date = '2026-01-08';
    const result = formatDate(date);
    expect(result).toContain('08.01.2026');
  });
});
