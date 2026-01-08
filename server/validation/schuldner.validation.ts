/**
 * @file        schuldner.validation.ts
 * @description Zod-Validierung fuer Schuldner-Endpunkte
 * @version     0.1.0
 * @created     2026-01-07 00:29:44 CET
 * @updated     2026-01-07 00:29:44 CET
 * @author      backend-entwickler
 *
 * @changelog
 *   0.1.0 - 2026-01-07 - Initial scaffold
 */

import { z } from 'zod';

export const schuldnerCreateSchema = z.object({
  datum: z.string().min(1),
  name: z.string().min(1),
  betrag: z.number().positive(),
  bezahlt: z.number().nonnegative().optional(),
  faelligkeit: z.string().nullable().optional(),
  notiz: z.string().nullable().optional()
});

export const schuldnerUpdateSchema = schuldnerCreateSchema.partial();

export const schuldnerIdParamSchema = z.object({
  id: z.coerce.number().int().positive()
});

export const schuldnerZahlungSchema = z.object({
  betrag: z.number().positive()
});
