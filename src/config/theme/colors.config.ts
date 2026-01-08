/**
 * @file        colors.config.ts
 * @description Color tokens (SEASIDE Dark Theme - authored values)
 * @version     1.0.0
 */

export const colorsConfig = {
  primary: {
    50: '#e3f2fd',
    100: '#bbdefb',
    200: '#90caf9',
    300: '#64b5f6',
    400: '#42a5f5',
    500: '#2196f3',
    600: '#1e88e5',
    700: '#1976d2',
    800: '#1565c0',
    900: '#0d47a1'
  },
  text: {
    primary: '#ffffff',
    secondary: '#cccccc',
    tertiary: '#999999'
  },
  ui: {
    background: '#1e1e1e',
    backgroundAlt: '#2d2d2d',
    backgroundCard: '#252525',
    border: '#3d3d3d'
  },
  button: {
    gray: '#3d3d3d',
    active: '#454545',
    customer: '#1f1f1f',
    offer: '#252525',
    order: '#303030',
    invoice: '#383838'
  },
  status: {
    error: '#e74c3c',
    warning: '#f39c12',
    success: '#27ae60',
    info: '#3498db'
  },
  error: {
    500: '#e74c3c',
    light: '#e74c3c',
    main: '#e74c3c',
    dark: '#c0392b'
  },
  warning: {
    light: '#f39c12',
    main: '#f39c12',
    dark: '#e67e22'
  },
  success: {
    light: '#27ae60',
    main: '#27ae60',
    dark: '#229954'
  },
  info: {
    light: '#3498db',
    main: '#3498db',
    dark: '#2980b9'
  },
  neutral: {
    50: '#fafafa',
    100: '#f5f5f5',
    200: '#eeeeee',
    300: '#e0e0e0',
    400: '#bdbdbd',
    500: '#9e9e9e',
    600: '#757575',
    700: '#616161',
    800: '#424242',
    900: '#212121'
  },
  table: {
    stripe1: '#1a1a1a',
    stripe2: '#2a2a2a',
    selection: '#353535'
  }
} as const;
