/**
 * @file        env.ts
 * @description Global ENV loader with prefix mapping (HIDEANDSEEK_* -> unprefixed)
 * @version     1.2.0
 * @created     2026-01-08 02:45:00 CET
 * @updated     2026-01-08 18:12:00 CET
 * @author      Akki Scholze
 *
 * @changelog
 *   1.2.0 - 2026-01-08 - Keine Fallback-Defaults (ENV muss aus KeePass/.env kommen)
 *   1.1.1 - 2026-01-08 - Entfernt CLIENT/HIDEANDSEEK_CLIENT Mapping (ENV nur laut .env.example)
 *   1.1.0 - 2026-01-08 - HIDEANDSEEK_CLIENT_* Mappings (Port/ApiUrl/NgrokUrl)
 *   1.0.0 - 2026-01-08 - Initial version: loads /home/akki/.config/.env and maps prefixed keys
 *
 * @usage
 *   Import this file BEFORE any config usage to ensure ENV is loaded:
 *   import './config/env';
 *
 * @security
 *   - Does NOT log secrets
 *   - Only maps HIDEANDSEEK_* prefixed keys
 *   - Keine Defaults: ENV muss bereitgestellt werden
 */

import { config } from 'dotenv';
import { resolve } from 'path';

// Load global ENV from fixed location
const globalEnvPath = '/home/akki/.config/.env';

try {
  config({ path: resolve(globalEnvPath) });
} catch (error) {
  // Silent fail
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
