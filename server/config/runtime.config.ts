/**
 * @file        runtime.config.ts
 * @description Runtime config for server (uses validated appConfig)
 * @version     1.0.1
 * @created     2026-01-06 19:14:38 CET
 * @updated     2026-01-08 00:05:00 CET
 * @author      agenten-koordinator
 *
 * @changelog
 *   1.0.1 - 2026-01-08 - Import von src/config/index (Single Import Point)
 *   1.0.0 - 2026-01-07 - Initial version
 */

import { appConfig } from '../../src/config/index.js';

export const runtimeConfig = {
  server: {
    port: appConfig.server.port,
    host: appConfig.server.host
  },
  database: {
    type: appConfig.database.type,
    path: appConfig.database.path
  }
};
