/**
 * @file        load.ts
 * @description Config Loader: TOML only + Zod strict Validation
 * @version     3.0.0
 * @created     2026-01-07 19:45:00 CET
 * @updated     2026-01-13 00:00:00 CET
 * @author      Akki Scholze
 *
 * @description
 *   Architecture: config.toml (App Config) + .env (Runtime Secrets)
 *   1. Load config.toml (app configuration only)
 *   2. Validate with schema (strict) - fail fast on config drift
 *   3. Export validated config
 *   Runtime variables (ports, hosts, URLs, secrets) come from .env
 *   - Frontend: import.meta.env.VITE_*
 *   - Backend: process.env.*
 *
 * @changelog
 *   3.0.0 - 2026-01-13 - COMPLETE RESTRUCTURE: Anpassung an neue config.toml Struktur A-I (theme/components/pages/content/navigation/layout)
 *   2.1.0 - 2026-01-12 - Added table progress fallback hydration (uses table.progress.colors when specific sections missing)
 *   2.0.0 - 2026-01-10 - Complete refactor: removed .env merge logic, config.toml only
 */

import { ConfigSchema, type AppConfig } from './schema/config.schema.js';
import { configFromToml } from './generated/config-from-toml.js';

/**
 * Load and validate config from config.toml only:
 * 1. Load config.toml
 * 2. Validate with schema (strict) - fail fast on config drift
 *
 * Throws error on validation failure
 * Build/Start MUST abort on failure
 */
export function loadConfig(): AppConfig {
  try {
    // Load TOML config and validate
    const validated = ConfigSchema.parse(configFromToml);
    return validated;
  } catch (error) {
    console.error('❌ CONFIG VALIDATION FAILED');
    console.error('Config Drift detected. Build/Start aborted.');
    console.error('');

    if (error instanceof Error && 'issues' in error) {
      const zodError = error as { issues: Array<{ path: string[]; message: string; received: unknown }> };
      console.error('Validation Errors:');
      zodError.issues.forEach((issue, index) => {
        console.error(`  ${index + 1}. Path: ${issue.path.join('.')}`);
        console.error(`     Expected: ${issue.message}`);
        console.error(`     Received: ${JSON.stringify(issue.received)}`);
        console.error('');
      });
    } else {
      console.error(error);
    }

    console.error('Fix config.toml and run pnpm generate:config');
    throw new Error('Config validation failed - cannot start app');
  }
}

/**
 * Validated config instance (singleton)
 * Final SoT: config.toml only (validated)
 * Runtime variables come from .env (process.env / import.meta.env)
 */
export const appConfig = loadConfig();
