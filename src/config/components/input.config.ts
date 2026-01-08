/**
 * @file        input.config.ts
 * @description Input component config (authored)
 * @version     1.0.0
 */

export const inputConfig = {
  base: {
    bg: '#2d2d2d',
    border: '#3d3d3d',
    text: '#ffffff',
    padding: '0.5rem 1rem',
    paddingX: '1rem',
    paddingY: '0.5rem',
    borderRadius: '0.25rem',
    fontSize: '1rem',
    height: '44px',
    borderWidth: '1px'
  },
  states: {
    focus: { border: '#2196f3', bg: '#2d2d2d', outline: '#2196f3' },
    error: { border: '#e74c3c', bg: '#2d2d2d', outline: '#e74c3c' },
    disabled: { border: '#3d3d3d', bg: '#1e1e1e', text: '#666666' },
    default: { border: '#3d3d3d', bg: '#2d2d2d' }
  },
  types: {
    text: { type: 'text' as const },
    number: { type: 'number' as const },
    date: { type: 'date' as const },
    email: { type: 'email' as const },
    currency: { type: 'text' as const }
  }
} as const;
