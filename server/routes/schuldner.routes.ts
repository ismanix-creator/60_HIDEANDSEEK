/**
 * @file        schuldner.routes.ts
 * @description Schuldner API Endpoints
 * @version     0.1.0
 * @created     2026-01-07 00:29:44 CET
 * @updated     2026-01-07 00:29:44 CET
 * @author      Akki Scholze
 *
 * @changelog
 *   0.1.0 - 2026-01-07 - Initial scaffold
 */

import { Hono } from 'hono';
import type { AppEnv } from '../types.js';
import { fromZodError } from '../errors.js';
import {
  schuldnerCreateSchema,
  schuldnerIdParamSchema,
  schuldnerUpdateSchema,
  schuldnerZahlungSchema
} from '../validation/schuldner.validation.js';
import {
  createSchuldner,
  deleteSchuldner,
  getSchuldnerById,
  listSchuldner,
  updateSchuldner,
  verbucheZahlungSchuldner
} from '../services/schuldner.service.js';

export const schuldnerRoutes = new Hono<AppEnv>();

schuldnerRoutes.get('/schuldner', (c) => {
  const db = c.get('db');
  const data = listSchuldner(db);
  return c.json({ success: true, data });
});

schuldnerRoutes.get('/schuldner/:id', (c) => {
  const params = schuldnerIdParamSchema.safeParse(c.req.param());
  if (!params.success) throw fromZodError(params.error);
  const db = c.get('db');
  const data = getSchuldnerById(db, params.data.id);
  return c.json({ success: true, data });
});

schuldnerRoutes.post('/schuldner', async (c) => {
  const payload: unknown = await c.req.json();
  const parsed = schuldnerCreateSchema.safeParse(payload);
  if (!parsed.success) throw fromZodError(parsed.error);

  const db = c.get('db');
  const bezahlt = parsed.data.bezahlt ?? 0;
  const betrag = parsed.data.betrag;
  const offen = betrag - bezahlt;
  const status = bezahlt >= betrag ? 'bezahlt' : 'offen';

  const data = createSchuldner(db, {
    ...parsed.data,
    notiz: parsed.data.notiz ?? null,
    faelligkeit: parsed.data.faelligkeit ?? null,
    bezahlt,
    offen,
    status
  });

  return c.json({ success: true, data }, 201);
});

schuldnerRoutes.put('/schuldner/:id', async (c) => {
  const params = schuldnerIdParamSchema.safeParse(c.req.param());
  if (!params.success) throw fromZodError(params.error);
  const payload: unknown = await c.req.json();
  const parsed = schuldnerUpdateSchema.safeParse(payload);
  if (!parsed.success) throw fromZodError(parsed.error);

  const db = c.get('db');
  const data = updateSchuldner(db, params.data.id, parsed.data);
  return c.json({ success: true, data });
});

schuldnerRoutes.delete('/schuldner/:id', (c) => {
  const params = schuldnerIdParamSchema.safeParse(c.req.param());
  if (!params.success) throw fromZodError(params.error);
  const db = c.get('db');
  const data = deleteSchuldner(db, params.data.id);
  return c.json({ success: true, data });
});

schuldnerRoutes.post('/schuldner/:id/zahlung', async (c) => {
  const params = schuldnerIdParamSchema.safeParse(c.req.param());
  if (!params.success) throw fromZodError(params.error);
  const payload: unknown = await c.req.json();
  const parsed = schuldnerZahlungSchema.safeParse(payload);
  if (!parsed.success) throw fromZodError(parsed.error);

  const db = c.get('db');
  const data = verbucheZahlungSchuldner(db, params.data.id, parsed.data.betrag);
  return c.json({ success: true, data });
});
