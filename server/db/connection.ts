/**
 * @file        connection.ts
 * @description SQLite DB Verbindung und Schema-Initialisierung
 * @version     1.0.0
 * @created     2026-01-06 19:14:38 CET
 * @updated     2026-01-10 04:24:56 CET
 * @author      Akki Scholze
 *
 * @changelog
 *   1.0.0 - 2026-01-10 - Architektur: DB-Pfad direkt aus .env (NOT appConfig.database.path)
 *   0.1.2 - 2026-01-06 - :memory: fuer Tests unterstuetzt
 *   0.1.1 - 2026-01-06 - Optionaler DB-Pfad fuer Tests
 *   0.1.0 - 2026-01-06 - Initial scaffold
 */

import Database from 'better-sqlite3';
import fs from 'fs';
import path from 'path';
import { schemaStatements } from './schema.js';

export function openDatabase(overridePath?: string) {
  // Runtime-Wert direkt aus .env (NOT aus config.toml!)
  const dbPath = overridePath ?? process.env.SQLITE_DB_PATH;
  if (!dbPath) {
    throw new Error('Database path missing (process.env.SQLITE_DB_PATH). Set in .env');
  }
  if (dbPath === ':memory:') {
    return new Database(dbPath);
  }
  const absolutePath = path.isAbsolute(dbPath) ? dbPath : path.resolve(process.cwd(), dbPath);
  fs.mkdirSync(path.dirname(absolutePath), { recursive: true });
  return new Database(absolutePath);
}

export function initializeSchema(db: Database.Database) {
  schemaStatements.forEach((statement) => db.exec(statement));
}
