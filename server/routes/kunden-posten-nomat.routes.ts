/**
 * @file        kunden-posten-nomat.routes.ts
 * @description KundenPostenNoMat API Endpoints
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
  kundenPostenNoMatCreateSchema,
  kundenPostenNoMatIdParamSchema,
  kundenPostenNoMatKundeIdParamSchema,
  kundenPostenNoMatUpdateSchema,
  kundenPostenNoMatZahlungSchema
} from '../validation/kunden-posten-nomat.validation.js';
import {
  createKundenPostenNoMat,
  deleteKundenPostenNoMat,
  getKundenPostenNoMatById,
  listKundenPostenNoMat,
  listKundenPostenNoMatByKunde,
  updateKundenPostenNoMat,
  verbucheZahlungKundenPostenNoMat
} from '../services/kunden-posten-nomat.service.js';

export const kundenPostenNoMatRoutes = new Hono<AppEnv>();

kundenPostenNoMatRoutes.get('/kunden-posten-nomat', (c) => {
  const db = c.get('db');
  const data = listKundenPostenNoMat(db);
  return c.json({ success: true, data });
});

kundenPostenNoMatRoutes.get('/kunden-posten-nomat/:id', (c) => {
  const params = kundenPostenNoMatIdParamSchema.safeParse(c.req.param());
  if (!params.success) throw fromZodError(params.error);
  const db = c.get('db');
  const data = getKundenPostenNoMatById(db, params.data.id);
  return c.json({ success: true, data });
});

kundenPostenNoMatRoutes.get('/kunden-posten-nomat/kunde/:kundeId', (c) => {
  const params = kundenPostenNoMatKundeIdParamSchema.safeParse(c.req.param());
  if (!params.success) throw fromZodError(params.error);
  const db = c.get('db');
  const data = listKundenPostenNoMatByKunde(db, params.data.kundeId);
  return c.json({ success: true, data });
});

kundenPostenNoMatRoutes.post('/kunden-posten-nomat', async (c) => {
  const payload = await c.req.json();
  const parsed = kundenPostenNoMatCreateSchema.safeParse(payload);
  if (!parsed.success) throw fromZodError(parsed.error);

  const db = c.get('db');
  // Service calculates offen, status internally
  const data = createKundenPostenNoMat(db, {
    ...parsed.data,
    notiz: parsed.data.notiz ?? null,
    bezahlt: parsed.data.bezahlt ?? 0,
    offen: 0, // Will be recalculated by service
    status: 'offen' // Will be recalculated by service
  });

  return c.json({ success: true, data }, 201);
});

kundenPostenNoMatRoutes.put('/kunden-posten-nomat/:id', async (c) => {
  const params = kundenPostenNoMatIdParamSchema.safeParse(c.req.param());
  if (!params.success) throw fromZodError(params.error);
  const payload = await c.req.json();
  const parsed = kundenPostenNoMatUpdateSchema.safeParse(payload);
  if (!parsed.success) throw fromZodError(parsed.error);

  const db = c.get('db');
  const data = updateKundenPostenNoMat(db, params.data.id, parsed.data);
  return c.json({ success: true, data });
});

kundenPostenNoMatRoutes.delete('/kunden-posten-nomat/:id', (c) => {
  const params = kundenPostenNoMatIdParamSchema.safeParse(c.req.param());
  if (!params.success) throw fromZodError(params.error);
  const db = c.get('db');
  const data = deleteKundenPostenNoMat(db, params.data.id);
  return c.json({ success: true, data });
});

kundenPostenNoMatRoutes.post('/kunden-posten-nomat/:id/zahlung', async (c) => {
  const params = kundenPostenNoMatIdParamSchema.safeParse(c.req.param());
  if (!params.success) throw fromZodError(params.error);
  const payload = await c.req.json();
  const parsed = kundenPostenNoMatZahlungSchema.safeParse(payload);
  if (!parsed.success) throw fromZodError(parsed.error);

  const db = c.get('db');
  const data = verbucheZahlungKundenPostenNoMat(db, params.data.id, parsed.data.betrag);
  return c.json({ success: true, data });
});
