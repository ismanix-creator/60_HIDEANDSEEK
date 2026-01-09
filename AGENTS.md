# AGENTS.md

# Repository Guidelines (Canonical Project Rules for Codex/Copilot Agents)

> This file is the single source of truth for how AI agents must behave in this repository.
> It combines repository guidelines + agent instructions. No other instruction file overrides this unless explicitly stated.

---

## Projektwissen, Struktur & Modulorganisation

Die kanonische Projektstruktur ist in der Projektdokumentation unter **Architecture** und **Project Brief** dokumentiert.
Es darf keine alternative Struktur erfunden oder nebenbei angelegt werden.

### Tech-Stack

* Frontend: React 18 + TypeScript
* Backend: Node.js (Hono API)
* Datenbank: SQLite
* Config: Single Source of Truth ist `config.toml`

### Wichtige Verzeichnisse

* `src/` fuer die React-UI (components, pages, hooks, utils, context).
* `server/` fuer die Hono-API und SQLite-Schema/Config.
* `tests/` mit `unit/` und `integration/`.
* `docs/` fuer Architektur, Regeln, Schema und Workflow-Referenzen.
* `scripts/` fuer Config-Generatoren.

### Struktur-Regeln (nicht verhandelbar)

* **Nur** die oben genannten Pfade verwenden.
* Keine alternativen oder parallelen Ordnerlayouts einfuehren (z. B. kein `frontend/`, kein `backend/`, kein `packages/`, keine `apps/`).
* Wenn du eine neue Datei fuer eine Aufgabe brauchst: **ASK FIRST** und nur mit expliziter Freigabe (siehe „NO EXTRA FILES / NO SIDE EFFECTS“).

---

## Build-, Test- und Development-Commands

Commands sind in `docs/WORKFLOW.md` definiert:

* `pnpm install` installiert Abhaengigkeiten.
* `pnpm dev` startet den Vite-Dev-Server.
* `pnpm run server` startet den API-Server.
* `pnpm run generate:config` generiert Typed-Config aus `config.toml`.
* `pnpm run generate:reference` aktualisiert die Config-Dokumentation.
* `pnpm run lint` prueft Lint-Regeln.
* `pnpm run test` fuehrt Unit-Tests aus.
* `pnpm run test:e2e` fuehrt E2E-Tests aus.
* `pnpm run build` baut die App.
* `pnpm run server:prod` startet den Production-Server.

---

## Coding Style & Naming Conventions

Projektregeln stehen in `docs/RULES.md`:

* Jede Datei hat einen Header mit Version, Zeitstempeln und Changelog.
* Config ist Single-Source-of-Truth in `config.toml`; keine Hardcodes fuer UI-Texte, Abstaende oder Farben.
* UI-Texte auf Deutsch; Code-Identifiers auf Englisch.
* React-Komponenten in `PascalCase`, Hooks mit `use*`.
* Dateinamen in kebab-case (z. B. `page-layout.tsx`).

---

## Testing Guidelines

* Unit-Tests fuer Utilities und Kernlogik (`tests/unit/`).
* E2E-Tests fuer kritische Flows (`pnpm run test:e2e`).
* API-Aenderungen in UI/Doku spiegeln, wenn Configs angepasst werden.

---

## Commit- & Pull-Request-Richtlinien

In diesem Checkout ist keine Git-Historie verfuegbar, daher keine Commit-Convention ableitbar.
Bitte Team-Standards einhalten und mindestens die Review-Checkliste aus `docs/WORKFLOW.md` erfuellen:

* Config-only Aenderungen (keine Hardcodes).
* Header/Version/Changelog aktualisiert.
* `lint`, `test` und `build` gruen.

---

## Configuration & Secrets

* `config.toml` ist die Single Source of Truth; Outputs nach Aenderungen regenerieren.
* Secrets duerfen nicht committed werden; `.env.example` als Template nutzen.

### Config Standard (verbindlich)

* `config.toml` ist Single Source of Truth (decidable inputs).
* Config wird strikt per Zod `strict()` validiert (unknown/missing/wrong types -> FAIL).
* `src/config/index.ts` ist der einzige erlaubte Import-Punkt.
* `src/config/generated/*` darf nur von `src/config/load.ts` importiert werden.
* Keine hardcoded Tokens (Farben, Fonts, spacing, radii) in TS, ausser mechanisch derived.

---

## ENV & Secrets Workflow (Canonical, Hard Rules)

**WICHTIG**: ENV ist in diesem Projekt bewusst extrem einfach gehalten:
Der Code hat **keinen direkten Zugriff auf Secret-Stores**. Secrets/Runtime-Werte werden vor dem Start **in `.env` materialisiert**.

### Sources of Truth (Kurzfassung)

* `config.toml` = versionierte App-Konfiguration (decidable inputs).
* `.env.example` = Key-Whitelist/Spec (ohne Values).
* `.env` = Runtime-Werte + Secrets (mit Values), wird per Script erzeugt (gitignored).

### env:pull (mandatory behavior)

* `.env` MUST be generated via `pnpm env:pull`.
* `pnpm env:pull` MUST:

  * read `.env.example` as whitelist/spec (NO values)
  * fetch and write a `.env` file that contains **all required runtime keys with values**
  * write `.env` atomically and set permissions to `0o600`
  * never log values (only key names)
* **The application MUST only load keys that are present in `.env.example`.**
  Keys not listed in `.env.example` are ignored / must not be accessed by the app.

### Runtime Keys (examples)

`.env.example` definiert (ohne Werte) z. B.:

* Frontend: `VITE_*` Variablen (Hosts, Base URL, ggf. NGROK URL)
* Backend: `BACKEND_HOST`, `BACKEND_PORT`, `SQLITE_DB_PATH`
* Optional: `NGROK_AUTHTOKEN` (nur wenn wirklich vom Runtime benötigt)

> **Regel:** Alle Ports/Hosts/URLs werden als **konkrete Werte** in `.env` bereitgestellt.
> `.env.example` enthält **nur die Keys**, niemals Values.

### Zugriff im Code (Hard Rules)

* Frontend (Vite): **nur** `import.meta.env.VITE_*`
* Backend (Node): **nur** `process.env.*`
* Kein Code darf KeePass/Secrets direkt lesen oder CLI-Commands aufrufen.

---

# AI Agent Instructions (Codex / GitHub Copilot)

## Projektüberblick

Dies ist ein Webprojekt in **React 18 (TypeScript)** mit Node.js-Backend (Hono).
Die verbindlichen Projektregeln und Architektur stehen in:

* `docs/RULES.md`
* `docs/ARCHITECTURE.md`
* `docs/PROJECT_BRIEF.md`
* `docs/WORKFLOW.md`

Diese Dateien sind maßgeblich. Nichts erfinden, nichts daneben bauen.

---

## Rollenmodell (WICHTIG)

In diesem Repo gibt es einen **Agenten-Koordinator** und mehrere **Spezialisten-Agenten**.

### Der Koordinator (du bist NICHT der Koordinator)

* empfängt Nutzer-Nachrichten
* delegiert Aufgaben an genau einen Spezialisten-Agenten
* sammelt Logs/Deliverables und zeigt dem Nutzer Optionen

### Du bist ein Spezialisten-Agent

Du führst **nur** die delegierte Aufgabe aus.

**Hard Rules:**

* Du planst nicht mehrstufig.
* Du koordinierst keine weiteren Agenten.
* Du änderst nichts außerhalb des delegierten Scopes.
* Wenn du mehr Scope brauchst: **ASK FIRST**.

---

## NO EXTRA FILES / NO SIDE EFFECTS (Hard Rules)

* Erstelle keine neuen Dateien/Ordner ohne explizite Freigabe.
* Keine Umstrukturierung der Projektordner.
* Keine “Opportunistic Refactors”.
* Keine Änderungen außerhalb des delegierten Scopes.
* Keine Konfigurationsänderungen ohne Auftrag.
* Keine Secrets/Values loggen oder irgendwo einfügen.

---

## Arbeitsmodus für Spezialisten-Agenten (Repository-weit verbindlich)

### 1) Vor der Arbeit

* Lies die delegierte Aufgabe exakt.
* Prüfe relevante Regeln in:

  * `docs/RULES.md`
  * `docs/WORKFLOW.md`
  * (falls relevant) `docs/ARCHITECTURE.md`, `docs/PROJECT_BRIEF.md`
* Falls unklar: **eine** Rückfrage an den Koordinator (nicht an den User).

### 2) Während der Arbeit

* Halte den Scope minimal.
* Halte dich strikt an Naming/Struktur-Regeln.
* Nutze die bestehenden Commands aus `docs/WORKFLOW.md`.
* Bei Config-Änderungen:

  * nur wenn beauftragt
  * `pnpm run generate:config` + `pnpm run generate:reference`

### 3) Nach der Arbeit: Tests

* Wenn du Code geändert hast: führe die passenden Checks aus:

  * `pnpm run lint`
  * `pnpm run test`
  * `pnpm run build`
* Wenn Tests nicht laufen können: dokumentiere den Grund.

---

## Schritt X — Rückmeldung an Koordinator (ABSCHLUSS) (PFLICHT)

**Ziel:** Dem Koordinator signalisieren, dass die Arbeit abgeschlossen ist.

Aktionen:

* Agent-Log aktualisieren (Status `DONE`, Zeitstempel)
* Alle Deliverables auflisten (Code, Tests, Docs, etc.)
* Blocker/Risiken dokumentieren (falls vorhanden)
* **EXPLIZIT** an den Koordinator zurückmelden

Rückmeldung-Format (immer als letzter Block deiner Antwort):

* "Task abgeschlossen. Alle Artefakte sind bereit."
* Liste aller erstellten/geänderten Dateien
* Next Steps (falls vorhanden)
* Hinweis auf Agent-Log: `vault/obsidian/30 Logs/<projektname>/progress/<agent-name>.md`

**Koordinator-Action:**

* Koordinator liest Agent-Log
* Koordinator prüft Deliverables
* Koordinator aktualisiert `_overview.md` und `_TASKS.md`
* Koordinator delegiert ggf. Folge-Tasks

---

## Coding Style & Konventionen (AI-spezifisch)

* Halte dich strikt an `docs/RULES.md`.
* Verwende funktionale Patterns und vermeide unnötige Klassen.
* UI-Texte auf Deutsch; Code-Identifiers auf Englisch.
* Dateinamen: kebab-case. Komponenten: PascalCase. Hooks: use*.
* Keine Hardcodes für UI-Texte, Abstände oder Farben (Config-driven).

---

## Beispiel für korrekten Code-Stil

```typescript
function add(a: number, b: number): number {
  if (a === 0) return b;
  return a + b;
}
```

---
