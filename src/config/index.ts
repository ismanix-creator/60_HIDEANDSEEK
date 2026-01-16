/**
 * @file        index.ts
 * @description Single Import Point für alle Config Consumers
 * @version     1.4.0
 * @created     2026-01-07 19:45:00 CET
 * @updated     2026-01-15 06:00:00 CET
 * @author      Akki Scholze
 *
 * @changelog
 *   1.4.0 - 2026-01-15 - Synchronized mit config.toml v5.0.0 rebuild
 *   1.3.0 - 2026-01-09 - spacingConfig + breakpointsConfig Exports entfernt (Option B: 100% direct access)
 *   1.2.0 - 2026-01-09 - spacingConfig + breakpointsConfig Exports wiederhergestellt (TypeScript-Fix)
 *   1.1.0 - 2026-01-09 - Component-Config-Imports entfernt (Phase 2.2 Cleanup)
 *   1.0.1 - 2026-01-08 - Added .js extensions for Node ESM compatibility
 *   1.0.0 - 2026-01-07 - Single import point für validated config
 */

/**
 * Export validated config
 * Components nutzen direkten Zugriff: appConfig.*
 */
export { appConfig } from './load.js';
export type { AppConfig } from './schema/config.schema.js';
