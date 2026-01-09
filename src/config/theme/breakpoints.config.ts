/**
 * @file        breakpoints.config.ts
 * @description Breakpoint-System (derived-only)
 * @version     2.0.0
 * @created     2026-01-06 19:14:38 CET
 * @updated     2026-01-09 20:37:39 CET
 * @changelog
 *   - 2.0.0 (2026-01-09 20:37:39): Reduziert auf derived-only (Phase 2.1.7)
 *   - 1.0.0 (2026-01-06): Initial authored values
 */

import { appConfig } from '@/config';

type BreakpointKey = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'xxl';

/**
 * Breakpoint-System mit allen Werten aus config.toml
 * Authored values sind nun in appConfig.theme.breakpoints
 * Diese Datei enthält nur noch derived logic (Media-Query-Builder, Conversions)
 */
export const breakpointsConfig = {
  // Base breakpoint values aus config.toml
  xs: appConfig.theme.breakpoints.xs,
  sm: appConfig.theme.breakpoints.sm,
  md: appConfig.theme.breakpoints.md,
  lg: appConfig.theme.breakpoints.lg,
  xl: appConfig.theme.breakpoints.xl,
  xxl: appConfig.theme.breakpoints.xxl,
  
  // Mobile/Desktop values aus config.toml
  mobile: appConfig.theme.breakpoints.mobile,
  desktop: appConfig.theme.breakpoints.desktop,
  mobileMaxWidth: appConfig.theme.breakpoints.mobile,
  
  // Touch-Mindestgröße aus theme.responsive
  touchMinSize: appConfig.theme.responsive.touchMinSize,
  
  // Derived: Numeric values (px string → number)
  values: {
    sm: parseInt(appConfig.theme.breakpoints.sm),
    md: parseInt(appConfig.theme.breakpoints.md),
    lg: parseInt(appConfig.theme.breakpoints.lg),
    xl: parseInt(appConfig.theme.breakpoints.xl),
    '2xl': parseInt(appConfig.theme.breakpoints.xxl),
  },
  
  // Derived: Media Query Builder
  mediaQueries: {
    mobile: `(max-width: ${appConfig.theme.breakpoints.mobile}px)`,
    tablet: `(min-width: ${parseInt(appConfig.theme.breakpoints.md)}px) and (max-width: ${parseInt(appConfig.theme.breakpoints.lg) - 1}px)`,
    desktop: `(min-width: ${appConfig.theme.breakpoints.desktop}px)`,
    samsungS24: `(max-width: ${appConfig.theme.breakpoints.devices.samsungS24.width}px)`,
    iPhone15: `(min-width: ${appConfig.theme.breakpoints.devices.iPhone15.width - 1}px) and (max-width: ${appConfig.theme.breakpoints.devices.iPhone15.width}px)`,
    surface7: `(min-width: ${appConfig.theme.breakpoints.devices.surface7.width}px)`,
  },
  
  // Device specs aus config.toml
  devices: appConfig.theme.breakpoints.devices,
  
  // Derived: Helper functions für Media Queries
  up: (size: BreakpointKey) => 
    `@media (min-width: ${appConfig.theme.breakpoints[size]})`,
  
  down: (size: BreakpointKey) => 
    `@media (max-width: ${appConfig.theme.breakpoints[size]})`,
  
  between: (min: BreakpointKey, max: BreakpointKey) =>
    `@media (min-width: ${appConfig.theme.breakpoints[min]}) and (max-width: ${appConfig.theme.breakpoints[max]})`,
  
  // Derived: px → number conversion
  toNumber: (size: BreakpointKey) => 
    parseInt(appConfig.theme.breakpoints[size]),
} as const;
