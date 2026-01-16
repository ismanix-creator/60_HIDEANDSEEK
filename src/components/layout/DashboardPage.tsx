/**
 * @file        DashboardPage.tsx
 * @description Dashboard mit horizontalen Navigation Cards (100% config-driven)
 * @version     0.2.0
 * @created     2026-01-13 12:00:00 CET
 * @updated     2026-01-13 13:30:00 CET
 * @author      Akki Scholze
 *
 * @changelog
 *   0.2.0 - 2026-01-13 - Horizontal Layout, 120x120px Cards, 80px Icons, alle Werte aus pages.dashboard.card Config
 *   0.1.0 - 2026-01-13 - Initial implementation
 */

import { useNavigate } from 'react-router-dom';
import { MainApp } from '@/components/layout/mainapp';
import { appConfig } from '@/config';
import type { CSSProperties } from 'react';
import { Package, Users, HandCoins, Settings } from 'lucide-react';

const { theme, components, pages, navigation: navConfig } = appConfig;

function getColorValue(colorPath: string): string {
  if (!colorPath || colorPath === 'transparent' || colorPath === 'none') {
    return 'transparent';
  }

  const trimmed = colorPath.trim();
  const tokenPath = trimmed.startsWith('{') && trimmed.endsWith('}') ? trimmed.slice(1, -1) : trimmed;
  const parts = tokenPath.split('.');

  if (parts.length === 2) {
    const [category, shade] = parts;
    const colorCategory = theme.colors[category as keyof typeof theme.colors];

    if (colorCategory && typeof colorCategory === 'object') {
      const resolved = (colorCategory as Record<string, string>)[shade];

      if (typeof resolved === 'string') {
        return resolved === trimmed ? resolved : getColorValue(resolved);
      }
    }
  }

  return trimmed;
}

interface NavigationCard {
  key: string;
  label: string;
  path: string;
  icon: string;
}

const iconMap = {
  package: Package,
  users: Users,
  'hand-coins': HandCoins,
  settings: Settings
};

export function DashboardPage() {
  const navigate = useNavigate();

  const dashboardConfig = pages.dashboard.card;

  // Filter nur die Haupt-Navigation-Items (ohne logout)
  const mainNavItems: NavigationCard[] = navConfig.items
    .filter((item) => item.key !== 'logout')
    .map((item) => ({
      key: item.key,
      label: item.label,
      path: item.path,
      icon: item.icon
    }));

  const cardStyle: CSSProperties = {
    backgroundColor: getColorValue(components.infobox.panel.bg),
    border: `1px solid ${getColorValue(components.infobox.panel.border)}`,
    borderRadius: components.infobox.panel.borderRadius,
    padding: dashboardConfig.padding,
    cursor: 'pointer',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'all 0.2s ease',
    width: '240px',
    height: '240px',
    flexShrink: 0
  };

  const cardHoverStyle = {
    backgroundColor: getColorValue(components.button.nav.hoverBg),
    transform: 'translateY(-4px)',
    boxShadow: theme.shadows.lg
  };

  const iconStyle: CSSProperties = {
    color: getColorValue(components.button.nav.icon),
    width: '120px',
    height: '120px'
  };

  const labelStyle: CSSProperties = {
    color: getColorValue(theme.colors.text.primary),
    fontSize: theme.typography.fontSize.sm,
    fontWeight: theme.typography.fontWeight.medium,
    textAlign: 'center',
    marginTop: '0.5rem'
  };

  const containerStyle: CSSProperties = {
    display: 'flex',
    flexDirection: 'row',
    gap: dashboardConfig.gap,
    padding: dashboardConfig.padding,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%'
  };

  return (
    <PageLayout title={pages.titles.dashboard} icon="layout-dashboard" hideNavigation={true}>
      <div style={containerStyle}>
        {mainNavItems.map((item) => {
          const IconComponent = iconMap[item.icon as keyof typeof iconMap] || Package;

          return (
            <div
              key={item.key}
              style={cardStyle}
              onClick={() => void navigate(item.path)}
              onMouseEnter={(e) => {
                Object.assign(e.currentTarget.style, cardHoverStyle);
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = getColorValue(components.infobox.panel.bg);
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = 'none';
              }}
            >
              <IconComponent style={iconStyle} />
              <span style={labelStyle}>{item.label}</span>
            </div>
          );
        })}
      </div>
    </PageLayout>
  );
}
