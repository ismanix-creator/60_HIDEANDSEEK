/**
 * @file        infobox.config.ts
 * @description Infobox component config (authored)
 * @version     1.0.0
 */

export const infoboxConfig = {
  variants: {
    info: { bg: '#1e3a5f', border: '#3498db', icon: '#3498db', iconColor: '#3498db' },
    success: { bg: '#1e3a2f', border: '#27ae60', icon: '#27ae60', iconColor: '#27ae60' },
    warning: { bg: '#3a2f1e', border: '#f39c12', icon: '#f39c12', iconColor: '#f39c12' },
    error: { bg: '#3a1e1e', border: '#e74c3c', icon: '#e74c3c', iconColor: '#e74c3c' }
  },
  base: {
    padding: '1rem',
    borderRadius: '0.5rem',
    fontSize: '0.875rem',
    borderWidth: '1px'
  },
  panel: {
    bg: '#252525',
    border: '#3d3d3d',
    borderRadius: '0.5rem',
    padding: '1.5rem'
  },
  formCompact: {
    containerWidth: '75%',
    inputWidth: '66%',
    buttonSize: 'sm'
  }
} as const;
