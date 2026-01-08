/**
 * @file        dialog.config.ts
 * @description Dialog component config (authored)
 * @version     1.0.0
 */

export const dialogConfig = {
  overlay: { bg: 'rgba(0, 0, 0, 0.75)' },
  container: {
    bg: '#2d2d2d',
    border: '#3d3d3d',
    borderRadius: '0.5rem',
    padding: '1.5rem',
    maxWidth: '600px',
    width: '90vw',
    shadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)'
  },
  header: {
    borderBottom: '#3d3d3d',
    padding: '0 0 1rem 0',
    fontSize: '1.25rem',
    fontWeight: 600
  },
  body: { padding: '1rem 0', gap: '1rem' },
  footer: {
    borderTop: '#3d3d3d',
    padding: '1rem 0 0 0',
    marginTop: '1rem',
    gap: '0.5rem'
  }
} as const;
