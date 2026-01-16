/**
 * @file        StatusIcon.tsx
 * @description Config-driven status icon component (100% config-driven, keine Hardcodes)
 * @version     1.0.0
 * @created     2026-01-14 05:45:00 CET
 * @updated     2026-01-14 05:45:00 CET
 * @author      Akki Scholze
 *
 * @changelog
 *   1.0.0 - 2026-01-14 05:45:00 - Initial implementation: Status-Icons für common und material variants
 */

import { Clock, AlertCircle, CheckCircle, XCircle } from 'lucide-react';
import { appConfig } from '@/config';

/**
 * Status-Icon-Typen
 * - common: wartend, in_bearbeitung, erledigt
 * - material: wartend, in_bearbeitung, bestand_0_aber_aussenstaende, erledigt
 */
type CommonStatus = 'wartend' | 'in_bearbeitung' | 'erledigt';
type MaterialStatus = 'wartend' | 'in_bearbeitung' | 'bestand_0_aber_aussenstaende' | 'erledigt';

export interface StatusIconProps {
  variant: 'common' | 'material';
  status: CommonStatus | MaterialStatus;
  className?: string;
}

/**
 * Icon-Mapping für Status-Zustände
 */
const ICON_MAP = {
  wartend: Clock,
  in_bearbeitung: AlertCircle,
  bestand_0_aber_aussenstaende: XCircle,
  erledigt: CheckCircle
} as const;

/**
 * Color-Mapping für Status-Zustände (theme.colors.text)
 */
const COLOR_MAP = {
  wartend: 'yellow.650', // Clock = Yellow
  in_bearbeitung: 'eisgraublau.500', // AlertCircle = Blue
  bestand_0_aber_aussenstaende: 'red.650', // XCircle = Red
  erledigt: 'green.650' // CheckCircle = Green
} as const;

/**
 * Helper: Resolve color path from theme
 */
function resolveColor(colorPath: string): string {
  const parts = colorPath.split('.');
  if (parts.length === 2) {
    const [category, shade] = parts;
    const colorCategory = appConfig.theme.colors[category as keyof typeof appConfig.theme.colors];
    if (colorCategory && typeof colorCategory === 'object') {
      return (colorCategory as Record<string, string>)[shade] || colorPath;
    }
  }
  return colorPath;
}

/**
 * StatusIcon Component
 * Rendert Status-Icons basierend auf variant (common/material) und status
 */
export function StatusIcon({ status, className = '' }: StatusIconProps) {
  const IconComponent = ICON_MAP[status];
  const colorPath = COLOR_MAP[status];
  const color = resolveColor(colorPath);

  if (!IconComponent) {
    return null;
  }

  return <IconComponent className={className} style={{ color }} size={20} strokeWidth={2} />;
}

/**
 * Helper: Status aus Daten berechnen (material variant)
 */
export function getMaterialStatus(bestand: number, aussenstaende: number, started: boolean): MaterialStatus {
  if (!started) return 'wartend';
  if (bestand === 0 && aussenstaende === 0) return 'erledigt';
  if (bestand === 0 && aussenstaende > 0) return 'bestand_0_aber_aussenstaende';
  return 'in_bearbeitung'; // bestand > 0
}

/**
 * Helper: Status aus Daten berechnen (common variant)
 */
export function getCommonStatus(started: boolean, erledigt: boolean): CommonStatus {
  if (!started) return 'wartend';
  if (erledigt) return 'erledigt';
  return 'in_bearbeitung';
}
