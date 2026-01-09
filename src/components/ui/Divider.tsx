/**
 * @file        Divider.tsx
 * @description Wiederverwendbare Divider-Komponente (SEASIDE Dark Theme)
 * @version     0.3.0
 * @created     2025-12-11 01:05:00 CET
 * @updated     2026-01-09 20:45:09 CET
 * @author      Akki Scholze
 *
 * @props
 *   month - Monat (1-12 oder "2025-12")
 *   year - Jahr (optional)
 *
 * @changelog
 *   0.3.0 - 2026-01-09 - Import auf appConfig.components.divider umgestellt (Phase 2.2.4)
 *   0.2.0 - 2025-12-11 - MonthDivider zentriert, Tailwind-Class entfernt
 *   0.1.0 - 2025-12-11 - Initial version
 */

// ═══════════════════════════════════════════════════════
// IMPORTS
// ═══════════════════════════════════════════════════════
import type { MonthDividerProps } from '@/types/ui.types';
import { appConfig, spacingConfig } from '@/config';

const dividerConfig = appConfig.components.divider;

const colorsConfig = appConfig.theme.colors;

const spacingBase = (key: number | string) => spacingConfig.base[String(key) as keyof typeof spacingConfig.base];

// ═══════════════════════════════════════════════════════
// HELPERS
// ═══════════════════════════════════════════════════════
const monthNames = [
  'Januar',
  'Februar',
  'März',
  'April',
  'Mai',
  'Juni',
  'Juli',
  'August',
  'September',
  'Oktober',
  'November',
  'Dezember'
];

function getColorValue(colorPath: string): string {
  const parts = colorPath.split('.');
  if (parts.length === 2) {
    const [category, shade] = parts;
    const colorCategory = colorsConfig[category as keyof typeof colorsConfig];
    if (colorCategory && typeof colorCategory === 'object') {
      return (colorCategory as Record<string, string>)[shade] || colorPath;
    }
  }
  return colorPath;
}

// ═══════════════════════════════════════════════════════
// COMPONENTS
// ═══════════════════════════════════════════════════════
export function MonthDivider({ month, year }: MonthDividerProps) {
  // Unterstützt Format "2025-12" oder "12" mit year Param
  let displayMonth: string;
  let displayYear: number | string;

  if (month.includes('-')) {
    const [y, m] = month.split('-');
    displayYear = y;
    const monthIndex = parseInt(m, 10) - 1;
    displayMonth = monthNames[monthIndex] || m;
  } else {
    const monthIndex = parseInt(month, 10) - 1;
    displayMonth = monthNames[monthIndex] || month;
    displayYear = year || '';
  }

  return (
    <div
      style={{
        backgroundColor: getColorValue(dividerConfig.month.bg),
        color: getColorValue(dividerConfig.month.text),
        padding: `${dividerConfig.month.paddingY * 0.25}rem ${dividerConfig.month.paddingX * 0.25}rem`,
        fontWeight: dividerConfig.month.fontWeight,
        fontSize: dividerConfig.month.fontSize,
        textTransform: dividerConfig.month.textTransform as 'uppercase',
        textAlign: 'center'
      }}
    >
      {displayMonth} {displayYear}
    </div>
  );
}

export function HorizontalDivider() {
  return (
    <hr
      style={{
        border: 'none',
        borderTop: `${dividerConfig.horizontal.thickness} solid ${getColorValue(dividerConfig.horizontal.color)}`,
        marginTop: spacingBase(dividerConfig.horizontal.marginY),
        marginBottom: spacingBase(dividerConfig.horizontal.marginY)
      }}
    />
  );
}
