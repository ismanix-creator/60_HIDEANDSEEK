/**
 * @file        Infobox.tsx
 * @description Wiederverwendbare Infobox-Komponente (SEASIDE Dark Theme) - Responsive
 * @version     0.4.0
 * @created     2025-12-11 01:05:00 CET
 * @updated     2026-01-09 20:45:09 CET
 * @author      Akki Scholze
 *
 * @props
 *   variant - Infobox-Variante (info, success, warning, error)
 *   title - Optionaler Titel
 *   children - Infobox-Inhalt
 *
 * @changelog
 *   0.4.0 - 2026-01-09 - Import auf appConfig.components.infobox umgestellt (Phase 2.2.5)
 *   0.3.0 - 2025-12-14 - Responsive: Kompaktere Mobile-Abstände, volle Breite
 *   0.2.0 - 2025-12-11 - 100% Config-Driven, Tailwind-Hardcodes entfernt
 *   0.1.0 - 2025-12-11 - Initial version
 */

// ═══════════════════════════════════════════════════════
// IMPORTS
// ═══════════════════════════════════════════════════════
import type { InfoboxProps } from '@/types/ui.types';
import { appConfig, spacingConfig } from '@/config';
import { Info, CheckCircle, AlertTriangle, XCircle } from 'lucide-react';
import { useResponsive } from '@/hooks/useResponsive';

const infoboxConfig = appConfig.components.infobox;

const colorsConfig = appConfig.theme.colors;
const typographyConfig = appConfig.theme.typography;

const spacingBase = (key: number | string) => spacingConfig.base[String(key) as keyof typeof spacingConfig.base];

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
  info: Info,
  success: CheckCircle,
  warning: AlertTriangle,
  error: XCircle
};

// ═══════════════════════════════════════════════════════
// COMPONENT
// ═══════════════════════════════════════════════════════
export function Infobox({ variant = 'info', title, children, className = '' }: InfoboxProps) {
  const { isMobile } = useResponsive();

  const variantStyles = infoboxConfig.variants[variant];
  const Icon = iconMap[variant];
  const baseConfig = infoboxConfig.base;

  // ═══════════════════════════════════════════════════════
  // RESPONSIVE STYLES
  // ═══════════════════════════════════════════════════════

  const containerStyle: React.CSSProperties = {
    display: 'flex',
    gap: isMobile ? spacingConfig.mobile.sm : spacingBase(3),
    backgroundColor: getColorValue(variantStyles.bg),
    borderWidth: `${baseConfig.borderWidth}px`,
    borderStyle: 'solid',
    borderColor: getColorValue(variantStyles.border),
    borderRadius: baseConfig.borderRadius,
    padding: isMobile ? spacingConfig.mobile.md : spacingBase(baseConfig.padding),
    // Mobile: Volle Breite
    width: isMobile ? '100%' : undefined
  };

  const iconStyle: React.CSSProperties = {
    width: isMobile ? '1rem' : '1.25rem',
    height: isMobile ? '1rem' : '1.25rem',
    flexShrink: 0,
    marginTop: spacingBase(1),
    color: getColorValue(variantStyles.iconColor)
  };

  return (
    <div className={className} style={containerStyle}>
      <Icon style={iconStyle} />
      <div style={{ flex: 1 }}>
        {title && (
          <p
            style={{
              fontWeight: typographyConfig.fontWeight.semibold,
              marginBottom: spacingBase(1),
              color: getColorValue(variantStyles.iconColor),
              fontSize: isMobile ? '0.875rem' : undefined
            }}
          >
            {title}
          </p>
        )}
        <div
          style={{
            fontSize: isMobile ? '0.8125rem' : typographyConfig.fontSize.sm,
            color: colorsConfig.text.primary
          }}
        >
          {children}
        </div>
      </div>
    </div>
  );
}
