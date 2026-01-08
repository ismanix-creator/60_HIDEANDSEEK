/**
 * @file        PageLayout.tsx
 * @description Seiten-Layout mit Titel und Actions (SEASIDE Dark Theme) - Responsive
 * @version     0.5.0
 * @created     2025-12-11 01:05:00 CET
 * @updated     2025-12-15 22:27:01 CET
 * @author      Claude Code CLI
 *
 * @props
 *   title - Seitentitel
 *   icon - Optionales Icon
 *   actions - Optionale Action-Buttons
 *   children - Seiteninhalt
 *
 * @changelog
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
import { colorsConfig, spacingConfig, iconsConfig } from '@/config';
import { useResponsive } from '@/hooks/useResponsive';

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
    paddingBottom: isMobile ? spacingConfig.responsive.bottomNavPadding : undefined
  };

  // Header Container Style
  const headerContainerStyle: React.CSSProperties = {
    maxWidth: spacingConfig.layout.contentMaxWidthRem,
    margin: '0 auto',
    paddingLeft: isMobile ? spacingConfig.mobile.md : spacingConfig.sm,
    paddingRight: isMobile ? spacingConfig.mobile.md : spacingConfig.sm,
    paddingTop: isMobile ? spacingConfig.mobile.lg : spacingConfig.lg,
    paddingBottom: isMobile ? spacingConfig.mobile.lg : spacingConfig.lg,
    display: 'flex',
    alignItems: 'center',
    // Mobile: Buttons wrappen wenn zu eng
    flexWrap: isMobile ? 'wrap' : 'nowrap',
    gap: isMobile ? spacingConfig.mobile.sm : undefined
  };

  // Title Container Style
  const titleContainerStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    gap: isMobile ? spacingConfig.mobile.sm : spacingConfig.sm,
    flex: isMobile ? '1 1 100%' : 1
  };

  // Actions Container Style
  const actionsContainerStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: isMobile ? 'flex-start' : 'center',
    gap: isMobile ? spacingConfig.mobile.sm : spacingConfig.xs,
    // Mobile: Volle Breite für Action-Buttons
    width: isMobile ? '100%' : undefined,
    flexWrap: isMobile ? 'wrap' : 'nowrap'
  };

  // Main Content Style
  const mainStyle: React.CSSProperties = {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    width: '100%',
    overflow: 'hidden',
    paddingLeft: isMobile ? spacingConfig.mobile.md : spacingConfig.sm,
    paddingRight: isMobile ? spacingConfig.mobile.md : spacingConfig.sm,
    paddingTop: isMobile ? spacingConfig.mobile.lg : spacingConfig.lg,
    paddingBottom: isMobile ? spacingConfig.mobile.lg : spacingConfig.lg
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
                  padding: isMobile ? spacingConfig.mobile.sm : spacingConfig.sm,
                  backgroundColor: colorsConfig.info.light,
                  borderRadius: spacingConfig.sm
                }}
              >
                {iconContent}
              </div>
            )}
            <h1 style={titleStyle}>{title}</h1>
          </div>

          {/* Actions - mittig (Desktop) / unter Titel (Mobile) */}
          {actions && <div style={actionsContainerStyle}>{actions}</div>}

          {/* Spacer - rechts (nur Desktop) */}
          {!isMobile && <div style={{ flex: 1 }} />}
        </div>
      </header>

      {/* Page Content */}
      <main style={mainStyle}>{children}</main>
    </div>
  );
}
