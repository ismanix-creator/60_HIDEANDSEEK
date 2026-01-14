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
import { Package, Users, HandCoins, Settings, UserCog, LogIn, LogOut, ArrowLeft, LayoutDashboard } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { appConfig } from '@/config';

const { theme, components, layout } = appConfig;
const colorsConfig = theme.colors;
const typographyConfig = theme.typography;
const headerConfig = layout.header;
const buttonConfig = components.button;

const iconMap: Record<string, React.ElementType> = {
  package: Package,
  users: Users,
  'hand-coins': HandCoins,
  settings: Settings,
  'user-cog': UserCog,
  'log-in': LogIn,
  'log-out': LogOut,
  'layout-dashboard': LayoutDashboard
};

function getColorValue(colorPath: string): string {
  if (!colorPath || colorPath === 'transparent' || colorPath === 'none') {
    return 'transparent';
  }

  const trimmed = colorPath.trim();
  const tokenPath = trimmed.startsWith('{') && trimmed.endsWith('}') ? trimmed.slice(1, -1) : trimmed;
  const parts = tokenPath.split('.');

  if (parts.length === 2) {
    const [category, shade] = parts;
    const colorCategory = colorsConfig[category as keyof typeof colorsConfig];

    if (colorCategory && typeof colorCategory === 'object') {
      const resolved = (colorCategory as Record<string, string>)[shade];

      if (typeof resolved === 'string') {
        return resolved === trimmed ? resolved : getColorValue(resolved);
      }
    }
  }

  return trimmed;
}

export interface HeaderAreaProps {
  style: CSSProperties;
  title: string;
  icon?: string | ReactNode;
  actions?: ReactNode;
  isMobile: boolean;
  showBackButton?: boolean;
}

function renderIcon(icon?: string | ReactNode) {
  if (!icon) return null;
  if (typeof icon === 'string') {
    const IconComponent = iconMap[icon];
    return IconComponent ? <IconComponent size={24} /> : null;
  }
  return icon;
}

export function HeaderArea({ style, title, icon, actions, isMobile, showBackButton }: HeaderAreaProps) {
  const navigate = useNavigate();

  const backButtonStyle: CSSProperties = {
    backgroundColor: getColorValue(buttonConfig.back.bg),
    color: getColorValue(buttonConfig.back.icon),
    border: `1px solid ${getColorValue(buttonConfig.back.border)}`,
    borderRadius: buttonConfig.borderRadius,
    padding: headerConfig.padding,
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'all 0.2s ease',
    outline: 'none'
  };

  const titleStyle: CSSProperties = {
    fontSize: isMobile ? typographyConfig.fontSize.lg : headerConfig.fontSize,
    fontWeight: headerConfig.fontWeight,
    fontFamily: typographyConfig.fontFamily.base,
    color: getColorValue(colorsConfig.text.primary),
    margin: 0,
    display: 'flex',
    alignItems: 'center',
    gap: headerConfig.gap
  };

  const actionsStyle: CSSProperties = {
    display: 'flex',
    gap: headerConfig.gap,
    alignItems: 'center'
  };

  const handleBackClick = () => {
    navigate('/');
  };

  const handleBackButtonHover = (e: React.MouseEvent<HTMLButtonElement>, isHover: boolean) => {
    if (isHover) {
      e.currentTarget.style.backgroundColor = getColorValue(buttonConfig.back.hoverBg);
    } else {
      e.currentTarget.style.backgroundColor = getColorValue(buttonConfig.back.bg);
    }
  };

  return (
    <header style={style}>
      <div style={{ display: 'flex', alignItems: 'center', gap: headerConfig.gap }}>
        {showBackButton && (
          <button
            style={backButtonStyle}
            onClick={handleBackClick}
            onMouseEnter={(e) => handleBackButtonHover(e, true)}
            onMouseLeave={(e) => handleBackButtonHover(e, false)}
            aria-label="Zurück zum Dashboard"
          >
            <ArrowLeft size={buttonConfig.back.iconSize} />
          </button>
        )}
        <h1 style={titleStyle}>
          {renderIcon(icon)}
          {title}
        </h1>
      </div>
      {actions ? <div style={actionsStyle}>{actions}</div> : null}
    </header>
  );
}
