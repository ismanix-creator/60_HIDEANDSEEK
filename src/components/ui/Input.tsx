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

const inputConfig = appConfig.components.entry;
const inputStyleConfig = appConfig.ui.entry.input.style;
const labelStyleConfig = appConfig.ui.entry.label.style;
const errorStyleConfig = appConfig.ui.entry.error.style;
const colorsConfig = appConfig.theme.colors;
const borderSizes = appConfig.theme.border.sizes;
const spacingEntry = appConfig.theme.spacing.entry;

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
  const entryColors = appConfig.theme.colors.dialog;

  // State-based colors
  const stateColors = {
    default: { border: entryColors.entryBorder, bg: colorsConfig.bg.card, text: colorsConfig.text.active },
    error: { border: entryColors.entryError, bg: colorsConfig.bg.card, text: colorsConfig.text.error },
    disabled: {
      border: entryColors.entryBorderDisabled,
      bg: entryColors.entryDisabled,
      text: colorsConfig.text.inactive
    }
  };
  const stateStyles = stateColors[state];

  // Determine actual HTML input type
  const inputType = type === 'currency' ? 'number' : type === 'password' ? 'password' : type;

  return (
    <div className={`flex flex-col gap-1 ${className}`}>
      {label && (
        <label
          style={{
            fontSize: labelStyleConfig.fontSize,
            fontWeight: labelStyleConfig.fontWeight,
            color: colorsConfig.text.hint
          }}
        >
          {label}
          {required && <span style={{ color: colorsConfig.text.error, marginLeft: spacingEntry.labelGap }}>*</span>}
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
          w-full
          ${type === 'currency' || type === 'number' ? 'font-mono' : ''}
          text-center
        `.trim()}
        style={{
          height: inputConfig.height,
          minHeight: isMobile ? inputStyleConfig.minHeightMobile : undefined,
          paddingLeft: isMobile ? '16px' : spacingEntry.paddingX,
          paddingRight: isMobile ? '16px' : spacingEntry.paddingX,
          paddingTop: isMobile ? '12px' : spacingEntry.paddingY,
          paddingBottom: isMobile ? '12px' : spacingEntry.paddingY,
          borderRadius: inputConfig.radius,
          borderWidth: borderSizes.thin,
          borderStyle: 'solid',
          borderColor: stateStyles.border,
          backgroundColor: stateStyles.bg,
          color: stateStyles.text,
          fontSize: isMobile ? '16px' : '0.875rem',
          WebkitTapHighlightColor: isMobile ? inputStyleConfig.webkitTapHighlightColorMobile : undefined,
          transition: appConfig.ui.tokens.transition.colors150,
          textAlign: inputStyleConfig.textAlign as React.CSSProperties['textAlign'],
          outline: appConfig.ui.entry.input.focus.outline,
          cursor: disabled ? appConfig.ui.entry.input.cursor.disabled : undefined
        }}
      />
      {error && <span style={{ fontSize: errorStyleConfig.fontSize, color: colorsConfig.red[500] }}>{error}</span>}
    </div>
  );
}
