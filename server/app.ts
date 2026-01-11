/**
 * @file        app.ts
 * @description Hono App Setup
 * @version     0.3.1
 * @created     2026-01-06 22:20:42 CET
 * @updated     2026-01-11 15:30:00 CET
 * @author      Akki Scholze
 *
 * @changelog
 *   0.3.1 - 2026-01-11 - Fixed any-type assertion in error handler
 *   0.3.0 - 2026-01-11 - Removed src/config import (strict backend/frontend separation, use backendConfig)
 *   0.2.2 - 2026-01-08 - CORS Allowed Origins aus config.toml (inkl. ngrok) abgeleitet
 *   0.2.1 - 2026-01-08 - CORS middleware hinzugefügt
 *   0.2.0 - 2026-01-08 - Auth/Admin routes added
 *   0.1.2 - 2026-01-07 - Neue Routen registriert (KundenPostenMat, KundenPostenNoMat, Glaeubiger, Schuldner)
 *   0.1.1 - 2026-01-06 - Kunden-Routen registriert
 *   0.1.0 - 2026-01-06 - Initial scaffold
 */

import { Hono } from 'hono';
import { cors } from 'hono/cors';
import type Database from 'better-sqlite3';
import type { AppEnv } from './types.js';
import { backendConfig } from './config/app.config.js';
import { materialRoutes } from './routes/material.routes.js';
import { kundenRoutes } from './routes/kunden.routes.js';
import { kundenPostenMatRoutes } from './routes/kunden-posten-mat.routes.js';
import { kundenPostenNoMatRoutes } from './routes/kunden-posten-nomat.routes.js';
import { glaeubigerRoutes } from './routes/glaeubiger.routes.js';
import { schuldnerRoutes } from './routes/schuldner.routes.js';
import { createAuthRoutes } from './routes/auth.routes.js';
import { createAdminRoutes } from './routes/admin.routes.js';
import { requestLogger } from './middleware/request-logger.js';
import { toErrorResponse } from './errors.js';

export function createApp(db: Database.Database) {
  const app = new Hono<AppEnv>();

  // CORS: erlaubte Origins (localhost + ngrok)
  const allowedOrigins = (() => {
    const origins = new Set<string>();
    const { backendPort, appBaseUrl } = backendConfig.runtime;

    // Localhost mit verschiedenen Ports
    origins.add(`http://localhost:${backendPort}`);
    origins.add(`http://127.0.0.1:${backendPort}`);

    // Frontend port (hardcoded, da meist 5173 für Vite)
    origins.add('http://localhost:5173');
    origins.add('http://127.0.0.1:5173');

    // App Base URL (falls ngrok oder ähnlich gesetzt)
    if (appBaseUrl) {
      origins.add(appBaseUrl);
    }

    return Array.from(origins);
  })();

  // CORS für Frontend-Zugriff (Playwright Tests)
  app.use(
    '*',
    cors({
      origin: allowedOrigins,
      credentials: true
    })
  );

  app.use('*', requestLogger);
  app.use('*', (c, next) => {
    c.set('db', db);
    return next();
  });

  app.get('/api/health', (c) => c.json({ success: true }));
  app.route('/api', materialRoutes);
  app.route('/api', kundenRoutes);
  app.route('/api', kundenPostenMatRoutes);
  app.route('/api', kundenPostenNoMatRoutes);
  app.route('/api', glaeubigerRoutes);
  app.route('/api', schuldnerRoutes);
  app.route('/api/auth', createAuthRoutes(db));
  app.route('/api/admin', createAdminRoutes(db));

  app.notFound((c) => c.json({ success: false, error: 'Not found', code: 'NOT_FOUND' }, 404));

  app.onError((err, c) => {
    const { status, body } = toErrorResponse(err);
    const requestId = c.get('requestId');
    console.error({ requestId, error: err }, 'request_error');
    return c.json(body, status as any);
  });

  return app;
}
