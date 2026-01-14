/**
 * @file        Badge.tsx
 * @description Wiederverwendbare Badge-Komponente
 * @version     0.3.0
 * @created     2025-12-11 01:05:00 CET
 * @updated     2026-01-11 18:35:00 CET
 * @author      Akki Scholze
 *
 * @props
 *   variant - Badge-Variante (success, error, warning, pending, neutral)
 *   showIcon - Ob das Icon angezeigt werden soll
 *   children - Badge-Inhalt
 *
 * @changelog
 *   0.3.0 - 2026-01-11 18:35:00 CET - Fixed: Config-Zugriff auf appConfig.components.badge statt appConfig.components.badge (Config-Struktur-Migration)
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
  if (!colorPath || colorPath === 'transparent' || colorPath === 'none') {
    return 'transparent';
  }

  // Token-Refs: {blue.500}, {white.50} etc. sind STRINGS
  if (colorPath.startsWith('{') && colorPath.endsWith('}')) {
    const tokenPath = colorPath.slice(1, -1); // Remove { }
    const parts = tokenPath.split('.');
    if (parts.length === 2) {
      const [category, shade] = parts;
      const colorCategory = colorsConfig[category as keyof typeof colorsConfig];
      if (colorCategory && typeof colorCategory === 'object') {
        return (colorCategory as Record<string, string>)[shade] || colorPath;
      }
    }
    return colorPath;
  }

  // Direct path (e.g., "gray.500")
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
