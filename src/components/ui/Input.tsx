/**
 * @file        Input.tsx
 * @description Wiederverwendbare Input-Komponente (SEASIDE Dark Theme) - Responsive
 * @version     0.8.0
 * @created     2025-12-11 01:05:00 CET
 * @updated     2026-01-11 18:35:00 CET
 * @author      Akki Scholze
 *
 * @props
 *   type - Input-Typ (text, number, currency, date)
 *   label - Label-Text
 *   value - Aktueller Wert
 *   onChange - Change-Handler
 *   error - Fehlermeldung
 *   disabled - Deaktiviert das Input
 *
 * @changelog
 *   0.8.0 - 2026-01-11 18:35:00 CET - Fixed: Config-Zugriff auf appConfig.components.input statt appConfig.components.input (Config-Struktur-Migration)
 *   0.7.0 - 2026-01-11 - Fixed for new config structure: token resolver for color references
 *   0.6.0 - 2026-01-09 - Direct appConfig.* access (breakpointsConfig eliminiert)
 *   0.4.0 - 2025-12-14 - Responsive: Touch-Targets 44px, fontSize 16px für iOS Zoom
 *   0.3.0 - 2025-12-11 - Text-Zentrierung für alle Input-Typen (wie Infobox)
 *   0.2.0 - 2025-12-11 - SEASIDE Dark Theme, Config-Driven Colors
 *   0.1.0 - 2025-12-11 - Initial version
 */

// ═══════════════════════════════════════════════════════
// IMPORTS
// ═══════════════════════════════════════════════════════
import type { InputProps } from '@/types/ui.types';
import { appConfig } from '@/config';
import { useResponsive } from '@/hooks/useResponsive';

const inputConfig = appConfig.components.input;

const colorsConfig = appConfig.theme.colors;

// ═══════════════════════════════════════════════════════
// HELPERS
// ═══════════════════════════════════════════════════════
type ColorLookup = Record<string, string>;

function isColorLookup(value: unknown): value is ColorLookup {
  if (typeof value !== 'object' || value === null || Array.isArray(value)) {
    return false;
  }
  return Object.values(value).every((shade) => typeof shade === 'string');
}

function getColorValue(colorPath: string): string {
  // Token-Refs: {blue.500}, {red.500} etc. sind STRINGS
  if (colorPath.startsWith('{') && colorPath.endsWith('}')) {
    const tokenPath = colorPath.slice(1, -1); // Remove { }
    const parts = tokenPath.split('.');
    if (parts.length === 2) {
      const [category, shade] = parts;
      const entry = Object.entries(colorsConfig).find(([key]) => key === category);
      if (entry) {
        const colorCategory: unknown = entry[1];
        if (isColorLookup(colorCategory)) {
          const shadeValue = colorCategory[shade];
          if (typeof shadeValue === 'string') {
            return shadeValue;
          }
        }
      }
    }
    return colorPath;
  }

  const parts = colorPath.split('.');
  if (parts.length === 2) {
    const [category, shade] = parts;
    const entry = Object.entries(colorsConfig).find(([key]) => key === category);
    if (entry) {
      const colorCategory: unknown = entry[1];
      if (isColorLookup(colorCategory)) {
        const shadeValue = colorCategory[shade];
        if (typeof shadeValue === 'string') {
          return shadeValue;
        }
      }
    }
  }
  return colorPath;
}

// ═══════════════════════════════════════════════════════
// COMPONENT
// ═══════════════════════════════════════════════════════
export function Input({
  type = 'text',
  label,
  value,
  onChange,
  placeholder,
  error,
  disabled = false,
  required = false,
  min,
  max,
  step,
  className = '',
  autoComplete,
  autoFocus,
  minLength
}: InputProps) {
  const { isMobile } = useResponsive();

  // Password type is handled separately (not in config, but valid HTML input type)
  // Use base config for all input types (no type-specific config)
  const state = error ? 'error' : disabled ? 'disabled' : 'default';
  const stateStyles = inputConfig.states[state];

  // Determine actual HTML input type
  const inputType = type === 'currency' ? 'number' : type === 'password' ? 'password' : type;

  // Touch-Target Minimum (44px) auf Mobile
  const minTouchTarget = `${appConfig.layout.rules.touchMinSizePx}px`;

  // Mobile: fontSize 16px verhindert iOS Auto-Zoom bei Focus
  const fontSize = isMobile ? '16px' : '0.875rem';

  // Mobile: Größere Padding-Werte
  const paddingX = isMobile ? '16px' : inputConfig.base.paddingX;
  const paddingY = isMobile ? '12px' : inputConfig.base.paddingY;

  return (
    <div className={`flex flex-col gap-1 ${className}`}>
      {label && (
        <label
          style={{
            fontSize: isMobile ? '0.9375rem' : '0.875rem',
            fontWeight: 500,
            color: colorsConfig.text.secondary
          }}
        >
          {label}
          {required && <span style={{ color: colorsConfig.red[500], marginLeft: '0.25rem' }}>*</span>}
        </label>
      )}
      <input
        type={inputType}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        disabled={disabled}
        required={required}
        min={min}
        max={max}
        step={step || (type === 'currency' ? '0.01' : undefined)}
        autoComplete={autoComplete}
        autoFocus={autoFocus}
        minLength={minLength}
        className={`
          w-full transition-colors duration-150
          focus:outline-none focus:ring-2
          ${disabled ? 'cursor-not-allowed' : ''}
          ${type === 'currency' || type === 'number' ? 'font-mono' : ''}
          text-center
        `.trim()}
        style={{
          // Mobile: minHeight für Touch-Target
          height: inputConfig.base.height,
          minHeight: isMobile ? minTouchTarget : undefined,
          paddingLeft: paddingX,
          paddingRight: paddingX,
          paddingTop: paddingY,
          paddingBottom: paddingY,
          borderRadius: inputConfig.base.borderRadius,
          borderWidth: inputConfig.base.borderWidth,
          borderStyle: 'solid',
          borderColor: getColorValue(stateStyles.border || 'ui.border'),
          backgroundColor: getColorValue(stateStyles.bg || inputConfig.base.bg),
          color: getColorValue(stateStyles.text || inputConfig.base.text),
          // Mobile: fontSize 16px verhindert iOS Auto-Zoom
          fontSize: fontSize,
          // Touch-freundlich
          WebkitTapHighlightColor: isMobile ? 'transparent' : undefined
        }}
      />
      {error && <span style={{ fontSize: '0.75rem', color: colorsConfig.red[500] }}>{error}</span>}
    </div>
  );
}
