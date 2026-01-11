/**
 * @file        index.ts
 * @description Hono API Server (with auth system)
 * @version     1.1.1
 * @created     2026-01-06 22:20:42 CET
 * @updated     2026-01-11 05:13:00 CET
 * @author      Akki Scholze
 *
 * @changelog
 *   1.1.1 - 2026-01-11 - Fixed: Re-added dotenv/config import (required for process.env access)
 *   1.1.0 - 2026-01-11 - Fixed: Removed dotenv/config import (ENV loaded externally via pnpm env:pull)
 *   1.0.0 - 2026-01-10 - Architektur: Runtime-Config direkt aus .env (NOT appConfig)
 *   0.3.0 - 2026-01-08 - Global ENV loading via ../src/config/env (HIDEANDSEEK_* mapping)
 *   0.2.0 - 2026-01-08 - Bootstrap admin seed added
 *   0.1.1 - 2026-01-06 - App-Factory + Routes integriert
 *   0.1.0 - 2026-01-06 - Initial server scaffold
 */
import 'dotenv/config';
import { serve } from '@hono/node-server';
import { initializeSchema, openDatabase } from './db/connection.js';
import { ensureBootstrapAdmin } from './db/bootstrap-admin.js';
import { createApp } from './app.js';

const db = openDatabase();
initializeSchema(db);
ensureBootstrapAdmin(db);

const app = createApp(db);

// Runtime-Werte direkt aus .env (NOT aus config.toml!)
const port = Number(process.env.BACKEND_PORT);
if (!Number.isFinite(port)) {
  throw new Error('Backend port missing or invalid (process.env.BACKEND_PORT). Set in .env');
}
const host = process.env.BACKEND_HOST;
if (!host) {
  throw new Error('Backend host missing (process.env.BACKEND_HOST). Set in .env');
}

console.log(`Server starting on ${host}:${port}`);
serve({ fetch: app.fetch, port, hostname: host });
