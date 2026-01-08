/**
 * @file        glaeubiger.service.ts
 * @description Glaeubiger-Services fuer CRUD und Zahlungen
 * @version     0.1.0
 * @created     2026-01-07 00:29:44 CET
 * @updated     2026-01-07 00:29:44 CET
 * @author      Akki Scholze
 *
 * @changelog
 *   0.1.0 - 2026-01-07 - Initial scaffold
 */

import type Database from 'better-sqlite3';
import { notFound } from '../errors.js';
import { nowIso } from '../utils/time.js';

export type GlaeubigersRecord = {
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

export function listGlaeubiger(db: Database.Database) {
  const stmt = db.prepare('SELECT * FROM glaeubiger ORDER BY id DESC');
  return stmt.all() as GlaeubigersRecord[];
}

export function getGlaeubigersById(db: Database.Database, id: number) {
  const stmt = db.prepare('SELECT * FROM glaeubiger WHERE id = ?');
  const row = stmt.get(id) as GlaeubigersRecord | undefined;
  if (!row) throw notFound('Glaeubiger not found');
  return row;
}

export function createGlaeubiger(
  db: Database.Database,
  input: Omit<GlaeubigersRecord, 'id' | 'created_at' | 'updated_at'>
) {
  const now = nowIso();
  const bezahlt = input.bezahlt ?? 0;
  const offen = input.betrag - bezahlt;
  const status = calculateStatus(bezahlt, input.betrag);

  const stmt = db.prepare(`
    INSERT INTO glaeubiger (
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

  return getGlaeubigersById(db, Number(result.lastInsertRowid));
}

export function updateGlaeubiger(
  db: Database.Database,
  id: number,
  input: Partial<Omit<GlaeubigersRecord, 'id' | 'created_at' | 'updated_at'>>
) {
  const current = getGlaeubigersById(db, id);

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
    UPDATE glaeubiger SET
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

  return getGlaeubigersById(db, id);
}

export function deleteGlaeubiger(db: Database.Database, id: number) {
  const existing = getGlaeubigersById(db, id);
  const stmt = db.prepare('DELETE FROM glaeubiger WHERE id = ?');
  stmt.run(id);
  return existing;
}

export function verbucheZahlungGlaeubiger(db: Database.Database, id: number, zahlungsbetrag: number) {
  const posten = getGlaeubigersById(db, id);
  const neuBezahlt = posten.bezahlt + zahlungsbetrag;
  const neuOffen = posten.betrag - neuBezahlt;
  const neuStatus = calculateStatus(neuBezahlt, posten.betrag);

  const stmt = db.prepare(`
    UPDATE glaeubiger
    SET bezahlt = ?, offen = ?, status = ?, updated_at = ?
    WHERE id = ?
  `);

  stmt.run(neuBezahlt, neuOffen, neuStatus, nowIso(), id);
  return getGlaeubigersById(db, id);
}
