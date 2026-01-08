/**
 * @file        kunden-posten-mat.routes.ts
 * @description KundenPostenMat API Endpoints
 * @version     0.1.0
 * @created     2026-01-07 00:29:44 CET
 * @updated     2026-01-07 00:29:44 CET
 * @author      Akki Scholze
 *
 * @changelog
 *   0.1.0 - 2026-01-07 - Initial scaffold
 */

import { Hono } from "hono";
import type { AppEnv } from "../types.js";
import { fromZodError } from "../errors.js";
import {
  kundenPostenMatCreateSchema,
  kundenPostenMatIdParamSchema,
  kundenPostenMatKundeIdParamSchema,
  kundenPostenMatUpdateSchema,
  kundenPostenMatZahlungSchema,
} from "../validation/kunden-posten-mat.validation.js";
import {
  createKundenPostenMat,
  deleteKundenPostenMat,
  getKundenPostenMatById,
  listKundenPostenMat,
  listKundenPostenMatByKunde,
  updateKundenPostenMat,
  verbucheZahlungKundenPostenMat,
} from "../services/kunden-posten-mat.service.js";

export const kundenPostenMatRoutes = new Hono<AppEnv>();

kundenPostenMatRoutes.get("/kunden-posten-mat", (c) => {
  const db = c.get("db");
  const data = listKundenPostenMat(db);
  return c.json({ success: true, data });
});

kundenPostenMatRoutes.get("/kunden-posten-mat/:id", (c) => {
  const params = kundenPostenMatIdParamSchema.safeParse(c.req.param());
  if (!params.success) throw fromZodError(params.error);
  const db = c.get('db');
  const data = getKundenPostenMatById(db, params.data.id);
  return c.json({ success: true, data });
});

kundenPostenMatRoutes.get('/kunden-posten-mat/kunde/:kundeId', (c) => {
  const params = kundenPostenMatKundeIdParamSchema.safeParse(c.req.param());
  if (!params.success) throw fromZodError(params.error);
  const db = c.get('db');
  const data = listKundenPostenMatByKunde(db, params.data.kundeId);
  return c.json({ success: true, data });
});

kundenPostenMatRoutes.post('/kunden-posten-mat', async (c) => {
  const payload = await c.req.json();
  const parsed = kundenPostenMatCreateSchema.safeParse(payload);
  if (!parsed.success) throw fromZodError(parsed.error);

  const db = c.get('db');
  // Service calculates betrag, offen, status internally
  const data = createKundenPostenMat(db, {
    ...parsed.data,
    notiz: parsed.data.notiz ?? null,
    bezahlt: parsed.data.bezahlt ?? 0,
    offen: 0, // Will be recalculated by service
    status: 'offen' // Will be recalculated by service
  });

  return c.json({ success: true, data }, 201);
});

kundenPostenMatRoutes.put('/kunden-posten-mat/:id', async (c) => {
  const params = kundenPostenMatIdParamSchema.safeParse(c.req.param());
  if (!params.success) throw fromZodError(params.error);
  const payload = await c.req.json();
  const parsed = kundenPostenMatUpdateSchema.safeParse(payload);
  if (!parsed.success) throw fromZodError(parsed.error);

  const db = c.get('db');
  const data = updateKundenPostenMat(db, params.data.id, parsed.data);
  return c.json({ success: true, data });
});

kundenPostenMatRoutes.delete('/kunden-posten-mat/:id', (c) => {
  const params = kundenPostenMatIdParamSchema.safeParse(c.req.param());
  if (!params.success) throw fromZodError(params.error);
  const db = c.get('db');
  const data = deleteKundenPostenMat(db, params.data.id);
  return c.json({ success: true, data });
});

kundenPostenMatRoutes.post('/kunden-posten-mat/:id/zahlung', async (c) => {
  const params = kundenPostenMatIdParamSchema.safeParse(c.req.param());
  if (!params.success) throw fromZodError(params.error);
  const payload = await c.req.json();
  const parsed = kundenPostenMatZahlungSchema.safeParse(payload);
  if (!parsed.success) throw fromZodError(parsed.error);

  const db = c.get('db');
  const data = verbucheZahlungKundenPostenMat(db, params.data.id, parsed.data.betrag);
  return c.json({ success: true, data });
});
