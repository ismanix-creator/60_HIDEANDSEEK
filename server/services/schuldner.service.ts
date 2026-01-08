/**
 * @file        schuldner.service.ts
 * @description Schuldner-Services fuer CRUD und Zahlungen
 * @version     0.1.0
 * @created     2026-01-07 00:29:44 CET
 * @updated     2026-01-07 00:29:44 CET
 * @author      backend-entwickler
 *
 * @changelog
 *   0.1.0 - 2026-01-07 - Initial scaffold
 */

import type Database from 'better-sqlite3';
import { notFound } from '../errors.js';
import { nowIso } from '../utils/time.js';

export type SchuldnerRecord = {
  id: number;
  datum: string;
  name: string;
  betrag: number;
  bezahlt: number;
  offen: number;
  faelligkeit: string | null;
  status: string;
  notiz: string | null;
  created_at: string;
  updated_at: string;
};

function calculateStatus(bezahlt: number, betrag: number): string {
  return bezahlt >= betrag ? 'bezahlt' : 'offen';
}

export function listSchuldner(db: Database.Database) {
  const stmt = db.prepare('SELECT * FROM schuldner ORDER BY id DESC');
  return stmt.all() as SchuldnerRecord[];
}

export function getSchuldnerById(db: Database.Database, id: number) {
  const stmt = db.prepare('SELECT * FROM schuldner WHERE id = ?');
  const row = stmt.get(id) as SchuldnerRecord | undefined;
  if (!row) throw notFound('Schuldner not found');
  return row;
}

export function createSchuldner(
  db: Database.Database,
  input: Omit<SchuldnerRecord, 'id' | 'created_at' | 'updated_at'>
) {
  const now = nowIso();
  const bezahlt = input.bezahlt ?? 0;
  const offen = input.betrag - bezahlt;
  const status = calculateStatus(bezahlt, input.betrag);

  const stmt = db.prepare(`
    INSERT INTO schuldner (
      datum, name, betrag, bezahlt, offen, faelligkeit, status, notiz,
      created_at, updated_at
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  const result = stmt.run(
    input.datum,
    input.name,
    input.betrag,
    bezahlt,
    offen,
    input.faelligkeit ?? null,
    status,
    input.notiz ?? null,
    now,
    now
  );

  return getSchuldnerById(db, Number(result.lastInsertRowid));
}

export function updateSchuldner(
  db: Database.Database,
  id: number,
  input: Partial<Omit<SchuldnerRecord, 'id' | 'created_at' | 'updated_at'>>
) {
  const current = getSchuldnerById(db, id);

  const updated = {
    ...current,
    ...input,
    notiz: input.notiz !== undefined ? input.notiz : current.notiz,
    faelligkeit: input.faelligkeit !== undefined ? input.faelligkeit : current.faelligkeit
  };

  updated.offen = updated.betrag - updated.bezahlt;
  updated.status = calculateStatus(updated.bezahlt, updated.betrag);
  updated.updated_at = nowIso();

  const stmt = db.prepare(`
    UPDATE schuldner SET
      datum = ?, name = ?, betrag = ?, bezahlt = ?,
      offen = ?, faelligkeit = ?, status = ?, notiz = ?, updated_at = ?
    WHERE id = ?
  `);

  stmt.run(
    updated.datum,
    updated.name,
    updated.betrag,
    updated.bezahlt,
    updated.offen,
    updated.faelligkeit,
    updated.status,
    updated.notiz,
    updated.updated_at,
    id
  );

  return getSchuldnerById(db, id);
}

export function deleteSchuldner(db: Database.Database, id: number) {
  const existing = getSchuldnerById(db, id);
  const stmt = db.prepare('DELETE FROM schuldner WHERE id = ?');
  stmt.run(id);
  return existing;
}

export function verbucheZahlungSchuldner(db: Database.Database, id: number, zahlungsbetrag: number) {
  const posten = getSchuldnerById(db, id);
  const neuBezahlt = posten.bezahlt + zahlungsbetrag;
  const neuOffen = posten.betrag - neuBezahlt;
  const neuStatus = calculateStatus(neuBezahlt, posten.betrag);

  const stmt = db.prepare(`
    UPDATE schuldner
    SET bezahlt = ?, offen = ?, status = ?, updated_at = ?
    WHERE id = ?
  `);

  stmt.run(neuBezahlt, neuOffen, neuStatus, nowIso(), id);
  return getSchuldnerById(db, id);
}
