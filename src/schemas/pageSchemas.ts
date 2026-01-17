/**
 * @file        pageSchemas.ts
 * @description Zentrale Page-Schema-Registry - Definiert Content/Header/Footer-Struktur pro Page
 * @version     0.1.0
 * @created     2026-01-17T03:40:00+01:00
 * @updated     2026-01-17T03:40:00+01:00
 * @author      Akki Scholze
 *
 * @description
 * Page-Schemas definieren die komplette Struktur einer Page:
 * - Header: Title, Actions, Filters
 * - Content: Tables (single/grid), Custom Content
 * - Footer: Grid-Widgets
 *
 * @changelog
 *   0.1.0 - 2026-01-17T03:40:00+01:00 - Initial: Page-Schema-System für Material/Kunden/Schuldner/Glaeubiger
 */

import type { PageSchema } from '@/types/ui.types';

// ═══════════════════════════════════════════════════════════════════════════════════════════════════
// PAGE SCHEMAS REGISTRY
// ═══════════════════════════════════════════════════════════════════════════════════════════════════

/**
 * PAGE_SCHEMAS - Zentrale Registry für Page-Layout-Definitionen
 *
 * Definiert pro Page:
 * - Header-Struktur (Title, Actions, Filters)
 * - Content-Struktur (Tables, Grid, Custom)
 * - Footer-Struktur (Widgets)
 *
 * Pages nutzen diese Schemas um ihre Struktur deklarativ zu definieren.
 * Content.tsx rendert basierend auf dem Schema die entsprechenden Komponenten.
 */
export const PAGE_SCHEMAS: Record<string, PageSchema> = {
  // ════════════════════════════════════════════════════════════
  // MATERIAL PAGE
  // ════════════════════════════════════════════════════════════
  material: {
    id: 'material',
    header: {
      title: 'Material',
      actions: [
        {
          type: 'new',
          label: 'Neues Material',
          onClick: () => {
            /* wird von Page überschrieben */
          }
        }
      ],
      filters: [
        {
          type: 'month',
          component: null // Wird von Page mit Month-Picker gefüllt
        }
      ]
    },
    content: {
      type: 'table',
      tableId: 'material.main'
    },
    footer: {
      columns: 3,
      widgets: [
        {
          id: 'widget1',
          component: null // Wird von Page gefüllt
        },
        {
          id: 'widget2',
          component: null
        },
        {
          id: 'widget3',
          component: null
        }
      ]
    }
  },

  // ════════════════════════════════════════════════════════════
  // KUNDEN PAGE
  // ════════════════════════════════════════════════════════════
  kunden: {
    id: 'kunden',
    header: {
      title: 'Kunden',
      actions: [
        {
          type: 'new',
          label: 'Neuer Kunde',
          onClick: () => {
            /* wird von Page überschrieben */
          }
        }
      ]
    },
    content: {
      type: 'table',
      tableId: 'kunden.main'
    }
  },

  // ════════════════════════════════════════════════════════════
  // SCHULDNER PAGE
  // ════════════════════════════════════════════════════════════
  schuldner: {
    id: 'schuldner',
    header: {
      title: 'Schuldner',
      actions: [
        {
          type: 'new',
          label: 'Neuer Schuldner',
          onClick: () => {
            /* wird von Page überschrieben */
          }
        }
      ]
    },
    content: {
      type: 'table',
      tableId: 'schuldner.main'
    }
  },

  // ════════════════════════════════════════════════════════════
  // GLAEUBIGER PAGE
  // ════════════════════════════════════════════════════════════
  glaeubiger: {
    id: 'glaeubiger',
    header: {
      title: 'Gläubiger',
      actions: [
        {
          type: 'new',
          label: 'Neuer Gläubiger',
          onClick: () => {
            /* wird von Page überschrieben */
          }
        }
      ]
    },
    content: {
      type: 'table',
      tableId: 'glaeubiger.main'
    }
  }
};

/**
 * Get Page Schema by ID
 * @param pageId - Page ID (z.B. 'material', 'kunden')
 * @returns PageSchema or undefined
 */
export function getPageSchema(pageId: string): PageSchema {
  return PAGE_SCHEMAS[pageId] || PAGE_SCHEMAS.material; // Fallback
}
