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
const inputConfigBase = appConfig.components.input;

// ═══════════════════════════════════════════════════════
// HELPERS
// ═══════════════════════════════════════════════════════
function getColorValue(colorPath: string): string {
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
  const stateStyles = inputConfigBase.states[state];

  return (
    <div className={`flex flex-col gap-1 ${className}`}>
      {label && (
        <label className="text-sm font-medium text-neutral-700">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      <select
        value={value}
        onChange={onChange}
        disabled={disabled}
        required={required}
        className={`
          w-full transition-colors duration-150
          focus:outline-none focus:ring-2 focus:ring-primary-500
          ${disabled ? 'cursor-not-allowed' : 'cursor-pointer'}
        `.trim()}
        style={{
          height: inputConfigBase.base.height,
          paddingLeft: inputConfigBase.base.paddingX,
          paddingRight: '2.5rem',
          borderRadius: inputConfigBase.base.borderRadius,
          borderWidth: inputConfigBase.base.borderWidth,
          borderStyle: 'solid',
          borderColor: getColorValue(stateStyles.border || colorsConfig.ui.border),
          backgroundColor: getColorValue(stateStyles.bg || inputConfigBase.base.bg),
          appearance: 'none',
          backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")`,
          backgroundPosition: 'right 0.5rem center',
          backgroundRepeat: 'no-repeat',
          backgroundSize: '1.5em 1.5em'
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
      {error && <span className="text-xs text-red-500">{error}</span>}
    </div>
  );
}
