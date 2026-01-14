/**
 * @file        ui.types.ts
 * @description TypeScript Type Definitions für UI-Komponenten
 * @version     0.5.1
 * @created     2026-01-07 01:18:02 CET
 * @updated     2026-01-12 10:45:00 CET
 * @author      Akki Scholze
 *
 * @changelog
 *   0.5.1 - 2026-01-12 - PageLayoutProps: Added optional footerColumns (Footer Grid)
 *   0.4.0 - 2026-01-11 23:30:00 CET - PageLayoutProps: Added optional footer prop
 *   0.3.0 - 2026-01-11 18:00:00 CET - Button types refactored: nav/new/act/rect/tab (replaced icon kind)
 *   0.2.0 - 2026-01-09 - CellType um 'input' erweitert für Monospace User-Input Spalten
 *   0.1.0 - 2026-01-07 - Initial version mit allen UI-Komponenten-Types
 */

import type { ReactNode, CSSProperties } from 'react';

// ═══════════════════════════════════════════════════════
// TABLE TYPES
// ═══════════════════════════════════════════════════════

export type CellType = 'text' | 'number' | 'currency' | 'date' | 'status' | 'actions' | 'input';

export interface TableColumn<T = unknown> {
  key: string;
  label: string;
  type?: CellType;
  render?: (row: T) => ReactNode;
  width?: string;
  align?: 'left' | 'center' | 'right';
  sortable?: boolean;
}

export interface TableProps<T = unknown> {
  columns: TableColumn<T>[];
  data: T[];
  keyField?: string;
  onRowClick?: (row: T) => void;
  emptyMessage?: string;
  loading?: boolean;
  className?: string;
  rowStyle?: (row: T) => CSSProperties;
}

// ═══════════════════════════════════════════════════════
// BUTTON TYPES
// ═══════════════════════════════════════════════════════

export type ButtonKind = 'nav' | 'new' | 'act' | 'tab' | 'rect';
export type ButtonIntent = 'default' | 'save';

/**
 * Button API (v0.15.0+)
 *
 * kind:
 *   - 'nav': Navigation Icons in Sidebar
 *   - 'new': Neu-Button neben Page Header
 *   - 'act': Action Icons in Tabellen (edit, delete, payment, etc.)
 *   - 'tab': Tab-Wechsel in Zahlungshistorien
 *   - 'rect': Standard Text-Buttons (Dialog, Settings)
 *
 * intent (nur für kind='rect'):
 *   - 'default': Standard-Button
 *   - 'save': Grüner Speichern-Button
 */
export interface ButtonProps {
  kind?: ButtonKind; // Default: 'rect'
  intent?: ButtonIntent; // Default: 'default' (only for kind='rect')
  disabled?: boolean;
  loading?: boolean; // Only for kind='rect'
  fullWidth?: boolean; // Only for kind='rect'
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
  children?: ReactNode;
  className?: string;
  type?: 'button' | 'submit' | 'reset';
}

// Legacy type aliases (for reference, will be deprecated)
export type ButtonVariant =
  | 'primary'
  | 'secondary'
  | 'outline'
  | 'ghost'
  | 'danger'
  | 'success'
  | 'warning'
  | 'transparent';
export type ButtonSize = 'btn' | 'icon';

// ═══════════════════════════════════════════════════════
// BADGE TYPES
// ═══════════════════════════════════════════════════════

export type BadgeVariant = 'success' | 'error' | 'warning' | 'pending' | 'neutral';

export interface BadgeProps {
  variant?: BadgeVariant;
  showIcon?: boolean;
  children: ReactNode;
  className?: string;
}

// ═══════════════════════════════════════════════════════
// DIALOG TYPES
// ═══════════════════════════════════════════════════════

export interface DialogProps {
  open: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
  actions?: ReactNode;
  footer?: ReactNode;
  className?: string;
}

// ═══════════════════════════════════════════════════════
// INPUT TYPES
// ═══════════════════════════════════════════════════════

export type InputType = 'text' | 'number' | 'currency' | 'date' | 'password' | 'email';

export interface InputProps {
  type?: InputType;
  label?: string;
  value?: string | number | undefined;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  error?: string;
  disabled?: boolean;
  required?: boolean;
  min?: number;
  max?: number;
  step?: string | number;
  className?: string;
  autoComplete?: string;
  autoFocus?: boolean;
  minLength?: number;
}

// ═══════════════════════════════════════════════════════
// SELECT TYPES
// ═══════════════════════════════════════════════════════

export interface SelectOption {
  value: string | number;
  label: string;
}

export interface SelectProps {
  label?: string;
  value: string | number;
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  options: SelectOption[];
  placeholder?: string;
  error?: string;
  disabled?: boolean;
  required?: boolean;
  className?: string;
}

// ═══════════════════════════════════════════════════════
// INFOBOX TYPES
// ═══════════════════════════════════════════════════════

export type InfoboxVariant = 'info' | 'success' | 'warning' | 'error';

export interface InfoboxProps {
  variant?: InfoboxVariant;
  title?: string;
  children: ReactNode;
  className?: string;
}

// ═══════════════════════════════════════════════════════
// DIVIDER TYPES
// ═══════════════════════════════════════════════════════

export interface MonthDividerProps {
  month: string;
  year?: string | number;
}

// ═══════════════════════════════════════════════════════
// LAYOUT TYPES
// ═══════════════════════════════════════════════════════

export interface PageLayoutProps {
  title: string;
  icon?: string | ReactNode;
  actions?: ReactNode;
  children: ReactNode;
  footer?: ReactNode;
  footerColumns?: number;
  showBackButton?: boolean;
  hideNavigation?: boolean;
}

export interface NavItem {
  key: string;
  label: string;
  path: string;
  icon: string;
  adminOnly?: boolean;
}
