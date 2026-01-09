/**
 * @file        Badge.tsx
 * @description Wiederverwendbare Badge-Komponente
 * @version     0.2.0
 * @created     2025-12-11 01:05:00 CET
 * @updated     2026-01-09 20:44:36 CET
 * @author      Akki Scholze
 *
 * @props
 *   variant - Badge-Variante (success, error, warning, pending, neutral)
 *   showIcon - Ob das Icon angezeigt werden soll
 *   children - Badge-Inhalt
 *
 * @changelog
 *   0.2.0 - 2026-01-09 - Import auf appConfig.components.badge umgestellt (Phase 2.2.1)
 *   0.1.0 - 2025-12-11 - Initial version
 */

// ═══════════════════════════════════════════════════════
// IMPORTS
// ═══════════════════════════════════════════════════════
import type { BadgeProps } from '@/types/ui.types';
import { appConfig } from '@/config';
import { Check, X, AlertTriangle, Clock } from 'lucide-react';

const badgeConfig = appConfig.components.badge;

const colorsConfig = appConfig.theme.colors;

// ═══════════════════════════════════════════════════════
// HELPERS
// ═══════════════════════════════════════════════════════
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

const iconMap = {
  success: Check,
  error: X,
  warning: AlertTriangle,
  pending: Clock,
  neutral: null
};

// ═══════════════════════════════════════════════════════
// COMPONENT
// ═══════════════════════════════════════════════════════
export function Badge({ variant = 'neutral', showIcon = true, children, className = '' }: BadgeProps) {
  const variantStyles = badgeConfig.variants[variant];
  const Icon = iconMap[variant];

  return (
    <span
      className={`inline-flex items-center gap-1 ${className}`}
      style={{
        backgroundColor: getColorValue(variantStyles.bg),
        color: getColorValue(variantStyles.text),
        borderRadius: badgeConfig.base.borderRadius,
        paddingLeft: `${badgeConfig.base.paddingX * 0.25}rem`,
        paddingRight: `${badgeConfig.base.paddingX * 0.25}rem`,
        paddingTop: `${badgeConfig.base.paddingY * 0.25}rem`,
        paddingBottom: `${badgeConfig.base.paddingY * 0.25}rem`,
        fontSize: badgeConfig.base.fontSize,
        fontWeight: badgeConfig.base.fontWeight
      }}
    >
      {showIcon && Icon && <Icon className="h-3 w-3" />}
      {children}
    </span>
  );
}
