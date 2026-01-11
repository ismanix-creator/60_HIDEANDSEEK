/**
 * @file        Button.tsx
 * @description Wiederverwendbare Button-Komponente mit neuer API (kind | intent)
 * @version     0.14.0
 * @created     2025-12-11 01:05:00 CET
 * @updated     2026-01-11 16:45:00 CET
 * @author      Akki Scholze
 *
 * @props
 *   kind - "rect" (Standard-Button mit Text) oder "icon" (Icon-Only Button)
 *   intent - "default" oder "save" (nur für kind='rect')
 *   disabled - Deaktiviert den Button
 *   loading - Zeigt Ladeindikator (nur für kind='rect')
 *   onClick - Click-Handler
 *   children - Button-Inhalt (Text für rect, wird bei icon ignoriert)
 *   fullWidth - Volle Breite (auch auf Desktop)
 *   type - "button" | "submit" | "reset"
 *   className - Zusätzliche CSS-Klassen
 *
 * @breaking-change v0.13.0
 *   - variant, size, iconOnly, icon, activeBorder, style, title Eigenschaften entfernt
 *   - Neue API: kind + intent statt variant/size
 *   - onClick erhält jetzt MouseEvent statt void
 *   - Icon-Unterstützung nur noch via Komponenten-Children (z.B. <Button kind="icon"><Icon/></Button>)
 *
 * @changelog
 *   0.14.0 - 2026-01-11 16:45:00 CET - Refactor: CSS-based hover/active (no React state), disabled state blocks hover/active
 *   0.13.0 - 2026-01-11 03:15:00 CET - Complete refactor: new API (kind | intent), CSS-based hover/active
 *   0.12.1 - 2026-01-11 01:58:38 CET - Renamed 'sizes.btn' → 'sizes.rect' to match config changes
 *   0.12.0 - 2026-01-11 - Fixed for new config structure: token resolver, simplified size/variant access
 */

// ═══════════════════════════════════════════════════════
// IMPORTS
// ═══════════════════════════════════════════════════════
import type { ButtonProps } from '@/types/ui.types';
import { appConfig } from '@/config';

const buttonConfig = appConfig.components.button;
const colorsConfig = appConfig.theme.colors;
const typographyConfig = appConfig.theme.typography;

// ═══════════════════════════════════════════════════════
// HELPERS
// ═══════════════════════════════════════════════════════

/**
 * Resolve color token strings to actual hex values.
 * Supports both {category.shade} and plain hex strings.
 */
function getColorValue(colorPath: string): string {
  if (!colorPath || colorPath === 'transparent' || colorPath === 'none') {
    return 'transparent';
  }

  // Token-Refs: {blue.500}, {white.50} etc. sind STRINGS
  if (colorPath.startsWith('{') && colorPath.endsWith('}')) {
    const tokenPath = colorPath.slice(1, -1); // Remove { }
    const parts = tokenPath.split('.');
    if (parts.length === 2) {
      const [category, shade] = parts;
      const colorCategory = colorsConfig[category as keyof typeof colorsConfig];
      if (colorCategory && typeof colorCategory === 'object') {
        return (colorCategory as Record<string, string>)[shade] || colorPath;
      }
    }
    return colorPath;
  }

  // Direct path (e.g., "gray.500")
  const parts = colorPath.split('.');
  if (parts.length === 2) {
    const [category, shade] = parts;
    const colorCategory = colorsConfig[category as keyof typeof colorsConfig];
    if (colorCategory && typeof colorCategory === 'object') {
      return (colorCategory as Record<string, string>)[shade] || colorPath;
    }
  }

  return colorPath;
}

/**
 * Resolve icon size tokens to pixel values.
 * Supports {icons.sizes.md}, {icons.sizes.sm}, etc.
 */
function resolveIconSizeToken(tokenPath: string): number {
  if (tokenPath.startsWith('{') && tokenPath.endsWith('}')) {
    const path = tokenPath.slice(1, -1); // Remove { }
    if (path === 'icons.sizes.md') return 24;
    if (path === 'icons.sizes.sm') return 16;
    if (path === 'icons.sizes.lg') return 32;
    if (path === 'icons.sizes.xs') return 12;
  }
  const num = parseInt(tokenPath, 10);
  return isNaN(num) ? 16 : num;
}

// ═══════════════════════════════════════════════════════
// COMPONENT
// ═══════════════════════════════════════════════════════
export function Button({
  kind = 'rect',
  intent = 'default',
  disabled = false,
  loading = false,
  onClick,
  type = 'button',
  children,
  className = '',
  fullWidth = false
}: ButtonProps) {
  const isDisabled = disabled || loading;
  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (!isDisabled && onClick) {
      onClick(e);
    }
  };

  // ═══════════════════════════════════════════════════════
  // ICON MODE (kind="icon")
  // ═══════════════════════════════════════════════════════
  if (kind === 'icon') {
    const iconConfig = buttonConfig.variant.icon;
    const rectConfig = buttonConfig.sizes.rect; // Icon size from rect config
    const iconSizeToken = rectConfig.iconSize;
    const iconSize = resolveIconSizeToken(iconSizeToken);

    const bgColor = getColorValue(iconConfig.bg);
    const hoverBgColor = getColorValue(iconConfig.hoverBg || iconConfig.bg);
    const activeBgColor = getColorValue(iconConfig.activeBg || hoverBgColor);
    const iconColor = isDisabled ? getColorValue(iconConfig.disabledIcon) : getColorValue(iconConfig.icon);
    const borderColor = getColorValue(iconConfig.border || 'transparent');

    // CSS Custom Properties for hover/active states (no React state manipulation)
    return (
      <button
        type={type}
        onClick={handleClick}
        disabled={isDisabled}
        className={`
          inline-flex items-center justify-center
          transition-colors duration-150
          ${className}
        `.trim()}
        style={
          {
            backgroundColor: bgColor,
            color: iconColor,
            borderRadius: buttonConfig.borderRadius,
            border: `1px solid ${borderColor}`,
            width: `${iconSize}px`,
            height: `${iconSize}px`,
            padding: '0',
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            opacity: `${isDisabled ? 0.5 : 1}`,
            outline: 'none',
            cursor: isDisabled ? 'not-allowed' : 'pointer',
            pointerEvents: isDisabled ? 'none' : 'auto',
            // CSS Custom Properties for :hover/:active states
            '--button-hover-bg': hoverBgColor,
            '--button-active-bg': activeBgColor
          } as unknown as React.CSSProperties
        }
      >
        {children}
      </button>
    );
  }

  // ═══════════════════════════════════════════════════════
  // RECT MODE (kind="rect", default)
  // ═══════════════════════════════════════════════════════
  const variantConfig = buttonConfig.variant.rect;
  const sizeConfig = buttonConfig.sizes.rect;
  const iconSizeToken = sizeConfig.iconSize;
  const iconSize = resolveIconSizeToken(iconSizeToken);

  // Determine colors based on intent
  let bgColor: string;
  let textColor: string;
  let borderColor: string;
  let hoverBgColor: string;
  let activeBgColor: string;

  if (intent === 'save') {
    bgColor = getColorValue(variantConfig.saveBg);
    textColor = getColorValue(variantConfig.saveText);
    borderColor = getColorValue(variantConfig.border || 'transparent');
    hoverBgColor = getColorValue(variantConfig.saveHoverBg);
    activeBgColor = getColorValue(variantConfig.saveActiveBg);
  } else {
    // Default intent
    bgColor = getColorValue(variantConfig.bg);
    textColor = getColorValue(variantConfig.text);
    borderColor = getColorValue(variantConfig.border || 'transparent');
    hoverBgColor = getColorValue(variantConfig.hoverBg);
    activeBgColor = getColorValue(variantConfig.activeBg);
  }

  // Disabled state
  if (isDisabled) {
    bgColor = getColorValue(variantConfig.disabledBg);
    textColor = getColorValue(variantConfig.disabledText);
    borderColor = getColorValue(variantConfig.disabledBorder || 'transparent');
  }

  // Font size from config
  type FontSizeKey = keyof typeof typographyConfig.fontSize;
  const fontSizeKey = sizeConfig.fontSize as FontSizeKey;
  const fontSize = typographyConfig.fontSize[fontSizeKey] || '0.875rem';

  // Padding calculation (convert from rem to units)
  // Format: "0.75rem 1.5rem" -> { padY: 0.75, padX: 1.5 }
  const paddingParts = sizeConfig.padding.split(' ');
  const padYValue = parseFloat(paddingParts[0]);
  const padXValue = parseFloat(paddingParts[1] || paddingParts[0]);

  return (
    <button
      type={type}
      onClick={handleClick}
      disabled={isDisabled}
      className={`
        inline-flex items-center justify-center gap-2
        font-semibold transition-colors duration-150
        ${className}
      `.trim()}
      style={
        {
          backgroundColor: bgColor,
          color: textColor,
          border: `1px solid ${borderColor}`,
          borderRadius: buttonConfig.borderRadius,
          height: sizeConfig.height,
          paddingTop: `${padYValue}rem`,
          paddingBottom: `${padYValue}rem`,
          paddingLeft: `${padXValue}rem`,
          paddingRight: `${padXValue}rem`,
          fontSize: fontSize,
          width: fullWidth ? '100%' : 'auto',
          opacity: `${isDisabled ? 0.5 : 1}`,
          outline: 'none',
          cursor: isDisabled ? 'not-allowed' : 'pointer',
          pointerEvents: isDisabled ? 'none' : 'auto',
          // CSS Custom Properties for :hover/:active states (no React state manipulation)
          '--button-hover-bg': hoverBgColor,
          '--button-active-bg': activeBgColor
        } as unknown as React.CSSProperties
      }
    >
      {loading && (
        /* Loading spinner (based on Tailwind CSS example - MIT License)
         * Source: https://tailwindcss.com/docs/animation#spin
         */
        <svg
          className="animate-spin"
          style={{ height: iconSize, width: iconSize }}
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle style={{ opacity: 0.25 }} cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path
            style={{ opacity: 0.75 }}
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          />
        </svg>
      )}
      {children}
    </button>
  );
}
