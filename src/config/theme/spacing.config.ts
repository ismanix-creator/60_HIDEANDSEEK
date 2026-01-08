/**
 * @file        spacing.config.ts
 * @description Spacing tokens with responsive variants (authored values)
 * @version     1.0.0
 */

export const spacingConfig = {
  base: {
    xxs: '0.125rem',
    xs: '0.25rem',
    sm: '0.5rem',
    md: '1rem',
    lg: '1.5rem',
    xl: '2rem',
    xxl: '3rem'
  },
  layout: {
    contentMaxWidthRem: '100rem'
  },
  component: {
    button: {
      paddingX: { sm: '0.5rem', md: '1rem', lg: '1.5rem' },
      paddingY: { sm: '0.25rem', md: '0.5rem', lg: '0.75rem' }
    }
  },
  mobile: {
    xxs: '0.0625rem',
    xs: '0.125rem',
    sm: '0.25rem',
    md: '0.5rem',
    lg: '1rem',
    xl: '1.5rem'
  },
  responsive: {
    pagePadding: { mobile: '0.5rem', tablet: '1rem', desktop: '1.5rem' },
    contentGap: { mobile: '0.5rem', tablet: '1rem', desktop: '1rem' },
    bottomNavHeight: '60px',
    bottomNavPadding: '80px',
    sidebarWidth: '200px'
  },
  // Backwards compat
  xxs: '0.125rem',
  xs: '0.25rem',
  sm: '0.5rem',
  md: '1rem',
  lg: '1.5rem',
  xl: '2rem',
  xxl: '3rem'
} as const;
