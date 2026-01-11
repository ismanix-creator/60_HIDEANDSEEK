/**
 * @file        useResponsive.ts
 * @description Custom Hook für Responsive Breakpoint Detection
 * @version     0.3.0
 * @created     2026-01-07 01:18:02 CET
 * @updated     2026-01-11 18:35:00 CET
 * @author      Akki Scholze
 *
 * @usage
 *   const { isMobile, isTablet, isDesktop } = useResponsive();
 *
 * @changelog
 *   0.3.0 - 2026-01-11 18:35:00 CET - Fixed: Config-Zugriff auf appConfig.breakpoints statt appConfig.breakpoints (Config-Struktur-Migration)
 *   0.2.0 - 2026-01-09 - Direct appConfig.breakpoints access (breakpointsConfig eliminiert)
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
 * Verwendet breakpointsConfig für Breakpoint-Werte
 */
export function useResponsive(): ResponsiveState {
  const [state, setState] = useState<ResponsiveState>(() => {
    const width = typeof window !== 'undefined' ? window.innerWidth : 1024;
    return {
      width,
      isMobile: width < appConfig.breakpoints.mobile,
      isTablet: width >= appConfig.breakpoints.mobile && width < appConfig.breakpoints.desktop,
      isDesktop: width >= appConfig.breakpoints.desktop
    };
  });

  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      setState({
        width,
        isMobile: width < appConfig.breakpoints.mobile,
        isTablet: width >= appConfig.breakpoints.mobile && width < appConfig.breakpoints.desktop,
        isDesktop: width >= appConfig.breakpoints.desktop
      });
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return state;
}
