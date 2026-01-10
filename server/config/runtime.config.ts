/**
 * @file        runtime.config.ts
 * @description Runtime config for server (reads directly from process.env)
 * @version     2.0.0
 * @created     2026-01-06 19:14:38 CET
 * @updated     2026-01-10 04:24:56 CET
 * @author      Akki Scholze
 *
 * @description
 * ARCHITEKTUR: Strikte Trennung config.toml ⊥ .env
 * - config.toml = App-Config ONLY (nicht runtime!)
 * - .env = Runtime-Variablen (Ports, Hosts, URLs, Secrets)
 * 
 * Runtime-Werte kommen direkt aus process.env, NICHT aus appConfig!
 * Falls missing → Error beim Start (fail fast)
 *
 * @changelog
 *   2.0.0 - 2026-01-10 - Neu: direct process.env access (NOT from appConfig!)
 *   1.0.1 - 2026-01-08 - Import von src/config/index (Single Import Point)
 *   1.0.0 - 2026-01-07 - Initial version
 */

export const runtimeConfig = {
  server: {
    // Direkter Zugriff auf .env (NOT appConfig!)
    port: process.env.BACKEND_PORT,
    host: process.env.BACKEND_HOST
  },
  database: {
    type: 'sqlite' as const,
    // Direkter Zugriff auf .env (NOT appConfig!)
    path: process.env.SQLITE_DB_PATH
  }
};

