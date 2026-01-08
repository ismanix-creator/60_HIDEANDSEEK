# AGENTS.md

# Repository Guidelines (Canonical Project Rules for Codex/Copilot Agents)

> This file is the single source of truth for how AI agents must behave in this repository.
> It combines repository guidelines + agent instructions. No other instruction file overrides this unless explicitly stated.

---

## Projektwissen, Struktur & Modulorganisation

Die kanonische Projektstruktur ist in der Projektdokumentation unter **Architecture** und **Project Brief** dokumentiert.
Es darf keine alternative Struktur erfunden oder nebenbei angelegt werden.

### Tech-Stack

- Frontend: React 18 + TypeScript
- Backend: Node.js (Hono API)
- Datenbank: SQLite
- Config: Single Source of Truth ist `config.toml`

### Wichtige Verzeichnisse

- `src/` fuer die React-UI (components, pages, hooks, utils, context).
- `server/` fuer die Hono-API und SQLite-Schema/Config.
- `tests/` mit `unit/` und `integration/`.
- `docs/` fuer Architektur, Regeln, Schema und Workflow-Referenzen.
- `scripts/` fuer Config-Generatoren.

### Struktur-Regeln (nicht verhandelbar)

- **Nur** die oben genannten Pfade verwenden.
- Keine alternativen oder parallelen Ordnerlayouts einfuehren (z. B. kein `frontend/`, kein `backend/`, kein `packages/`, keine `apps/`).
- Wenn du eine neue Datei fuer eine Aufgabe brauchst: **ASK FIRST** und nur mit expliziter Freigabe (siehe „NO EXTRA FILES / NO SIDE EFFECTS“).

---

## Build-, Test- und Development-Commands

Commands sind in `docs/WORKFLOW.md` definiert:

- `pnpm install` installiert Abhaengigkeiten.
- `pnpm dev` startet den Vite-Dev-Server.
- `pnpm run server` startet den API-Server.
- `pnpm run generate:config` generiert Typed-Config aus `config.toml`.
- `pnpm run generate:reference` aktualisiert die Config-Dokumentation.
- `pnpm run lint` prueft Lint-Regeln.
- `pnpm run test` fuehrt Unit-Tests aus.
- `pnpm run test:e2e` fuehrt E2E-Tests aus.
- `pnpm run build` baut die App.
- `pnpm run server:prod` startet den Production-Server.

---

## Coding Style & Naming Conventions

Projektregeln stehen in `docs/RULES.md`:

- Jede Datei hat einen Header mit Version, Zeitstempeln und Changelog.
- Config ist Single-Source-of-Truth in `config.toml`; keine Hardcodes fuer UI-Texte, Abstaende oder Farben.
- UI-Texte auf Deutsch; Code-Identifiers auf Englisch.
- React-Komponenten in `PascalCase`, Hooks mit `use*`.
- Dateinamen in kebab-case (z. B. `page-layout.tsx`).

---

## Testing Guidelines

- Unit-Tests fuer Utilities und Kernlogik (`tests/unit/`).
- E2E-Tests fuer kritische Flows (`pnpm run test:e2e`).
- API-Aenderungen in UI/Doku spiegeln, wenn Configs angepasst werden.

---

## Commit- & Pull-Request-Richtlinien

In diesem Checkout ist keine Git-Historie verfuegbar, daher keine Commit-Convention ableitbar.
Bitte Team-Standards einhalten und mindestens die Review-Checkliste aus `docs/WORKFLOW.md` erfuellen:

- Config-only Aenderungen (keine Hardcodes).
- Header/Version/Changelog aktualisiert.
- `lint`, `test` und `build` gruen.

---

## Configuration & Secrets

- `config.toml` ist die Single Source of Truth; Outputs nach Aenderungen regenerieren.
- Secrets duerfen nicht committed werden; `.env.example` als Template nutzen.

### Config Standard (verbindlich)
- `config.toml` ist Single Source of Truth (decidable inputs).
- Config wird strikt per Zod `strict()` validiert (unknown/missing/wrong types -> FAIL).
- `src/config/index.ts` ist der einzige erlaubte Import-Punkt.
- `src/config/generated/*` darf nur von `src/config/load.ts` importiert werden.
- Keine hardcoded Tokens (Farben, Fonts, spacing, radii) in TS, ausser mechanisch derived.

---

# AI Agent Instructions (Codex / GitHub Copilot)

## Projektüberblick

Dies ist ein Webprojekt in **React 18 (TypeScript)** mit Node.js-Backend. Es verwendet eine Monorepo-Struktur mit mehreren Paketen. Ziel des Projekts ist ... _(kurze Beschreibung)_.

---

## Deine Rolle(n) als KI-Assistent

- Du bist ein **Frontend-Entwickler-Agent**, spezialisiert auf React-Komponenten und UI.
- Du bist ebenfalls ein **Test-Agent** für Unit- und Integrationstests.
- Jede Änderung von dir soll unseren Code-Standards entsprechen und durch Tests abgedeckt sein.

---

## Code-Stil & Konventionen (AI-spezifisch)

- Halte dich strikt an `docs/RULES.md`.
- Verwende funktionale Patterns und vermeide unnötige Klassen.
- UI-Texte auf Deutsch; Code-Identifiers auf Englisch.
- Dateinamen: kebab-case. Komponenten: PascalCase. Hooks: use\*.

---

## Beispiel für korrekten Code-Stil

```typescript
function add(a: number, b: number): number {
  if (a === 0) return b;
  return a + b;
}
```
