/**
 * @file        app.config.ts
 * @description Backend App Config (aus config.toml + process.env)
 * @version     1.0.1
 * @created     2026-01-11 14:45:00 CET
 * @updated     2026-01-11 15:30:00 CET
 * @author      Akki Scholze
 *
 * @description
 * ARCHITEKTUR: Backend-Config ist unabhängig von Frontend-Config (src/config)
 * - auth, app-config: aus config.toml (SoT für App-Konfiguration)
 * - runtime (ports, hosts, paths): aus .env (Runtime-Variablen)
 *
 * Backend importiert NICHT src/config/*
 * Frontend importiert NICHT server/config/*
 *
 * @changelog
 *   1.0.1 - 2026-01-11 - Removed unused eslint-disable directive
 *   1.0.0 - 2026-01-11 - Initial backend app config (strict separation)
 */

/* eslint-disable @typescript-eslint/no-unsafe-assignment, no-undef */

import * as fs from 'fs';
import * as path from 'path';
import * as toml from 'toml';
import { z } from 'zod';

// ============================================
// Load config.toml (SoT für App-Config)
// ============================================
const configPath = path.resolve(process.cwd(), 'config.toml');
let configFromToml: Record<string, unknown> = {};

try {
  const configRaw = fs.readFileSync(configPath, 'utf-8');
  configFromToml = toml.parse(configRaw);
} catch {
  console.error(`[BackendConfig Error] config.toml not found or invalid: ${configPath}`);
  process.exit(1);
}

// ============================================
// Zod Schemas (strict validation)
// ============================================

const AuthConfigSchema = z.object({
  enabled: z.boolean().default(false),
  mode: z.enum(['password_required']).default('password_required'),
  admin_bootstrap_user_id: z.string().default('admin')
});

const RuntimeConfigSchema = z.object({
  backendHost: z.string().default('localhost'),
  backendPort: z.number().default(3001),
  dbPath: z.string(),
  appBaseUrl: z.string().optional() // ngrok URL or similar (for CORS)
});

const AppConfigSchema = z.object({
  auth: AuthConfigSchema,
  runtime: RuntimeConfigSchema
});

// ============================================
// Build backendConfig (config.toml + .env)
// ============================================

const runtimeRaw = {
  backendHost: process.env.BACKEND_HOST || 'localhost',
  backendPort: Number(process.env.BACKEND_PORT) || 3001,
  dbPath: process.env.SQLITE_DB_PATH || './data/material-tracker.db',
  appBaseUrl: process.env.APP_BASE_URL
};

const backendConfigRaw = {
  auth: configFromToml.auth || {
    enabled: false,
    mode: 'password_required',
    admin_bootstrap_user_id: 'admin'
  },
  runtime: runtimeRaw
};

// Validate (strict)
let backendConfig: z.infer<typeof AppConfigSchema>;
try {
  backendConfig = AppConfigSchema.strict().parse(backendConfigRaw);
} catch (err) {
  console.error('[BackendConfig Validation Error]', err);
  process.exit(1);
}

export { backendConfig };

export type BackendConfig = z.infer<typeof AppConfigSchema>;
