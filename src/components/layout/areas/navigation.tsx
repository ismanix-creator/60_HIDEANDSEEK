/**
 * @file        navigation.tsx
 * @description Navigationsbereich fuer PageLayout (Startpage-ready), rendert Nav-Items inkl. Logout
 * @version     0.2.0
 * @created     2026-01-11 16:20:00 CET
 * @updated     2026-01-11 23:59:00 CET
 * @author      Akki Scholze
 *
 * @changelog
 *   0.2.0 - 2026-01-11 - Desktop: 6-Spalten-Grid, Padding/Gap/Höhe aus layout.areas.navigation
 *   0.1.0 - 2026-01-11 - Extraktion aus PageLayout, Navigation-Logik gekapselt
 */

import type { CSSProperties } from 'react';
import { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { Package, Users, HandCoins, Settings, UserCog, LogIn, LogOut } from 'lucide-react';
import type { NavItem } from '@/types/ui.types';
import { appConfig, navigationConfig } from '@/config';
import { useAuth } from '@/context/AuthContext';

const colorsConfig = appConfig.theme.colors;
const buttonConfig = appConfig.components.button;

const iconMap: Record<string, React.ElementType> = {
  package: Package,
  users: Users,
  'hand-coins': HandCoins,
  settings: Settings,
  'user-cog': UserCog,
  'log-in': LogIn,
  'log-out': LogOut
};

export interface NavigationAreaProps {
  style: CSSProperties;
  isMobile: boolean;
}

type NavigationAreaConfig = {
  padding?: string;
  gap?: string;
  height?: string;
  minHeight?: string;
};

export function NavigationArea({ style, isMobile }: NavigationAreaProps) {
  const [hoveredKey, setHoveredKey] = useState<string | null>(null);
  const { isAuthenticated, logout } = useAuth();

  const navItems = navigationConfig.items as ReadonlyArray<NavItem>;

  const filteredItems = navItems.filter((item) => {
    if (item.key === 'login' && isAuthenticated) return false;
    if (item.key === 'logout' && !isAuthenticated) return false;
    return true;
  });

  const layoutNavigation = appConfig.layout.navigation as NavigationAreaConfig;
  const navPadding =
    layoutNavigation?.padding ??
    (isMobile ? `${appConfig.theme.spacing.compact} 0` : `${appConfig.theme.spacing.element_gap} ${appConfig.theme.spacing.content_gap}`);
  const navGap = layoutNavigation?.gap ?? (isMobile ? appConfig.theme.spacing.compact : appConfig.theme.spacing.content_gap);
  const navHeight = layoutNavigation?.height;
  const navMinHeight = layoutNavigation?.minHeight;

  const mergedNavStyle: CSSProperties = {
    ...style,
    padding: style.padding ?? navPadding,
    height: style.height ?? navHeight,
    minHeight: style.minHeight ?? navMinHeight
  };

  const navGridColumns = isMobile ? Math.max(filteredItems.length, 1) : 6;

  const navItemsContainerStyle: CSSProperties = {
    display: 'grid',
    gridTemplateColumns: `repeat(${navGridColumns}, 1fr)`,
    width: '100%',
    height: '100%',
    gap: navGap,
    alignItems: 'center'
  };

  const getNavLinkStyle = (isActive: boolean, isHovered: boolean): CSSProperties => ({
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: isMobile ? appConfig.theme.spacing.compact : appConfig.theme.spacing.element_gap,
    textDecoration: 'none',
    transition: appConfig.navigation.transition,
    backgroundColor: isHovered ? colorsConfig.black['700'] : 'transparent',
    color: isActive ? colorsConfig.text.primary : colorsConfig.text.secondary,
    transform:
      !isMobile && isHovered
        ? `scale(${appConfig.navigation.hoverScale})`
        : `scale(${appConfig.navigation.normalScale})`,
    minHeight: isMobile ? `${appConfig.layout.rules.touchMinSizePx}px` : undefined,
    borderRadius: isMobile ? undefined : appConfig.theme.spacing.element_gap
  });

  const getIconContainerStyle = (isActive: boolean): CSSProperties => ({
    padding: isMobile ? appConfig.theme.spacing.compact : appConfig.theme.spacing.element_gap,
    borderRadius: appConfig.theme.spacing.element_gap,
    backgroundColor: isActive ? colorsConfig.green['500'] : 'transparent',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  });

  const getIconStyle = (itemKey: string): CSSProperties => ({
    height: buttonConfig.nav.iconSize,
    width: buttonConfig.nav.iconSize,
    transform: itemKey === 'glaeubiger' ? appConfig.navigation.icon.rotateGlaeubiger : undefined
  });

  const handleLogout = async () => {
    await logout();
    window.location.href = '/';
  };

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

  return (
    <nav style={mergedNavStyle}>
      <div style={navItemsContainerStyle}>{filteredItems.map(renderNavItem)}</div>
    </nav>
  );
}
