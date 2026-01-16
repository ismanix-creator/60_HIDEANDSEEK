/**
 * @file        header.tsx
 * @description Header-Area: Zeigt NUR den Titel-Text an
 * @version     0.2.0
 * @created     2026-01-11 16:20:00 CET
 * @updated     2026-01-15 15:00:00 CET
 * @author      Akki Scholze
 *
 * @changelog
 *   0.2.0 - 2026-01-15 - Architektur-Korrektur: NUR Titel, keine Icons/Actions/Navigation
 *   0.1.0 - 2026-01-11 - Extraktion aus PageLayout
 */

import type { CSSProperties } from 'react';
import { appConfig } from '@/config';

const { theme } = appConfig;
const colorsConfig = theme.colors;
const typographyConfig = theme.typography;

export interface HeaderAreaProps {
  title: string;
  isMobile: boolean;
}

export function HeaderArea({ title, isMobile }: HeaderAreaProps) {
  const headerStyle: CSSProperties = {
    backgroundColor: colorsConfig.bg.header,
    borderBottom: `2px solid ${colorsConfig.border.default}`,
    padding: theme.spacing.layout.areaPadding,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  };

  const titleStyle: CSSProperties = {
    fontSize: isMobile ? typographyConfig.fontSize.headerSubtitle : typographyConfig.fontSize.headerTitle,
    fontWeight: typographyConfig.fontWeight.semibold,
    fontFamily: typographyConfig.font.base,
    color: colorsConfig.text.active,
    margin: 0
  };

  return (
    <header style={headerStyle}>
      <h1 style={titleStyle}>{title}</h1>
    </header>
  );
}
