/**
 * @file        Dialog.tsx
 * @description Wiederverwendbare Dialog/Modal-Komponente (SEASIDE Dark Theme) - Responsive
 * @version     0.7.0
 * @created     2025-12-11 01:05:00 CET
 * @updated     2026-01-11 18:35:00 CET
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
 * @changelog
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
import { useEffect, useCallback } from 'react';
import type { DialogProps } from '@/types/ui.types';
import { appConfig } from '@/config';

const dialogConfig = appConfig.components.dialog.base;

const colorsConfig = appConfig.theme.colors;
import { X } from 'lucide-react';
import { useResponsive } from '@/hooks/useResponsive';

// Helper: Tailwind-Scale (0-32) auf spacing (semantische Namen) mappen
const spacingBase = (key: number | string): string => {
  const keyNum = typeof key === 'number' ? key : parseInt(String(key), 10);
  if (isNaN(keyNum)) return appConfig.theme.spacing.content_gap; // fallback

  // Tailwind-Scale Mapping:
  // 0 -> tight, 1-2 -> compact, 3 -> element_gap, 4-5 -> content_gap, 6 -> panel_padding, 8 -> section_padding, 10+ -> page_padding
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

  // Touch-Target Minimum (fallback to 44px if not in config)
  const minTouchTarget = `${appConfig.layout.responsive?.touchMinSize || 44}px`;

  // ═══════════════════════════════════════════════════════
  // RESPONSIVE STYLES
  // ═══════════════════════════════════════════════════════

  // Dialog Container Style
  const containerStyle: React.CSSProperties = isMobile
    ? {
        // MOBILE: Fullscreen
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: 10,
        backgroundColor: colorsConfig.ui.backgroundCard,
        borderRadius: 0,
        padding: appConfig.theme.spacing.mobile_section_padding,
        overflow: 'auto',
        display: 'flex',
        flexDirection: 'column'
      }
    : {
        // DESKTOP: Centered Modal
        position: 'relative',
        zIndex: 10,
        backgroundColor: colorsConfig.ui.backgroundCard,
        borderRadius: dialogConfig.container.borderRadius,
        boxShadow: dialogConfig.container.shadow,
        padding: spacingBase(dialogConfig.container.padding),
        maxWidth: dialogConfig.container.maxWidth,
        width: dialogConfig.container.width,
        maxHeight: '90vh',
        overflow: 'auto',
        border: `1px solid ${colorsConfig.ui.border}`
      };

  // Close Button Style
  const closeButtonStyle: React.CSSProperties = {
    padding: spacingBase(1),
    borderRadius: '0.375rem',
    color: colorsConfig.text.tertiary,
    backgroundColor: 'transparent',
    border: 'none',
    cursor: 'pointer',
    // Mobile: Größerer Touch-Target
    minWidth: isMobile ? minTouchTarget : undefined,
    minHeight: isMobile ? minTouchTarget : undefined,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  };

  // Footer Style
  const footerStyle: React.CSSProperties = {
    display: 'flex',
    justifyContent: isMobile ? 'stretch' : 'center',
    flexDirection: isMobile ? 'column' : 'row',
    marginTop: isMobile ? 'auto' : dialogConfig.footer.marginTop,
    paddingTop: isMobile ? appConfig.theme.spacing.mobile_section_padding : undefined,
    paddingLeft: isMobile ? appConfig.theme.spacing.mobile_section_padding : dialogConfig.container.padding,
    paddingRight: isMobile ? appConfig.theme.spacing.mobile_section_padding : dialogConfig.container.padding,
    gap: isMobile ? appConfig.theme.spacing.mobile_element_gap : dialogConfig.footer.gap
  };

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 50,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}
    >
      {/* Overlay - nur auf Desktop */}
      {!isMobile && (
        <div
          style={{
            position: 'absolute',
            inset: 0,
            backgroundColor: dialogConfig.overlay.bg,
            cursor: 'pointer'
          }}
          onClick={onClose}
        />
      )}

      {/* Dialog Container */}
      <div className={className} style={containerStyle}>
        {/* Header */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: isMobile ? appConfig.theme.spacing.mobile_section_padding : spacingBase(4)
          }}
        >
          <h2
            style={{
              fontSize: isMobile ? '1.25rem' : dialogConfig.header.fontSize,
              fontWeight: dialogConfig.header.fontWeight,
              color: colorsConfig.text.primary
            }}
          >
            {title}
          </h2>
          <button
            onClick={onClose}
            style={closeButtonStyle}
            onMouseEnter={(e) => {
              if (!isMobile) {
                e.currentTarget.style.backgroundColor = colorsConfig.gray[200];
                e.currentTarget.style.color = colorsConfig.text.primary;
              }
            }}
            onMouseLeave={(e) => {
              if (!isMobile) {
                e.currentTarget.style.backgroundColor = 'transparent';
                e.currentTarget.style.color = colorsConfig.text.tertiary;
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
            display: 'flex',
            flexDirection: 'column',
            gap: isMobile ? appConfig.theme.spacing.mobile_section_padding : spacingBase(dialogConfig.body.gap),
            flex: isMobile ? 1 : undefined
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
