/**
 * @file        spacing.config.ts
 * @description Spacing-System (derived-only)
 * @version     2.0.0
 * @created     2026-01-06 19:14:38 CET
 * @updated     2026-01-09 20:37:01 CET
 * @changelog
 *   - 2.0.0 (2026-01-09 20:37:01): Reduziert auf derived-only (Phase 2.1.6)
 *   - 1.0.0 (2026-01-06): Initial authored values
 */

import { appConfig } from '@/config';

/**
 * Spacing-System mit allen Werten aus config.toml
 * Authored values sind nun in appConfig.theme.spacing
 * Diese Datei enthält nur noch derived logic
 */
export const spacingConfig = {
  // Base spacing values aus config.toml
  ...appConfig.theme.spacing,
  
  // Backwards compatibility aliases (falls benötigt)
  base: {
    xxs: appConfig.theme.spacing.xxs,
    xs: appConfig.theme.spacing.xs,
    sm: appConfig.theme.spacing.sm,
    md: appConfig.theme.spacing.md,
    lg: appConfig.theme.spacing.lg,
    xl: appConfig.theme.spacing.xl,
    xxl: appConfig.theme.spacing.xxl,
  },
  
  // Layout-Werte aus config.toml
  layout: appConfig.theme.spacing.layout,
  
  // Component-spezifische Spacings aus config.toml
  component: appConfig.theme.spacing.component,
  
  // Mobile variants aus config.toml
  mobile: appConfig.theme.spacing.mobile,
  
  // Responsive-Werte aus theme.responsive
  responsive: {
    pagePadding: { mobile: '0.5rem', tablet: '1rem', desktop: '1.5rem' },
    contentGap: { mobile: '0.5rem', tablet: '1rem', desktop: '1rem' },
    bottomNavHeight: appConfig.theme.responsive.bottomNavHeight,
    bottomNavPadding: appConfig.theme.responsive.bottomNavPadding,
    sidebarWidth: appConfig.theme.responsive.sidebarWidth,
  },
} as const;
