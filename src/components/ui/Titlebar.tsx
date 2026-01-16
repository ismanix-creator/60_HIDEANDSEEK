/**
 * @file        Titlebar.tsx
 * @description Config-driven Titlebar-Komponente mit Titel, optionalem Icon und Actions
 * @version     1.0.0
 * @created     2026-01-16 01:20:11 CET
 * @updated     2026-01-16 01:20:11 CET
 * @author      Akki Scholze
 *
 * @props
 *   title - Haupttitel
 *   subtitle - Optionaler Untertitel
 *   icon - Optionales Icon (ReactNode)
 *   actions - Optionale Action-Buttons (ReactNode)
 *   isMobile - Mobile-Ansicht
 *
 * @changelog
 *   1.0.0 - 2026-01-16 - Initial: 100% config-driven Titlebar
 */

import type { CSSProperties, ReactNode } from 'react';
import { appConfig } from '@/config';

const { theme } = appConfig;
const colorsConfig = theme.colors;
const typographyConfig = theme.typography;

export interface TitlebarProps {
  title: string;
  subtitle?: string;
  icon?: ReactNode;
  actions?: ReactNode;
  isMobile?: boolean;
}

export function Titlebar({ title, subtitle, icon, actions, isMobile = false }: TitlebarProps) {
  const containerStyle: CSSProperties = {
    backgroundColor: colorsConfig.bg.header,
    borderBottom: `${theme.border.sizes.normal} solid ${colorsConfig.border.default}`,
    padding: theme.spacing.layout.areaPadding,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: theme.spacing.layout.areaGap
  };

  const leftSectionStyle: CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    gap: theme.spacing.layout.areaGap,
    flex: 1
  };

  const textSectionStyle: CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    gap: theme.spacing.layout.bodyInnerGap
  };

  const titleStyle: CSSProperties = {
    fontSize: isMobile ? typographyConfig.fontSize.headerSubtitle : typographyConfig.fontSize.headerTitle,
    fontWeight: typographyConfig.fontWeight.semibold,
    fontFamily: typographyConfig.font.base,
    color: colorsConfig.text.active,
    margin: 0
  };

  const subtitleStyle: CSSProperties = {
    fontSize: typographyConfig.fontSize.headerMeta,
    fontWeight: typographyConfig.fontWeight.normal,
    fontFamily: typographyConfig.font.base,
    color: colorsConfig.text.hint,
    margin: 0
  };

  const actionsSectionStyle: CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    gap: theme.spacing.layout.areaGap
  };

  return (
    <div style={containerStyle}>
      <div style={leftSectionStyle}>
        {icon && <div>{icon}</div>}
        <div style={textSectionStyle}>
          <h1 style={titleStyle}>{title}</h1>
          {subtitle && <p style={subtitleStyle}>{subtitle}</p>}
        </div>
      </div>
      {actions && <div style={actionsSectionStyle}>{actions}</div>}
    </div>
  );
}
