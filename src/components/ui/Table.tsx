/**
 * @file        Table.tsx
 * @description Wiederverwendbare Table-Komponente (SEASIDE Dark Theme) - Responsive
 * @version     0.12.0
 * @created     2025-12-11 01:05:00 CET
 * @updated     2026-01-11 22:30:00 CET
 * @author      Akki Scholze
 *
 * @props
 *   columns - Spaltendefinitionen
 *   data - Tabellendaten
 *   keyField - Eindeutiges Schlüsselfeld
 *   onRowClick - Click-Handler für Zeilen
 *   emptyMessage - Nachricht bei leerer Tabelle
 *
 * @changelog
 *   0.12.0 - 2026-01-11 22:30:00 - Feature: minRows Logic implementiert (table.behavior.minRows aus Config)
 *   0.11.0 - 2026-01-11 - Fixed: Config-Zugriff auf appConfig.components.table statt appConfig.components.table (Config-Struktur-Migration)
 *   0.10.0 - 2026-01-11 - Fixed: unused parameter warning in formatCellValue (renamed column to _column)
 *   0.9.0 - 2026-01-10 - Row-Click auf Aktions-Spalte (letzte) ausgeschlossen (Task 2.4.3)
 *   0.8.0 - 2026-01-09 - Direct appConfig.* access (spacingConfig eliminiert)
 *   0.6.0 - 2026-01-09 - overflowY:hidden für konsistente Border-Farbe an borderRadius-Ecken
 *   0.5.0 - 2025-12-14 - Responsive: Horizontal Scroll auf Mobile, WebkitOverflowScrolling
 *   0.4.2 - 2025-12-12 - Optionales rowStyle Callback für zeilenspezifische Styles
 *   0.4.1 - 2025-12-12 - Globale Cell-Font aus tableConfig.cell.fontFamily (Standard jetzt mono)
 *   0.4.0 - 2025-12-12 - Header/Rows/Zellen konsequent aus tableConfig (bg/padding/textAlign/fontFamily)
 *   0.3.0 - 2025-12-11 - Spacing-Berechnungen vereinfacht, Config-Werte direkt genutzt
 *   0.2.0 - 2025-12-11 - SEASIDE Dark Theme, Config-Driven Styling
 *   0.1.0 - 2025-12-11 - Initial version
 */

// ═══════════════════════════════════════════════════════
// IMPORTS
// ═══════════════════════════════════════════════════════
import type { CSSProperties } from 'react';
import type { TableProps, TableColumn } from '@/types/ui.types';
import { appConfig } from '@/config';
import { formatCurrency, formatDate, formatNumber } from '@/utils/format';
import { useResponsive } from '@/hooks/useResponsive';

const tableConfig = appConfig.components.table;

const colorsConfig = appConfig.theme.colors;
const typographyConfig = appConfig.theme.typography;

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
    const palette = colorsConfig as Record<string, Record<string, string>>;
    const colorCategory = palette[category];
    if (colorCategory && typeof colorCategory === 'object') {
      return colorCategory[shade] || colorPath;
    }
  }
  return colorPath;
}

function getCellValue<T>(item: T, key: string | keyof T): unknown {
  if (typeof key === 'string') {
    return (item as Record<string, unknown>)[key];
  }
  return (item as Record<string, unknown>)[String(key)];
}

function toDisplayString(value: unknown): string {
  if (value === null || value === undefined) {
    return '';
  }
  if (typeof value === 'string') {
    return value;
  }
  if (typeof value === 'number' || typeof value === 'boolean' || typeof value === 'bigint') {
    return value.toString();
  }
  if (typeof value === 'symbol' || typeof value === 'function') {
    return value.toString();
  }
  if (typeof value === 'object') {
    return JSON.stringify(value);
  }
  return '';
}

function formatCellValue<T>(item: T, _column: TableColumn<T>): React.ReactNode {
  if (_column.render) {
    return _column.render(item);
  }

  const value = getCellValue(item, _column.key);

  switch (_column.type) {
    case 'currency':
      return formatCurrency(value as number);
    case 'date':
      return formatDate(value as string);
    case 'number':
      return formatNumber(value as number);
    case 'status':
      return value ? '✅' : '⏳';
    default:
      return toDisplayString(value);
  }
}

// Helper: Tailwind-Scale (0-32) auf spacing (xxs-xxl) mappen
const spacingBase = (key: number | string): string => {
  const keyNum = typeof key === 'number' ? key : parseInt(String(key), 10);
  if (isNaN(keyNum)) return appConfig.theme.spacing.content_gap; // fallback

  if (keyNum <= 0) return appConfig.theme.spacing.tight;
  if (keyNum === 1) return appConfig.theme.spacing.compact;
  if (keyNum === 2) return appConfig.theme.spacing.compact;
  if (keyNum === 3) return appConfig.theme.spacing.element_gap;
  if (keyNum === 4) return appConfig.theme.spacing.content_gap;
  if (keyNum === 5) return appConfig.theme.spacing.content_gap;
  if (keyNum === 6) return appConfig.theme.spacing.panel_padding;
  if (keyNum === 8) return appConfig.theme.spacing.section_padding;
  return appConfig.theme.spacing.page_padding; // 10+
};

const EDGE_PADDING_STEPS = 1;

const getEdgePadding = (key: number | string, steps = EDGE_PADDING_STEPS): string => {
  if (steps <= 0) {
    return spacingBase(key);
  }

  const numericKey = typeof key === 'number' ? key : Number(key);
  if (!Number.isNaN(numericKey)) {
    const targetKey = numericKey + steps;
    const candidate = spacingBase(targetKey);
    if (candidate) {
      return candidate;
    }
  }

  return spacingBase(key);
};

function getAlign<T>(_column: TableColumn<T>): CSSProperties['textAlign'] {
  return 'center';
}

function getFontFamily<T>(_column: TableColumn<T>): string {
  // Use global font family from table config (cellFontMono: boolean)
  const useMono = tableConfig.cellFontMono;
  if (useMono) return appConfig.theme.typography.fontFamily.mono;
  return appConfig.theme.typography.fontFamily.base;
}

// ═══════════════════════════════════════════════════════
// EMPTY ROW HANDLING
// ═══════════════════════════════════════════════════════
type EmptyRow = { isEmpty: true; id: string };

export function isEmptyRow<T>(row: T | EmptyRow): row is EmptyRow {
  return (row as EmptyRow).isEmpty === true;
}

function ensureMinRows<T>(data: T[], minRows: number): Array<T | EmptyRow> {
  const rows: Array<T | EmptyRow> = [...data];
  while (rows.length < minRows) {
    rows.push({ isEmpty: true, id: `empty-${rows.length}` });
  }
  return rows;
}

// ═══════════════════════════════════════════════════════
// COMPONENT
// ═══════════════════════════════════════════════════════
export function Table<T>({
  columns,
  data,
  keyField,
  onRowClick,
  rowStyle,
  loading = false,
  className = ''
}: TableProps<T>) {
  const { isMobile } = useResponsive();

  if (loading) {
    // Fallback: loading nicht in config.toml definiert
    const loadingPaddingY = '2rem';
    const spinnerSize = 32;
    const spinnerColor = colorsConfig.blue?.[500] || '#3b82f6';

    return (
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          paddingTop: loadingPaddingY,
          paddingBottom: loadingPaddingY
        }}
      >
        <div
          style={{
            width: `${spinnerSize}px`,
            height: `${spinnerSize}px`,
            border: `2px solid ${spinnerColor}`,
            borderTopColor: 'transparent',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite'
          }}
        />
      </div>
    );
  }

  // Apply minRows logic from config
  const minRows = tableConfig.behavior.minRows;
  const rowsToRender = ensureMinRows(data, minRows);

  const lastColumnIndex = columns.length - 1;
  const headerPaddingY = spacingBase(tableConfig.cellPaddingY);
  const headerPaddingX = spacingBase(tableConfig.cellPaddingX);
  const headerEdgePadding = getEdgePadding(tableConfig.cellPaddingX);
  const cellPaddingY = spacingBase(tableConfig.cellPaddingY);
  const cellPaddingX = spacingBase(tableConfig.cellPaddingX);
  const cellEdgePadding = getEdgePadding(tableConfig.cellPaddingX);

  // ═══════════════════════════════════════════════════════
  // RESPONSIVE STYLES
  // ═══════════════════════════════════════════════════════

  // Wrapper Style mit Horizontal Scroll auf Mobile
  const wrapperStyle: CSSProperties = {
    overflowX: 'auto',
    overflowY: 'hidden', // Border-Farbe konsistent an borderRadius-Ecken
    // Mobile: Smooth Scroll für iOS
    WebkitOverflowScrolling: isMobile ? 'touch' : undefined,
    backgroundColor: getColorValue(tableConfig.wrapperBg),
    borderRadius: tableConfig.wrapperBorderRadius,
    border: `2px solid ${getColorValue(tableConfig.wrapperBorder)}`,
    boxShadow: appConfig.theme.shadows[tableConfig.wrapperShadow as keyof typeof appConfig.theme.shadows] || 'none'
  };

  // Table Style
  const tableStyle: CSSProperties = {
    width: '100%',
    // Mobile: Mindestbreite für Horizontal Scroll
    minWidth: isMobile ? '800px' : undefined,
    borderCollapse: 'collapse',
    tableLayout: 'fixed'
  };

  return (
    <div className={className} style={wrapperStyle}>
      <table style={tableStyle}>
        <thead>
          <tr
            style={{
              backgroundColor: getColorValue(tableConfig.headerBg)
            }}
          >
            {columns.map((column, columnIndex) => {
              const isFirst = columnIndex === 0;
              const isLast = columnIndex === lastColumnIndex;
              const columnKey = typeof column.key === 'string' ? column.key : String(column.key);
              return (
                <th
                  key={columnKey}
                  style={{
                    width: column.width,
                    minWidth: column.width,
                    paddingTop: headerPaddingY,
                    paddingBottom: headerPaddingY,
                    paddingLeft: isFirst ? headerEdgePadding : headerPaddingX,
                    paddingRight: isLast ? headerEdgePadding : headerPaddingX,
                    textAlign: getAlign(column),
                    fontSize: tableConfig.headerFontSize,
                    fontWeight: tableConfig.headerFontWeight,
                    fontFamily: tableConfig.headerFontMono
                      ? appConfig.theme.typography.fontFamily.mono
                      : appConfig.theme.typography.fontFamily.base,
                    color: getColorValue(tableConfig.headerText),
                    borderBottom: `2px solid ${getColorValue(tableConfig.rowBorderBottom)}`
                  }}
                >
                  {column.label}
                </th>
              );
            })}
          </tr>
        </thead>
        <tbody>
          {rowsToRender.map((item, rowIndex) => {
            const empty = isEmptyRow(item);
            const rowKey = empty ? item.id : String(item[keyField as keyof T]);
            return (
              <tr
                key={rowKey}
                style={{
                  backgroundColor:
                    rowIndex % 2 === 0 ? getColorValue(tableConfig.rowBgOdd) : getColorValue(tableConfig.rowBgEven),
                  cursor: onRowClick && !empty ? 'pointer' : 'default',
                  borderBottom: `2px solid ${getColorValue(tableConfig.rowBorderBottom)}`,
                  ...(rowStyle && !empty ? rowStyle(item) : undefined)
                }}
                onMouseEnter={(e) => {
                  // Hover nur auf Desktop und nicht auf Empty Rows
                  if (onRowClick && !isMobile && !empty) {
                    e.currentTarget.style.backgroundColor = getColorValue(tableConfig.rowBgHover);
                  }
                }}
                onMouseLeave={(e) => {
                  // Hover nur auf Desktop
                  if (!isMobile) {
                    e.currentTarget.style.backgroundColor =
                      rowIndex % 2 === 0 ? getColorValue(tableConfig.rowBgOdd) : getColorValue(tableConfig.rowBgEven);
                  }
                }}
              >
                {columns.map((column, columnIndex) => {
                  const isFirst = columnIndex === 0;
                  const isLast = columnIndex === lastColumnIndex;
                  const columnKey = typeof column.key === 'string' ? column.key : String(column.key);
                  return (
                    <td
                      key={columnKey}
                      onClick={() => {
                        // Row-Click NICHT auf der letzten Spalte (actions) oder auf Empty Rows
                        if (!isLast && onRowClick && !empty) {
                          onRowClick(item);
                        }
                      }}
                      style={{
                        width: column.width,
                        minWidth: column.width,
                        paddingTop: cellPaddingY,
                        paddingBottom: cellPaddingY,
                        paddingLeft: isFirst ? cellEdgePadding : cellPaddingX,
                        paddingRight: isLast ? cellEdgePadding : cellPaddingX,
                        textAlign: getAlign(column),
                        fontSize:
                          typographyConfig.fontSize[tableConfig.cellFontSize as keyof typeof typographyConfig.fontSize],
                        color: getColorValue(tableConfig.cellText),
                        fontFamily: getFontFamily(column)
                      }}
                    >
                      <div
                        style={{
                          display: 'flex',
                          flexDirection: 'column',
                          justifyContent: 'center',
                          alignItems: 'center',
                          textAlign: 'center',
                          width: '100%',
                          height: '100%',
                          gap: spacingBase(0)
                        }}
                      >
                        {empty ? tableConfig.behavior.emptyRowPlaceholder : formatCellValue(item, column)}
                      </div>
                    </td>
                  );
                })}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
