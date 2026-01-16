/**
 * @file        ProgressBar.tsx
 * @description Config-driven ProgressBar-Komponente (2 Varianten: Fortschritt 0→100, Bestand 100→0)
 * @version     1.0.0
 * @created     2026-01-16 02:12:35 CET
 * @updated     2026-01-16 02:12:35 CET
 * @author      Akki Scholze
 *
 * @features
 *   - Fortschritt: 0→100% (mit Prozentzahl im Balken)
 *   - Bestand: 100→0 (mit realer Zahl im Balken: Menge-Gebucht=Bestand)
 *   - 100% config-driven (keine UI-/Layout-Hardcodes)
 *   - Farben aus theme.colors.progress
 *   - Konfiguration aus components.progressbar.scale.*
 *
 * @usage
 *   <ProgressBar variant="progressPercent" value={75} />
 *   <ProgressBar variant="stock" current={30} max={50} />
 *
 * @changelog
 *   1.0.0 - 2026-01-16 02:12:35 CET - Initial version
 */

import type { CSSProperties } from 'react';
import { appConfig } from '@/config';

const { theme, components } = appConfig;

// ═══════════════════════════════════════════════════════
// TYPES
// ═══════════════════════════════════════════════════════

export interface ProgressBarProps {
  /**
   * Variante der ProgressBar:
   * - 'progressPercent': Fortschritt 0→100% (default scale)
   * - 'progressPercent110': Fortschritt 0→110% (erweiterte Skala)
   * - 'stock': Bestand (inverted: 100→0)
   */
  variant: 'progressPercent' | 'progressPercent110' | 'stock';

  /**
   * Aktueller Wert (für progressPercent/progressPercent110)
   */
  value?: number;

  /**
   * Aktueller Bestand (für stock-Variante)
   */
  current?: number;

  /**
   * Maximaler Bestand (für stock-Variante)
   */
  max?: number;

  /**
   * Optionale CSS-Klasse
   */
  className?: string;
}

// ═══════════════════════════════════════════════════════
// HELPER: Resolve Theme Color
// ═══════════════════════════════════════════════════════

function resolveThemeColor(colorPath: string): string {
  const parts = colorPath.split('.');

  if (parts.length === 2) {
    const [category, shade] = parts;
    const colorCategory = theme.colors[category as keyof typeof theme.colors];

    if (colorCategory && typeof colorCategory === 'object') {
      return (colorCategory as Record<string, string>)[shade] || colorPath;
    }
  }

  return colorPath;
}

// ═══════════════════════════════════════════════════════
// HELPER: Get Color from Progress Scale
// ═══════════════════════════════════════════════════════

function getProgressColor(percent: number, direction: 'normal' | 'inverted'): string {
  const progressColors = theme.colors.progress;
  const keys = Object.keys(progressColors)
    .map(Number)
    .sort((a, b) => a - b);

  // Clamp percent to 0-100
  const clampedPercent = Math.max(0, Math.min(100, percent));

  // Für inverted: Farbe basiert auf invertiertem Prozentsatz
  const lookupPercent = direction === 'inverted' ? 100 - clampedPercent : clampedPercent;

  // Find closest key
  let closestKey = keys[0];
  let minDiff = Math.abs(lookupPercent - closestKey);

  for (const key of keys) {
    const diff = Math.abs(lookupPercent - key);
    if (diff < minDiff) {
      minDiff = diff;
      closestKey = key;
    }
  }

  return progressColors[closestKey.toString()];
}

// ═══════════════════════════════════════════════════════
// COMPONENT
// ═══════════════════════════════════════════════════════

export function ProgressBar({ variant, value = 0, current = 0, max = 0, className = '' }: ProgressBarProps) {
  const config = components.progressbar;
  const scaleConfig = config.scale[variant];

  // ═══════════════════════════════════════════════════════
  // CALCULATE VALUES
  // ═══════════════════════════════════════════════════════

  let displayValue: number | string;
  let percent: number;
  let barColor: string;

  if (variant === 'stock') {
    // Bestand: current/max → Prozent für Farbe & Breite
    const actualCurrent = current ?? 0;
    const actualMax = max ?? 0;

    displayValue = actualCurrent; // Reale Zahl im Balken
    percent = actualMax > 0 ? (actualCurrent / actualMax) * 100 : 0;

    barColor = getProgressColor(percent, scaleConfig.direction as 'normal' | 'inverted');
  } else {
    // Fortschritt: value → Prozent
    const actualValue = value ?? 0;
    const scaleMax = scaleConfig.max ?? 100;

    percent = (actualValue / scaleMax) * 100;
    displayValue = `${Math.round(actualValue)}${scaleConfig.unit}`;

    barColor = getProgressColor(actualValue, scaleConfig.direction as 'normal' | 'inverted');
  }

  // Clamp percent for width (0-100%)
  const widthPercent = Math.max(0, Math.min(100, percent));

  // ═══════════════════════════════════════════════════════
  // STYLES (100% config-driven)
  // ═══════════════════════════════════════════════════════

  const containerStyle: CSSProperties = {
    position: 'relative',
    width: '100%',
    height: config.height,
    backgroundColor: resolveThemeColor('eisgraublau.900'),
    borderRadius: config.radius,
    overflow: 'hidden',
    padding: config.padding
  };

  const barStyle: CSSProperties = {
    position: 'absolute',
    top: config.padding,
    left: config.padding,
    bottom: config.padding,
    width: `calc(${widthPercent}% - ${config.padding} * 2)`,
    backgroundColor: barColor,
    borderRadius: `calc(${config.radius} - ${config.padding})`,
    transition: 'width 0.3s ease, background-color 0.3s ease'
  };

  const labelStyle: CSSProperties = {
    position: 'absolute',
    top: '0',
    left: '0',
    right: '0',
    bottom: '0',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '0.75rem',
    fontWeight: 600,
    color: resolveThemeColor('white.900'),
    zIndex: 1,
    pointerEvents: 'none',
    textShadow: '0 1px 2px rgba(0, 0, 0, 0.5)'
  };

  // ═══════════════════════════════════════════════════════
  // RENDER
  // ═══════════════════════════════════════════════════════

  return (
    <div className={className} style={containerStyle}>
      <div style={barStyle} />
      {scaleConfig.showValueInsideBar && <div style={labelStyle}>{displayValue}</div>}
    </div>
  );
}
