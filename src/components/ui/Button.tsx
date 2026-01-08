/**
 * @file        Button.tsx
 * @description Wiederverwendbare Button-Komponente (Dark Theme, größere Buttons) - Responsive
 * @version     0.6.0
 * @created     2025-12-11 01:05:00 CET
 * @updated     2025-12-15 22:27:01 CET
 * @author      Akki Scholze
 *
 * @props
 *   variant - Button-Variante (primary, secondary, outline, ghost, danger, success, warning)
 *   size - Button-Größe (xs, sm, md, lg, xl)
 *   disabled - Deaktiviert den Button
 *   loading - Zeigt Ladeindikator
 *   onClick - Click-Handler
 *   children - Button-Inhalt
 *   fullWidth - Volle Breite (auch auf Desktop)
 *
 * @changelog
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
import { buttonConfig, colorsConfig, typographyConfig, iconsConfig, breakpointsConfig } from '@/config';
import { useResponsive } from '@/hooks/useResponsive';

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
  size = 'md',
  disabled = false,
  loading = false,
  onClick,
  type = 'button',
  children,
  className = '',
  style,
  title,
  fullWidth = false
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

  const spinnerSize = iconsConfig.button[size as keyof typeof iconsConfig.button];

  // Touch-Target Minimum (44px) auf Mobile
  const minTouchTarget = `${breakpointsConfig.touchMinSize}px`;

  // Mobile: Größere Padding-Werte
  const mobilePaddingMultiplier = 1.25;
  const paddingX = isMobile
    ? `${sizeStyles.paddingX * 0.25 * mobilePaddingMultiplier}rem`
    : `${sizeStyles.paddingX * 0.25}rem`;

  // Mobile: Größere Schrift für bessere Lesbarkeit
  const baseFontSize = typographyConfig.fontSize[sizeStyles.fontSize] || '0.875rem';
  const fontSize = isMobile && size === 'xs' ? '0.875rem' : baseFontSize;

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
        border: 'border' in variantStyles ? `1px solid ${getColorValue(variantStyles.border)}` : 'none',
        // fullWidth oder Mobile: 100% Breite
        width: fullWidth ? '100%' : undefined,
        // Touch-freundlich: Kein user-select auf Mobile
        WebkitTapHighlightColor: isMobile ? 'transparent' : undefined,
        ...style
      }}
    >
      {loading && (
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
      {children}
    </button>
  );
}
