/**
 * @file        dashboard.tsx
 * @description Dashboard Container mit 2-Modi-Logik (initial: header+navigation, full: alle 4 Areas)
 * @version     0.4.0
 * @created     2026-01-17T02:12:44+01:00
 * @updated     2026-01-17T02:28:23+01:00
 * @author      Akki Scholze
 * @changelog
 *   0.4.0 - 2026-01-17 - Container-Refactoring: 2-Modi-Logik, ContentArea + FooterArea Integration
 *   0.3.0 - 2026-01-17 - Rebuild: Config-driven, nur Areas laden
 */

import { useState } from 'react';
import { HeaderArea } from '@/components/layout/areas/header';
import { NavigationArea } from '@/components/layout/areas/navigation';
import { ContentArea } from '@/components/layout/areas/content';
import { FooterArea } from '@/components/layout/areas/footer';
import { appConfig } from '@/config';
import { useResponsive } from '@/hooks/useResponsive';
import type { CSSProperties } from 'react';

type ViewMode = 'initial' | 'full';

export function Dashboard() {
  const { isMobile } = useResponsive();
  const [viewMode, setViewMode] = useState<ViewMode>('initial');

  const areaGap = appConfig.theme.spacing.layout.areaGap;
  const areaPadding = appConfig.theme.spacing.layout.areaPadding;

  const containerStyle: CSSProperties = {
    display: 'grid',
    gap: areaGap,
    padding: areaPadding,
    minHeight: '100vh'
  };

  const navStyle: CSSProperties = {
    backgroundColor: appConfig.theme.colors.bg?.navigation || '#000',
    borderBottom: `2px solid ${appConfig.theme.colors.border?.default || '#333'}`
  };

  const contentStyle: CSSProperties = {
    backgroundColor: appConfig.theme.colors.bg?.content || '#1a1a1a',
    padding: areaPadding,
    minHeight: '400px'
  };

  const footerStyle: CSSProperties = {
    backgroundColor: appConfig.theme.colors.bg?.footer || '#000',
    borderTop: `2px solid ${appConfig.theme.colors.border?.default || '#333'}`,
    padding: areaPadding
  };

  const handleNavigate = () => {
    setViewMode('full');
  };

  if (viewMode === 'initial') {
    return (
      <div style={containerStyle}>
        <HeaderArea title="Dashboard" isMobile={isMobile} />
        <NavigationArea style={navStyle} isMobile={isMobile} onNavigate={handleNavigate} />
      </div>
    );
  }

  return (
    <div style={containerStyle}>
      <NavigationArea style={navStyle} isMobile={isMobile} onNavigate={handleNavigate} />
      <HeaderArea title="Dashboard" isMobile={isMobile} />
      <ContentArea style={contentStyle}>
        <p style={{ color: appConfig.theme.colors.text.primary }}>Content Area - Page wird hier geladen</p>
      </ContentArea>
      <FooterArea style={footerStyle} columns={3}>
        <div style={{ color: appConfig.theme.colors.text.secondary }}>Footer Left</div>
        <div style={{ color: appConfig.theme.colors.text.secondary }}>Footer Center</div>
        <div style={{ color: appConfig.theme.colors.text.secondary }}>Footer Right</div>
      </FooterArea>
    </div>
  );
}
