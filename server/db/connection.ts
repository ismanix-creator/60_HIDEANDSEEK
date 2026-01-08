/**
 * @file        connection.ts
 * @description SQLite DB Verbindung und Schema-Initialisierung
 * @version     0.1.2
 * @created     2026-01-06 19:14:38 CET
 * @updated     2026-01-06 22:20:42 CET
 * @author      agenten-koordinator
 *
 * @changelog
 *   0.1.0 - 2026-01-06 - Initial scaffold
 *   0.1.1 - 2026-01-06 - Optionaler DB-Pfad fuer Tests
 *   0.1.2 - 2026-01-06 - :memory: fuer Tests unterstuetzt
 */

import Database from 'better-sqlite3';
import fs from 'fs';
import path from 'path';
import { runtimeConfig } from '../config/runtime.config.js';
import { schemaStatements } from './schema.js';

export function openDatabase(overridePath?: string) {
  const dbPath = overridePath ?? runtimeConfig.database?.path ?? 'data/material-tracker.db';
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
