/**
 * @file        badge.config.ts
 * @description Badge component config (SEASIDE Dark Theme - authored)
 * @version     1.0.0
 */

export const badgeConfig = {
  variants: {
    success: { bg: '#27ae60', text: '#ffffff' },
    error: { bg: '#e74c3c', text: '#ffffff' },
    warning: { bg: '#f39c12', text: '#1e1e1e' },
    info: { bg: '#3498db', text: '#ffffff' },
    pending: { bg: '#999999', text: '#ffffff' },
    neutral: { bg: '#666666', text: '#ffffff' }
  },
  base: {
    padding: '0.25rem 0.5rem',
    paddingX: 2,
    paddingY: 1,
    borderRadius: '0.25rem',
    fontSize: '0.75rem',
    fontWeight: 500,
    display: 'inline-flex',
    alignItems: 'center',
    gap: '0.25rem'
  }
} as const;
