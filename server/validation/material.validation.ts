/**
 * @file        material.validation.ts
 * @description Zod-Validierung fuer Material-Endpunkte
 * @version     0.1.1
 * @created     2026-01-06 22:20:42 CET
 * @updated     2026-01-06 23:10:40 CET
 * @author      Akki Scholze
 *
 * @changelog
 *   0.1.1 - 2026-01-06 - Query-Validierung fuer Bewegungs-Listen
 *   0.1.0 - 2026-01-06 - Initial scaffold
 */

import { z } from 'zod';

export const materialCreateSchema = z.object({
  datum: z.string().min(1),
  bezeichnung: z.string().min(1),
  menge: z.number().nonnegative(),
  ek_stueck: z.number().nonnegative(),
  ek_gesamt: z.number().nonnegative(),
  vk_stueck: z.number().nonnegative(),
  bestand: z.number().nonnegative(),
  einnahmen_bar: z.number().nonnegative().optional(),
  einnahmen_rechnung: z.number().nonnegative().optional(),
  gewinn_aktuell: z.number().optional(),
  gewinn_theoretisch: z.number().optional(),
  notiz: z.string().nullable().optional()
});

export const materialUpdateSchema = materialCreateSchema.partial();

export const materialIdParamSchema = z.object({
  id: z.coerce.number().int().positive()
});

export const barMovementSchema = z.object({
  material_id: z.number().int().positive(),
  datum: z.string().min(1),
  menge: z.number().positive(),
  preis: z.number().nonnegative(),
  info: z.string().optional(),
  notiz: z.string().optional()
});

export const rechnungMovementSchema = z.object({
  material_id: z.number().int().positive(),
  kunde_id: z.number().int().positive(),
  datum: z.string().min(1),
  menge: z.number().positive(),
  preis: z.number().nonnegative(),
  notiz: z.string().optional()
});

export const listMovementsQuerySchema = z.object({
  materialId: z.coerce.number().int().positive().optional()
});

export const historieQuerySchema = z.object({
  materialId: z.coerce.number().int().positive()
});
