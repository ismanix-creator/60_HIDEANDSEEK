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

const colorsConfig = appConfig.theme.colors;
const monthDividerStyle = appConfig.ui.dividers.month.style;
const horizontalDividerStyle = appConfig.ui.dividers.horizontal.style;

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
        backgroundColor: colorsConfig.bg.card,
        color: colorsConfig.text.active,
        padding: monthDividerStyle.padding,
        fontWeight: monthDividerStyle.fontWeight,
        fontSize: monthDividerStyle.fontSize,
        textTransform: monthDividerStyle.textTransform as React.CSSProperties['textTransform'],
        textAlign: monthDividerStyle.textAlign as React.CSSProperties['textAlign']
      }}
    >
      {displayMonth} {displayYear}
    </div>
  );
}

export function HorizontalDivider() {
  const borderTopColor = horizontalDividerStyle.borderColor.replace('border.', '');
  const resolvedBorderColor = colorsConfig.border[borderTopColor as keyof typeof colorsConfig.border];

  return (
    <hr
      style={{
        border: horizontalDividerStyle.border,
        borderTop: `${horizontalDividerStyle.borderTop} ${resolvedBorderColor}`,
        marginTop: horizontalDividerStyle.marginTop,
        marginBottom: horizontalDividerStyle.marginBottom
      }}
    />
  );
}
