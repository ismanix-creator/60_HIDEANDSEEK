/**
 * @file        useResponsive.ts
 * @description Custom Hook für Responsive Breakpoint Detection
 * @version     0.4.0
 * @created     2026-01-07 01:18:02 CET
 * @updated     2026-01-17T03:19:28+01:00
 * @author      Akki Scholze
 *
 * @usage
 *   const { isMobile, isTablet, isDesktop } = useResponsive();
 *
 * @changelog
 *   0.4.0 - 2026-01-17T03:19:28+01:00 - Fixed: Config-Zugriff auf theme.breakpoints (layout.rules existiert nicht)
 *   0.3.0 - 2026-01-11 18:35:00 CET - Fixed: Config-Zugriff auf appConfig.layout.breakpoints statt appConfig.layout.breakpoints (Config-Struktur-Migration)
 *   0.2.0 - 2026-01-09 - Direct appConfig.layout.breakpoints access (breakpointsConfig eliminiert)
 *   0.1.0 - 2026-01-07 - Initial version mit Mobile/Tablet/Desktop Detection
 */

import { useState, useEffect } from 'react';
import { appConfig } from '@/config';

export interface ResponsiveState {
  isMobile: boolean;
  isTablet: boolean;
  isDesktop: boolean;
  width: number;
}

/**
 * Hook für Responsive Breakpoint Detection
 * Verwendet theme.breakpoints für Breakpoint-Werte
 */
export function useResponsive(): ResponsiveState {
  // Parse breakpoints from config (smartphoneMaxWidth="767px", pcMinWidth="768px")
  const mobileMax = parseInt(appConfig?.theme?.breakpoints?.smartphoneMaxWidth || '767px', 10);
  const pcMin = parseInt(appConfig?.theme?.breakpoints?.pcMinWidth || '768px', 10);

  const [state, setState] = useState<ResponsiveState>(() => {
    const width = typeof window !== 'undefined' ? window.innerWidth : 1024;
    return {
      width,
      isMobile: width <= mobileMax,
      isTablet: width > mobileMax && width < pcMin + 256, // ~1024px tablet threshold
      isDesktop: width >= pcMin + 256
    };
  });

  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      setState({
        width,
        isMobile: width <= mobileMax,
        isTablet: width > mobileMax && width < pcMin + 256,
        isDesktop: width >= pcMin + 256
      });
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [mobileMax, pcMin]);

  return state;
}
