/**
 * @file        Table.tsx
 * @description Wiederverwendbare Table-Komponente (SEASIDE Dark Theme) - Responsive
 * @version     0.5.0
 * @created     2025-12-11 01:05:00 CET
 * @updated     2025-12-15 22:27:01 CET
 * @author      Claude Code CLI
 *
 * @props
 *   columns - Spaltendefinitionen
 *   data - Tabellendaten
 *   keyField - Eindeutiges Schlüsselfeld
 *   onRowClick - Click-Handler für Zeilen
 *   emptyMessage - Nachricht bei leerer Tabelle
 *
 * @changelog
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
import { tableConfig, colorsConfig, typographyConfig, spacingConfig } from '@/config';
import { formatCurrency, formatDate, formatNumber } from '@/utils/format';
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

function formatCellValue<T>(item: T, column: TableColumn<T>): React.ReactNode {
  if (column.render) {
    return column.render(item);
  }

  const value = getCellValue(item, column.key);

  switch (column.type) {
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

const spacingBase = (key: number | string) => spacingConfig.base[String(key) as keyof typeof spacingConfig.base];

const EDGE_PADDING_STEPS = 1;

const getEdgePadding = (key: number | string, steps = EDGE_PADDING_STEPS) => {
  if (steps <= 0) {
    return spacingBase(key);
  }

  const numericKey = typeof key === 'number' ? key : Number(key);
  if (!Number.isNaN(numericKey)) {
    const targetKey = numericKey + steps;
    const candidate = spacingConfig.base[String(targetKey) as keyof typeof spacingConfig.base];
    if (candidate) {
      return candidate;
    }
  }

  return spacingBase(key);
};

function getAlign<T>(_column: TableColumn<T>): CSSProperties['textAlign'] {
  return 'center';
}

function getFontFamily<T>(column: TableColumn<T>): string {
  const typeConfig = column.type ? tableConfig.cellTypes[column.type as keyof typeof tableConfig.cellTypes] : undefined;
  const base = tableConfig.cell.fontFamily;
  const fontFamilyOverride = typeConfig && 'fontFamily' in typeConfig ? typeConfig.fontFamily : undefined;
  const chosen: string = (fontFamilyOverride as string | undefined) || (base as string | undefined) || 'inherit';
  if (chosen === 'mono') return "'JetBrains Mono', monospace";
  return chosen;
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
  emptyMessage,
  loading = false,
  className = ''
}: TableProps<T>) {
  const { isMobile } = useResponsive();

  if (loading) {
    return (
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          paddingTop: spacingBase(tableConfig.loading.paddingY),
          paddingBottom: spacingBase(tableConfig.loading.paddingY)
        }}
      >
        <div
          style={{
            width: `${tableConfig.loading.spinnerSize}px`,
            height: `${tableConfig.loading.spinnerSize}px`,
            border: `2px solid ${getColorValue(tableConfig.loading.spinnerColor)}`,
            borderTopColor: 'transparent',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite'
          }}
        />
      </div>
    );
  }

  if (data.length === 0) {
    return (
      <div
        style={{
          textAlign: 'center',
          paddingTop: spacingBase(tableConfig.empty.paddingY),
          paddingBottom: spacingBase(tableConfig.empty.paddingY),
          color: getColorValue(tableConfig.empty.color)
        }}
      >
        {emptyMessage || tableConfig.empty.text}
      </div>
    );
  }

  const lastColumnIndex = columns.length - 1;
  const headerPaddingY = spacingBase(tableConfig.header.paddingY);
  const headerPaddingX = spacingBase(tableConfig.header.paddingX);
  const headerEdgePadding = getEdgePadding(tableConfig.header.paddingX);
  const cellPaddingY = spacingBase(tableConfig.cell.paddingY);
  const cellPaddingX = spacingBase(tableConfig.cell.paddingX);
  const cellEdgePadding = getEdgePadding(tableConfig.cell.paddingX);

  // ═══════════════════════════════════════════════════════
  // RESPONSIVE STYLES
  // ═══════════════════════════════════════════════════════

  // Wrapper Style mit Horizontal Scroll auf Mobile
  const wrapperStyle: CSSProperties = {
    overflowX: 'auto',
    // Mobile: Smooth Scroll für iOS
    WebkitOverflowScrolling: isMobile ? 'touch' : undefined,
    backgroundColor: getColorValue(tableConfig.wrapper.bg),
    borderRadius: tableConfig.wrapper.borderRadius,
    border: `1px solid ${getColorValue(tableConfig.wrapper.border)}`,
    boxShadow: tableConfig.wrapper.shadow || 'none'
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
              backgroundColor: getColorValue(tableConfig.header.bg)
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
                    fontSize:
                      typographyConfig.fontSize[tableConfig.header.fontSize as keyof typeof typographyConfig.fontSize],
                    fontWeight:
                      typographyConfig.fontWeight[
                        tableConfig.header.fontWeight as keyof typeof typographyConfig.fontWeight
                      ],
                    color: getColorValue(tableConfig.header.text),
                    borderBottom: `2px solid ${getColorValue(tableConfig.row.borderBottom)}`
                  }}
                >
                  {column.label}
                </th>
              );
            })}
          </tr>
        </thead>
        <tbody>
          {data.map((item, rowIndex) => {
            const rowKey = String(item[keyField as keyof T]);
            return (
              <tr
                key={rowKey}
                onClick={() => onRowClick?.(item)}
                style={{
                  backgroundColor:
                    rowIndex % 2 === 0 ? getColorValue(tableConfig.row.bgOdd) : getColorValue(tableConfig.row.bgEven),
                  cursor: onRowClick ? 'pointer' : 'default',
                  borderBottom: `1px solid ${getColorValue(tableConfig.row.borderBottom)}`,
                  ...(rowStyle ? rowStyle(item) : undefined)
                }}
                onMouseEnter={(e) => {
                  // Hover nur auf Desktop
                  if (onRowClick && !isMobile) {
                    e.currentTarget.style.backgroundColor = getColorValue(tableConfig.row.bgHover);
                  }
                }}
                onMouseLeave={(e) => {
                  // Hover nur auf Desktop
                  if (!isMobile) {
                    e.currentTarget.style.backgroundColor =
                      rowIndex % 2 === 0 ? getColorValue(tableConfig.row.bgOdd) : getColorValue(tableConfig.row.bgEven);
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
                      style={{
                        width: column.width,
                        minWidth: column.width,
                        paddingTop: cellPaddingY,
                        paddingBottom: cellPaddingY,
                        paddingLeft: isFirst ? cellEdgePadding : cellPaddingX,
                        paddingRight: isLast ? cellEdgePadding : cellPaddingX,
                        textAlign: getAlign(column),
                        fontSize:
                          typographyConfig.fontSize[
                            tableConfig.cell.fontSize as keyof typeof typographyConfig.fontSize
                          ],
                        color: getColorValue(tableConfig.cell.text),
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
                        {formatCellValue(item, column)}
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
