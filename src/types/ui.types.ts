/**
 * @file        ui.types.ts
 * @description TypeScript Type Definitions für UI-Komponenten
 * @version     0.2.0
 * @created     2026-01-07 01:18:02 CET
 * @updated     2026-01-09 13:43:15 CET
 * @author      Akki Scholze
 *
 * @changelog
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

export type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger' | 'success' | 'warning' | 'transparent';

export type ButtonSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';

export interface ButtonProps {
  variant?: ButtonVariant;
  size?: ButtonSize;
  disabled?: boolean;
  loading?: boolean;
  fullWidth?: boolean;
  activeBorder?: boolean;
  onClick?: () => void;
  children?: ReactNode;
  className?: string;
  type?: 'button' | 'submit' | 'reset';
  style?: CSSProperties;
  title?: string;
  icon?: ReactNode;
  iconOnly?: boolean;
}

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
}

export interface NavItem {
  key: string;
  label: string;
  path: string;
  icon: string;
  adminOnly?: boolean;
}
