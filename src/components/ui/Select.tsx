/**
 * @file        Select.tsx
 * @description Wiederverwendbare Select-Komponente
 * @version     0.3.0
 * @created     2025-12-11 01:05:00 CET
 * @updated     2026-01-11 18:35:00 CET
 * @author      Akki Scholze
 *
 * @props
 *   label - Label-Text
 *   value - Aktueller Wert
 *   onChange - Change-Handler
 *   options - Auswahloptionen
 *   error - Fehlermeldung
 *   disabled - Deaktiviert das Select
 *
 * @changelog
 *   0.3.0 - 2026-01-11 18:35:00 CET - Fixed: Config-Zugriff auf appConfig.components.input statt appConfig.components.input (Config-Struktur-Migration)
 *   0.1.0 - 2025-12-11 - Initial version
 */

// ═══════════════════════════════════════════════════════
// IMPORTS
// ═══════════════════════════════════════════════════════
import type { SelectProps } from '@/types/ui.types';
import { appConfig } from '@/config';

const colorsConfig = appConfig.theme.colors;
const inputConfigBase = appConfig.components.entry;
const labelStyleConfig = appConfig.ui.entry.label.style;
const errorStyleConfig = appConfig.ui.entry.error.style;
const borderSizes = appConfig.theme.border.sizes;
const spacingEntry = appConfig.theme.spacing.entry;

// ═══════════════════════════════════════════════════════
// COMPONENT
// ═══════════════════════════════════════════════════════
export function Select({
  label,
  value,
  onChange,
  options,
  placeholder,
  error,
  disabled = false,
  required = false,
  className = ''
}: SelectProps) {
  const state = error ? 'error' : disabled ? 'disabled' : 'default';
  const entryColors = appConfig.theme.colors.dialog;

  // State-based colors
  const stateColors = {
    default: { border: entryColors.entryBorder, bg: colorsConfig.bg.card },
    error: { border: entryColors.entryError, bg: colorsConfig.bg.card },
    disabled: { border: entryColors.entryBorderDisabled, bg: entryColors.entryDisabled }
  };
  const stateStyles = stateColors[state];

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
      <select
        value={value}
        onChange={onChange}
        disabled={disabled}
        required={required}
        className="w-full"
        style={{
          height: inputConfigBase.height,
          paddingLeft: inputConfigBase.paddingX,
          paddingRight: '2.5rem',
          borderRadius: inputConfigBase.radius,
          borderWidth: borderSizes.thin,
          borderStyle: 'solid',
          borderColor: stateStyles.border,
          backgroundColor: stateStyles.bg,
          color: colorsConfig.text.active,
          fontSize: labelStyleConfig.fontSize,
          transition: appConfig.ui.tokens.transition.colors150,
          outline: appConfig.ui.entry.input.focus.outline,
          cursor: disabled ? appConfig.ui.entry.select.cursor.disabled : appConfig.ui.entry.select.cursor.default,
          appearance: appConfig.ui.entry.select.style.appearance,
          backgroundImage: appConfig.ui.entry.select.style.backgroundImage,
          backgroundPosition: appConfig.ui.entry.select.style.backgroundPosition,
          backgroundRepeat: appConfig.ui.entry.select.style.backgroundRepeat,
          backgroundSize: appConfig.ui.entry.select.style.backgroundSize
        }}
      >
        {placeholder && (
          <option value="" disabled>
            {placeholder}
          </option>
        )}
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      {error && <span style={{ fontSize: errorStyleConfig.fontSize, color: colorsConfig.red[500] }}>{error}</span>}
    </div>
  );
}
