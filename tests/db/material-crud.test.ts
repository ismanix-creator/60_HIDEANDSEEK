/**
 * @file        material-crud.test.ts
 * @description CRUD Test fuer material Tabelle
 * @version     0.1.0
 * @created     2026-01-08 15:20:04 CET
 * @updated     2026-01-08 15:20:04 CET
 * @author      codex
 *
 * @changelog
 *   0.1.0 - 2026-01-08 - Minimaler CRUD Test fuer material
 */

import { describe, expect, it } from 'vitest';
import { createTestDb } from '../helpers/testDb';

describe('material CRUD', () => {
  it('erstellt, liest, aktualisiert und loescht', () => {
    const { db, cleanup } = createTestDb(':memory:');
    const now = '2026-01-08T15:20:04.000Z';

    const insert = db.prepare(`
      INSERT INTO material (
        datum,
        bezeichnung,
        menge,
        ek_stueck,
        ek_gesamt,
        vk_stueck,
        bestand,
        einnahmen_bar,
        einnahmen_kombi,
        gewinn_aktuell,
        gewinn_theoretisch,
        notiz,
        created_at,
        updated_at
      ) VALUES (
        @datum,
        @bezeichnung,
        @menge,
        @ek_stueck,
        @ek_gesamt,
        @vk_stueck,
        @bestand,
        @einnahmen_bar,
        @einnahmen_kombi,
        @gewinn_aktuell,
        @gewinn_theoretisch,
        @notiz,
        @created_at,
        @updated_at
      )
    `);

    const result = insert.run({
      datum: '2026-01-08',
      bezeichnung: 'Testmaterial',
      menge: 5,
      ek_stueck: 2,
      ek_gesamt: 10,
      vk_stueck: 4,
      bestand: 5,
      einnahmen_bar: 0,
      einnahmen_kombi: 0,
      gewinn_aktuell: 0,
      gewinn_theoretisch: 0,
      notiz: 'Init',
      created_at: now,
      updated_at: now
    });

    const row = db.prepare('SELECT * FROM material WHERE id = ?').get(result.lastInsertRowid) as { bezeichnung: string };
    expect(row).toBeTruthy();
    expect(row.bezeichnung).toBe('Testmaterial');

    const update = db.prepare('UPDATE material SET bestand = ? WHERE id = ?');
    update.run(3, result.lastInsertRowid);

    const updated = db.prepare('SELECT bestand FROM material WHERE id = ?').get(result.lastInsertRowid) as { bestand: number };
    expect(updated.bestand).toBe(3);

    const del = db.prepare('DELETE FROM material WHERE id = ?');
    del.run(result.lastInsertRowid);

    const remaining = db.prepare('SELECT COUNT(*) as count FROM material').get() as { count: number };
    expect(remaining.count).toBe(0);

    cleanup();
  });
});
