/**
 * @file        table.config.ts
 * @description Table component config (authored)
 * @version     1.0.0
 */

export const tableConfig = {
  wrapper: {
    bg: '#1e1e1e',
    border: '#3d3d3d',
    borderRadius: '0.5rem',
    shadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)'
  },
  header: {
    bg: '#252525',
    text: '#ffffff',
    fontWeight: 'semibold' as const,
    padding: '1rem',
    paddingY: '1rem',
    paddingX: '1rem',
    fontSize: 'md' as const,
    borderBottom: '#3d3d3d'
  },
  row: {
    even: { bg: '#1a1a1a' },
    odd: { bg: '#2a2a2a' },
    hover: { bg: '#353535' },
    bgEven: '#1a1a1a',
    bgOdd: '#2a2a2a',
    bgHover: '#353535',
    borderBottom: '#3d3d3d'
  },
  cell: {
    padding: '0.75rem 1rem',
    paddingY: '0.75rem',
    paddingX: '1rem',
    fontSize: 'sm' as const,
    text: '#ffffff',
    fontFamily: 'base' as const
  },
  cellTypes: {
    currency: { fontFamily: 'JetBrains Mono, monospace', textAlign: 'right' as const },
    number: { textAlign: 'right' as const },
    date: { textAlign: 'center' as const }
  },
  loading: {
    text: 'Lädt...',
    color: '#999999',
    paddingY: '2rem',
    spinnerSize: '32px',
    spinnerColor: '#2196f3'
  },
  empty: {
    text: 'Keine Daten',
    color: '#666666',
    paddingY: '2rem'
  }
} as const;

export const pageHeaderConfig = {
  button: {
    className: 'page-header-button'
  }
} as const;
