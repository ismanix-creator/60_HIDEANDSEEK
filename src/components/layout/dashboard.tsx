/**
 * @file        dashboard.tsx
 * @description Dashboard Layout: Header → Navigation, 100% config-driven
 * @version     0.4.0
 * @created     2026-01-13 12:00:00 CET
 * @updated     2026-01-17 02:18:57 CET
 * @author      Akki Scholze
 *
 * @changelog
 *   0.4.0 - 2026-01-17 - Clean Slate: Kompletter Neuaufbau, Header → Navigation, Padding aus config
 *   0.3.0 - 2026-01-17 - Refactor: Layout auf HeaderArea → NavigationArea umgestellt (Task A05)
 *   0.2.0 - 2026-01-13 - Horizontal Layout, 120x120px Cards, 80px Icons, alle Werte aus pages.dashboard.card Config
 *   0.1.0 - 2026-01-13 - Initial implementation
 */

import type { CSSProperties } from 'react';
import { HeaderArea } from './areas/header';
import { NavigationArea } from './areas/navigation';
import { appConfig } from '@/config';
import { useResponsive } from '@/hooks/useResponsive';

export function Dashboard() {
  const { isMobile } = useResponsive();
  const areaGap = appConfig.theme.spacing.layout.areaGap;

  const containerStyle: CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    minHeight: '100vh',
    backgroundColor: appConfig.theme.colors.bg.main
  };

  const headerContainerStyle: CSSProperties = {
    backgroundColor: appConfig.theme.colors.bg.header,
    borderBottom: `${appConfig.theme.border.sizes.normal} solid ${appConfig.theme.colors.border.default}`,
    padding: appConfig.theme.spacing.layout.areaPadding
  };

  const navigationContainerStyle: CSSProperties = {
    backgroundColor: appConfig.theme.colors.bg.navigation,
    borderBottom: `${appConfig.theme.border.sizes.normal} solid ${appConfig.theme.colors.border.default}`,
    padding: appConfig.theme.spacing.layout.areaPadding,
    marginTop: areaGap
  };

  return (
    <div style={containerStyle}>
      <HeaderArea title={appConfig.ui.titles.dashboard} isMobile={isMobile} />
      <div style={{ paddingTop: areaGap }}>
        <NavigationArea style={navigationContainerStyle} isMobile={isMobile} />
      </div>
    </div>
  );
}
