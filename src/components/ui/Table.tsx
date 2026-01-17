/**
 * @file        Table.tsx
 * @description Wiederverwendbare Table-Komponente (SEASIDE Dark Theme) - Responsive
 * @version     0.14.0
 * @created     2025-12-11 01:05:00 CET
 * @updated     2026-01-17T03:27:18+01:00
 * @author      Akki Scholze
 *
 * @props
 *   columns - Spaltendefinitionen
 *   data - Tabellendaten
 *   keyField - Eindeutiges Schlüsselfeld (optional, default: 'id')
 *   onRowClick - Click-Handler für Zeilen
 *   emptyMessage - Nachricht bei leerer Tabelle
 *
 * @changelog
 *   0.14.0 - 2026-01-17T03:27:18+01:00 - Fixed: React Key Warning - keyField default 'id' + index fallback für undefined keys
 *   0.13.0 - 2026-01-14 05:50:00 - Feature: ProgressBar und StatusIcon zentral importiert und automatisch gerendert (type: progress/stock/statusMaterial/statusCommon)
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
import { Button } from './Button';
import { ProgressBar } from './ProgressBar';
import { StatusIcon, getMaterialStatus, getCommonStatus } from './StatusIcon';

const tableColors = appConfig.theme.colors.table;
const colorsConfig = appConfig.theme.colors;
const typographyConfig = appConfig.theme.typography;
const tableSpacing = appConfig.theme.spacing.table;

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
    case 'actions':
      // Actions werden direkt aus column.actions gerendert
      if (_column.actions && typeof _column.actions === 'function') {
        const actions = _column.actions(item) as Array<{
          type: 'bar' | 'rechnung' | 'zahlung' | 'edit' | 'delete';
          onClick: () => void;
        }>;
        return (
          <div style={{ display: 'flex', gap: tableSpacing.actionsGap }}>
            {actions.map((action, idx) => (
              <Button.TableActions key={idx} type={action.type} onClick={action.onClick} />
            ))}
          </div>
        );
      }
      return null;
    case 'progress':
      // ProgressBar für Fortschrittsanzeigen (0-100%)
      if (_column.progressValue && typeof _column.progressValue === 'function') {
        const progressValue = _column.progressValue(item);
        const variant = _column.progressVariant || 'progressPercent';
        return <ProgressBar variant={variant} value={progressValue} />;
      }
      return null;
    case 'stock':
      // ProgressBar für Bestandsanzeigen (current/max)
      if (
        _column.stockCurrent &&
        _column.stockMax &&
        typeof _column.stockCurrent === 'function' &&
        typeof _column.stockMax === 'function'
      ) {
        const current = _column.stockCurrent(item);
        const max = _column.stockMax(item);
        return <ProgressBar variant="stock" current={current} max={max} />;
      }
      return null;
    case 'statusMaterial':
      // Status-Icon für Material-Status
      if (_column.statusData && typeof _column.statusData === 'function') {
        const statusData = _column.statusData(item) as { bestand: number; aussenstaende: number; started: boolean };
        const status = getMaterialStatus(statusData.bestand, statusData.aussenstaende, statusData.started);
        return <StatusIcon variant="material" status={status} />;
      }
      return null;
    case 'statusCommon':
      // Status-Icon für Common-Status
      if (_column.statusData && typeof _column.statusData === 'function') {
        const statusData = _column.statusData(item) as { started: boolean; erledigt: boolean };
        const status = getCommonStatus(statusData.started, statusData.erledigt);
        return <StatusIcon variant="common" status={status} />;
      }
      return null;
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

function getAlign<T>(_column: TableColumn<T>): CSSProperties['textAlign'] {
  return 'center';
}

function getFontFamily<T>(_column: TableColumn<T>): string {
  // Use mono font for all table cells
  return typographyConfig.font.mono;
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
    const loadingConfig = appConfig.ui.tables.loading;

    return (
      <div
        style={{
          display: loadingConfig.container.display,
          alignItems: loadingConfig.container.alignItems,
          justifyContent: loadingConfig.container.justifyContent,
          paddingTop: loadingConfig.container.paddingY,
          paddingBottom: loadingConfig.container.paddingY
        }}
      >
        <div
          style={{
            width: loadingConfig.spinner.size,
            height: loadingConfig.spinner.size,
            border: `${loadingConfig.spinner.borderWidth} solid ${getColorValue(loadingConfig.spinner.borderColor)}`,
            borderTopColor: loadingConfig.spinner.borderTopColor,
            borderRadius: loadingConfig.spinner.borderRadius,
            animation: loadingConfig.spinner.animation
          }}
        />
      </div>
    );
  }

  // Apply minRows logic - default 10 if not in config
  const minRows = 10;
  const rowsToRender = ensureMinRows(data, minRows);

  const lastColumnIndex = columns.length - 1;

  // ═══════════════════════════════════════════════════════
  // RESPONSIVE STYLES
  // ═══════════════════════════════════════════════════════

  // Wrapper Style mit Horizontal Scroll auf Mobile
  const wrapperConfig = appConfig.ui.tables.wrapper.style;
  const wrapperStyle: CSSProperties = {
    overflowX: wrapperConfig.overflowX as React.CSSProperties['overflowX'],
    overflowY: wrapperConfig.overflowY as React.CSSProperties['overflowY'],
    WebkitOverflowScrolling: isMobile
      ? (wrapperConfig.webkitOverflowScrollingMobile as React.CSSProperties['WebkitOverflowScrolling'])
      : undefined,
    backgroundColor: colorsConfig.bg.body,
    borderRadius: appConfig.theme.border.radius.body,
    border: `${appConfig.theme.border.sizes.normal} solid ${tableColors.outerBorder}`,
    boxShadow: appConfig.theme.shadows.area
  };

  // Table Style
  const tableStyleConfig = appConfig.ui.tables.table.style;
  const tableStyle: CSSProperties = {
    width: tableStyleConfig.width,
    minWidth: isMobile ? tableStyleConfig.minWidthMobile : undefined,
    borderCollapse: tableStyleConfig.borderCollapse as React.CSSProperties['borderCollapse'],
    tableLayout: tableStyleConfig.tableLayout as React.CSSProperties['tableLayout']
  };

  return (
    <div className={className} style={wrapperStyle}>
      <table style={tableStyle}>
        <thead>
          <tr
            style={{
              backgroundColor: tableColors.headerBg
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
                    paddingTop: tableSpacing.headerPaddingY,
                    paddingBottom: tableSpacing.headerPaddingY,
                    paddingLeft: isFirst ? '20px' : tableSpacing.headerPaddingX,
                    paddingRight: isLast ? '20px' : tableSpacing.headerPaddingX,
                    textAlign: 'center' as React.CSSProperties['textAlign'],
                    fontSize: typographyConfig.fontSize.bodyText,
                    fontWeight: typographyConfig.fontWeight.semibold,
                    fontFamily: typographyConfig.font.mono,
                    color: colorsConfig.text.active,
                    borderBottom: `2px solid ${tableColors.headerDivider}`
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
            // Use keyField (default 'id'), fallback to index if undefined
            const keyFieldToUse = keyField || 'id';
            const keyValue = empty ? item.id : item[keyFieldToUse as keyof T];
            const rowKey = keyValue !== undefined ? String(keyValue) : `row-${rowIndex}`;
            return (
              <tr
                key={rowKey}
                style={{
                  backgroundColor: rowIndex % 2 === 0 ? tableColors.row : tableColors.rowAlt,
                  cursor:
                    onRowClick && !empty
                      ? appConfig.ui.entry.select.cursor.default
                      : appConfig.ui.entry.select.cursor.disabled,
                  borderBottom: `2px solid ${tableColors.divider}`,
                  ...(rowStyle && !empty ? rowStyle(item) : undefined)
                }}
                onMouseEnter={(e) => {
                  if (onRowClick && !isMobile && !empty) {
                    e.currentTarget.style.backgroundColor = tableColors.rowHover;
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isMobile) {
                    e.currentTarget.style.backgroundColor = rowIndex % 2 === 0 ? tableColors.row : tableColors.rowAlt;
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
                        paddingTop: tableSpacing.cellPaddingY,
                        paddingBottom: tableSpacing.cellPaddingY,
                        paddingLeft: isFirst ? '20px' : tableSpacing.cellPaddingX,
                        paddingRight: isLast ? '20px' : tableSpacing.cellPaddingX,
                        textAlign: getAlign(column),
                        fontSize: typographyConfig.fontSize.bodyText,
                        color: colorsConfig.text.active,
                        fontFamily: getFontFamily(column)
                      }}
                    >
                      <div
                        style={{
                          display: appConfig.ui.tables.cell.content.display,
                          flexDirection: appConfig.ui.tables.cell.content
                            .flexDirection as React.CSSProperties['flexDirection'],
                          justifyContent: appConfig.ui.tables.cell.content.justifyContent,
                          alignItems: appConfig.ui.tables.cell.content.alignItems,
                          textAlign: appConfig.ui.tables.cell.content.textAlign as React.CSSProperties['textAlign'],
                          width: appConfig.ui.tables.cell.content.width,
                          height: appConfig.ui.tables.cell.content.height,
                          gap: appConfig.ui.tables.cell.content.gap
                        }}
                      >
                        {empty ? '—' : formatCellValue(item, column)}
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
