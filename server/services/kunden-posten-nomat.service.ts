/**
 * @file        kunden-posten-nomat.service.ts
 * @description KundenPostenNoMat-Services fuer CRUD und Zahlungen
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

export type KundenPostenNoMatRecord = {
  id: number;
  kunde_id: number;
  datum: string;
  bezeichnung: string;
  betrag: number;
  bezahlt: number;
  offen: number;
  status: string;
  notiz: string | null;
  created_at: string;
  updated_at: string;
};

function calculateStatus(bezahlt: number, betrag: number): string {
  return bezahlt >= betrag ? 'bezahlt' : 'offen';
}

function ensureKundeExists(db: Database.Database, kundeId: number) {
  const stmt = db.prepare('SELECT id FROM kunden WHERE id = ?');
  const row = stmt.get(kundeId) as { id: number } | undefined;
  if (!row) throw notFound('Kunde not found');
}

export function listKundenPostenNoMat(db: Database.Database) {
  const stmt = db.prepare('SELECT * FROM kunden_posten_nomat ORDER BY id DESC');
  return stmt.all() as KundenPostenNoMatRecord[];
}

export function getKundenPostenNoMatById(db: Database.Database, id: number) {
  const stmt = db.prepare('SELECT * FROM kunden_posten_nomat WHERE id = ?');
  const row = stmt.get(id) as KundenPostenNoMatRecord | undefined;
  if (!row) throw notFound('KundenPostenNoMat not found');
  return row;
}

export function listKundenPostenNoMatByKunde(db: Database.Database, kundeId: number) {
  ensureKundeExists(db, kundeId);
  const stmt = db.prepare('SELECT * FROM kunden_posten_nomat WHERE kunde_id = ? ORDER BY id DESC');
  return stmt.all(kundeId) as KundenPostenNoMatRecord[];
}

export function createKundenPostenNoMat(
  db: Database.Database,
  input: Omit<KundenPostenNoMatRecord, 'id' | 'created_at' | 'updated_at'>
) {
  ensureKundeExists(db, input.kunde_id);

  const now = nowIso();
  const bezahlt = input.bezahlt ?? 0;
  const offen = input.betrag - bezahlt;
  const status = calculateStatus(bezahlt, input.betrag);

  const stmt = db.prepare(`
    INSERT INTO kunden_posten_nomat (
      kunde_id, datum, bezeichnung, betrag, bezahlt, offen, status, notiz,
      created_at, updated_at
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  const result = stmt.run(
    input.kunde_id,
    input.datum,
    input.bezeichnung,
    input.betrag,
    bezahlt,
    offen,
    status,
    input.notiz ?? null,
    now,
    now
  );

  return getKundenPostenNoMatById(db, Number(result.lastInsertRowid));
}

export function updateKundenPostenNoMat(
  db: Database.Database,
  id: number,
  input: Partial<Omit<KundenPostenNoMatRecord, 'id' | 'created_at' | 'updated_at'>>
) {
  const current = getKundenPostenNoMatById(db, id);

  if (input.kunde_id !== undefined) ensureKundeExists(db, input.kunde_id);

  const updated = {
    ...current,
    ...input,
    notiz: input.notiz !== undefined ? input.notiz : current.notiz
  };

  updated.offen = updated.betrag - updated.bezahlt;
  updated.status = calculateStatus(updated.bezahlt, updated.betrag);
  updated.updated_at = nowIso();

  const stmt = db.prepare(`
    UPDATE kunden_posten_nomat SET
      kunde_id = ?, datum = ?, bezeichnung = ?, betrag = ?,
      bezahlt = ?, offen = ?, status = ?, notiz = ?, updated_at = ?
    WHERE id = ?
  `);

  stmt.run(
    updated.kunde_id,
    updated.datum,
    updated.bezeichnung,
    updated.betrag,
    updated.bezahlt,
    updated.offen,
    updated.status,
    updated.notiz,
    updated.updated_at,
    id
  );

  return getKundenPostenNoMatById(db, id);
}

export function deleteKundenPostenNoMat(db: Database.Database, id: number) {
  const existing = getKundenPostenNoMatById(db, id);
  const stmt = db.prepare('DELETE FROM kunden_posten_nomat WHERE id = ?');
  stmt.run(id);
  return existing;
}

export function verbucheZahlungKundenPostenNoMat(db: Database.Database, id: number, zahlungsbetrag: number) {
  const posten = getKundenPostenNoMatById(db, id);
  const neuBezahlt = posten.bezahlt + zahlungsbetrag;
  const neuOffen = posten.betrag - neuBezahlt;
  const neuStatus = calculateStatus(neuBezahlt, posten.betrag);

  const stmt = db.prepare(`
    UPDATE kunden_posten_nomat
    SET bezahlt = ?, offen = ?, status = ?, updated_at = ?
    WHERE id = ?
  `);

  stmt.run(neuBezahlt, neuOffen, neuStatus, nowIso(), id);
  return getKundenPostenNoMatById(db, id);
}
