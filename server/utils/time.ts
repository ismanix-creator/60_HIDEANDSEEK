/**
 * @file        time.ts
 * @description Zeit-Helfer fuer Timestamps
 * @version     0.1.0
 * @created     2026-01-06 22:20:42 CET
 * @updated     2026-01-06 22:20:42 CET
 * @author      agenten-koordinator
 *
 * @changelog
 *   0.1.0 - 2026-01-06 - Initial scaffold
 */

export function nowIso() {
  return new Date().toISOString();
}
