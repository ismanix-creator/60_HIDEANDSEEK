/**
 * @file        load.ts
 * @description Config Loader mit Zod strict Validation
 * @version     1.1.1
 * @created     2026-01-07 19:45:00 CET
 * @updated     2026-01-08 17:25:00 CET
 * @author      Akki Scholze
 *
 * @changelog
 *   1.1.1 - 2026-01-08 - Entfernt CLIENT/HIDEANDSEEK_CLIENT Overrides (SoT .env.example/Keepass)
 *   1.1.0 - 2026-01-08 - Optional ENV-Overrides für client.port/apiUrl/ngrokUrl (HIDEANDSEEK_CLIENT_*)
 *   1.0.1 - 2026-01-08 - Added .js extensions for Node ESM
 *   1.0.0 - 2026-01-07 - Initial loader mit strict validation
 */

import { ConfigSchema, type AppConfig } from './schema/config.schema.js';
import { configFromToml } from './generated/config-from-toml.js';

/**
 * Load and validate config from TOML
 * Throws error on validation failure (unknown/missing/wrong types)
 * Build/Start MUST abort on failure
 */
export function loadConfig(): AppConfig {
  try {
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
 */
export const appConfig = loadConfig();
