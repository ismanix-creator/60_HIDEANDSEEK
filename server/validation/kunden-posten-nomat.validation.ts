/**
 * @file        kunden-posten-nomat.validation.ts
 * @description Zod-Validierung fuer KundenPostenNoMat-Endpunkte
 * @version     0.1.0
 * @created     2026-01-07 00:29:44 CET
 * @updated     2026-01-07 00:29:44 CET
 * @author      backend-entwickler
 *
 * @changelog
 *   0.1.0 - 2026-01-07 - Initial scaffold
 */

import { z } from 'zod';

export const kundenPostenNoMatCreateSchema = z.object({
  kunde_id: z.number().int().positive(),
  datum: z.string().min(1),
  bezeichnung: z.string().min(1),
  betrag: z.number().positive(),
  bezahlt: z.number().nonnegative().optional(),
  notiz: z.string().nullable().optional()
});

export const kundenPostenNoMatUpdateSchema = kundenPostenNoMatCreateSchema.partial();

export const kundenPostenNoMatIdParamSchema = z.object({
  id: z.coerce.number().int().positive()
});

export const kundenPostenNoMatKundeIdParamSchema = z.object({
  kundeId: z.coerce.number().int().positive()
});

export const kundenPostenNoMatZahlungSchema = z.object({
  betrag: z.number().positive()
});
