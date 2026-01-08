/**
 * @file        kunden-posten-mat.service.ts
 * @description KundenPostenMat-Services fuer CRUD und Zahlungen
 * @version     0.1.0
 * @created     2026-01-07 00:29:44 CET
 * @updated     2026-01-07 00:29:44 CET
 * @author      backend-entwickler
 *
 * @changelog
 *   0.1.0 - 2026-01-07 - Initial scaffold mit Ueberschuss-Logik
 */

import type Database from 'better-sqlite3';
import { notFound } from '../errors.js';
import { nowIso } from '../utils/time.js';

export type KundenPostenMatRecord = {
  id: number;
  kunde_id: number;
  material_id: number;
  datum: string;
  menge: number;
  preis: number;
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

function ensureMaterialExists(db: Database.Database, materialId: number) {
  const stmt = db.prepare('SELECT id FROM material WHERE id = ?');
  const row = stmt.get(materialId) as { id: number } | undefined;
  if (!row) throw notFound('Material not found');
}

export function listKundenPostenMat(db: Database.Database) {
  const stmt = db.prepare('SELECT * FROM kunden_posten_mat ORDER BY id DESC');
  return stmt.all() as KundenPostenMatRecord[];
}

export function getKundenPostenMatById(db: Database.Database, id: number) {
  const stmt = db.prepare('SELECT * FROM kunden_posten_mat WHERE id = ?');
  const row = stmt.get(id) as KundenPostenMatRecord | undefined;
  if (!row) throw notFound('KundenPostenMat not found');
  return row;
}

export function listKundenPostenMatByKunde(db: Database.Database, kundeId: number) {
  ensureKundeExists(db, kundeId);
  const stmt = db.prepare('SELECT * FROM kunden_posten_mat WHERE kunde_id = ? ORDER BY id DESC');
  return stmt.all(kundeId) as KundenPostenMatRecord[];
}

export function createKundenPostenMat(
  db: Database.Database,
  input: Omit<KundenPostenMatRecord, 'id' | 'created_at' | 'updated_at'>
) {
  ensureKundeExists(db, input.kunde_id);
  ensureMaterialExists(db, input.material_id);

  const now = nowIso();
  const betrag = input.menge * input.preis;
  const bezahlt = input.bezahlt ?? 0;
  const offen = betrag - bezahlt;
  const status = calculateStatus(bezahlt, betrag);

  const stmt = db.prepare(`
    INSERT INTO kunden_posten_mat (
      kunde_id, material_id, datum, menge, preis, bezahlt, offen, status, notiz,
      created_at, updated_at
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  const result = stmt.run(
    input.kunde_id,
    input.material_id,
    input.datum,
    input.menge,
    input.preis,
    bezahlt,
    offen,
    status,
    input.notiz ?? null,
    now,
    now
  );

  return getKundenPostenMatById(db, Number(result.lastInsertRowid));
}

export function updateKundenPostenMat(
  db: Database.Database,
  id: number,
  input: Partial<Omit<KundenPostenMatRecord, 'id' | 'created_at' | 'updated_at'>>
) {
  const current = getKundenPostenMatById(db, id);

  if (input.kunde_id !== undefined) ensureKundeExists(db, input.kunde_id);
  if (input.material_id !== undefined) ensureMaterialExists(db, input.material_id);

  const updated = {
    ...current,
    ...input,
    notiz: input.notiz !== undefined ? input.notiz : current.notiz
  };

  const betrag = updated.menge * updated.preis;
  updated.offen = betrag - updated.bezahlt;
  updated.status = calculateStatus(updated.bezahlt, betrag);
  updated.updated_at = nowIso();

  const stmt = db.prepare(`
    UPDATE kunden_posten_mat SET
      kunde_id = ?, material_id = ?, datum = ?, menge = ?, preis = ?,
      bezahlt = ?, offen = ?, status = ?, notiz = ?, updated_at = ?
    WHERE id = ?
  `);

  stmt.run(
    updated.kunde_id,
    updated.material_id,
    updated.datum,
    updated.menge,
    updated.preis,
    updated.bezahlt,
    updated.offen,
    updated.status,
    updated.notiz,
    updated.updated_at,
    id
  );

  return getKundenPostenMatById(db, id);
}

export function deleteKundenPostenMat(db: Database.Database, id: number) {
  const existing = getKundenPostenMatById(db, id);
  const stmt = db.prepare('DELETE FROM kunden_posten_mat WHERE id = ?');
  stmt.run(id);
  return existing;
}

export function verbucheZahlungKundenPostenMat(db: Database.Database, id: number, zahlungsbetrag: number) {
  const posten = getKundenPostenMatById(db, id);
  const betrag = posten.menge * posten.preis;
  const neuBezahlt = posten.bezahlt + zahlungsbetrag;

  // Überschuss-Logik
  if (neuBezahlt > betrag) {
    return db.transaction(() => {
      const ueberschuss = neuBezahlt - betrag;

      // 1. KundenPostenMat aktualisieren (nur bis betrag bezahlen)
      const stmtMat = db.prepare(`
        UPDATE kunden_posten_mat
        SET bezahlt = ?, offen = ?, status = ?, updated_at = ?
        WHERE id = ?
      `);
      stmtMat.run(betrag, 0, 'bezahlt', nowIso(), id);

      // 2. Neuesten KundenPostenNoMat des Kunden holen
      const stmtNoMat = db.prepare(`
        SELECT * FROM kunden_posten_nomat
        WHERE kunde_id = ? AND status = 'offen'
        ORDER BY id DESC
        LIMIT 1
      `);
      const nomatPosten = stmtNoMat.get(posten.kunde_id) as any | undefined;

      if (nomatPosten) {
        // 3. Überschuss vom NoMat-Posten abziehen
        const neuBezahltNoMat = nomatPosten.bezahlt + ueberschuss;
        const neuOffenNoMat = nomatPosten.betrag - neuBezahltNoMat;
        const neuStatusNoMat = calculateStatus(neuBezahltNoMat, nomatPosten.betrag);

        // Material-Bezeichnung holen
        const stmtMaterial = db.prepare('SELECT bezeichnung FROM material WHERE id = ?');
        const material = stmtMaterial.get(posten.material_id) as { bezeichnung: string } | undefined;
        const materialName = material?.bezeichnung ?? 'Material';

        const notiz = nomatPosten.notiz
          ? `${nomatPosten.notiz}\nAutomatische Gutschrift aus Überschuss: ${materialName} (${ueberschuss.toFixed(2)}EUR)`
          : `Automatische Gutschrift aus Überschuss: ${materialName} (${ueberschuss.toFixed(2)}EUR)`;

        const stmtUpdateNoMat = db.prepare(`
          UPDATE kunden_posten_nomat
          SET bezahlt = ?, offen = ?, status = ?, notiz = ?, updated_at = ?
          WHERE id = ?
        `);
        stmtUpdateNoMat.run(neuBezahltNoMat, neuOffenNoMat, neuStatusNoMat, notiz, nowIso(), nomatPosten.id);
      }

      return getKundenPostenMatById(db, id);
    })();
  }

  // Normale Zahlung ohne Überschuss
  const neuOffen = betrag - neuBezahlt;
  const neuStatus = calculateStatus(neuBezahlt, betrag);

  const stmt = db.prepare(`
    UPDATE kunden_posten_mat
    SET bezahlt = ?, offen = ?, status = ?, updated_at = ?
    WHERE id = ?
  `);

  stmt.run(neuBezahlt, neuOffen, neuStatus, nowIso(), id);
  return getKundenPostenMatById(db, id);
}
