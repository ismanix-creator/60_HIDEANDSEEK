/**
 * @file        navigation.tsx
 * @description Navigationsbereich fuer PageLayout (Startpage-ready), rendert Nav-Items inkl. Logout
 * @version     0.5.1
 * @created     2026-01-11 16:20:00 CET
 * @updated     2026-01-17T11:37:15+01:00
 * @author      Akki Scholze
 *
 * @changelog
 *   0.5.1 - 2026-01-17 - Navigation-Fix: Festes 6-Spalten-Grid, quadratische Icons, Dashboard entfernt, Logout hinzugefügt
 *   0.4.0 - 2026-01-17 - Config-Pfade korrigiert: ui.layout.navigation, theme.spacing, ui.tokens, components.icon.nav
 *   0.3.0 - 2026-01-17 - onNavigate callback hinzugefuegt fuer Container-Orchestrierung
 *   0.2.0 - 2026-01-11 - Desktop: 6-Spalten-Grid, Padding/Gap/Höhe aus layout.areas.navigation
 *   0.1.0 - 2026-01-11 - Extraktion aus PageLayout, Navigation-Logik gekapselt
 */

import type { CSSProperties } from 'react';
import { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { Package, Users, HandCoins, Settings, UserCog, LogIn, LogOut } from 'lucide-react';
import type { NavItem } from '@/types/ui.types';
import { appConfig } from '@/config';
import { useAuth } from '@/context/AuthContext';

const colorsConfig = appConfig.theme.colors;

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
  onNavigate?: () => void;
}

type NavigationAreaConfig = {
  padding?: string;
  gap?: string;
  height?: string;
  minHeight?: string;
};

export function NavigationArea({ style, isMobile, onNavigate }: NavigationAreaProps) {
  const [hoveredKey, setHoveredKey] = useState<string | null>(null);
  const { isAuthenticated, logout } = useAuth();

  const navItems = appConfig.navigation.item as ReadonlyArray<NavItem>;

  const filteredItems = navItems.filter((item) => {
    if (item.key === 'login' && isAuthenticated) return false;
    if (item.key === 'logout' && !isAuthenticated) return false;
    return true;
  });

  const layoutNavigation = appConfig.ui.layout.navigation?.style as NavigationAreaConfig | undefined;
  const navPadding =
    layoutNavigation?.padding ??
    (isMobile
      ? `${appConfig.theme.spacing.layout.bodyInnerGap} 0`
      : `${appConfig.theme.spacing.layout.bodyInnerGap} ${appConfig.theme.spacing.layout.areaGap}`);
  const navGap =
    layoutNavigation?.gap ??
    (isMobile ? appConfig.theme.spacing.layout.bodyInnerGap : appConfig.theme.spacing.layout.areaGap);
  const navHeight = layoutNavigation?.height;
  const navMinHeight = layoutNavigation?.minHeight;

  const mergedNavStyle: CSSProperties = {
    ...style,
    padding: style.padding ?? navPadding,
    height: style.height ?? navHeight,
    minHeight: style.minHeight ?? navMinHeight
  };

  const navGridColumns = 6;

  const navItemsContainerStyle: CSSProperties = {
    display: 'grid',
    gridTemplateColumns: isMobile ? `repeat(${Math.max(filteredItems.length, 1)}, 1fr)` : 'repeat(6, 1fr)',
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
    padding: isMobile ? appConfig.theme.spacing.layout.bodyInnerGap : appConfig.theme.spacing.layout.bodyInnerGap,
    textDecoration: 'none',
    transition: appConfig.ui.tokens.transition.fast,
    backgroundColor: isHovered ? colorsConfig.black['700'] : colorsConfig.bg.transparent,
    color: isActive ? colorsConfig.text.active : colorsConfig.text.inactive,
    transform: !isMobile && isHovered ? 'scale(1.05)' : 'scale(1)',
    minHeight: isMobile ? appConfig.ui.tokens.size.touchMin : undefined,
    borderRadius: isMobile ? undefined : appConfig.theme.border.radius.navigation
  });

  const getIconContainerStyle = (isActive: boolean): CSSProperties => ({
    padding: isMobile ? appConfig.theme.spacing.layout.bodyInnerGap : appConfig.theme.spacing.layout.bodyInnerGap,
    borderRadius: appConfig.theme.border.radius.navigation,
    backgroundColor: isActive ? colorsConfig.green['500'] : colorsConfig.bg.transparent,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  });

  const getIconStyle = (itemKey: string): CSSProperties => ({
    height: appConfig.components.icon.nav.iconSize,
    width: appConfig.components.icon.nav.iconSize,
    aspectRatio: '1',
    transform: itemKey === 'glaeubiger' ? 'scaleX(-1)' : undefined
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
        onClick={onNavigate}
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
