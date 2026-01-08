/**
 * @file        kunden.routes.ts
 * @description Kunden API Endpoints (with optional auth enforcement)
 * @version     0.2.0
 * @created     2026-01-06 23:20:12 CET
 * @updated     2026-01-08 01:30:00 CET
 * @author      agenten-koordinator
 *
 * @changelog
 *   0.2.0 - 2026-01-08 - Auth enforcement added (respects auth.enabled)
 *   0.1.0 - 2026-01-06 - Initial scaffold
 */

import { Hono } from 'hono';
import type { AppEnv } from '../types.js';
import { fromZodError } from '../errors.js';
import { kundenCreateSchema, kundenIdParamSchema, kundenUpdateSchema } from '../validation/kunden.validation.js';
import { createKunde, deleteKunde, getKundeById, listKunden, updateKunde } from '../services/kunden.service.js';
import { maybeRequireUser, assertKundeAccess, type User } from '../auth/guards.js';

export const kundenRoutes = new Hono<AppEnv>();

// Apply auth middleware (conditional on auth.enabled)
kundenRoutes.use('*', (c, next) => {
  const db = c.get('db');
  return maybeRequireUser(db)(c, next);
});

kundenRoutes.get('/kunden', (c) => {
  const db = c.get('db');
  const user = c.get('user') as User | undefined;

  // If user is regular user, filter by kunde_id
  if (user && user.role === 'user' && user.kunde_id !== null) {
    const stmt = db.prepare('SELECT * FROM kunden WHERE id = ?');
    const data = stmt.all(user.kunde_id);
    return c.json({ success: true, data });
  }

  // Admin or no-auth mode: return all
  const data = listKunden(db);
  return c.json({ success: true, data });
});

kundenRoutes.get('/kunden/:id', (c) => {
  const params = kundenIdParamSchema.safeParse(c.req.param());
  if (!params.success) throw fromZodError(params.error);
  
  const user = c.get('user') as User | undefined;
  
  // Enforce access if auth enabled + user exists
  if (user) {
    assertKundeAccess(user, params.data.id);
  }

  const db = c.get('db');
  const data = getKundeById(db, params.data.id);
  return c.json({ success: true, data });
});

kundenRoutes.post('/kunden', async (c) => {
  const payload = await c.req.json();
  const parsed = kundenCreateSchema.safeParse(payload);
  if (!parsed.success) throw fromZodError(parsed.error);
  
  // Only admin can create kunden when auth enabled
  const user = c.get('user') as User | undefined;
  if (user) {
    // Auth enabled: enforce admin-only
    if (user.role !== 'admin') {
      return c.json({ error: 'Forbidden: admin only' }, 403);
    }
  }
  // Auth disabled: allow all

  const db = c.get('db');
  const data = createKunde(db, parsed.data);
  return c.json({ success: true, data }, 201);
});

kundenRoutes.put('/kunden/:id', async (c) => {
  const params = kundenIdParamSchema.safeParse(c.req.param());
  if (!params.success) throw fromZodError(params.error);
  
  const user = c.get('user') as User | undefined;
  if (user) {
    if (user.role !== 'admin') {
      assertKundeAccess(user, params.data.id);
    }
  }

  const payload = await c.req.json();
  const parsed = kundenUpdateSchema.safeParse(payload);
  if (!parsed.success) throw fromZodError(parsed.error);
  const db = c.get('db');
  const data = updateKunde(db, params.data.id, parsed.data);
  return c.json({ success: true, data });
});

kundenRoutes.delete('/kunden/:id', (c) => {
  const params = kundenIdParamSchema.safeParse(c.req.param());
  if (!params.success) throw fromZodError(params.error);
  
  // Only admin can delete when auth enabled
  const user = c.get('user') as User | undefined;
  if (user) {
    // Auth enabled: enforce admin-only
    if (user.role !== 'admin') {
      return c.json({ error: 'Forbidden: admin only' }, 403);
    }
  }
  // Auth disabled: allow all

  const db = c.get('db');
  const data = deleteKunde(db, params.data.id);
  return c.json({ success: true, data });
});
