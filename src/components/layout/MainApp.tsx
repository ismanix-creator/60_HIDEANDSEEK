/**
 * @file        MainApp.tsx
 * @description Main Application Layout (Navigation → Header → Content → Footer)
 * @version     0.3.0
 * @created     2026-01-17T02:12:44+01:00 CET
 * @updated     2026-01-17T02:12:44+01:00 CET
 * @author      Akki Scholze
 * @changelog
 *   0.3.0 - 2026-01-17 - Rebuild: Config-driven, nur Areas laden
 */

import { NavigationArea } from './areas/navigation';
import { HeaderArea } from './areas/header';
import { ContentArea } from './areas/content';
import { FooterArea } from './areas/footer';
import { appConfig } from '@/config';
import { useResponsive } from '@/hooks/useResponsive';
import type { CSSProperties, ReactNode } from 'react';

export interface MainAppProps {
  title?: string;
  children: ReactNode;
  footer?: ReactNode;
  footerColumns?: number;
}

export function MainApp({ title, children, footer, footerColumns = 2 }: MainAppProps) {
  const { isMobile } = useResponsive();

  const containerStyle: CSSProperties = {
    padding: appConfig.theme.spacing.layout?.areaPadding || '1rem'
  };

  const spacingStyle: CSSProperties = {
    marginTop: appConfig.theme.spacing.layout?.areaGap || '1rem'
  };

  const navStyle: CSSProperties = {
    backgroundColor: appConfig.theme.colors.bg?.navigation || '#000',
    borderBottom: `2px solid ${appConfig.theme.colors.border?.default || '#333'}`
  };

  const contentStyle: CSSProperties = {
    backgroundColor: appConfig.theme.colors.bg?.main || '#000',
    padding: appConfig.theme.spacing.layout?.areaPadding || '1rem'
  };

  const footerStyle: CSSProperties = {
    backgroundColor: appConfig.theme.colors.bg?.footer || '#000',
    padding: appConfig.theme.spacing.layout?.areaPadding || '1rem'
  };

  return (
    <div style={containerStyle}>
      <NavigationArea style={navStyle} isMobile={isMobile} />
      {title && (
        <div style={spacingStyle}>
          <HeaderArea title={title} isMobile={isMobile} />
        </div>
      )}
      <div style={spacingStyle}>
        <ContentArea style={contentStyle}>{children}</ContentArea>
      </div>
      {footer && (
        <div style={spacingStyle}>
          <FooterArea style={footerStyle} columns={footerColumns}>
            {footer}
          </FooterArea>
        </div>
      )}
    </div>
  );
}
