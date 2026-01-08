/**
 * @file        migrate-db.ts
 * @description Fuehrt eine idempotente Schema-Migration fuer SQLite aus
 * @version     0.1.0
 * @created     2026-01-07 00:03:06 CET
 * @updated     2026-01-07 00:03:06 CET
 * @author      Akki Scholze
 *
 * @changelog
 *   0.1.0 - 2026-01-07 - Initialer Migrations-Script
 */

import { openDatabase, initializeSchema } from '../server/db/connection';

function getArgValue(flag: string, args: string[]) {
  const index = args.indexOf(flag);
  if (index === -1) return undefined;
  return args[index + 1];
}

const args = process.argv.slice(2);
const overridePath = getArgValue('--db', args);

const db = openDatabase(overridePath);
db.exec('PRAGMA foreign_keys = ON;');
initializeSchema(db);
db.close();

console.log('Migration abgeschlossen.');
