/**
 * @file        testDb.ts
 * @description Test-DB Helper fuer SQLite (Memory oder Temp-File)
 * @version     0.1.0
 * @created     2026-01-08 15:20:04 CET
 * @updated     2026-01-08 15:20:04 CET
 * @author      codex
 *
 * @changelog
 *   0.1.0 - 2026-01-08 - Helper fuer Test-DB mit Schema-Init
 */

import Database from 'better-sqlite3';
import { schemaStatements } from '../../server/db/schema';

type TestDbHandle = {
  db: Database.Database;
  cleanup: () => void;
};

export function createTestDb(dbPath: string = ':memory:'): TestDbHandle {
  const db = new Database(dbPath);
  schemaStatements.forEach((statement) => db.exec(statement));
  return {
    db,
    cleanup: () => db.close()
  };
}
