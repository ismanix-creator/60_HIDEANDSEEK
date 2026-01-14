/**
 * @file        Divider.tsx
 * @description Wiederverwendbare Divider-Komponente (SEASIDE Dark Theme)
 * @version     0.4.0
 * @created     2025-12-11 01:05:00 CET
 * @updated     2026-01-09 23:18:50 CET
 * @author      Akki Scholze
 *
 * @props
 *   month - Monat (1-12 oder "2025-12")
 *   year - Jahr (optional)
 *
 * @changelog
 *   0.4.0 - 2026-01-09 - Direct appConfig.* access (spacingConfig eliminiert)
 *   0.2.0 - 2025-12-11 - MonthDivider zentriert, Tailwind-Class entfernt
 *   0.1.0 - 2025-12-11 - Initial version
 */

// ═══════════════════════════════════════════════════════
// IMPORTS
// ═══════════════════════════════════════════════════════
import type { MonthDividerProps } from '@/types/ui.types';
import { appConfig } from '@/config';

const dividerConfig = appConfig.divider;

const colorsConfig = appConfig.theme.colors;

// Helper: Tailwind-Scale (0-32) auf theme.spacing (xxs-xxl) mappen
const spacingBase = (key: number | string): string => {
  const keyNum = typeof key === 'number' ? key : parseInt(String(key), 10);
  if (isNaN(keyNum)) return appConfig.theme.spacing.content_gap; // fallback

  if (keyNum <= 0) return appConfig.theme.spacing.tight;
  if (keyNum === 1) return appConfig.theme.spacing.compact;
  if (keyNum === 2) return appConfig.theme.spacing.compact;
  if (keyNum === 3) return appConfig.theme.spacing.element_gap;
  if (keyNum === 4) return appConfig.theme.spacing.content_gap;
  if (keyNum === 5) return appConfig.theme.spacing.content_gap;
  if (keyNum === 6) return appConfig.theme.spacing.panel_padding;
  if (keyNum === 8) return appConfig.theme.spacing.section_padding;
  return appConfig.theme.spacing.page_padding; // 10+
};

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
