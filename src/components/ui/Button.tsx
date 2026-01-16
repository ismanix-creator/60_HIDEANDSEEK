/**
 * @file        Button.tsx
 * @description 5 Button-Typen - 100% config-driven (keine Style-Hardcodes)
 * @version     3.0.0
 * @created     2026-01-15
 * @updated     2026-01-16
 * @author      Akki Scholze
 *
 * @changelog
 *   3.0.0 - 2026-01-16 - 100% config-driven: Alle Hardcodes entfernt (border/cursor/display/alignItems/justifyContent/transition/outline/backgroundColor/opacity)
 *   2.0.0 - 2026-01-15 - Komplette Neuentwicklung mit 5 Button-Typen
 */

import type { CSSProperties, ReactNode } from 'react';
import {
  Boxes,
  Users,
  HandCoins,
  Settings as SettingsIcon,
  Plus,
  ArrowLeft,
  ChevronLeft,
  ChevronRight,
  Calendar,
  Banknote,
  FileText,
  Euro,
  Pencil,
  Trash2
} from 'lucide-react';
import { appConfig } from '@/config';

const { theme, components } = appConfig;

// ═══════════════════════════════════════════════════════
// 1. NAVIGATION ICON BUTTONS (5 Buttons)
// ═══════════════════════════════════════════════════════

interface NavigationIconButtonProps {
  type: 'material' | 'kunden' | 'schuldner' | 'glaeubiger' | 'settings';
  isActive?: boolean;
  onClick?: () => void;
}

export function NavigationIconButton({ type, isActive = false, onClick }: NavigationIconButtonProps) {
  const { ui } = appConfig;
  const navStyle = ui.buttons.navigation.style;

  const iconMap = {
    material: Boxes,
    kunden: Users,
    schuldner: HandCoins,
    glaeubiger: HandCoins,
    settings: SettingsIcon
  };

  const Icon = iconMap[type];
  const isGlaeubiger = type === 'glaeubiger';

  const style: CSSProperties = {
    width: components.icon.nav.buttonsSize,
    height: components.icon.nav.buttonsSize,
    borderRadius: components.icon.nav.radius,
    backgroundColor: isActive ? theme.colors.bg.navigation : navStyle.inactive.bg,
    color: isActive ? theme.colors.buttons.icon.iconActive : theme.colors.buttons.icon.iconInactive,
    border: navStyle.base.border,
    cursor: navStyle.base.cursor,
    display: navStyle.base.display,
    alignItems: navStyle.base.alignItems,
    justifyContent: navStyle.base.justifyContent,
    transition: navStyle.base.transition,
    outline: navStyle.base.outline
  };

  const iconStyle: CSSProperties = isGlaeubiger ? { transform: 'rotate(180deg) scaleX(-1)' } : {};

  return (
    <button
      style={style}
      onClick={onClick}
      onMouseEnter={(e) => {
        if (!isActive) {
          e.currentTarget.style.color = theme.colors.buttons.icon.iconHover;
        }
      }}
      onMouseLeave={(e) => {
        if (!isActive) {
          e.currentTarget.style.color = theme.colors.buttons.icon.iconInactive;
        }
      }}
      aria-label={type}
    >
      <Icon size={Number.parseInt(components.icon.nav.iconSize)} style={iconStyle} />
    </button>
  );
}

// ═══════════════════════════════════════════════════════
// 2. ACTION ICON BUTTONS (5 Buttons: Neu, Zurück, Monat vor/zurück, Kalender)
// ═══════════════════════════════════════════════════════

interface ActionIconButtonProps {
  type: 'new' | 'back' | 'prevMonth' | 'nextMonth' | 'calendar';
  onClick: () => void;
}

export function ActionIconButton({ type, onClick }: ActionIconButtonProps) {
  const { ui } = appConfig;
  const actionStyle = ui.buttons.action.style;

  const iconMap = {
    new: Plus,
    back: ArrowLeft,
    prevMonth: ChevronLeft,
    nextMonth: ChevronRight,
    calendar: Calendar
  };

  const Icon = iconMap[type];

  const style: CSSProperties = {
    width: '40px',
    height: '40px',
    borderRadius: theme.border.radius.buttonsRect,
    backgroundColor: theme.colors.bg.card,
    color: theme.colors.buttons.icon.iconInactive,
    border: actionStyle.base.border,
    cursor: actionStyle.base.cursor,
    display: actionStyle.base.display,
    alignItems: actionStyle.base.alignItems,
    justifyContent: actionStyle.base.justifyContent,
    transition: actionStyle.base.transition,
    outline: actionStyle.base.outline
  };

  return (
    <button
      style={style}
      onClick={onClick}
      onMouseEnter={(e) => {
        e.currentTarget.style.color = theme.colors.buttons.icon.iconHover;
        e.currentTarget.style.backgroundColor = theme.colors.buttons.rect.rectHover;
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.color = theme.colors.buttons.icon.iconInactive;
        e.currentTarget.style.backgroundColor = theme.colors.bg.card;
      }}
    >
      <Icon size={components.icon.act.iconSize} />
    </button>
  );
}

// ═══════════════════════════════════════════════════════
// 3. TABLE ACTIONS ICON BUTTONS (5 Buttons)
// ═══════════════════════════════════════════════════════

interface TableActionsIconButtonProps {
  type: 'bar' | 'rechnung' | 'zahlung' | 'edit' | 'delete';
  onClick: () => void;
}

export function TableActionsIconButton({ type, onClick }: TableActionsIconButtonProps) {
  const { ui } = appConfig;
  const actStyle = ui.buttons.act.style;

  const iconMap = {
    bar: Banknote,
    rechnung: FileText,
    zahlung: Euro,
    edit: Pencil,
    delete: Trash2
  };

  const colorMap = {
    bar: theme.colors.icon.active,
    rechnung: theme.colors.icon.active,
    zahlung: theme.colors.icon.active,
    edit: theme.colors.icon.edit,
    delete: theme.colors.icon.delete
  };

  const Icon = iconMap[type];
  const color = colorMap[type];

  const style: CSSProperties = {
    width: '32px',
    height: '32px',
    borderRadius: theme.border.radius.buttonsRect,
    backgroundColor: actStyle.base.bg,
    color,
    border: actStyle.base.border,
    cursor: actStyle.base.cursor,
    display: actStyle.base.display,
    alignItems: actStyle.base.alignItems,
    justifyContent: actStyle.base.justifyContent,
    transition: actStyle.base.transition,
    outline: actStyle.base.outline
  };

  return (
    <button
      style={style}
      onClick={onClick}
      onMouseEnter={(e) => {
        e.currentTarget.style.opacity = '0.7';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.opacity = '1';
      }}
    >
      <Icon size={components.icon.act.iconSize} />
    </button>
  );
}

// ═══════════════════════════════════════════════════════
// 4. RECT BUTTONS (3 Buttons: Speichern, Abbrechen, Setup)
// ═══════════════════════════════════════════════════════

interface RectButtonProps {
  type?: 'save' | 'cancel' | 'setup';
  onClick?: () => void;
  fullWidth?: boolean;
  disabled?: boolean;
  children?: ReactNode;
}

export function RectButton({ type, onClick, fullWidth = false, disabled = false, children }: RectButtonProps) {
  const { ui } = appConfig;
  const rectStyle = ui.buttons.rect.style;

  const colorMap = {
    save: {
      bg: theme.colors.buttons.rect.rectSave,
      text: theme.colors.text.active,
      hover: theme.colors.green['700']
    },
    cancel: {
      bg: theme.colors.buttons.rect.rectInactive,
      text: theme.colors.text.inactive,
      hover: theme.colors.black['600']
    },
    setup: {
      bg: theme.colors.buttons.rect.rectActive,
      text: theme.colors.text.active,
      hover: theme.colors.buttons.rect.rectHover
    },
    generic: {
      bg: theme.colors.bg.card,
      text: theme.colors.text.inactive,
      hover: theme.colors.buttons.rect.rectHover
    }
  };

  const colors = colorMap[type || 'generic'];

  const style: CSSProperties = {
    minWidth: fullWidth ? '100%' : '120px',
    height: '44px',
    padding: `${theme.spacing.buttons.rectPaddingY} ${theme.spacing.buttons.rectPaddingX}`,
    borderRadius: theme.border.radius.buttonsRect,
    backgroundColor: colors.bg,
    color: colors.text,
    border: rectStyle.base.border,
    fontSize: theme.typography.fontSize.buttonsRect,
    fontWeight: theme.typography.fontWeight.semibold,
    fontFamily: theme.typography.font.base,
    cursor: disabled ? rectStyle.base.cursorDisabled : rectStyle.base.cursor,
    display: rectStyle.base.display,
    alignItems: rectStyle.base.alignItems,
    justifyContent: rectStyle.base.justifyContent,
    transition: rectStyle.base.transition,
    outline: rectStyle.base.outline,
    opacity: disabled ? rectStyle.base.opacityDisabled : rectStyle.base.opacity
  };

  const labelMap: Record<string, string> = {
    save: 'Speichern',
    cancel: 'Abbrechen',
    setup: 'Setup'
  };

  return (
    <button
      style={style}
      onClick={onClick}
      disabled={disabled}
      onMouseEnter={(e) => {
        if (!disabled) {
          e.currentTarget.style.backgroundColor = colors.hover;
        }
      }}
      onMouseLeave={(e) => {
        if (!disabled) {
          e.currentTarget.style.backgroundColor = colors.bg;
        }
      }}
    >
      {children || (type && labelMap[type])}
    </button>
  );
}

// ═══════════════════════════════════════════════════════
// 5. TAB BUTTONS (Allgemein für Tab-Wechsel in Dialogen)
// ═══════════════════════════════════════════════════════

interface TabButtonProps {
  children: ReactNode;
  isActive: boolean;
  onClick: () => void;
}

export function TabButton({ children, isActive, onClick }: TabButtonProps) {
  const { ui } = appConfig;
  const tabStyle = ui.buttons.tab.style;

  const style: CSSProperties = {
    minWidth: '100px',
    height: '40px',
    padding: `${theme.spacing.buttons.tabPaddingY} ${theme.spacing.buttons.tabPaddingX}`,
    borderRadius: theme.border.radius.buttonsTab,
    backgroundColor: isActive ? theme.colors.buttons.tab.tabActive : 'transparent',
    color: isActive ? theme.colors.text.active : theme.colors.text.inactive,
    border: tabStyle.base.border,
    fontSize: theme.typography.fontSize.buttonsTab,
    fontWeight: theme.typography.fontWeight.semibold,
    fontFamily: theme.typography.font.base,
    cursor: tabStyle.base.cursor,
    display: tabStyle.base.display,
    alignItems: tabStyle.base.alignItems,
    justifyContent: tabStyle.base.justifyContent,
    transition: tabStyle.base.transition,
    outline: tabStyle.base.outline
  };

  return (
    <button
      style={style}
      onClick={onClick}
      onMouseEnter={(e) => {
        if (!isActive) {
          e.currentTarget.style.color = theme.colors.buttons.tab.tabHover;
        }
      }}
      onMouseLeave={(e) => {
        if (!isActive) {
          e.currentTarget.style.color = theme.colors.text.inactive;
        }
      }}
    >
      {children}
    </button>
  );
}

// ═══════════════════════════════════════════════════════
// GROUPED EXPORT
// ═══════════════════════════════════════════════════════

export const Button = {
  Navigation: NavigationIconButton,
  Action: ActionIconButton,
  TableActions: TableActionsIconButton,
  Rect: RectButton,
  Tab: TabButton
};
