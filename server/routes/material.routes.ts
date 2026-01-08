/**
 * @file        material.routes.ts
 * @description Material API Endpoints
 * @version     0.1.1
 * @created     2026-01-06 22:20:42 CET
 * @updated     2026-01-06 23:11:14 CET
 * @author      Akki Scholze
 *
 * @changelog
 *   0.1.1 - 2026-01-06 - Query-Validierung fuer Bewegungs-Listen
 *   0.1.0 - 2026-01-06 - Initial scaffold
 */

import { Hono } from 'hono';
import type { AppEnv } from '../types.js';
import { fromZodError } from '../errors.js';
import {
  barMovementSchema,
  historieQuerySchema,
  kombiMovementSchema,
  listMovementsQuerySchema,
  materialCreateSchema,
  materialIdParamSchema,
  materialUpdateSchema
} from '../validation/material.validation.js';
import {
  createBarMovement,
  createKombiMovement,
  createMaterial,
  deleteMaterial,
  getMaterialById,
  getMaterialHistorie,
  listBarMovements,
  listKombiMovements,
  listMaterial,
  updateMaterial
} from '../services/material.service.js';

export const materialRoutes = new Hono<AppEnv>();

materialRoutes.get('/material', (c) => {
  const db = c.get('db');
  const data = listMaterial(db);
  return c.json({ success: true, data });
});

materialRoutes.get('/material/:id', (c) => {
  const params = materialIdParamSchema.safeParse(c.req.param());
  if (!params.success) throw fromZodError(params.error);
  const db = c.get('db');
  const data = getMaterialById(db, params.data.id);
  return c.json({ success: true, data });
});

materialRoutes.post('/material', async (c) => {
  const payload = await c.req.json();
  const parsed = materialCreateSchema.safeParse(payload);
  if (!parsed.success) throw fromZodError(parsed.error);

  const db = c.get('db');
  const data = createMaterial(db, {
    ...parsed.data,
    notiz: parsed.data.notiz ?? null,
    einnahmen_bar: parsed.data.einnahmen_bar ?? 0,
    einnahmen_kombi: parsed.data.einnahmen_kombi ?? 0,
    gewinn_aktuell: parsed.data.gewinn_aktuell ?? 0,
    gewinn_theoretisch: parsed.data.gewinn_theoretisch ?? 0
  });

  return c.json({ success: true, data }, 201);
});

materialRoutes.put('/material/:id', async (c) => {
  const params = materialIdParamSchema.safeParse(c.req.param());
  if (!params.success) throw fromZodError(params.error);
  const payload = await c.req.json();
  const parsed = materialUpdateSchema.safeParse(payload);
  if (!parsed.success) throw fromZodError(parsed.error);

  const db = c.get('db');
  const data = updateMaterial(db, params.data.id, parsed.data);
  return c.json({ success: true, data });
});

materialRoutes.delete('/material/:id', (c) => {
  const params = materialIdParamSchema.safeParse(c.req.param());
  if (!params.success) throw fromZodError(params.error);
  const db = c.get('db');
  const data = deleteMaterial(db, params.data.id);
  return c.json({ success: true, data });
});

materialRoutes.get('/material-bewegungen-bar', (c) => {
  const parsed = listMovementsQuerySchema.safeParse({ materialId: c.req.query('materialId') });
  if (!parsed.success) throw fromZodError(parsed.error);
  const db = c.get('db');
  const data = listBarMovements(db, parsed.data.materialId);
  return c.json({ success: true, data });
});

materialRoutes.post('/material-bewegungen-bar', async (c) => {
  const payload = await c.req.json();
  const parsed = barMovementSchema.safeParse(payload);
  if (!parsed.success) throw fromZodError(parsed.error);

  const db = c.get('db');
  const data = createBarMovement(db, parsed.data);
  return c.json({ success: true, data }, 201);
});

materialRoutes.get('/material-bewegungen-kombi', (c) => {
  const parsed = listMovementsQuerySchema.safeParse({ materialId: c.req.query('materialId') });
  if (!parsed.success) throw fromZodError(parsed.error);
  const db = c.get('db');
  const data = listKombiMovements(db, parsed.data.materialId);
  return c.json({ success: true, data });
});

materialRoutes.post('/material-bewegungen-kombi', async (c) => {
  const payload = await c.req.json();
  const parsed = kombiMovementSchema.safeParse(payload);
  if (!parsed.success) throw fromZodError(parsed.error);

  const db = c.get('db');
  const data = createKombiMovement(db, parsed.data);
  return c.json({ success: true, data }, 201);
});

materialRoutes.get('/material/historie', (c) => {
  const parsed = historieQuerySchema.safeParse({ materialId: c.req.query('materialId') });
  if (!parsed.success) throw fromZodError(parsed.error);
  const db = c.get('db');
  const data = getMaterialHistorie(db, parsed.data.materialId);
  return c.json({ success: true, data });
});
