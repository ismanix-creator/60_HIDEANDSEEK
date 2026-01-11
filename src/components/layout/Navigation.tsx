/**
 * @file        Navigation.tsx
 * @description Haupt-Navigation - Responsive (ohne Auth)
 * @version     0.12.0
 * @created     2025-12-11 01:05:00 CET
 * @updated     2026-01-14 23:45:00 CET
 * @author      Akki Scholze
 *
 * @changelog
 *   0.12.0 - 2026-01-14 - Migration: Flache Config-Struktur (appConfig.colors, appConfig.button, etc.)
 *   0.11.0 - 2026-01-11 - Code-Cleanup: Redundanzen entfernt, Rendering-Logik konsolidiert
 *   0.10.2 - 2026-01-11 - Fix: async onClick handlers → wrap in arrow function
 *   0.10.1 - 2026-01-11 - Fix: colorsConfig.primary undefined → blue[600]
 *   0.10.0 - 2026-01-07 - Ohne Auth: useAuth entfernt, alle Nav-Items sichtbar
 */

import { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { Package, Users, HandCoins, Settings, UserCog, LogIn, LogOut } from 'lucide-react';
import type { NavItem } from '@/types/ui.types';
import { appConfig, navigationConfig } from '@/config';
import { useResponsive } from '@/hooks/useResponsive';
import { useAuth } from '@/context/AuthContext';

const colorsConfig = appConfig.colors;
const buttonConfig = appConfig.button;

const iconMap: Record<string, React.ElementType> = {
  package: Package,
  users: Users,
  'hand-coins': HandCoins,
  settings: Settings,
  'user-cog': UserCog,
  'log-in': LogIn,
  'log-out': LogOut
};

export function Navigation() {
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

  // Styles
  const navContainerStyle: React.CSSProperties = isMobile
    ? {
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        height: appConfig.responsive.bottomNavHeight,
        backgroundColor: colorsConfig.ui.backgroundAlt,
        borderTop: `${appConfig.navigation.borderWidth} solid ${colorsConfig.ui.border}`,
        zIndex: appConfig.navigation.zIndex,
        padding: `${appConfig.spacing.xs} 0`
      }
    : {
        backgroundColor: colorsConfig.ui.backgroundAlt,
        borderBottom: `${appConfig.navigation.borderWidth} solid ${colorsConfig.ui.border}`,
        padding: `${appConfig.spacing.sm} ${appConfig.spacing.md}`,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between'
      };

  const containerStyle: React.CSSProperties = isMobile
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
    backgroundColor: isHovered ? colorsConfig.black[700] : 'transparent',
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
    backgroundColor: isActive ? colorsConfig.green[500] : 'transparent',
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

  return (
    <nav style={navContainerStyle}>
      <div style={containerStyle}>{filteredItems.map(renderNavItem)}</div>
    </nav>
  );
}
