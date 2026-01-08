/**
 * @file        kunden-posten-mat.validation.ts
 * @description Zod-Validierung fuer KundenPostenMat-Endpunkte
 * @version     0.1.0
 * @created     2026-01-07 00:29:44 CET
 * @updated     2026-01-07 00:29:44 CET
 * @author      Akki Scholze
 *
 * @changelog
 *   0.1.0 - 2026-01-07 - Initial scaffold
 */

import { z } from 'zod';

export const kundenPostenMatCreateSchema = z.object({
  kunde_id: z.number().int().positive(),
  material_id: z.number().int().positive(),
  datum: z.string().min(1),
  menge: z.number().positive(),
  preis: z.number().nonnegative(),
  bezahlt: z.number().nonnegative().optional(),
  notiz: z.string().nullable().optional()
});

export const kundenPostenMatUpdateSchema = kundenPostenMatCreateSchema.partial();

export const kundenPostenMatIdParamSchema = z.object({
  id: z.coerce.number().int().positive()
});

export const kundenPostenMatKundeIdParamSchema = z.object({
  kundeId: z.coerce.number().int().positive()
});

export const kundenPostenMatZahlungSchema = z.object({
  betrag: z.number().positive()
});
