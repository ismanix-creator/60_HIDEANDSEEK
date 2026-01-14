/**
 * @file        Infobox.tsx
 * @description Wiederverwendbare Infobox-Komponente (SEASIDE Dark Theme) - Responsive
 * @version     0.6.0
 * @created     2025-12-11 01:05:00 CET
 * @updated     2026-01-11 18:35:00 CET
 * @author      Akki Scholze
 *
 * @props
 *   variant - Infobox-Variante (info, success, warning, error)
 *   title - Optionaler Titel
 *   children - Infobox-Inhalt
 *
 * @changelog
 *   0.6.0 - 2026-01-11 18:35:00 CET - Fixed: Config-Zugriff auf appConfig.infobox statt appConfig.components.infobox (Config-Struktur-Migration)
 *   0.5.0 - 2026-01-09 - Direct appConfig.* access (spacingConfig eliminiert)
 *   0.3.0 - 2025-12-14 - Responsive: Kompaktere Mobile-Abstände, volle Breite
 *   0.2.0 - 2025-12-11 - 100% Config-Driven, Tailwind-Hardcodes entfernt
 *   0.1.0 - 2025-12-11 - Initial version
 */

// ═══════════════════════════════════════════════════════
// IMPORTS
// ═══════════════════════════════════════════════════════
import type { InfoboxProps } from '@/types/ui.types';
import { appConfig } from '@/config';
import { Info, CheckCircle, AlertTriangle, XCircle } from 'lucide-react';
import { useResponsive } from '@/hooks/useResponsive';

const infoboxConfig = appConfig.infobox;

const colorsConfig = appConfig.theme.colors;
const typographyConfig = appConfig.theme.typography;

// Helper: Tailwind-Scale (0-32) auf spacing (xxs-xxl) mappen
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
    gap: isMobile ? appConfig.theme.spacing.mobile_element_gap : spacingBase(3),
    backgroundColor: getColorValue(variantStyles.bg),
    borderWidth: `${baseConfig.borderWidth}px`,
    borderStyle: 'solid',
    borderColor: getColorValue(variantStyles.border),
    borderRadius: baseConfig.borderRadius,
    padding: isMobile ? appConfig.theme.spacing.mobile_container_padding : spacingBase(baseConfig.padding),
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
