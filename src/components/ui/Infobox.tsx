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

const colorsConfig = appConfig.theme.colors;
const typographyConfig = appConfig.theme.typography;
const infoboxConfig = appConfig.ui.infobox;

// ═══════════════════════════════════════════════════════
// HELPERS
// ═══════════════════════════════════════════════════════
function resolveColor(colorPath: string): string {
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

  const Icon = iconMap[variant];

  const variantConfig = infoboxConfig.variants[variant];
  const variantStyles = {
    bg: resolveColor(variantConfig.bg),
    border: resolveColor(variantConfig.border),
    iconColor: resolveColor(variantConfig.iconColor)
  };

  // ═══════════════════════════════════════════════════════
  // RESPONSIVE STYLES
  // ═══════════════════════════════════════════════════════

  const containerStyle: React.CSSProperties = {
    display: infoboxConfig.container.style.display,
    gap: isMobile ? infoboxConfig.container.style.gapMobile : infoboxConfig.container.style.gapDesktop,
    backgroundColor: variantStyles.bg,
    borderWidth: infoboxConfig.container.style.borderWidth,
    borderStyle: infoboxConfig.container.style.borderStyle,
    borderColor: variantStyles.border,
    borderRadius: infoboxConfig.container.style.borderRadius,
    padding: isMobile ? infoboxConfig.container.style.paddingMobile : infoboxConfig.container.style.paddingDesktop,
    width: isMobile ? infoboxConfig.container.style.widthMobile : undefined
  };

  const iconStyle: React.CSSProperties = {
    width: isMobile ? infoboxConfig.icon.style.widthMobile : infoboxConfig.icon.style.widthDesktop,
    height: isMobile ? infoboxConfig.icon.style.heightMobile : infoboxConfig.icon.style.heightDesktop,
    flexShrink: infoboxConfig.icon.style.flexShrink,
    marginTop: infoboxConfig.icon.style.marginTop,
    color: variantStyles.iconColor
  };

  return (
    <div className={className} style={containerStyle}>
      <Icon style={iconStyle} />
      <div style={{ flex: infoboxConfig.content.style.flex }}>
        {title && (
          <p
            style={{
              fontWeight: typographyConfig.fontWeight.semibold,
              marginBottom: infoboxConfig.title.style.marginBottom,
              color: variantStyles.iconColor,
              fontSize: isMobile ? typographyConfig.fontSize.small : undefined
            }}
          >
            {title}
          </p>
        )}
        <div
          style={{
            fontSize: isMobile ? typographyConfig.fontSize.xsmall : typographyConfig.fontSize.bodyText,
            color: colorsConfig.text.active
          }}
        >
          {children}
        </div>
      </div>
    </div>
  );
}
