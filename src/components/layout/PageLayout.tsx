/**
 * @file        PageLayout.tsx
 * @description Seiten-Layout mit Titel und Actions (SEASIDE Dark Theme) - Responsive
 * @version     0.6.0
 * @created     2025-12-11 01:05:00 CET
 * @updated     2026-01-09 12:59:24 CET
 * @author      Akki Scholze
 *
 * @props
 *   title - Seitentitel
 *   icon - Optionales Icon
 *   actions - Optionale Action-Buttons
 *   children - Seiteninhalt
 *
 * @changelog
 *   0.6.0 - 2026-01-09 - Header + Actions horizontal zentriert mit festem Abstand
 *   0.5.0 - 2025-12-14 - Responsive: Mobile Bottom-Nav Padding, angepasste Abstände
 *   0.4.0 - 2025-12-12 - Config-Driven: Hardcodes durch spacingConfig/iconsConfig ersetzt
 *   0.3.0 - 2025-12-11 - Fixed: Removed maxWidth, added overflow: hidden for scrolling children
 *   0.2.0 - 2025-12-11 - SEASIDE Dark Theme, Config-Driven Colors
 *   0.1.0 - 2025-12-11 - Initial version
 */

// ═══════════════════════════════════════════════════════
// IMPORTS
// ═══════════════════════════════════════════════════════
import type { PageLayoutProps } from '@/types/ui.types';
import { Package, Users, ArrowDownCircle, ArrowUpCircle } from 'lucide-react';
import { appConfig } from '@/config';
import { useResponsive } from '@/hooks/useResponsive';

const colorsConfig = appConfig.theme.colors;
const iconsConfig = appConfig.theme.icons;

// ═══════════════════════════════════════════════════════
// ICON MAP
// ═══════════════════════════════════════════════════════
const iconMap: Record<string, React.ElementType> = {
  package: Package,
  users: Users,
  'arrow-down-circle': ArrowDownCircle,
  'arrow-up-circle': ArrowUpCircle
};

// ═══════════════════════════════════════════════════════
// COMPONENT
// ═══════════════════════════════════════════════════════
export function PageLayout({ title, icon, actions, children }: PageLayoutProps) {
  const { isMobile } = useResponsive();

  // Icon kann string (aus iconMap) oder direktes ReactNode sein
  const renderIcon = () => {
    if (!icon) return null;
    if (typeof icon === 'string') {
      const IconComponent = iconMap[icon];
      return IconComponent ? (
        <IconComponent
          style={{
            height: iconsConfig.sizes.md,
            width: iconsConfig.sizes.md,
            color: colorsConfig.primary[500]
          }}
        />
      ) : null;
    }
    // ReactNode direkt rendern
    return icon;
  };

  const iconContent = renderIcon();

  // ═══════════════════════════════════════════════════════
  // RESPONSIVE STYLES
  // ═══════════════════════════════════════════════════════

  // Container Style
  const containerStyle: React.CSSProperties = {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    backgroundColor: colorsConfig.ui.backgroundAlt,
    // Mobile: Padding unten für Bottom-Navigation
    paddingBottom: isMobile ? appConfig.theme.responsive.bottomNavPadding : undefined
  };

  // Header Container Style
  const headerContainerStyle: React.CSSProperties = {
    maxWidth: appConfig.theme.spacing.layout.contentMaxWidthRem,
    margin: '0 auto',
    paddingLeft: isMobile ? appConfig.theme.spacing.mobile.md : appConfig.theme.spacing.sm,
    paddingRight: isMobile ? appConfig.theme.spacing.mobile.md : appConfig.theme.spacing.sm,
    paddingTop: isMobile ? appConfig.theme.spacing.mobile.lg : appConfig.theme.spacing.lg,
    paddingBottom: isMobile ? appConfig.theme.spacing.mobile.lg : appConfig.theme.spacing.lg,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    // Mobile: Buttons wrappen wenn zu eng
    flexWrap: isMobile ? 'wrap' : 'nowrap',
    gap: isMobile ? appConfig.theme.spacing.mobile.sm : appConfig.theme.spacing.lg
  };

  // Title Container Style
  const titleContainerStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    gap: isMobile ? appConfig.theme.spacing.mobile.sm : appConfig.theme.spacing.sm
  };

  // Actions Container Style
  const actionsContainerStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-start',
    gap: isMobile ? appConfig.theme.spacing.mobile.sm : appConfig.theme.spacing.xs,
    flexWrap: isMobile ? 'wrap' : 'nowrap'
  };

  // Main Content Style
  const mainStyle: React.CSSProperties = {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    width: '100%',
    overflow: 'hidden',
    paddingLeft: isMobile ? appConfig.theme.spacing.mobile.md : appConfig.theme.spacing.sm,
    paddingRight: isMobile ? appConfig.theme.spacing.mobile.md : appConfig.theme.spacing.sm,
    paddingTop: isMobile ? appConfig.theme.spacing.mobile.lg : appConfig.theme.spacing.lg,
    paddingBottom: isMobile ? appConfig.theme.spacing.mobile.lg : appConfig.theme.spacing.lg
  };

  // Title Style
  const titleStyle: React.CSSProperties = {
    fontSize: isMobile ? '1rem' : '1.25rem',
    fontWeight: 700,
    color: colorsConfig.text.primary,
    margin: 0
  };

  return (
    <div style={containerStyle}>
      {/* Page Header */}
      <header
        style={{
          backgroundColor: colorsConfig.ui.background,
          borderBottom: `1px solid ${colorsConfig.ui.border}`
        }}
      >
        <div style={headerContainerStyle}>
          {/* Titel - links */}
          <div style={titleContainerStyle}>
            {iconContent && (
              <div
                style={{
                  padding: isMobile ? appConfig.theme.spacing.mobile.sm : appConfig.theme.spacing.sm,
                  backgroundColor: colorsConfig.info.light,
                  borderRadius: appConfig.theme.spacing.sm
                }}
              >
                {iconContent}
              </div>
            )}
            <h1 style={titleStyle}>{title}</h1>
          </div>

          {/* Actions - neben Titel mit festem Abstand */}
          {actions && <div style={actionsContainerStyle}>{actions}</div>}
        </div>
      </header>

      {/* Page Content */}
      <main style={mainStyle}>{children}</main>
    </div>
  );
}
