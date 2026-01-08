/**
 * @file        typography.config.ts
 * @description Typography tokens (authored values)
 * @version     1.0.0
 */

export const typographyConfig = {
  fontFamily: {
    base: 'Segoe UI, system-ui, sans-serif',
    mono: 'JetBrains Mono, monospace'
  },
  fontSize: {
    xs: '0.75rem',
    sm: '0.875rem',
    md: '1rem',
    lg: '1.25rem',
    xl: '1.5rem'
  },
  fontWeight: {
    normal: 400,
    medium: 500,
    semibold: 600,
    bold: 700
  }
} as const;
