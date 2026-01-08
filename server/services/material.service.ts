/**
 * @file        material.service.ts
 * @description Material-Services fuer CRUD und Bewegungen
 * @version     0.1.1
 * @created     2026-01-06 22:20:42 CET
 * @updated     2026-01-06 23:13:30 CET
 * @author      Akki Scholze
 *
 * @changelog
 *   0.1.1 - 2026-01-06 - Transaktionen, Kunde-Check, stabile Historie-Sortierung
 *   0.1.0 - 2026-01-06 - Initial scaffold
 */

import type Database from 'better-sqlite3';
import { badRequest, notFound } from '../errors.js';
import { nowIso } from '../utils/time.js';

export type MaterialRecord = {
  id: number;
  datum: string;
  bezeichnung: string;
  menge: number;
  ek_stueck: number;
  ek_gesamt: number;
  vk_stueck: number;
  bestand: number;
  einnahmen_bar: number;
  einnahmen_kombi: number;
  gewinn_aktuell: number;
  gewinn_theoretisch: number;
  notiz: string | null;
  created_at: string;
  updated_at: string;
};

export function listMaterial(db: Database.Database) {
  const stmt = db.prepare('SELECT * FROM material ORDER BY id DESC');
  return stmt.all() as MaterialRecord[];
}

export function getMaterialById(db: Database.Database, id: number) {
  const stmt = db.prepare('SELECT * FROM material WHERE id = ?');
  const row = stmt.get(id) as MaterialRecord | undefined;
  if (!row) throw notFound('Material not found');
  return row;
}

function ensureKundeExists(db: Database.Database, kundeId: number) {
  const stmt = db.prepare('SELECT id FROM kunden WHERE id = ?');
  const row = stmt.get(kundeId) as { id: number } | undefined;
  if (!row) throw notFound('Kunde not found');
}

export function createMaterial(db: Database.Database, input: Omit<MaterialRecord, 'id' | 'created_at' | 'updated_at'>) {
  const now = nowIso();
  const stmt = db.prepare(`
    INSERT INTO material (
      datum, bezeichnung, menge, ek_stueck, ek_gesamt, vk_stueck,
      bestand, einnahmen_bar, einnahmen_kombi, gewinn_aktuell, gewinn_theoretisch, notiz,
      created_at, updated_at
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);
  const result = stmt.run(
    input.datum,
    input.bezeichnung,
    input.menge,
    input.ek_stueck,
    input.ek_gesamt,
    input.vk_stueck,
    input.bestand,
    input.einnahmen_bar,
    input.einnahmen_kombi,
    input.gewinn_aktuell,
    input.gewinn_theoretisch,
    input.notiz ?? null,
    now,
    now
  );

  return getMaterialById(db, Number(result.lastInsertRowid));
}

export function updateMaterial(
  db: Database.Database,
  id: number,
  input: Partial<Omit<MaterialRecord, 'id' | 'created_at' | 'updated_at'>>
) {
  const current = getMaterialById(db, id);
  const updated = {
    ...current,
    ...input,
    notiz: input.notiz ?? current.notiz,
    updated_at: nowIso()
  };

  const stmt = db.prepare(`
    UPDATE material SET
      datum = ?,
      bezeichnung = ?,
      menge = ?,
      ek_stueck = ?,
      ek_gesamt = ?,
      vk_stueck = ?,
      bestand = ?,
      einnahmen_bar = ?,
      einnahmen_kombi = ?,
      gewinn_aktuell = ?,
      gewinn_theoretisch = ?,
      notiz = ?,
      updated_at = ?
    WHERE id = ?
  `);

  stmt.run(
    updated.datum,
    updated.bezeichnung,
    updated.menge,
    updated.ek_stueck,
    updated.ek_gesamt,
    updated.vk_stueck,
    updated.bestand,
    updated.einnahmen_bar,
    updated.einnahmen_kombi,
    updated.gewinn_aktuell,
    updated.gewinn_theoretisch,
    updated.notiz,
    updated.updated_at,
    id
  );

  return getMaterialById(db, id);
}

export function deleteMaterial(db: Database.Database, id: number) {
  const existing = getMaterialById(db, id);
  const stmt = db.prepare('DELETE FROM material WHERE id = ?');
  stmt.run(id);
  return existing;
}

export function listBarMovements(db: Database.Database, materialId?: number): any[] {
  const stmt = materialId
    ? db.prepare('SELECT * FROM material_bewegungen_bar WHERE material_id = ? ORDER BY datum DESC, id DESC')
    : db.prepare('SELECT * FROM material_bewegungen_bar ORDER BY datum DESC, id DESC');
  return materialId ? stmt.all(materialId) : stmt.all();
}

export function listKombiMovements(db: Database.Database, materialId?: number): any[] {
  const stmt = materialId
    ? db.prepare('SELECT * FROM material_bewegungen_kombi WHERE material_id = ? ORDER BY datum DESC, id DESC')
    : db.prepare('SELECT * FROM material_bewegungen_kombi ORDER BY datum DESC, id DESC');
  return materialId ? stmt.all(materialId) : stmt.all();
}

export function createBarMovement(
  db: Database.Database,
  input: { material_id: number; datum: string; menge: number; preis: number; info?: string; notiz?: string }
) {
  const material = getMaterialById(db, input.material_id);
  if (material.bestand - input.menge < 0) {
    throw badRequest('Bestand darf nicht negativ werden');
  }

  const insertStmt = db.prepare(`
    INSERT INTO material_bewegungen_bar (
      material_id, datum, menge, preis, info, notiz, created_at
    ) VALUES (?, ?, ?, ?, ?, ?, ?)
  `);
  const now = nowIso();

  const updateStmt = db.prepare(`
    UPDATE material
    SET bestand = ?, einnahmen_bar = ?, updated_at = ?
    WHERE id = ?
  `);
  const runTransaction = db.transaction(() => {
    insertStmt.run(
      input.material_id,
      input.datum,
      input.menge,
      input.preis,
      input.info ?? null,
      input.notiz ?? null,
      now
    );
    updateStmt.run(material.bestand - input.menge, material.einnahmen_bar + input.preis, now, input.material_id);
  });
  runTransaction();

  return { success: true };
}

export function createKombiMovement(
  db: Database.Database,
  input: { material_id: number; kunde_id: number; datum: string; menge: number; preis: number; notiz?: string }
) {
  const material = getMaterialById(db, input.material_id);
  ensureKundeExists(db, input.kunde_id);
  if (material.bestand - input.menge < 0) {
    throw badRequest('Bestand darf nicht negativ werden');
  }

  const insertStmt = db.prepare(`
    INSERT INTO material_bewegungen_kombi (
      material_id, kunde_id, datum, menge, preis, notiz, created_at
    ) VALUES (?, ?, ?, ?, ?, ?, ?)
  `);
  const now = nowIso();

  const updateStmt = db.prepare(`
    UPDATE material
    SET bestand = ?, einnahmen_kombi = ?, updated_at = ?
    WHERE id = ?
  `);
  const runTransaction = db.transaction(() => {
    insertStmt.run(input.material_id, input.kunde_id, input.datum, input.menge, input.preis, input.notiz ?? null, now);
    updateStmt.run(material.bestand - input.menge, material.einnahmen_kombi + input.preis, now, input.material_id);
  });
  runTransaction();

  return { success: true };
}

export function getMaterialHistorie(db: Database.Database, materialId: number) {
  const bar = listBarMovements(db, materialId).map((item) => ({ ...item, typ: 'bar' as const }));
  const kombi = listKombiMovements(db, materialId).map((item) => ({ ...item, typ: 'kombi' as const }));
  const combined = [...bar, ...kombi].sort((a, b) => {
    const dateA = Date.parse(a.datum);
    const dateB = Date.parse(b.datum);
    if (!Number.isNaN(dateA) && !Number.isNaN(dateB) && dateA !== dateB) {
      return dateB - dateA;
    }
    if (a.datum !== b.datum) {
      return a.datum < b.datum ? 1 : -1;
    }
    return (b.id ?? 0) - (a.id ?? 0);
  });

  const grouped: Record<string, typeof combined> = {};
  combined.forEach((item) => {
    const key = item.datum;
    if (!grouped[key]) grouped[key] = [];
    grouped[key].push(item);
  });

  return Object.entries(grouped).map(([datum, items]) => ({
    datum,
    items,
    latest: items[0]
  }));
}
