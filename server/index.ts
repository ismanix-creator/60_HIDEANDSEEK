/**
 * @file        index.ts
 * @description Hono API Server (with auth system)
 * @version     0.3.0
 * @created     2026-01-06 22:20:42 CET
 * @updated     2026-01-08 02:45:00 CET
 * @author      Akki Scholze
 *
 * @changelog
 *   0.3.0 - 2026-01-08 - Global ENV loading via ../src/config/env (HIDEANDSEEK_* mapping)
 *   0.2.0 - 2026-01-08 - Bootstrap admin seed added
 *   0.1.1 - 2026-01-06 - App-Factory + Routes integriert
 *   0.1.0 - 2026-01-06 - Initial server scaffold
 */

import { serve } from '@hono/node-server';
import { initializeSchema, openDatabase } from './db/connection.js';
import { ensureBootstrapAdmin } from './db/bootstrap-admin.js';
import { runtimeConfig } from './config/runtime.config.js';
import { createApp } from './app.js';

const db = openDatabase();
initializeSchema(db);
ensureBootstrapAdmin(db);

const app = createApp(db);

const port = Number(runtimeConfig.server?.port);
if (!Number.isFinite(port)) {
  throw new Error('Server port missing (runtimeConfig.server.port)');
}
const host = runtimeConfig.server?.host;
if (!host) {
  throw new Error('Server host missing (runtimeConfig.server.host)');
}

console.log(`Server starting on ${host}:${port}`);
serve({ fetch: app.fetch, port, hostname: host });
