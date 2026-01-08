/**
 * @file        env.ts
 * @description Global ENV loader with prefix mapping (HIDEANDSEEK_* -> unprefixed)
 * @version     1.0.0
 * @created     2026-01-08 02:45:00 CET
 * @updated     2026-01-08 02:45:00 CET
 * @author      agenten-koordinator
 *
 * @changelog
 *   1.0.0 - 2026-01-08 - Initial version: loads /home/akki/.config/.env and maps prefixed keys
 *
 * @usage
 *   Import this file BEFORE any config usage to ensure ENV is loaded:
 *   import './config/env';
 *
 * @security
 *   - Does NOT log secrets
 *   - Only maps HIDEANDSEEK_* prefixed keys
 *   - Falls back to defaults if prefixed keys missing
 */

import { config } from 'dotenv';
import { resolve } from 'path';

// Load global ENV from fixed location
const globalEnvPath = '/home/akki/.config/.env';

try {
  config({ path: resolve(globalEnvPath) });
} catch (error) {
  // Silent fail - defaults will be used
}

// Mapping: HIDEANDSEEK_* -> unprefixed
// Only set if unprefixed key doesn't already exist (local override priority)

const mappings: Record<string, string> = {
  FRONTEND_PORT: 'HIDEANDSEEK_FRONTEND_PORT',
  BACKEND_HOST: 'HIDEANDSEEK_BACKEND_HOST',
  BACKEND_PORT: 'HIDEANDSEEK_BACKEND_PORT',
  VITE_ALLOWED_HOSTS: 'HIDEANDSEEK_VITE_ALLOWED_HOSTS',
  APP_BASE_URL: 'HIDEANDSEEK_APP_BASE_URL',
  VITE_APP_BASE_URL: 'HIDEANDSEEK_VITE_APP_BASE_URL',
  SQLITE_DB_PATH: 'HIDEANDSEEK_SQLITE_DB_PATH'
};

for (const [unprefixed, prefixed] of Object.entries(mappings)) {
  if (!process.env[unprefixed] && process.env[prefixed]) {
    process.env[unprefixed] = process.env[prefixed];
  }
}

// Defaults (only if still not set)
if (!process.env.FRONTEND_PORT) process.env.FRONTEND_PORT = '5173';
if (!process.env.BACKEND_HOST) process.env.BACKEND_HOST = 'localhost';
if (!process.env.BACKEND_PORT) process.env.BACKEND_PORT = '3001';
if (!process.env.VITE_ALLOWED_HOSTS) process.env.VITE_ALLOWED_HOSTS = 'localhost,.ngrok-free.dev';
