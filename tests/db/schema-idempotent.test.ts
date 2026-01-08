/**
 * @file        schema-idempotent.test.ts
 * @description DB Schema kann mehrfach ausgefuehrt werden
 * @version     0.1.0
 * @created     2026-01-08 15:20:04 CET
 * @updated     2026-01-08 15:20:04 CET
 * @author      codex
 *
 * @changelog
 *   0.1.0 - 2026-01-08 - Idempotenz-Test fuer Schema
 */

import { describe, expect, it } from 'vitest';
import Database from 'better-sqlite3';
import { schemaStatements } from '../../server/db/schema';

describe('DB Schema', () => {
  it('laesst sich mehrfach ausfuehren', () => {
    const db = new Database(':memory:');
    schemaStatements.forEach((statement) => db.exec(statement));

    expect(() => {
      schemaStatements.forEach((statement) => db.exec(statement));
    }).not.toThrow();

    db.close();
  });
});
