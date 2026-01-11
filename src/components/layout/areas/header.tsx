/**
 * @file        header.tsx
 * @description Header-Bereich fuer PageLayout (Startpage-ready), zeigt Titel/Icon/Actions
 * @version     0.1.0
 * @created     2026-01-11 16:20:00 CET
 * @updated     2026-01-11 16:20:00 CET
 * @author      Akki Scholze
 *
 * @changelog
 *   0.1.0 - 2026-01-11 - Extraktion aus PageLayout, Header-Rendering gekapselt
 */

import type { CSSProperties, ReactNode } from 'react';
import { Package, Users, HandCoins, Settings, UserCog, LogIn, LogOut } from 'lucide-react';
import { appConfig } from '@/config';

const colorsConfig = appConfig.colors;
const typographyConfig = appConfig.typography;
const pageHeaderConfig = appConfig.pageHeader;

const iconMap: Record<string, React.ElementType> = {
  package: Package,
  users: Users,
  'hand-coins': HandCoins,
  settings: Settings,
  'user-cog': UserCog,
  'log-in': LogIn,
  'log-out': LogOut
};

export interface HeaderAreaProps {
  style: CSSProperties;
  title: string;
  icon?: string | ReactNode;
  actions?: ReactNode;
  isMobile: boolean;
}

function renderIcon(icon?: string | ReactNode) {
  if (!icon) return null;
  if (typeof icon === 'string') {
    const IconComponent = iconMap[icon];
    return IconComponent ? <IconComponent size={24} /> : null;
  }
  return icon;
}

export function HeaderArea({ style, title, icon, actions, isMobile }: HeaderAreaProps) {
  const titleStyle: CSSProperties = {
    fontSize: isMobile ? typographyConfig.fontSize.lg : pageHeaderConfig.button.fontSize,
    fontWeight: pageHeaderConfig.button.fontWeight,
    fontFamily: typographyConfig.fontFamily.base,
    color: colorsConfig.text.primary,
    margin: 0,
    display: 'flex',
    alignItems: 'center',
    gap: appConfig.spacing.sm
  };

  const actionsStyle: CSSProperties = {
    display: 'flex',
    gap: appConfig.spacing.lg
  };

  return (
    <header style={style}>
      <h1 style={titleStyle}>
        {renderIcon(icon)}
        {title}
      </h1>
      {actions ? <div style={actionsStyle}>{actions}</div> : null}
    </header>
  );
}
