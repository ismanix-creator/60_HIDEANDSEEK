/**
 * @file        seed-db.ts
 * @description Erstellt Testdaten fuer SQLite (Material, Kunden, Posten, Bewegungen)
 * @version     0.1.0
 * @created     2026-01-07 00:03:06 CET
 * @updated     2026-01-07 00:03:06 CET
 * @author      Akki Scholze
 *
 * @changelog
 *   0.1.0 - 2026-01-07 - Initialer Seed-Script
 */

import { openDatabase, initializeSchema } from '../server/db/connection';

function getArgValue(flag: string, args: string[]) {
  const index = args.indexOf(flag);
  if (index === -1) return undefined;
  return args[index + 1];
}

const args = process.argv.slice(2);
const overridePath = getArgValue('--db', args);
const force = args.includes('--force');

const db = openDatabase(overridePath);
db.exec('PRAGMA foreign_keys = ON;');
initializeSchema(db);

const tableNames = [
  'material_bewegungen_rechnung',
  'material_bewegungen_bar',
  'kunden_posten_mat',
  'kunden_posten_nomat',
  'material',
  'kunden',
  'glaeubiger',
  'schuldner'
];

const hasAnyData = tableNames.some((table) => {
  const row = db.prepare(`SELECT COUNT(*) as count FROM ${table}`).get() as { count: number };
  return row.count > 0;
});

if (hasAnyData && !force) {
  console.log('Seed uebersprungen: Es sind bereits Daten vorhanden. Nutze --force zum Leeren.');
  db.close();
  process.exit(0);
}

if (force) {
  db.exec('BEGIN');
  try {
    tableNames.forEach((table) => db.exec(`DELETE FROM ${table};`));
    db.exec('COMMIT');
  } catch (error) {
    db.exec('ROLLBACK');
    throw error;
  }
}

const now = new Date().toISOString();

const insertTx = db.transaction(() => {
  const insertMaterial = db.prepare(
    `INSERT INTO material
    (datum, bezeichnung, menge, ek_stueck, ek_gesamt, vk_stueck, bestand, einnahmen_bar, einnahmen_rechnung, gewinn_aktuell, gewinn_theoretisch, notiz, created_at, updated_at)
    VALUES (@datum, @bezeichnung, @menge, @ek_stueck, @ek_gesamt, @vk_stueck, @bestand, @einnahmen_bar, @einnahmen_rechnung, @gewinn_aktuell, @gewinn_theoretisch, @notiz, @created_at, @updated_at);`
  );

  const materialRows = [
    {
      datum: '2026-01-01',
      bezeichnung: 'Kupferkabel',
      menge: 100,
      ek_stueck: 1.2,
      ek_gesamt: 120,
      vk_stueck: 2.0,
      bestand: 75,
      einnahmen_bar: 40,
      einnahmen_rechnung: 10,
      gewinn_aktuell: 18,
      gewinn_theoretisch: 80,
      notiz: 'Startbestand Januar',
      created_at: now,
      updated_at: now
    },
    {
      datum: '2026-01-03',
      bezeichnung: 'Aluminiumprofil',
      menge: 60,
      ek_stueck: 3.5,
      ek_gesamt: 210,
      vk_stueck: 5.0,
      bestand: 48,
      einnahmen_bar: 30,
      einnahmen_rechnung: 20,
      gewinn_aktuell: 22,
      gewinn_theoretisch: 90,
      notiz: 'Lieferung KW01',
      created_at: now,
      updated_at: now
    }
  ];

  const materialIds = materialRows.map((row) => insertMaterial.run(row).lastInsertRowid as number);

  const insertKunde = db.prepare(
    `INSERT INTO kunden (name, created_at, updated_at) VALUES (@name, @created_at, @updated_at);`
  );

  const kundenRows = [
    { name: 'Kunde Nord', created_at: now, updated_at: now },
    { name: 'Kunde Sued', created_at: now, updated_at: now }
  ];

  const kundenIds = kundenRows.map((row) => insertKunde.run(row).lastInsertRowid as number);

  const insertPostenMat = db.prepare(
    `INSERT INTO kunden_posten_mat
    (kunde_id, material_id, datum, menge, preis, bezahlt, offen, status, notiz, created_at, updated_at)
    VALUES (@kunde_id, @material_id, @datum, @menge, @preis, @bezahlt, @offen, @status, @notiz, @created_at, @updated_at);`
  );

  insertPostenMat.run({
    kunde_id: kundenIds[0],
    material_id: materialIds[0],
    datum: '2026-01-04',
    menge: 10,
    preis: 2.0,
    bezahlt: 8,
    offen: 12,
    status: 'teilweise',
    notiz: 'Teilzahlung erhalten',
    created_at: now,
    updated_at: now
  });

  insertPostenMat.run({
    kunde_id: kundenIds[1],
    material_id: materialIds[1],
    datum: '2026-01-05',
    menge: 6,
    preis: 5.0,
    bezahlt: 30,
    offen: 0,
    status: 'bezahlt',
    notiz: 'Kombi-Verkauf',
    created_at: now,
    updated_at: now
  });

  const insertPostenNoMat = db.prepare(
    `INSERT INTO kunden_posten_nomat
    (kunde_id, datum, bezeichnung, betrag, bezahlt, offen, status, notiz, created_at, updated_at)
    VALUES (@kunde_id, @datum, @bezeichnung, @betrag, @bezahlt, @offen, @status, @notiz, @created_at, @updated_at);`
  );

  insertPostenNoMat.run({
    kunde_id: kundenIds[0],
    datum: '2026-01-06',
    bezeichnung: 'Servicepauschale',
    betrag: 25,
    bezahlt: 0,
    offen: 25,
    status: 'offen',
    notiz: 'Offene Servicekosten',
    created_at: now,
    updated_at: now
  });

  const insertGlaeubiger = db.prepare(
    `INSERT INTO glaeubiger
    (datum, name, betrag, bezahlt, offen, faelligkeit, status, notiz, created_at, updated_at)
    VALUES (@datum, @name, @betrag, @bezahlt, @offen, @faelligkeit, @status, @notiz, @created_at, @updated_at);`
  );

  insertGlaeubiger.run({
    datum: '2026-01-02',
    name: 'Lieferant A',
    betrag: 180,
    bezahlt: 60,
    offen: 120,
    faelligkeit: '2026-01-20',
    status: 'teilweise',
    notiz: 'Anzahlung geleistet',
    created_at: now,
    updated_at: now
  });

  const insertSchuldner = db.prepare(
    `INSERT INTO schuldner
    (datum, name, betrag, bezahlt, offen, faelligkeit, status, notiz, created_at, updated_at)
    VALUES (@datum, @name, @betrag, @bezahlt, @offen, @faelligkeit, @status, @notiz, @created_at, @updated_at);`
  );

  insertSchuldner.run({
    datum: '2026-01-03',
    name: 'Partner B',
    betrag: 95,
    bezahlt: 0,
    offen: 95,
    faelligkeit: '2026-02-01',
    status: 'offen',
    notiz: 'Rueckzahlung ausstehend',
    created_at: now,
    updated_at: now
  });

  const insertBar = db.prepare(
    `INSERT INTO material_bewegungen_bar
    (material_id, datum, menge, preis, info, notiz, created_at, updated_at)
    VALUES (@material_id, @datum, @menge, @preis, @info, @notiz, @created_at, @updated_at);`
  );

  insertBar.run({
    material_id: materialIds[0],
    datum: '2026-01-04',
    menge: 5,
    preis: 2.0,
    info: 'Barzahlung',
    notiz: 'Abholung vor Ort',
    created_at: now,
    updated_at: now
  });

  const insertRechnung = db.prepare(
    `INSERT INTO material_bewegungen_rechnung
    (material_id, kunde_id, datum, menge, preis, notiz, created_at, updated_at)
    VALUES (@material_id, @kunde_id, @datum, @menge, @preis, @notiz, @created_at, @updated_at);`
  );

  insertRechnung.run({
    material_id: materialIds[1],
    kunde_id: kundenIds[1],
    datum: '2026-01-05',
    menge: 6,
    preis: 5.0,
    notiz: 'Rechnung-Posten',
    created_at: now,
    updated_at: now
  });
});

insertTx();
db.close();

console.log('Seed abgeschlossen.');
