/**
 * @file        PageLayout.tsx
 * @description Seiten-Layout mit Titel und Actions (SEASIDE Dark Theme) - Responsive
 * @version     0.10.0
 * @created     2025-12-11 01:05:00 CET
 * @updated     2026-01-11 14:47:00 CET
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
import { useState } from 'react';
import { NavLink } from 'react-router-dom';
import type { PageLayoutProps } from '@/types/ui.types';
import type { NavItem } from '@/types/ui.types';
import { Package, Users, HandCoins, Settings, UserCog, LogIn, LogOut } from 'lucide-react';
import { appConfig, navigationConfig } from '@/config';
import { useResponsive } from '@/hooks/useResponsive';
import { useAuth } from '@/context/AuthContext';

const colorsConfig = appConfig.colors;
const typographyConfig = appConfig.typography;
const buttonConfig = appConfig.button;
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
const iconMap: Record<string, React.ElementType> = {
  package: Package,
  users: Users,
  'hand-coins': HandCoins,
  settings: Settings,
  'user-cog': UserCog,
  'log-in': LogIn,
  'log-out': LogOut
};

// ═══════════════════════════════════════════════════════
// COMPONENT
// ═══════════════════════════════════════════════════════
export function PageLayout({ title, icon, actions, children, footer }: PageLayoutProps) {
  const [hoveredKey, setHoveredKey] = useState<string | null>(null);
  const { isMobile } = useResponsive();
  const { isAuthenticated, logout } = useAuth();

  const navItems = navigationConfig.items as ReadonlyArray<NavItem>;

  const filteredItems = navItems.filter((item) => {
    if (item.key === 'login' && isAuthenticated) return false;
    if (item.key === 'logout' && !isAuthenticated) return false;
    return true;
  });

  const handleLogout = async () => {
    await logout();
    window.location.href = '/';
  };

  // ═══════════════════════════════════════════════════════
  // NAVIGATION STYLES (Config: layout.areas.navigation)
  // ═══════════════════════════════════════════════════════
  const navContainerStyle: React.CSSProperties = isMobile
    ? {
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        height: appConfig.responsive.bottomNavHeight,
        backgroundColor: getColorValue(layoutAreas.navigation.bg),
        borderTop: `${layoutAreas.navigation.borderWidth} solid ${getColorValue(layoutAreas.navigation.border)}`,
        zIndex: appConfig.navigation.zIndex,
        padding: `${appConfig.spacing.xs} 0`
      }
    : {
        backgroundColor: getColorValue(layoutAreas.navigation.bg),
        borderBottom: `${layoutAreas.navigation.borderWidth} solid ${getColorValue(layoutAreas.navigation.border)}`,
        padding: `${appConfig.spacing.sm} ${appConfig.spacing.md}`,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between'
      };

  const navItemsContainerStyle: React.CSSProperties = isMobile
    ? {
        display: 'grid',
        gridTemplateColumns: `repeat(${filteredItems.length}, 1fr)`,
        width: '100%',
        height: '100%'
      }
    : {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-evenly',
        flex: 1
      };

  const getNavLinkStyle = (isActive: boolean, isHovered: boolean): React.CSSProperties => ({
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: isMobile ? appConfig.spacing.xs : appConfig.spacing.sm,
    textDecoration: 'none',
    transition: appConfig.navigation.transition,
    backgroundColor: isHovered ? colorsConfig.black['700'] : 'transparent',
    color: isActive ? colorsConfig.text.primary : colorsConfig.text.secondary,
    transform:
      !isMobile && isHovered
        ? `scale(${appConfig.navigation.hoverScale})`
        : `scale(${appConfig.navigation.normalScale})`,
    minHeight: isMobile ? `${appConfig.responsive.touchMinSize}px` : undefined,
    borderRadius: isMobile ? undefined : appConfig.spacing.sm
  });

  const getIconContainerStyle = (isActive: boolean): React.CSSProperties => ({
    padding: isMobile ? appConfig.spacing.xs : appConfig.spacing.sm,
    borderRadius: appConfig.spacing.sm,
    backgroundColor: isActive ? colorsConfig.green['500'] : 'transparent',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  });

  const getIconStyle = (itemKey: string): React.CSSProperties => ({
    height: buttonConfig.nav.iconSize,
    width: buttonConfig.nav.iconSize,
    transform: itemKey === 'glaeubiger' ? appConfig.navigation.icon.rotateGlaeubiger : undefined
  });

  const renderNavItem = (item: NavItem) => {
    const Icon = iconMap[item.icon];
    const isHovered = hoveredKey === item.key;

    if (item.key === 'logout') {
      return (
        <button
          key={item.key}
          onClick={() => void handleLogout()}
          title={item.label}
          style={getNavLinkStyle(false, isHovered)}
          onMouseEnter={!isMobile ? () => setHoveredKey(item.key) : undefined}
          onMouseLeave={!isMobile ? () => setHoveredKey(null) : undefined}
        >
          <div style={getIconContainerStyle(false)}>{Icon && <Icon style={getIconStyle(item.key)} />}</div>
        </button>
      );
    }

    return (
      <NavLink
        key={item.key}
        to={item.path}
        title={item.label}
        style={({ isActive }) => getNavLinkStyle(isActive, isHovered)}
        onMouseEnter={!isMobile ? () => setHoveredKey(item.key) : undefined}
        onMouseLeave={!isMobile ? () => setHoveredKey(null) : undefined}
      >
        {({ isActive }) => (
          <div style={getIconContainerStyle(isActive)}>{Icon && <Icon style={getIconStyle(item.key)} />}</div>
        )}
      </NavLink>
    );
  };

  // ═══════════════════════════════════════════════════════
  // PAGE STYLES (Config: layout.areas.*)
  // ═══════════════════════════════════════════════════════
  const pageContainerStyle: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    minHeight: '100vh',
    backgroundColor: getColorValue(layoutAreas.content.bg),
    paddingBottom: isMobile ? appConfig.responsive.bottomNavPadding : undefined
  };

  const headerBarStyle: React.CSSProperties = {
    backgroundColor: getColorValue(layoutAreas.header.bg),
    borderBottom: `${layoutAreas.header.borderWidth} solid ${getColorValue(layoutAreas.header.border)}`,
    padding: isMobile ? appConfig.spacing.mobile.md : appConfig.spacing.md,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: appConfig.spacing.md
  };

  const titleStyle: React.CSSProperties = {
    fontSize: isMobile ? typographyConfig.fontSize.lg : typographyConfig.fontSize.xl,
    fontWeight: typographyConfig.fontWeight.bold,
    fontFamily: typographyConfig.fontFamily.base,
    color: colorsConfig.text.primary,
    margin: 0,
    display: 'flex',
    alignItems: 'center',
    gap: appConfig.spacing.sm
  };

  const contentStyle: React.CSSProperties = {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    overflow: 'hidden',
    padding: isMobile ? appConfig.spacing.mobile.md : appConfig.spacing.md,
    backgroundColor: getColorValue(layoutAreas.content.bg)
  };

  const footerStyle: React.CSSProperties = {
    backgroundColor: getColorValue(layoutAreas.footer.bg),
    borderTop: `${layoutAreas.footer.borderWidth} solid ${getColorValue(layoutAreas.footer.border)}`,
    borderRadius: layoutAreas.footer.borderRadius,
    padding: isMobile ? appConfig.spacing.mobile.md : appConfig.spacing.md
  };

  // Helper: Render Icon
  const renderIcon = () => {
    if (!icon) return null;
    if (typeof icon === 'string') {
      const IconComponent = iconMap[icon];
      return IconComponent ? <IconComponent size={24} /> : null;
    }
    return icon;
  };

  return (
    <div style={pageContainerStyle}>
      {/* 1. Navigation */}
      <nav style={navContainerStyle}>
        <div style={navItemsContainerStyle}>{filteredItems.map(renderNavItem)}</div>
      </nav>

      {/* 2. Header Bar mit Titel und Neu-Button */}
      <header style={headerBarStyle}>
        <h1 style={titleStyle}>
          {renderIcon()}
          {title}
        </h1>
        {actions && <div style={{ display: 'flex', gap: appConfig.spacing.sm }}>{actions}</div>}
      </header>

      {/* 3. Content (Tabelle) */}
      <main style={contentStyle}>{children}</main>

      {/* 4. Footer (Infobox) */}
      {footer && <footer style={footerStyle}>{footer}</footer>}
    </div>
  );
}
