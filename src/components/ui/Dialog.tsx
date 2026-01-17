/**
 * @file        Dialog.tsx
 * @description Wiederverwendbare Dialog/Modal-Komponente (SEASIDE Dark Theme) + Zentrale Dialog-Schemas
 * @version     0.9.0
 * @created     2025-12-11 01:05:00 CET
 * @updated     2026-01-16 21:00:00 CET
 * @author      Akki Scholze
 *
 * @props
 *   open - Ob der Dialog geöffnet ist
 *   onClose - Close-Handler
 *   title - Dialog-Titel
 *   children - Dialog-Inhalt
 *   actions - Action-Buttons (preferred)
 *   footer - Optionaler Footer-Bereich (deprecated, use actions)
 *
 * @exports
 *   Dialog - Base Dialog Container
 *   DialogForm - Form Dialog mit automatischem Field-Rendering
 *   DialogDynamic - Schema-basierter Dialog für alle Pages
 *
 * @changelog
 *   0.9.0 - 2026-01-16 21:00:00 CET - Add: Zentrales Dialog-Schema System (17 Dialoge), 100% config.toml driven
 *   0.8.0 - 2026-01-16 20:40:00 CET - Add: DialogForm component für zentrale Form-Dialoge
 *   0.7.0 - 2026-01-11 18:35:00 CET - Fixed: Config-Zugriff auf appConfig.components.dialog statt appConfig.components.dialog (Config-Struktur-Migration)
 *   0.6.0 - 2026-01-09 - Direct appConfig.* access (spacingConfig/breakpointsConfig eliminiert)
 *   0.4.1 - 2026-01-07 - Fix: actions Prop korrekt implementiert (war nur in Types definiert)
 *   0.4.0 - 2025-12-14 - Responsive: Fullscreen auf Mobile, Touch-freundlicher Close-Button
 *   0.3.0 - 2025-12-11 - Responsive Design, Tailwind-Classes durch spacingConfig ersetzt
 *   0.2.0 - 2025-12-11 - SEASIDE Dark Theme, Config-Driven Colors
 *   0.1.0 - 2025-12-11 - Initial version
 */

// ═══════════════════════════════════════════════════════
// IMPORTS
// ═══════════════════════════════════════════════════════
import { useEffect, useCallback, useState } from 'react';
import type { DialogProps, DialogDynamicProps, DialogSchema, FormField, DialogFormProps } from '@/types/ui.types';
import { appConfig } from '@/config';
import { X } from 'lucide-react';
import { useResponsive } from '@/hooks/useResponsive';
import { Button } from './Button';
import { Input } from './Input';
import { Select } from './Select';
import { Infobox } from './Infobox';

// Config shortcuts
const colorsConfig = appConfig.theme.colors;
const spacingDialog = appConfig.theme.spacing.dialog;

// ═══════════════════════════════════════════════════════
// COMPONENT
// ═══════════════════════════════════════════════════════
export function Dialog({ open = true, onClose, title, children, actions, footer, className = '' }: DialogProps) {
  const { isMobile } = useResponsive();

  // Handle escape key
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    },
    [onClose]
  );

  useEffect(() => {
    if (open) {
      document.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [open, handleKeyDown]);

  if (!open) {
    return null;
  }

  // ═══════════════════════════════════════════════════════
  // RESPONSIVE STYLES
  // ═══════════════════════════════════════════════════════

  // Dialog Container Style
  const dialogContainerMobile = appConfig.ui.dialogs.container.style.mobile;
  const dialogContainerDesktop = appConfig.ui.dialogs.container.style.desktop;
  const containerStyle: React.CSSProperties = isMobile
    ? {
        // MOBILE: Fullscreen
        position: dialogContainerMobile.position as React.CSSProperties['position'],
        top: dialogContainerMobile.top,
        left: dialogContainerMobile.left,
        right: dialogContainerMobile.right,
        bottom: dialogContainerMobile.bottom,
        zIndex: dialogContainerMobile.zIndex,
        backgroundColor: colorsConfig.bg.card,
        borderRadius: dialogContainerMobile.borderRadius,
        padding: dialogContainerMobile.padding,
        overflow: dialogContainerMobile.overflow,
        display: dialogContainerMobile.display,
        flexDirection: dialogContainerMobile.flexDirection as React.CSSProperties['flexDirection']
      }
    : {
        // DESKTOP: Centered Modal
        position: dialogContainerDesktop.position as React.CSSProperties['position'],
        zIndex: dialogContainerDesktop.zIndex,
        backgroundColor: colorsConfig.bg.card,
        borderRadius: appConfig.theme.border.radius.body,
        boxShadow: appConfig.theme.shadows.dialog,
        padding: spacingDialog.padding,
        maxWidth: dialogContainerDesktop.maxWidth,
        width: dialogContainerDesktop.width,
        maxHeight: dialogContainerDesktop.maxHeight,
        overflow: dialogContainerDesktop.overflow,
        border: `1px solid ${colorsConfig.border.default}`
      };

  // Close Button Style (100% config-driven)
  const dialogCloseBtn = appConfig.ui.dialogs.closeButtons.style;
  const closeButtonStyle: React.CSSProperties = {
    padding: dialogCloseBtn.padding,
    borderRadius: dialogCloseBtn.borderRadius,
    color: colorsConfig.text.hint,
    backgroundColor: colorsConfig.bg[dialogCloseBtn.bg as keyof typeof colorsConfig.bg],
    border: dialogCloseBtn.border,
    cursor: dialogCloseBtn.cursor,
    // Mobile: Größerer Touch-Target
    minWidth: isMobile ? dialogCloseBtn.minWidthMobile : undefined,
    minHeight: isMobile ? dialogCloseBtn.minHeightMobile : undefined,
    display: dialogCloseBtn.display,
    alignItems: dialogCloseBtn.alignItems,
    justifyContent: dialogCloseBtn.justifyContent
  };

  // Footer Style (100% config-driven)
  const dialogFooter = appConfig.ui.dialogs.footer.style;
  const dialogFooterMobile = appConfig.ui.dialogs.footer.style.mobile;
  const dialogFooterDesktop = appConfig.ui.dialogs.footer.style.desktop;
  const footerStyle: React.CSSProperties = {
    display: dialogFooter.display,
    justifyContent: isMobile ? dialogFooterMobile.justifyContent : dialogFooterDesktop.justifyContent,
    flexDirection: (isMobile
      ? dialogFooterMobile.flexDirection
      : dialogFooterDesktop.flexDirection) as React.CSSProperties['flexDirection'],
    marginTop: isMobile ? dialogFooterMobile.marginTop : dialogFooterDesktop.marginTop,
    paddingTop: isMobile ? dialogFooterMobile.paddingTop : undefined,
    gap: spacingDialog.actionsGap
  };

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 50,
        // Wrapper-Layout ist fix für Dialogs (zentriert), aber explizit für clarity
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}
    >
      {/* Overlay - nur auf Desktop */}
      {!isMobile && (
        <div
          style={{
            position: appConfig.ui.dialogs.overlay.style.position as React.CSSProperties['position'],
            inset: appConfig.ui.dialogs.overlay.style.inset,
            backgroundColor: colorsConfig.bg.overlay,
            cursor: appConfig.ui.dialogs.overlay.style.cursor
          }}
          onClick={onClose}
        />
      )}

      {/* Dialog Container */}
      <div className={className} style={containerStyle}>
        {/* Header */}
        <div
          style={{
            display: appConfig.ui.dialogs.header.style.display,
            alignItems: appConfig.ui.dialogs.header.style.alignItems,
            justifyContent: appConfig.ui.dialogs.header.style.justifyContent,
            marginBottom: isMobile ? '20px' : spacingDialog.contentGap
          }}
        >
          <h2
            style={{
              fontSize: isMobile ? '1.25rem' : '1.125rem',
              fontWeight: '600',
              color: colorsConfig.text.active
            }}
          >
            {title}
          </h2>
          <button
            onClick={onClose}
            style={closeButtonStyle}
            onMouseEnter={(e) => {
              if (!isMobile) {
                e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.1)';
                e.currentTarget.style.color = colorsConfig.text.active;
              }
            }}
            onMouseLeave={(e) => {
              if (!isMobile) {
                e.currentTarget.style.backgroundColor = 'transparent';
                e.currentTarget.style.color = colorsConfig.text.hint;
              }
            }}
            aria-label="Schließen"
          >
            <X
              style={{
                height: isMobile ? '1.5rem' : '1.25rem',
                width: isMobile ? '1.5rem' : '1.25rem'
              }}
            />
          </button>
        </div>

        {/* Body */}
        <div
          style={{
            display: appConfig.ui.dialogs.body.style.display,
            flexDirection: appConfig.ui.dialogs.body.style.flexDirection as React.CSSProperties['flexDirection'],
            gap: isMobile ? '20px' : spacingDialog.fieldGap,
            flex: isMobile ? appConfig.ui.dialogs.body.style.mobile.flex : undefined
          }}
        >
          {children}
        </div>

        {/* Footer with Actions (prefer actions over footer) */}
        {(actions || footer) && <div style={footerStyle}>{actions || footer}</div>}
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════
// DIALOG FORM COMPONENT
// ═══════════════════════════════════════════════════════

/**
 * Rendert ein Formular-Feld basierend auf dem Field-Type
 */
function renderField(
  field: FormField,
  value: unknown,
  onChange: (name: string, value: unknown) => void
): React.ReactElement {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const newValue = field.type === 'number' ? parseFloat(e.target.value) || 0 : e.target.value;
    onChange(field.name, newValue);
  };

  // Convert value to string safely
  const stringValue =
    value === null || value === undefined
      ? ''
      : typeof value === 'string' || typeof value === 'number' || typeof value === 'boolean'
        ? String(value)
        : '';

  if (field.type === 'text' || field.type === 'textarea') {
    return (
      <Input
        key={field.name}
        label={field.label}
        value={stringValue}
        onChange={handleChange}
        required={field.required}
        disabled={field.disabled}
        placeholder={field.placeholder}
      />
    );
  }

  if (field.type === 'number') {
    const numberValue = typeof value === 'number' ? value : 0;
    return (
      <Input
        key={field.name}
        label={field.label}
        type="number"
        value={String(numberValue)}
        onChange={handleChange}
        step={field.step}
        min={field.min}
        max={field.max}
        required={field.required}
        disabled={field.disabled}
        placeholder={field.placeholder}
      />
    );
  }

  if (field.type === 'date') {
    return (
      <Input
        key={field.name}
        label={field.label}
        type="date"
        value={stringValue}
        onChange={handleChange}
        required={field.required}
        disabled={field.disabled}
      />
    );
  }

  if (field.type === 'select') {
    return (
      <Select
        key={field.name}
        label={field.label}
        value={stringValue}
        onChange={handleChange}
        options={field.options || []}
        required={field.required}
        disabled={field.disabled}
      />
    );
  }

  // checkbox
  return <div key={field.name}>Unsupported field type: checkbox</div>;
}

/**
 * Dialog.Form - Generischer Form Dialog mit automatischem Field-Rendering
 * Zentralisiert Form-Logik für Standard CRUD-Operationen
 */
export function DialogForm({
  open,
  onClose,
  title,
  fields,
  initialData = {},
  onSubmit,
  submitLabel = 'Speichern',
  cancelLabel = 'Abbrechen'
}: DialogFormProps) {
  const [formData, setFormData] = useState<Record<string, unknown>>(initialData);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Reset form when dialog opens/closes or initialData changes
  useEffect(() => {
    if (open) {
      setFormData(initialData);
      setError(null);
    }
  }, [open, initialData]);

  // Handle field change
  const handleChange = (name: string, value: unknown) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Handle submit
  const handleSubmit = () => {
    void (async () => {
      setLoading(true);
      setError(null);
      try {
        await onSubmit(formData);
        onClose();
      } catch (err: unknown) {
        setError((err as Error)?.message || 'Fehler beim Speichern');
      } finally {
        setLoading(false);
      }
    })();
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      title={title}
      actions={
        <>
          <Button.Rect onClick={onClose} disabled={loading}>
            {cancelLabel}
          </Button.Rect>
          <Button.Rect onClick={handleSubmit} disabled={loading}>
            {loading ? 'Wird gespeichert...' : submitLabel}
          </Button.Rect>
        </>
      }
    >
      {error && (
        <Infobox variant="error" title="Fehler">
          {error}
        </Infobox>
      )}
      <div className="space-y-3 w-full max-w-md">
        {fields.map((field: FormField) => renderField(field, formData[field.name], handleChange))}
      </div>
    </Dialog>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════════════════════════
// ZENTRALE DIALOG-SCHEMAS (für alle Pages)
// ═══════════════════════════════════════════════════════════════════════════════════════════════════

const dialogSchemas: Record<string, Record<string, DialogSchema>> = {
  material: {
    create: {
      title: 'Neues Material',
      fields: [
        { name: 'datum', label: 'Datum', type: 'date', required: true },
        { name: 'bezeichnung', label: 'Bezeichnung', type: 'text', required: true },
        { name: 'menge', label: 'Menge', type: 'number', step: '1', min: 0, required: true },
        { name: 'vk_stueck', label: 'VK/Stück', type: 'number', step: '0.10', min: 0, required: true },
        { name: 'notiz', label: 'Notiz (optional)', type: 'text' }
      ]
    },
    edit: {
      title: 'Material bearbeiten',
      fields: [
        { name: 'datum', label: 'Datum', type: 'date', required: true },
        { name: 'bezeichnung', label: 'Bezeichnung', type: 'text', required: true },
        { name: 'vk_stueck', label: 'VK/Stück', type: 'number', step: '0.10', min: 0, required: true },
        { name: 'notiz', label: 'Notiz', type: 'text' }
      ]
    },
    delete: {
      title: 'Material löschen?',
      confirmText: 'Möchten Sie "{bezeichnung}" wirklich löschen?',
      fields: []
    },
    bar: {
      title: 'BAR Buchung',
      fields: [
        { name: 'datum', label: 'Datum', type: 'date', required: true },
        { name: 'menge', label: 'Menge', type: 'number', step: '1', min: 0, required: true },
        { name: 'info', label: 'Info', type: 'text' },
        { name: 'notiz', label: 'Notiz', type: 'text' }
      ]
    },
    rechnung: {
      title: 'Rechnung Buchung',
      fields: [
        { name: 'kunde_id', label: 'Kunde', type: 'select', options: [], required: true },
        { name: 'datum', label: 'Datum', type: 'date', required: true },
        { name: 'menge', label: 'Menge', type: 'number', step: '1', min: 0, required: true },
        { name: 'notiz', label: 'Notiz', type: 'text' }
      ]
    },
    historie: {
      title: 'Historie: {bezeichnung}',
      fields: [],
      customBody: true
    }
  },
  kunden: {
    create: {
      title: 'Neuer Kunde',
      fields: [
        { name: 'name', label: 'Name', type: 'text', required: true },
        { name: 'adresse', label: 'Adresse', type: 'text' },
        { name: 'plz', label: 'PLZ', type: 'text' },
        { name: 'ort', label: 'Ort', type: 'text' },
        { name: 'telefon', label: 'Telefon', type: 'text' },
        { name: 'email', label: 'E-Mail', type: 'text' },
        { name: 'notiz', label: 'Notiz', type: 'text' }
      ]
    },
    edit: {
      title: 'Kunde bearbeiten',
      fields: [
        { name: 'name', label: 'Name', type: 'text', required: true },
        { name: 'adresse', label: 'Adresse', type: 'text' },
        { name: 'plz', label: 'PLZ', type: 'text' },
        { name: 'ort', label: 'Ort', type: 'text' },
        { name: 'telefon', label: 'Telefon', type: 'text' },
        { name: 'email', label: 'E-Mail', type: 'text' },
        { name: 'notiz', label: 'Notiz', type: 'text' }
      ]
    },
    delete: {
      title: 'Kunde löschen?',
      confirmText: 'Möchten Sie "{name}" wirklich löschen?',
      fields: []
    }
  },
  kundenDetail: {
    postenNoMat: {
      title: 'Neuer Posten (ohne Material)',
      fields: [
        { name: 'datum', label: 'Datum', type: 'date', required: true },
        { name: 'bezeichnung', label: 'Bezeichnung', type: 'text', required: true },
        { name: 'menge', label: 'Menge', type: 'number', step: '1', min: 0, required: true },
        { name: 'preis', label: 'Preis', type: 'number', step: '0.10', min: 0, required: true },
        { name: 'notiz', label: 'Notiz', type: 'text' }
      ]
    },
    postenMat: {
      title: 'Rechnung (mit Material)',
      fields: [
        { name: 'material_id', label: 'Material', type: 'select', options: [], required: true },
        { name: 'kunde_id', label: 'Kunde', type: 'select', options: [], required: true },
        { name: 'datum', label: 'Datum', type: 'date', required: true },
        { name: 'menge', label: 'Menge', type: 'number', step: '1', min: 0, required: true },
        { name: 'preis', label: 'Preis', type: 'number', step: '0.10', min: 0, required: true },
        { name: 'notiz', label: 'Notiz', type: 'text' }
      ]
    }
  },
  schuldner: {
    create: {
      title: 'Neuer Schuldner',
      fields: [
        { name: 'name', label: 'Name', type: 'text', required: true },
        { name: 'betrag', label: 'Betrag', type: 'number', step: '0.01', min: 0, required: true },
        { name: 'datum', label: 'Datum', type: 'date', required: true },
        { name: 'notiz', label: 'Notiz', type: 'text' }
      ]
    },
    edit: {
      title: 'Schuldner bearbeiten',
      fields: [
        { name: 'name', label: 'Name', type: 'text', required: true },
        { name: 'betrag', label: 'Betrag', type: 'number', step: '0.01', min: 0, required: true },
        { name: 'datum', label: 'Datum', type: 'date', required: true },
        { name: 'notiz', label: 'Notiz', type: 'text' }
      ]
    },
    delete: {
      title: 'Schuldner löschen?',
      confirmText: 'Möchten Sie "{name}" wirklich löschen?',
      fields: []
    }
  },
  glaeubiger: {
    create: {
      title: 'Neuer Gläubiger',
      fields: [
        { name: 'name', label: 'Name', type: 'text', required: true },
        { name: 'betrag', label: 'Betrag', type: 'number', step: '0.01', min: 0, required: true },
        { name: 'datum', label: 'Datum', type: 'date', required: true },
        { name: 'notiz', label: 'Notiz', type: 'text' }
      ]
    },
    edit: {
      title: 'Gläubiger bearbeiten',
      fields: [
        { name: 'name', label: 'Name', type: 'text', required: true },
        { name: 'betrag', label: 'Betrag', type: 'number', step: '0.01', min: 0, required: true },
        { name: 'datum', label: 'Datum', type: 'date', required: true },
        { name: 'notiz', label: 'Notiz', type: 'text' }
      ]
    },
    delete: {
      title: 'Gläubiger löschen?',
      confirmText: 'Möchten Sie "{name}" wirklich löschen?',
      fields: []
    }
  }
};

// ═══════════════════════════════════════════════════════════════════════════════════════════════════
// DIALOG DYNAMIC COMPONENT (Schema-basiertes Rendering)
// ═══════════════════════════════════════════════════════════════════════════════════════════════════

export function DialogDynamic({
  schema,
  open,
  onClose,
  onSubmit,
  initialData = {},
  data = {},
  customBody,
  options = {}
}: DialogDynamicProps) {
  const [category, action] = schema.split('.');
  const dialogConfig = dialogSchemas[category]?.[action];

  if (!dialogConfig) {
    console.error(`Dialog schema not found: ${schema}`);
    return null;
  }

  const [formData, setFormData] = useState<Record<string, unknown>>(initialData);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Reset form when dialog opens/closes
  useEffect(() => {
    if (open) {
      setFormData(initialData);
      setError(null);
    }
  }, [open, initialData]);

  // Handle field change
  const handleChange = (name: string, value: unknown) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Handle submit
  const handleSubmit = () => {
    void (async () => {
      setLoading(true);
      setError(null);
      try {
        await onSubmit(formData);
        onClose();
      } catch (err: unknown) {
        setError((err as Error)?.message || 'Fehler beim Speichern');
      } finally {
        setLoading(false);
      }
    })();
  };

  // Interpolate title with data
  const interpolatedTitle = dialogConfig.title.replace(/\{(\w+)\}/g, (_, key: string) => {
    const val = data[key];
    if (val === null || val === undefined) return '';
    if (typeof val === 'string' || typeof val === 'number' || typeof val === 'boolean') {
      return String(val);
    }
    return '';
  });

  // Delete Dialog (Confirmation ohne Felder)
  if (dialogConfig.fields.length === 0 && dialogConfig.confirmText) {
    const confirmText = dialogConfig.confirmText.replace(/\{(\w+)\}/g, (_, key: string) => {
      const val = data[key];
      if (val === null || val === undefined) return '';
      if (typeof val === 'string' || typeof val === 'number' || typeof val === 'boolean') {
        return String(val);
      }
      return '';
    });
    return (
      <Dialog
        open={open}
        onClose={onClose}
        title={interpolatedTitle}
        actions={
          <>
            <Button.Rect onClick={onClose}>Abbrechen</Button.Rect>
            <Button.Rect onClick={handleSubmit} disabled={loading}>
              {loading ? 'Wird gelöscht...' : 'Löschen'}
            </Button.Rect>
          </>
        }
      >
        <p>{confirmText}</p>
      </Dialog>
    );
  }

  // Custom Body Dialog (z.B. Historie)
  if (dialogConfig.customBody && customBody) {
    return (
      <Dialog
        open={open}
        onClose={onClose}
        title={interpolatedTitle}
        actions={<Button.Rect onClick={onClose}>Schließen</Button.Rect>}
      >
        {customBody}
      </Dialog>
    );
  }

  // Standard Form Dialog
  const fieldsWithOptions = dialogConfig.fields.map((field) => {
    if (field.type === 'select') {
      const fieldOptions = options[field.name];
      if (fieldOptions && Array.isArray(fieldOptions)) {
        return { ...field, options: fieldOptions as Array<{ value: string; label: string }> };
      }
    }
    return field;
  });

  return (
    <Dialog
      open={open}
      onClose={onClose}
      title={interpolatedTitle}
      actions={
        <>
          <Button.Rect onClick={onClose} disabled={loading}>
            Abbrechen
          </Button.Rect>
          <Button.Rect onClick={handleSubmit} disabled={loading}>
            {loading ? 'Wird gespeichert...' : 'Speichern'}
          </Button.Rect>
        </>
      }
    >
      {error && (
        <Infobox variant="error" title="Fehler">
          {error}
        </Infobox>
      )}
      <div className="space-y-3 w-full max-w-md">
        {fieldsWithOptions.map((field) => {
          const value = formData[field.name];
          const handleFieldChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
            const newValue = field.type === 'number' ? parseFloat(e.target.value) || 0 : e.target.value;
            handleChange(field.name, newValue);
          };

          const stringValue =
            value === null || value === undefined
              ? ''
              : typeof value === 'string' || typeof value === 'number' || typeof value === 'boolean'
                ? String(value)
                : '';

          if (field.type === 'select') {
            return (
              <Select
                key={field.name}
                label={field.label}
                value={stringValue}
                onChange={handleFieldChange}
                options={field.options || []}
                required={field.required}
                disabled={field.disabled}
              />
            );
          }

          if (field.type === 'number') {
            const numberValue = typeof value === 'number' ? value : 0;
            return (
              <Input
                key={field.name}
                label={field.label}
                type="number"
                value={String(numberValue)}
                onChange={handleFieldChange}
                step={field.step}
                min={field.min}
                max={field.max}
                required={field.required}
                disabled={field.disabled}
                placeholder={field.placeholder}
              />
            );
          }

          if (field.type === 'date') {
            return (
              <Input
                key={field.name}
                label={field.label}
                type="date"
                value={stringValue}
                onChange={handleFieldChange}
                required={field.required}
                disabled={field.disabled}
              />
            );
          }

          // text or textarea
          return (
            <Input
              key={field.name}
              label={field.label}
              type={field.type === 'textarea' ? 'textarea' : 'text'}
              value={stringValue}
              onChange={handleFieldChange}
              required={field.required}
              disabled={field.disabled}
              placeholder={field.placeholder}
            />
          );
        })}
      </div>
    </Dialog>
  );
}
