/**
 * @file        breakpoints.config.ts
 * @description Breakpoint tokens with media queries (authored values)
 * @version     1.0.0
 */

const mobileMaxWidth = 767;
const desktopMinWidth = 1024;

const breakpointValues = {
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
  '2xl': 1536
};

export const breakpointsConfig = {
  sm: '640px',
  md: '768px',
  lg: '1024px',
  xl: '1280px',
  '2xl': '1536px',
  mobile: mobileMaxWidth,
  desktop: desktopMinWidth,
  mobileMaxWidth,
  values: breakpointValues,
  touchMinSize: 44,
  mediaQueries: {
    mobile: `(max-width: ${mobileMaxWidth}px)`,
    tablet: `(min-width: ${breakpointValues.md}px) and (max-width: ${breakpointValues.lg - 1}px)`,
    desktop: `(min-width: ${desktopMinWidth}px)`,
    samsungS24: `(max-width: 360px)`,
    iPhone15: `(min-width: 361px) and (max-width: 393px)`,
    surface7: `(min-width: 1368px)`
  },
  devices: {
    samsungS24: { width: 360, height: 780 },
    iPhone15: { width: 393, height: 852 },
    surface7: { width: 1368, height: 912 },
    pcFullHD: { width: 1920, height: 1080 }
  }
} as const;
