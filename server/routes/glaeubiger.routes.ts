/**
 * @file        glaeubiger.routes.ts
 * @description Glaeubiger API Endpoints
 * @version     0.1.0
 * @created     2026-01-07 00:29:44 CET
 * @updated     2026-01-07 00:29:44 CET
 * @author      backend-entwickler
 *
 * @changelog
 *   0.1.0 - 2026-01-07 - Initial scaffold
 */

import { Hono } from 'hono';
import type { AppEnv } from '../types.js';
import { fromZodError } from '../errors.js';
import {
  glaeubigersCreateSchema,
  glaeubigersIdParamSchema,
  glaeubigersUpdateSchema,
  glaeubigersZahlungSchema
} from '../validation/glaeubiger.validation.js';
import {
  createGlaeubiger,
  deleteGlaeubiger,
  getGlaeubigersById,
  listGlaeubiger,
  updateGlaeubiger,
  verbucheZahlungGlaeubiger
} from '../services/glaeubiger.service.js';

export const glaeubigerRoutes = new Hono<AppEnv>();

glaeubigerRoutes.get('/glaeubiger', (c) => {
  const db = c.get('db');
  const data = listGlaeubiger(db);
  return c.json({ success: true, data });
});

glaeubigerRoutes.get('/glaeubiger/:id', (c) => {
  const params = glaeubigersIdParamSchema.safeParse(c.req.param());
  if (!params.success) throw fromZodError(params.error);
  const db = c.get('db');
  const data = getGlaeubigersById(db, params.data.id);
  return c.json({ success: true, data });
});

glaeubigerRoutes.post('/glaeubiger', async (c) => {
  const payload = await c.req.json();
  const parsed = glaeubigersCreateSchema.safeParse(payload);
  if (!parsed.success) throw fromZodError(parsed.error);

  const db = c.get('db');
  const bezahlt = parsed.data.bezahlt ?? 0;
  const betrag = parsed.data.betrag;
  const offen = betrag - bezahlt;
  const status = bezahlt >= betrag ? 'bezahlt' : 'offen';

  const data = createGlaeubiger(db, {
    ...parsed.data,
    notiz: parsed.data.notiz ?? null,
    faelligkeit: parsed.data.faelligkeit ?? null,
    bezahlt,
    offen,
    status
  });

  return c.json({ success: true, data }, 201);
});

glaeubigerRoutes.put('/glaeubiger/:id', async (c) => {
  const params = glaeubigersIdParamSchema.safeParse(c.req.param());
  if (!params.success) throw fromZodError(params.error);
  const payload = await c.req.json();
  const parsed = glaeubigersUpdateSchema.safeParse(payload);
  if (!parsed.success) throw fromZodError(parsed.error);

  const db = c.get('db');
  const data = updateGlaeubiger(db, params.data.id, parsed.data);
  return c.json({ success: true, data });
});

glaeubigerRoutes.delete('/glaeubiger/:id', (c) => {
  const params = glaeubigersIdParamSchema.safeParse(c.req.param());
  if (!params.success) throw fromZodError(params.error);
  const db = c.get('db');
  const data = deleteGlaeubiger(db, params.data.id);
  return c.json({ success: true, data });
});

glaeubigerRoutes.post('/glaeubiger/:id/zahlung', async (c) => {
  const params = glaeubigersIdParamSchema.safeParse(c.req.param());
  if (!params.success) throw fromZodError(params.error);
  const payload = await c.req.json();
  const parsed = glaeubigersZahlungSchema.safeParse(payload);
  if (!parsed.success) throw fromZodError(parsed.error);

  const db = c.get('db');
  const data = verbucheZahlungGlaeubiger(db, params.data.id, parsed.data.betrag);
  return c.json({ success: true, data });
});
