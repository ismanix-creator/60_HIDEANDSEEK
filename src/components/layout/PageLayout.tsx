/**
 * @file        PageLayout.tsx
 * @description Seiten-Layout mit Titel und Actions (SEASIDE Dark Theme) - Responsive
 * @version     0.11.1
 * @created     2025-12-11 01:05:00 CET
 * @updated     2026-01-12 10:55:00 CET
 * @author      Akki Scholze
 *
 * @props
 *   title - Seitentitel
 *   icon - Optionales Icon
 *   actions - Optionale Action-Buttons
 *   children - Seiteninhalt
 *   footer - Optionale Infobox unter dem Content
 *
 * @changelog
 *   0.11.1 - 2026-01-12 - Fix: Typisierungen für optionale Layout-Keys, FooterArea integriert
 *   0.11.0 - 2026-01-12 - Refactor: Layout auf Area-Komponenten (Navigation/Header/Content/Footer) umgestellt, Grid-Layouts (6/2/Content/Footer)
 *   0.10.1 - 2026-01-11 - FIX: fontSize von pageHeader.button Config (80px statt 1.5rem)
 *   0.10.0 - 2026-01-11 14:47:00 CET - Migration: layout.areas.* Config für navigation/header/content/footer (config.toml v2.9.0)
 *   0.9.1 - 2026-01-11 23:45:00 CET - Optimized spacing: Compact header, content starts directly below (no top padding)
 *   0.9.0 - 2026-01-11 23:30:00 CET - Added footer prop, sections for header/content/footer with config-driven styles
 *   0.8.0 - 2026-01-14 - Migration: Flache Config-Struktur (appConfig.colors, appConfig.spacing, etc.)
 *   0.7.0 - 2026-01-11 12:30:00 CET - Typography: fontSize/fontWeight/fontFamily aus config.toml
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
import type { CSSProperties } from 'react';
import type { PageLayoutProps } from '@/types/ui.types';
import { appConfig } from '@/config';
import { useResponsive } from '@/hooks/useResponsive';
import { NavigationArea } from './areas/navigation';
import { HeaderArea } from './areas/header';
import { ContentArea } from './areas/content';
import { FooterArea } from './areas/footer.tsx';

const colorsConfig = appConfig.colors;
const layoutAreas = appConfig.layout.areas;

// ═══════════════════════════════════════════════════════
// HELPERS
// ═══════════════════════════════════════════════════════
/**
 * Resolve color token strings to actual hex values.
 * Supports {category.shade} token refs (e.g., {black.900}, {ui.border})
 */
function getColorValue(colorPath: string): string {
  if (!colorPath || colorPath === 'transparent' || colorPath === 'none') {
    return 'transparent';
  }

  // Token-Refs: {ui.border}, {black.900} etc. sind STRINGS
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

// ═══════════════════════════════════════════════════════
// ICON MAP
// ═══════════════════════════════════════════════════════
type LayoutAreaExtended = {
  bg: string;
  border: string;
  borderWidth: string;
  borderRadius?: string;
  height?: string;
  minHeight?: string;
  padding?: string;
  gridColumns?: number;
  gap?: string;
};

export function PageLayout({ title, icon, actions, children, footer, footerColumns }: PageLayoutProps) {
  const { isMobile } = useResponsive();

  const navigationArea = layoutAreas.navigation as LayoutAreaExtended;
  const headerArea = layoutAreas.header as LayoutAreaExtended;
  const contentArea = layoutAreas.content as LayoutAreaExtended;
  const footerArea = layoutAreas.footer as LayoutAreaExtended;

  // ═══════════════════════════════════════════════════════
  // NAVIGATION STYLES (Config: layout.areas.navigation)
  // ═══════════════════════════════════════════════════════
  const pageContainerStyle: CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    minHeight: '100vh',
    backgroundColor: getColorValue(layoutAreas.content.bg),
    paddingBottom: isMobile ? appConfig.responsive.bottomNavPadding : undefined
  };

  const navContainerStyle: CSSProperties = isMobile
    ? {
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        height: navigationArea.height || appConfig.responsive.bottomNavHeight,
        backgroundColor: getColorValue(navigationArea.bg),
        borderTop: `${navigationArea.borderWidth} solid ${getColorValue(navigationArea.border)}`,
        zIndex: appConfig.navigation.zIndex,
        padding: navigationArea.padding || `${appConfig.spacing.xs} 0`
      }
    : {
        backgroundColor: getColorValue(navigationArea.bg),
        borderBottom: `${navigationArea.borderWidth} solid ${getColorValue(navigationArea.border)}`,
        padding: navigationArea.padding || `${appConfig.spacing.sm} ${appConfig.spacing.md}`
      };

  const headerStyle: CSSProperties = {
    backgroundColor: getColorValue(headerArea.bg),
    borderBottom: `${headerArea.borderWidth} solid ${getColorValue(headerArea.border)}`,
    padding: isMobile ? appConfig.spacing.mobile.md : headerArea.padding || appConfig.spacing.xl,
    display: 'grid',
    gridTemplateColumns: headerArea.gridColumns ? `repeat(${headerArea.gridColumns}, minmax(0, 1fr))` : '1fr auto',
    alignItems: 'center',
    gap: headerArea.gap || appConfig.spacing.md,
    height: headerArea.height
  };

  const contentStyle: CSSProperties = {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    overflow: 'hidden',
    padding: isMobile ? appConfig.spacing.mobile.md : contentArea.padding || appConfig.spacing.md,
    backgroundColor: getColorValue(contentArea.bg),
    minHeight: contentArea.minHeight,
    height: contentArea.height,
    borderRadius: contentArea.borderRadius,
    border: contentArea.borderWidth
      ? `${contentArea.borderWidth} solid ${getColorValue(contentArea.border)}`
      : undefined
  };

  const resolvedFooterColumns: number = Number(footerColumns ?? footerArea.gridColumns ?? 3);

  const footerStyle: CSSProperties = {
    backgroundColor: getColorValue(footerArea.bg),
    borderTop: `${footerArea.borderWidth} solid ${getColorValue(footerArea.border)}`,
    borderRadius: footerArea.borderRadius,
    padding: isMobile ? footerArea.padding || appConfig.spacing.mobile.md : footerArea.padding || appConfig.spacing.md,
    height: footerArea.height,
    gap: footerArea.gap
  };

  return (
    <div style={pageContainerStyle}>
      <NavigationArea style={navContainerStyle} isMobile={isMobile} />

      <HeaderArea style={headerStyle} title={title} icon={icon} actions={actions} isMobile={isMobile} />

      <ContentArea style={contentStyle}>{children}</ContentArea>

      {footer && (
        <FooterArea style={footerStyle} columns={resolvedFooterColumns}>
          {footer}
        </FooterArea>
      )}
    </div>
  );
}
