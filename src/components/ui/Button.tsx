/**
 * @file        Button.tsx
 * @description Wiederverwendbare Button-Komponente mit Icon-Support (Dark Theme, Responsive)
 * @version     0.11.0
 * @created     2025-12-11 01:05:00 CET
 * @updated     2026-01-09 23:18:50 CET
 * @author      Akki Scholze
 *
 * @props
 *   variant - Button-Variante (primary, secondary, outline, ghost, danger, success, warning, transparent)
 *   size - Button-Größe (btn = Standard für Dialoge/Settings/Setup, icon = Icon-Only für Navigation/Actions/Header)
 *   disabled - Deaktiviert den Button
 *   loading - Zeigt Ladeindikator
 *   onClick - Click-Handler
 *   children - Button-Inhalt (optional wenn iconOnly)
 *   fullWidth - Volle Breite (auch auf Desktop)
 *   icon - Icon für icon-only oder icon+text Mode
 *   iconOnly - Wenn true: nur Icon ohne Text, transparent BG, colored icon
 *
 * @changelog
 *   0.11.0 - 2026-01-09 - Direct appConfig.theme.* access (breakpointsConfig eliminiert)
 *   0.10.0 - 2026-01-09 - Import auf appConfig.components.button umgestellt (Phase 2.2.2)
 *   0.9.0 - 2026-01-09 - Icon-Only: Padding entfernt (Button = Icon-Größe), keine Layout-Abstandssummierung
 *   0.8.0 - 2026-01-09 - Icon-Only: Transparent bg, colored icon (variant.text), hover 10% opacity
 *   0.7.0 - 2026-01-09 - Icon-only Mode integriert, transparent variant für Page-Action-Buttons
 *   0.6.0 - 2025-12-14 - Responsive: Touch-Targets 44px, kein Hover auf Mobile
 *   0.5.0 - 2025-12-12 - Config-Driven: Hardcodes durch iconsConfig ersetzt
 *   0.4.0 - 2025-12-11 - activeBorder Prop für Tab-Buttons mit sichtbarer Border
 *   0.3.0 - 2025-12-11 - xs-Size für kompakte Panel-Buttons, fontSize aus typographyConfig
 *   0.2.0 - 2025-12-11 - Größere Buttons, xl-Size, Hover-Effekte
 *   0.1.0 - 2025-12-11 - Initial version
 */

// ═══════════════════════════════════════════════════════
// IMPORTS
// ═══════════════════════════════════════════════════════
import { useState } from 'react';
import type { ButtonProps } from '@/types/ui.types';
import { appConfig } from '@/config';
import { useResponsive } from '@/hooks/useResponsive';

const buttonConfig = appConfig.components.button;

const colorsConfig = appConfig.theme.colors;
const typographyConfig = appConfig.theme.typography;
const iconsConfig = appConfig.theme.icons;

// ═══════════════════════════════════════════════════════
// HELPERS
// ═══════════════════════════════════════════════════════
function getColorValue(colorPath: string): string {
  if (colorPath === 'none' || colorPath === 'transparent' || colorPath === 'white') {
    return colorPath === 'none' ? 'transparent' : colorPath;
  }

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

// ═══════════════════════════════════════════════════════
// COMPONENT
// ═══════════════════════════════════════════════════════
export function Button({
  variant = 'primary',
  size = 'btn',
  disabled = false,
  loading = false,
  onClick,
  type = 'button',
  children,
  className = '',
  style,
  title,
  fullWidth = false,
  icon,
  iconOnly = false
}: ButtonProps) {
  const [isHovered, setIsHovered] = useState(false);
  const { isMobile } = useResponsive();

  const variantStyles = buttonConfig.variants[variant];
  const sizeStyles = buttonConfig.sizes[size];

  const handleClick = () => {
    if (!disabled && !loading && onClick) {
      onClick();
    }
  };

  const isDisabled = disabled || loading;

  // Hover nur auf Desktop
  const bgColor =
    isHovered && !isDisabled && !isMobile ? getColorValue(variantStyles.hover) : getColorValue(variantStyles.bg);

  // Spinner/Icon Size für btn (Standard)
  const spinnerSize = size === 'btn' ? iconsConfig.sizes.md : iconsConfig.sizes.sm;
  const iconSize = size === 'btn' ? iconsConfig.sizes.md : iconsConfig.sizes.sm;

  // Touch-Target Minimum (44px) auf Mobile
  const minTouchTarget = `${appConfig.theme.responsive.touchMinSize}px`;

  // ═══════════════════════════════════════════════════════
  // ICON-ONLY MODE (transparent bg, colored icon)
  // ═══════════════════════════════════════════════════════
  if (iconOnly && icon) {
    // Icon-Only: kein Padding, Button = Icon-Größe
    const padding = '0';

    // Icon-Only: Immer transparenter Hintergrund, nur Icon farbig
    // Hover: leichte Hintergrundfarbe (10% opacity)
    const iconColor = getColorValue(variantStyles.text);
    const hoverBg =
      isHovered && !isDisabled && !isMobile
        ? `${getColorValue(variantStyles.text)}1a` // 10% opacity (#rrggbb + 1a)
        : 'transparent';

    return (
      <button
        type={type}
        onClick={handleClick}
        disabled={isDisabled}
        title={title}
        aria-label={title}
        // Hover Events nur auf Desktop
        onMouseEnter={() => !isMobile && setIsHovered(true)}
        onMouseLeave={() => !isMobile && setIsHovered(false)}
        className={`
          inline-flex items-center justify-center
          transition-all duration-150
          ${isDisabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
          ${className}
        `.trim()}
        style={{
          backgroundColor: hoverBg,
          color: iconColor,
          borderRadius: buttonConfig.borderRadius,
          padding: padding,
          // Mobile: minHeight/minWidth für Touch-Target
          minHeight: isMobile ? minTouchTarget : undefined,
          minWidth: isMobile ? minTouchTarget : undefined,
          border: 'none',
          // Touch-freundlich: Kein user-select auf Mobile
          WebkitTapHighlightColor: isMobile ? 'transparent' : undefined,
          ...style
        }}
      >
        <div
          style={{
            width: iconSize,
            height: iconSize,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          {icon}
        </div>
      </button>
    );
  }

  // ═══════════════════════════════════════════════════════
  // STANDARD MODE (mit Text, optional mit Icon)
  // ═══════════════════════════════════════════════════════

  // Mobile: Größere Padding-Werte
  const mobilePaddingMultiplier = 1.25;
  const paddingX = isMobile
    ? `${sizeStyles.paddingX * 0.25 * mobilePaddingMultiplier}rem`
    : `${sizeStyles.paddingX * 0.25}rem`;

  // fontSize nur für btn (icon hat keine fontSize in Config)
  type FontSizeKey = keyof typeof typographyConfig.fontSize;
  const fontSizeKey = (size === 'btn' && sizeStyles.fontSize ? sizeStyles.fontSize : 'md') as FontSizeKey;
  const baseFontSize = typographyConfig.fontSize[fontSizeKey] || '0.875rem';
  const fontSize = baseFontSize;

  return (
    <button
      type={type}
      onClick={handleClick}
      disabled={isDisabled}
      title={title}
      // Hover Events nur auf Desktop
      onMouseEnter={() => !isMobile && setIsHovered(true)}
      onMouseLeave={() => !isMobile && setIsHovered(false)}
      className={`
        inline-flex items-center justify-center gap-2
        font-semibold transition-all duration-150
        ${isDisabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
        ${className}
      `.trim()}
      style={{
        backgroundColor: bgColor,
        color: getColorValue(variantStyles.text),
        borderRadius: buttonConfig.borderRadius,
        // Mobile: minHeight für Touch-Target
        height: sizeStyles.height,
        minHeight: isMobile ? minTouchTarget : undefined,
        paddingLeft: paddingX,
        paddingRight: paddingX,
        fontSize: fontSize,
        border:
          'border' in variantStyles ? `1px solid ${getColorValue(variantStyles.border || 'transparent')}` : 'none',
        // fullWidth oder Mobile: 100% Breite
        width: fullWidth ? '100%' : undefined,
        // Touch-freundlich: Kein user-select auf Mobile
        WebkitTapHighlightColor: isMobile ? 'transparent' : undefined,
        ...style
      }}
    >
      {loading && (
        /* Loading spinner (based on Tailwind CSS example - MIT License)
         * Source: https://tailwindcss.com/docs/animation#spin
         */
        <svg
          className="animate-spin"
          style={{ height: spinnerSize, width: spinnerSize }}
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
      {icon && (
        <div
          style={{
            width: iconSize,
            height: iconSize,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          {icon}
        </div>
      )}
      {children}
    </button>
  );
}
