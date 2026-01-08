/**
 * @file        runtime.config.ts
 * @description Typed runtime config via validated appConfig
 * @version     1.0.1
 * @created     2026-01-06 19:14:38 CET
 * @updated     2026-01-08 00:25:00 CET
 * @author      agenten-koordinator
 *
 * @changelog
 *   1.0.1 - 2026-01-08 - Added .js extension for Node ESM
 *   1.0.0 - 2026-01-07 - Refactored to use validated appConfig (no direct generated import)
 *   0.1.0 - 2026-01-06 - Initial scaffold
 */

import { appConfig } from './load.js';

export const runtimeConfig = {
  app: appConfig.app,
  server: appConfig.server,
  client: appConfig.client,
  database: appConfig.database
} as const;
