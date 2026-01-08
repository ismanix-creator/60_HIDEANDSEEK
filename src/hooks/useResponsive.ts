/**
 * @file        useResponsive.ts
 * @description Custom Hook für Responsive Breakpoint Detection
 * @version     0.1.0
 * @created     2026-01-07 01:18:02 CET
 * @updated     2026-01-07 01:18:02 CET
 * @author      frontend-entwickler
 *
 * @usage
 *   const { isMobile, isTablet, isDesktop } = useResponsive();
 *
 * @changelog
 *   0.1.0 - 2026-01-07 - Initial version mit Mobile/Tablet/Desktop Detection
 */

import { useState, useEffect } from 'react';
import { breakpointsConfig } from '@/config';

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
      isMobile: width < breakpointsConfig.mobile,
      isTablet: width >= breakpointsConfig.mobile && width < breakpointsConfig.desktop,
      isDesktop: width >= breakpointsConfig.desktop
    };
  });

  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      setState({
        width,
        isMobile: width < breakpointsConfig.mobile,
        isTablet: width >= breakpointsConfig.mobile && width < breakpointsConfig.desktop,
        isDesktop: width >= breakpointsConfig.desktop
      });
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return state;
}
