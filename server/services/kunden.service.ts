/**
 * @file        kunden.service.ts
 * @description Kunden-Services fuer CRUD
 * @version     0.1.0
 * @created     2026-01-06 23:20:12 CET
 * @updated     2026-01-06 23:20:12 CET
 * @author      agenten-koordinator
 *
 * @changelog
 *   0.1.0 - 2026-01-06 - Initial scaffold
 */

import type Database from 'better-sqlite3';
import { conflict, notFound } from '../errors.js';
import { nowIso } from '../utils/time.js';

export type KundenRecord = {
  id: number;
  name: string;
  created_at: string;
  updated_at: string;
};

function getKundeByName(db: Database.Database, name: string) {
  const stmt = db.prepare('SELECT * FROM kunden WHERE name = ?');
  return stmt.get(name) as KundenRecord | undefined;
}

export function listKunden(db: Database.Database) {
  const stmt = db.prepare('SELECT * FROM kunden ORDER BY id DESC');
  return stmt.all() as KundenRecord[];
}

export function getKundeById(db: Database.Database, id: number) {
  const stmt = db.prepare('SELECT * FROM kunden WHERE id = ?');
  const row = stmt.get(id) as KundenRecord | undefined;
  if (!row) throw notFound('Kunde not found');
  return row;
}

export function createKunde(db: Database.Database, input: { name: string }) {
  const existing = getKundeByName(db, input.name);
  if (existing) throw conflict('Kunde already exists');
  const now = nowIso();
  const stmt = db.prepare(`
    INSERT INTO kunden (name, created_at, updated_at)
    VALUES (?, ?, ?)
  `);
  const result = stmt.run(input.name, now, now);
  return getKundeById(db, Number(result.lastInsertRowid));
}

export function updateKunde(db: Database.Database, id: number, input: { name?: string }) {
  const current = getKundeById(db, id);
  if (input.name && input.name !== current.name) {
    const existing = getKundeByName(db, input.name);
    if (existing && existing.id !== id) throw conflict('Kunde already exists');
  }
  const updated = {
    ...current,
    ...input,
    updated_at: nowIso()
  };

  const stmt = db.prepare(`
    UPDATE kunden
    SET name = ?, updated_at = ?
    WHERE id = ?
  `);
  stmt.run(updated.name, updated.updated_at, id);
  return getKundeById(db, id);
}

export function deleteKunde(db: Database.Database, id: number) {
  const existing = getKundeById(db, id);
  const stmt = db.prepare('DELETE FROM kunden WHERE id = ?');
  stmt.run(id);
  return existing;
}
