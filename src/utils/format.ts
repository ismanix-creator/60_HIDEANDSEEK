/**
 * @file        format.ts
 * @description Formatting-Utilities für Currency, Date, Number
 * @version     0.1.0
 * @created     2026-01-07 01:18:02 CET
 * @updated     2026-01-07 01:18:02 CET
 * @author      frontend-entwickler
 *
 * @usage
 *   import { formatCurrency, formatDate, formatNumber } from '@/utils/format';
 *   formatCurrency(1234.56) // "1.234,56 €"
 *   formatDate('2026-01-07') // "07.01.2026"
 *   formatNumber(1234.56) // "1.234,56"
 *
 * @changelog
 *   0.1.0 - 2026-01-07 - Initial version mit deutschen Formaten
 */

/**
 * Formatiert einen betrag als Currency (EUR)
 * @param value - betrag als number
 * @returns Formatierter String mit € Symbol
 */
export function formatCurrency(value: number | null | undefined): string {
  if (value === null || value === undefined || isNaN(value)) {
    return '0,00 €';
  }

  return new Intl.NumberFormat('de-DE', {
    style: 'currency',
    currency: 'EUR',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(value);
}

/**
 * Formatiert ein Datum im deutschen Format
 * @param value - Datum als ISO String (YYYY-MM-DD) oder Date
 * @returns Formatierter String (DD.MM.YYYY)
 */
export function formatDate(value: string | Date | null | undefined): string {
  if (!value) {
    return '-';
  }

  try {
    const date = typeof value === 'string' ? new Date(value) : value;

    if (isNaN(date.getTime())) {
      return '-';
    }

    return new Intl.DateTimeFormat('de-DE', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    }).format(date);
  } catch {
    return '-';
  }
}

/**
 * Formatiert eine Zahl mit deutschen Tausender-Trennzeichen
 * @param value - Zahl
 * @param decimals - Anzahl Nachkommastellen (default: 2)
 * @returns Formatierter String
 */
export function formatNumber(value: number | null | undefined, decimals: number = 2): string {
  if (value === null || value === undefined || isNaN(value)) {
    return '0';
  }

  return new Intl.NumberFormat('de-DE', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals
  }).format(value);
}

/**
 * Parst einen deutschen Currency-String zu number
 * @param value - String wie "1.234,56 €"
 * @returns Number-Wert
 */
export function parseCurrency(value: string): number {
  if (!value) return 0;

  // Entferne Währungssymbol, Leerzeichen und Tausender-Trenner
  const cleaned = value
    .replace(/[€$\s]/g, '')
    .replace(/\./g, '')
    .replace(/,/g, '.');

  return parseFloat(cleaned) || 0;
}

/**
 * Parst ein deutsches Datum zu ISO String
 * @param value - String wie "07.01.2026"
 * @returns ISO String (YYYY-MM-DD)
 */
export function parseDate(value: string): string {
  if (!value) return '';

  const parts = value.split('.');
  if (parts.length !== 3) return '';

  const [day, month, year] = parts;
  return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
}
