/**
 * @file        kunden.validation.ts
 * @description Zod-Validierung fuer Kunden-Endpunkte
 * @version     0.1.0
 * @created     2026-01-06 23:20:12 CET
 * @updated     2026-01-06 23:20:12 CET
 * @author      agenten-koordinator
 *
 * @changelog
 *   0.1.0 - 2026-01-06 - Initial scaffold
 */

import { z } from 'zod';

export const kundenCreateSchema = z.object({
  name: z.string().min(1)
});

export const kundenUpdateSchema = kundenCreateSchema.partial();

export const kundenIdParamSchema = z.object({
  id: z.coerce.number().int().positive()
});
