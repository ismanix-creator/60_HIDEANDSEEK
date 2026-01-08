/**
 * @file        schema.ts
 * @description SQLite schema definitions (with users/auth table)
 * @version     0.2.0
 * @created     2026-01-06 19:14:38 CET
 * @updated     2026-01-08 01:05:00 CET
 * @author      agenten-koordinator
 *
 * @changelog
 *   0.2.0 - 2026-01-08 - Added users table for auth/setup system
 *   0.1.0 - 2026-01-06 - Initial schema based on plan/db-schema-helper.md
 */

export const schemaStatements = [
  `CREATE TABLE IF NOT EXISTS material (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    datum TEXT NOT NULL,
    bezeichnung TEXT NOT NULL,
    menge REAL NOT NULL,
    ek_stueck REAL NOT NULL,
    ek_gesamt REAL NOT NULL,
    vk_stueck REAL NOT NULL,
    bestand REAL NOT NULL DEFAULT 0,
    einnahmen_bar REAL NOT NULL DEFAULT 0,
    einnahmen_kombi REAL NOT NULL DEFAULT 0,
    gewinn_aktuell REAL NOT NULL DEFAULT 0,
    gewinn_theoretisch REAL NOT NULL DEFAULT 0,
    notiz TEXT,
    created_at TEXT NOT NULL,
    updated_at TEXT NOT NULL
  );`,
  `CREATE TABLE IF NOT EXISTS material_bewegungen_bar (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    material_id INTEGER NOT NULL,
    datum TEXT NOT NULL,
    menge REAL NOT NULL,
    preis REAL NOT NULL,
    info TEXT,
    
    notiz TEXT,
    created_at TEXT NOT NULL,
    FOREIGN KEY (material_id) REFERENCES material(id)
  );`,
  `CREATE TABLE IF NOT EXISTS material_bewegungen_kombi (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    material_id INTEGER NOT NULL,
    kunde_id INTEGER NOT NULL,
    datum TEXT NOT NULL,
    menge REAL NOT NULL,
    preis REAL NOT NULL,
    notiz TEXT,
    created_at TEXT NOT NULL,
    FOREIGN KEY (material_id) REFERENCES material(id),
    FOREIGN KEY (kunde_id) REFERENCES kunden(id)
  );`,
  `CREATE TABLE IF NOT EXISTS kunden (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL UNIQUE,
    created_at TEXT NOT NULL,
    updated_at TEXT NOT NULL
  );`,
  `CREATE TABLE IF NOT EXISTS users (
    id TEXT PRIMARY KEY,
    username TEXT NOT NULL UNIQUE,
    display_name TEXT NOT NULL,

    role TEXT NOT NULL CHECK(role IN ('admin','user')),
    status TEXT NOT NULL CHECK(status IN ('bootstrap','pending','active','disabled')),

    kunde_id INTEGER,

    password_hash TEXT,
    password_salt TEXT,
    password_set_at TEXT,

    requested_at TEXT,
    approved_at TEXT,
    approved_by TEXT,

    created_at TEXT NOT NULL,
    updated_at TEXT NOT NULL,

    FOREIGN KEY (kunde_id) REFERENCES kunden(id)
  );`,
  `CREATE TABLE IF NOT EXISTS kunden_posten_mat (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    kunde_id INTEGER NOT NULL,
    material_id INTEGER NOT NULL,
    datum TEXT NOT NULL,
    menge REAL NOT NULL,
    preis REAL NOT NULL,
    bezahlt REAL NOT NULL DEFAULT 0,
    offen REAL NOT NULL,
    status TEXT NOT NULL,
    notiz TEXT,
    created_at TEXT NOT NULL,
    updated_at TEXT NOT NULL,
    FOREIGN KEY (kunde_id) REFERENCES kunden(id),
    FOREIGN KEY (material_id) REFERENCES material(id)
  );`,
  `CREATE TABLE IF NOT EXISTS kunden_posten_nomat (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    kunde_id INTEGER NOT NULL,
    datum TEXT NOT NULL,
    bezeichnung TEXT NOT NULL,
    betrag REAL NOT NULL,
    bezahlt REAL NOT NULL DEFAULT 0,
    offen REAL NOT NULL,
    status TEXT NOT NULL,
    notiz TEXT,
    created_at TEXT NOT NULL,
    updated_at TEXT NOT NULL,
    FOREIGN KEY (kunde_id) REFERENCES kunden(id)
  );`,
  `CREATE TABLE IF NOT EXISTS glaeubiger (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    datum TEXT NOT NULL,
    name TEXT NOT NULL,
    betrag REAL NOT NULL,
    bezahlt REAL NOT NULL DEFAULT 0,
    offen REAL NOT NULL,
    faelligkeit TEXT,
    status TEXT NOT NULL,
    notiz TEXT,
    created_at TEXT NOT NULL,
    updated_at TEXT NOT NULL
  );`,
  `CREATE TABLE IF NOT EXISTS schuldner (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    datum TEXT NOT NULL,
    name TEXT NOT NULL,
    betrag REAL NOT NULL,
    bezahlt REAL NOT NULL DEFAULT 0,
    offen REAL NOT NULL,
    faelligkeit TEXT,
    status TEXT NOT NULL,
    notiz TEXT,
    created_at TEXT NOT NULL,
    updated_at TEXT NOT NULL
  );`
];
