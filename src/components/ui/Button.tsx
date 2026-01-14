/**
 * @file        Button.tsx
 * @description Wiederverwendbare Button-Komponente mit typen-spezifischer API
 * @version     0.17.0
 * @created     2025-12-11 01:05:00 CET
 * @updated     2026-01-11 22:30:00 CET
 * @author      Akki Scholze
 *
 * @props
 *   kind - "nav" | "new" | "act" | "tab" | "rect" (default: "rect")
 *   intent - "default" | "save" (nur für kind='rect')
 *   disabled - Deaktiviert den Button
 *   loading - Zeigt Ladeindikator (nur für kind='rect')
 *   onClick - Click-Handler
 *   children - Button-Inhalt (Text für rect, Icon für icon-basierte kinds)
 *   fullWidth - Volle Breite (nur für kind='rect')
 *   type - "button" | "submit" | "reset"
 *   className - Zusätzliche CSS-Klassen
 *
 * @button-types
 *   nav: Navigation Icons in Sidebar (iconSize: 24px)
 *   new: Neu-Button neben Page Header (iconSize: 32px)
 *   act: Action Icons in Tabellen (iconSize: 20px)
 *   tab: Tab-Wechsel in Zahlungshistorien (iconSize: 20px)
 *   rect: Standard Text-Buttons für Dialog, Settings (mit intent: default/save)
 *
 * @changelog
 *   0.17.0 - 2026-01-11 22:30:00 CET - Feature: Disabled-State Support für Action Buttons mit Config-Styling (cursor-not-allowed, aria-disabled)
 *   0.16.0 - 2026-01-11 18:35:00 CET - Fixed: Config-Zugriff auf appConfig.components.button statt appConfig.components.button (Config-Struktur-Migration)
 *   0.15.0 - 2026-01-11 18:00:00 CET - Complete refactor: nav/new/act/tab/rect, iconSize in config per type
 *   0.14.0 - 2026-01-11 16:45:00 CET - Refactor: CSS-based hover/active (no React state), disabled state blocks hover/active
 *   0.13.0 - 2026-01-11 03:15:00 CET - Complete refactor: new API (kind | intent), CSS-based hover/active
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
 * Resolve icon size to pixel value.
 * Expects format like "20px", "24px", "32px"
 */
function resolveIconSize(sizeStr: string): number {
  const match = sizeStr.match(/^(\d+)px$/);
  if (match) {
    return parseInt(match[1], 10);
  }
  return 20; // fallback
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
  // ICON BUTTONS (nav, new, act, tab)
  // ═══════════════════════════════════════════════════════
  if (kind === 'nav' || kind === 'new' || kind === 'act' || kind === 'tab') {
    type IconButtonConfig = typeof buttonConfig.nav;
    let config: IconButtonConfig;

    if (kind === 'nav') config = buttonConfig.nav;
    else if (kind === 'new') config = buttonConfig.new;
    else if (kind === 'act') config = buttonConfig.act;
    else config = buttonConfig.tab;

    const iconSize = resolveIconSize(config.iconSize);

    const bgColor = getColorValue(config.bg);
    const hoverBgColor = getColorValue(config.hoverBg || config.bg);
    const activeBgColor = getColorValue(config.activeBg || hoverBgColor);
    const iconColor = isDisabled ? getColorValue(config.disabledIcon) : getColorValue(config.icon);
    const borderColor = getColorValue(config.border || 'transparent');

    return (
      <button
        type={type}
        onClick={handleClick}
        disabled={isDisabled}
        aria-disabled={isDisabled}
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
  // RECT BUTTONS (rect: default + save)
  // ═══════════════════════════════════════════════════════
  const config = buttonConfig.rect;
  const iconSize = resolveIconSize(config.iconSize);

  // Determine colors based on intent
  let bgColor: string;
  let textColor: string;
  let borderColor: string;
  let hoverBgColor: string;
  let activeBgColor: string;

  if (intent === 'save') {
    bgColor = getColorValue(config.saveBg);
    textColor = getColorValue(config.saveText);
    borderColor = getColorValue(config.border || 'transparent');
    hoverBgColor = getColorValue(config.saveHoverBg);
    activeBgColor = getColorValue(config.saveActiveBg);
  } else {
    // Default intent
    bgColor = getColorValue(config.bg);
    textColor = getColorValue(config.text);
    borderColor = getColorValue(config.border || 'transparent');
    hoverBgColor = getColorValue(config.hoverBg);
    activeBgColor = getColorValue(config.activeBg);
  }

  if (isDisabled) {
    bgColor = getColorValue(config.disabledBg);
    textColor = getColorValue(config.disabledText);
  }

  const fontSizeKey = config.fontSize as keyof typeof typographyConfig.fontSize;
  const fontSize = typographyConfig.fontSize[fontSizeKey] || '1rem';

  return (
    <button
      type={type}
      onClick={handleClick}
      disabled={isDisabled}
      aria-disabled={isDisabled}
      className={`
        inline-flex items-center justify-center gap-2
        transition-colors duration-150
        ${fullWidth ? 'w-full' : ''}
        ${className}
      `.trim()}
      style={
        {
          backgroundColor: bgColor,
          color: textColor,
          borderRadius: buttonConfig.borderRadius,
          border: `1px solid ${borderColor}`,
          padding: config.padding,
          fontSize,
          fontWeight: typographyConfig.fontWeight.medium,
          fontFamily: typographyConfig.fontFamily.base,
          height: config.height,
          minHeight: config.height,
          opacity: `${isDisabled ? 0.6 : 1}`,
          outline: 'none',
          cursor: isDisabled ? 'not-allowed' : 'pointer',
          pointerEvents: isDisabled ? 'none' : 'auto',
          whiteSpace: 'nowrap',
          // CSS Custom Properties for :hover/:active states
          '--button-hover-bg': hoverBgColor,
          '--button-active-bg': activeBgColor,
          '--icon-size': `${iconSize}px`
        } as unknown as React.CSSProperties
      }
    >
      {loading ? <span>...</span> : children}
    </button>
  );
}
