/**
 * @file        DashboardPage.tsx
 * @description Dashboard Layout (Header → Navigation)
 * @version     0.3.0
 * @created     2026-01-17T02:12:44+01:00 CET
 * @updated     2026-01-17T02:12:44+01:00 CET
 * @author      Akki Scholze
 * @changelog
 *   0.3.0 - 2026-01-17 - Rebuild: Config-driven, nur Areas laden
 */

import { HeaderArea } from '@/components/layout/areas/header';
import { NavigationArea } from '@/components/layout/areas/navigation';
import { appConfig } from '@/config';
import { useResponsive } from '@/hooks/useResponsive';
import type { CSSProperties } from 'react';

export function DashboardPage() {
  const { isMobile } = useResponsive();
  
  const pageStyle: CSSProperties = {
    padding: appConfig.theme.spacing.layout?.areaPadding || '1rem'
  };

  const spacingStyle: CSSProperties = {
    marginTop: appConfig.theme.spacing.layout?.areaGap || '1rem'
  };

  const navStyle: CSSProperties = {
    backgroundColor: appConfig.theme.colors.bg?.navigation || '#000',
    borderBottom: `2px solid ${appConfig.theme.colors.border?.default || '#333'}`
  };
  
  return (
    <div style={pageStyle}>
      <HeaderArea title="Dashboard" isMobile={isMobile} />
      <div style={spacingStyle}>
        <NavigationArea style={navStyle} isMobile={isMobile} />
      </div>
    </div>
  );
}
