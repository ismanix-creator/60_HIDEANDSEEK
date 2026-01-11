/**
 * @file        Navigation.tsx
 * @description Haupt-Navigation - Responsive (ohne Auth)
 * @version     0.10.2
 * @created     2025-12-11 01:05:00 CET
 * @updated     2026-01-11 13:30:00 CET
 * @author      Akki Scholze
 *
 * @changelog
 *   0.10.2 - 2026-01-11 - Fix: async onClick handlers → wrap in arrow function
 *   0.10.1 - 2026-01-11 - Fix: colorsConfig.primary undefined → blue[600]
 *   0.10.0 - 2026-01-07 - Ohne Auth: useAuth entfernt, alle Nav-Items sichtbar
 *   0.9.0 - 2025-12-14 - Auth-Integration: Logout-Button, Settings-Link, rollenbasierte Navigation
 *   0.8.0 - 2025-12-14 - Responsive: Top-Bar (Desktop) / Bottom-Bar (Mobile)
 *   0.7.0 - 2025-12-12 - Navigationseinträge aus config.toml (navigationConfig)
 *   0.6.0 - 2025-12-12 - Config-Driven: Hardcodes durch iconsConfig ersetzt
 *   0.5.0 - 2025-12-11 - Texte unter Navigationsbuttons entfernt (nur Icons)
 *   0.4.0 - 2025-12-11 - 4-Spalten-Grid, Seitentitel unter aktivem Button
 *   0.3.0 - 2025-12-11 - Navigationsbuttons dauerhaft sichtbar (kein Hover-Ausblenden mehr)
 *   0.2.0 - 2025-12-11 - SEASIDE Dark Theme, Config-Driven Colors
 *   0.1.0 - 2025-12-11 - Initial version
 */

// ═══════════════════════════════════════════════════════
// IMPORTS
// ═══════════════════════════════════════════════════════
import { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { Package, Users, HandCoins, Settings, UserCog, LogIn, LogOut } from 'lucide-react';
import type { NavItem } from '@/types/ui.types';
import { appConfig, navigationConfig } from '@/config';
import { useResponsive } from '@/hooks/useResponsive';
import { useAuth } from '@/context/AuthContext';

const colorsConfig = appConfig.theme.colors;
const iconsConfig = appConfig.theme.icons;

// ═══════════════════════════════════════════════════════
// NAVIGATION ITEMS
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

export function Navigation() {
  const [hoveredKey, setHoveredKey] = useState<string | null>(null);
  const { isMobile } = useResponsive();
  const { isAuthenticated, logout } = useAuth();

  const navItems = navigationConfig.items as ReadonlyArray<NavItem>;

  // Filter: Wenn eingeloggt, zeige Logout statt Login
  const filteredItems = navItems.filter((item) => {
    if (item.key === 'login' && isAuthenticated) return false;
    if (item.key === 'logout' && !isAuthenticated) return false;
    return true;
  });

  // Logout Handler
  const handleLogout = async () => {
    await logout();
    window.location.href = '/';
  };

  // ═══════════════════════════════════════════════════════
  // STYLES
  // ═══════════════════════════════════════════════════════

  // Nav Container: Top-Bar (Desktop) oder Bottom-Bar (Mobile)
  const navContainerStyle: React.CSSProperties = isMobile
    ? {
        // MOBILE: Fixed Bottom-Bar
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        height: appConfig.theme.responsive.bottomNavHeight,
        backgroundColor: colorsConfig.ui.backgroundAlt,
        borderTop: `1px solid ${colorsConfig.ui.border}`,
        zIndex: 1000,
        padding: `${appConfig.theme.spacing.xs} 0`
      }
    : {
        // DESKTOP: Top-Bar
        backgroundColor: colorsConfig.ui.backgroundAlt,
        borderBottom: `1px solid ${colorsConfig.ui.border}`,
        padding: `${appConfig.theme.spacing.sm} ${appConfig.theme.spacing.md}`,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between'
      };

  // Grid Container für Mobile
  const mobileGridStyle: React.CSSProperties = {
    display: 'grid',
    gridTemplateColumns: `repeat(${filteredItems.length}, 1fr)`,
    width: '100%',
    height: '100%'
  };

  // Desktop Layout - Nav-Buttons gleichmäßig verteilt
  const desktopNavStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-evenly',
    flex: 1
  };

  // NavLink Style Generator
  const getNavLinkStyle = (isActive: boolean, isHovered: boolean): React.CSSProperties => ({
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: isMobile ? appConfig.theme.spacing.xs : appConfig.theme.spacing.sm,
    textDecoration: 'none',
    transition: 'background-color 0.15s ease, transform 0.15s ease',
    backgroundColor: isHovered ? colorsConfig.gray[200] : 'transparent',
    color: isActive ? colorsConfig.text.primary : colorsConfig.text.secondary,
    transform: !isMobile && isHovered ? 'scale(1.05)' : 'scale(1)',
    minHeight: isMobile ? `${appConfig.theme.responsive.touchMinSize}px` : undefined,
    borderRadius: isMobile ? undefined : appConfig.theme.spacing.sm
  });

  // Icon Container Style
  const getIconContainerStyle = (isActive: boolean): React.CSSProperties => ({
    padding: isMobile ? appConfig.theme.spacing.xs : appConfig.theme.spacing.sm,
    borderRadius: appConfig.theme.spacing.sm,
    backgroundColor: isActive ? colorsConfig.blue[600] : 'transparent',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  });

  // Icon Size
  const iconSize = isMobile ? iconsConfig.sizes.xl : iconsConfig.sizes.lg;

  // ═══════════════════════════════════════════════════════
  // RENDER: MOBILE
  // ═══════════════════════════════════════════════════════
  if (isMobile) {
    return (
      <nav style={navContainerStyle}>
        <div style={mobileGridStyle}>
          {/* Navigation Items */}
          {filteredItems.map((item) => {
            const Icon = iconMap[item.icon];
            const isHovered = hoveredKey === item.key;

            // Logout als Button statt NavLink
            if (item.key === 'logout') {
              return (
                <button
                  key={item.key}
                  onClick={() => void handleLogout()}
                  title={item.label}
                  style={getNavLinkStyle(false, isHovered)}
                >
                  <div style={getIconContainerStyle(false)}>
                    {Icon && <Icon style={{ height: iconSize, width: iconSize }} />}
                  </div>
                </button>
              );
            }

            return (
              <NavLink
                key={item.key}
                to={item.path}
                title={item.label}
                style={({ isActive }) => getNavLinkStyle(isActive, isHovered)}
              >
                {({ isActive }) => (
                  <div style={getIconContainerStyle(isActive)}>
                    {Icon && (
                      <Icon
                        style={{
                          height: iconSize,
                          width: iconSize,
                          transform: item.key === 'glaeubiger' ? 'rotate(180deg) scaleX(-1)' : undefined
                        }}
                      />
                    )}
                  </div>
                )}
              </NavLink>
            );
          })}
        </div>
      </nav>
    );
  }

  // ═══════════════════════════════════════════════════════
  // RENDER: DESKTOP
  // ═══════════════════════════════════════════════════════
  return (
    <nav style={navContainerStyle}>
      {/* Navigation Items */}
      <div style={desktopNavStyle}>
        {filteredItems.map((item) => {
          const Icon = iconMap[item.icon];
          const isHovered = hoveredKey === item.key;

          // Logout als Button statt NavLink
          if (item.key === 'logout') {
            return (
              <button
                key={item.key}
                onClick={() => void handleLogout()}
                title={item.label}
                style={getNavLinkStyle(false, isHovered)}
                onMouseEnter={() => setHoveredKey(item.key)}
                onMouseLeave={() => setHoveredKey(null)}
              >
                <div style={getIconContainerStyle(false)}>
                  {Icon && <Icon style={{ height: iconSize, width: iconSize }} />}
                </div>
              </button>
            );
          }

          return (
            <NavLink
              key={item.key}
              to={item.path}
              title={item.label}
              style={({ isActive }) => getNavLinkStyle(isActive, isHovered)}
              onMouseEnter={() => setHoveredKey(item.key)}
              onMouseLeave={() => setHoveredKey(null)}
            >
              {({ isActive }) => (
                <div style={getIconContainerStyle(isActive)}>
                  {Icon && (
                    <Icon
                      style={{
                        height: iconSize,
                        width: iconSize,
                        transform: item.key === 'glaeubiger' ? 'rotate(180deg) scaleX(-1)' : undefined
                      }}
                    />
                  )}
                </div>
              )}
            </NavLink>
          );
        })}
      </div>
    </nav>
  );
}
