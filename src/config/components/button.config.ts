/**
 * @file        button.config.ts
 * @description Button component config (authored)
 * @version     1.0.0
 */

export const buttonConfig = {
  variants: {
    primary: { bg: '#2196f3', text: '#ffffff', hover: '#1e88e5' },
    secondary: { bg: '#3d3d3d', text: '#ffffff', hover: '#454545' },
    danger: { bg: '#e74c3c', text: '#ffffff', hover: '#c0392b' },
    outline: { bg: 'transparent', text: '#2196f3', hover: '#1e88e540', border: '#2196f3' },
    ghost: { bg: 'transparent', text: '#ffffff', hover: '#ffffff20' },
    success: { bg: '#27ae60', text: '#ffffff', hover: '#229955' },
    warning: { bg: '#f39c12', text: '#1e1e1e', hover: '#e67e22' }
  },
  sizes: {
    xs: { padding: '0.25rem 0.5rem', paddingX: 2, paddingY: 1, fontSize: 'xs' as const, icon: '14px', height: '28px' },
    sm: { padding: '0.5rem 1rem', paddingX: 4, paddingY: 2, fontSize: 'sm' as const, icon: '16px', height: '36px' },
    md: { padding: '0.75rem 1.5rem', paddingX: 6, paddingY: 3, fontSize: 'md' as const, icon: '18px', height: '44px' },
    lg: { padding: '1rem 2rem', paddingX: 8, paddingY: 4, fontSize: 'lg' as const, icon: '20px', height: '52px' },
    xl: { padding: '1.25rem 2.5rem', paddingX: 10, paddingY: 5, fontSize: 'xl' as const, icon: '24px', height: '60px' }
  },
  borderRadius: '0.25rem'
} as const;
