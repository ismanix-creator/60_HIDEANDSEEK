# 60_HIDEANDSEEK Project Overview

**Generated**: 2026-01-11
**Version**: 1.0.0
**Agent-System-Version**: 1.0.0

## Projekt-Identität

- **Name**: 60_HIDEANDSEEK (Material-Tracker)
- **Version**: 1.2.0
- **Type**: Material-Sales-Management Application
- **Author**: Alexander Scholze
- **License**: UNLICENSED (privat)

## Tech-Stack

### Frontend

- **Framework**: React 19.0.0
- **Language**: TypeScript 5.7.2
- **Build**: Vite 6.0.3
- **Styling**: Tailwind CSS 4.0.0
- **Router**: React Router DOM 7.1.0
- **Icons**: Lucide React 0.468.0
- **Testing**: Vitest 1.5.0 + @testing-library/react 16.3.1

### Backend

- **Framework**: Hono 4.6.0
- **Runtime**: Node.js + @hono/node-server 1.13.0
- **Database**: SQLite + better-sqlite3 11.6.0
- **Validation**: Zod 3.23.8

### Development

- **Package Manager**: pnpm
- **Linter**: ESLint 9.39.2 + @typescript-eslint
- **Formatter**: Prettier 3.7.4
- **E2E**: Playwright 1.57.0

## Architektur-Prinzipien

### 1. Config-Driven (100%)

- **Single Source of Truth**: config.toml (v2.10.0, 31KB)
- **Zod-Validation**: Strict-Mode auf allen Ebenen
- **No Hardcodes**: Alle UI-Texte, Colors, Spacing aus appConfig.\*
- **Config-Generation**: `pnpm generate:config` → src/config/generated/config-from-toml.ts

### 2. Type-Safety

- **TypeScript strict-mode**: Aktiviert
- **Zod-Schemas**: Für alle Config-Sections + API-Validation
- **ApiResponse<T>-Pattern**: Success/Error-Wrapping

### 3. Feature-First-Organization

```
src/
├── pages/           # Feature-Entry-Points
├── components/
│   ├── ui/          # Reusable UI-Components
│   └── layout/      # Layout-Components
├── hooks/           # Custom React-Hooks
├── config/          # Config-Pipeline
└── types/           # Type-Definitions

server/
├── routes/          # API-Routes
├── services/        # Business-Logic
├── validation/      # Zod-Schemas
└── db/              # Database-Layer
```

### 4. Testing-Strategy

- **Unit**: Vitest (min. 80% Coverage)
- **Integration**: API-Tests (alle Endpoints)
- **E2E**: Playwright (Happy-Path + Error-Paths)
- **Property-Based**: fast-check (Business-Logic-Invarianten)

## Features

1. **Material-Management** (MaterialPage)
   - CRUD für Materialien (Oracal, PoliFlex, Siser, etc.)
   - Bestandsverwaltung, Gewinn-Kalkulation

2. **Kunden-Management** (KundenPage)
   - Kundendaten, Kontaktinformationen

3. **Offene Posten** (Gläubiger/Schuldner-Pages)
   - Forderungen, Zahlungsverfolgung

4. **Buchungs-Flows** (Kundenposten)
   - Material/Non-Material Buchungen
   - Zahlungs-Status-Tracking

5. **Auth-System** (Login-Page)
   - Basic-Auth (aktuell disabled, config: auth.enabled = false)

6. **Settings** (SettingsPage)
   - UI-Konfiguration
   - Theme-Anpassung

## Coding-Standards (AGENTS.md)

### File-Organization

- **Components**: PascalCase (Button.tsx, MaterialPage.tsx)
- **Hooks**: camelCase + Prefix `use` (useApi.ts)
- **Services**: camelCase + Suffix `.service.ts` (material.service.ts)

### JSDoc-Header (REQUIRED)

```typescript
/**
 * @file        ComponentName.tsx
 * @description Kurze Beschreibung
 * @version     1.2.0
 * @props       propA, propB
 * @changelog
 *   v1.2.0 - Feature XYZ (2026-01-11)
 *   v1.1.0 - Bug-Fix ABC (2026-01-10)
 */
```

### Config-Zugriff (STRICT)

```typescript
// ✅ CORRECT
import { appConfig } from '@/config';
const buttonConfig = appConfig.button;

// ❌ WRONG
import { appConfig } from '@/config/generated/config-from-toml';
```

### Error-Handling (REQUIRED)

```typescript
// Backend: ApiResponse<T>
return c.json({ success: true, data: result }, 200);
return c.json({ success: false, error: 'Message' }, 400);

// Frontend: Try-Catch mit ApiResponse-Handling
const { success, data, error } = await api.fetch<Material>('/material');
```

## Quality-Gates

1. **ESLint**: 0 Errors, 0 Warnings
2. **Prettier**: Alle Files formatiert
3. **TypeScript**: 0 Type-Errors (strict-mode)
4. **Tests**: min. 80% Coverage, alle grün
5. **Config-Drift**: 0 Violations (tests/config.validation.test.ts)
6. **No-Hardcodes**: Alle UI-Texte aus appConfig.labels

## Agent-System-Regeln

### Agents verfügbar

1. **orchestrator** - Master-Koordinator
2. **architect** - System-Design
3. **frontend_specialist** - React/TypeScript
4. **backend_specialist** - Hono/Node.js
5. **database_specialist** - SQLite
6. **testing_specialist** - Tests
7. **documentation_specialist** - Docs
8. **qa_specialist** - Code-Review
9. **devops_specialist** - CI/CD

### Workflows

- **simple-fix.yaml** - Für Bug-Fixes (< 1h, 1-2 Agents)
- **medium-feature.yaml** - Für Features (1-4h, 3-6 Agents)
- **complex-feature.yaml** - Für Breaking-Changes (> 4h, 6-8 Agents)

## Wichtige Dateien

- [AGENTS.md](../../AGENTS.md) - Coding-Standards (Source of Truth)
- [CONFIG_ARCHITECTURE_SUMMARY.md](../../CONFIG_ARCHITECTURE_SUMMARY.md) - Config-Architektur
- [config.toml](../../config.toml) - Single Source of Truth
- [README.md](../../README.md) - Projekt-Dokumentation

## Kontakt & Support

- **Repository**: (falls vorhanden)
- **Issues**: (falls vorhanden)
- **Documentation**: AGENTS.md + README.md
