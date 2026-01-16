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
import { X } from 'lucide-react';
import { useResponsive } from '@/hooks/useResponsive';

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

  // Touch-Target Minimum
  const minTouchTarget = '44px';

  // ═══════════════════════════════════════════════════════
  // RESPONSIVE STYLES
  // ═══════════════════════════════════════════════════════

  // Dialog Container Style
  const dialogContainerMobile = appConfig.ui.dialogs.container.style.mobile;
  const dialogContainerDesktop = appConfig.ui.dialogs.container.style.desktop;
  const containerStyle: React.CSSProperties = isMobile
    ? {
        // MOBILE: Fullscreen
        position: dialogContainerMobile.position,
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
        flexDirection: dialogContainerMobile.flexDirection
      }
    : {
        // DESKTOP: Centered Modal
        position: dialogContainerDesktop.position,
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
    flexDirection: isMobile ? dialogFooterMobile.flexDirection : dialogFooterDesktop.flexDirection,
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
            position: appConfig.ui.dialogs.overlay.style.position,
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
            flexDirection: appConfig.ui.dialogs.body.style.flexDirection,
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
