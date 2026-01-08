/**
 * @file        divider.config.ts
 * @description Divider component config (authored)
 * @version     1.0.0
 */

export const dividerConfig = {
  month: {
    bg: '#252525',
    text: '#999999',
    border: '#3d3d3d',
    padding: '0.5rem 1rem',
    paddingY: 2,
    paddingX: 4,
    fontSize: '0.875rem',
    fontWeight: 600,
    textTransform: 'uppercase'
  },
  horizontal: {
    border: '#3d3d3d',
    margin: '1rem 0',
    marginY: '1rem',
    height: '1px',
    thickness: '1px',
    color: '#3d3d3d'
  }
} as const;
