/**
 * @file        runtime.config.ts
 * @description Frontend runtime config from environment variables only
 * @version     2.0.0
 * @created     2026-01-06 19:14:38 CET
 * @updated     2026-01-11 14:15:00 CET
 * @author      Akki Scholze
 *
 * @changelog
 *   2.0.0 - 2026-01-11 - Cleanup: removed appConfig.server/client/database (deprecated). Frontend uses import.meta.env only.
 *   1.0.1 - 2026-01-08 - Added .js extension for Node ESM
 *   1.0.0 - 2026-01-07 - Refactored to use validated appConfig (no direct generated import)
 *   0.1.0 - 2026-01-06 - Initial scaffold
 */

/**
 * DEPRECATED: This file is no longer used.
 *
 * Frontend runtime values come from environment variables only:
 * - import.meta.env.VITE_* for frontend
 * - useApi() hook handles API_BASE_URL resolution
 *
 * No Server/Client/Database config here. Use .env.example as whitelist.
 */

export const runtimeConfig = {} as const;
