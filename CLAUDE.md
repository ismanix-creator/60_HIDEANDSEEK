# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

### Development
```bash
pnpm install                 # Install dependencies
pnpm run generate:config     # Generate TypeScript config from config.toml (REQUIRED after config.toml changes)
pnpm run dev                 # Start Vite dev server (Frontend on port from .env)
pnpm run server              # Start Hono API server (Backend)
```

### Testing
```bash
pnpm run test                # Run unit tests (Vitest)
pnpm run test:watch          # Run unit tests in watch mode
pnpm run test:e2e            # Run E2E tests (Playwright)
pnpm run test:all            # Run all tests (unit + E2E)
pnpm run qa                  # Run full QA pipeline (typecheck + lint + format:check + test)
```

### Single Test Execution
```bash
vitest run path/to/test.test.ts              # Run single unit test file
playwright test path/to/test.spec.ts         # Run single E2E test file
```

### Build & Type Checking
```bash
pnpm run build               # Build frontend (outputs to dist/)
pnpm run build:server        # Build backend (outputs to dist/server/)
pnpm run typecheck           # Type check frontend
pnpm run typecheck:server    # Type check backend
pnpm run lint                # Run ESLint
pnpm run format              # Format code with Prettier
pnpm run format:check        # Check code formatting
```

### Database
```bash
pnpm run db:migrate          # Run database migrations
pnpm run db:seed             # Seed database with test data
```

### ENV Management
```bash
pnpm run env:pull            # Generate .env from KeePass (REQUIRED before dev/server/test:e2e)
```

## High-Level Architecture

### 100% Config-Driven Architecture

This project follows a strict **config.toml-driven architecture** where ALL configuration comes from a single source of truth:

```
config.toml (Single Source of Truth)
    ↓
pnpm generate:config
    ↓
src/config/generated/config-from-toml.ts
    ↓
src/config/load.ts (ONLY file that imports generated/)
    ↓ (Zod strict validation)
appConfig singleton
    ↓
src/config/index.ts (SINGLE IMPORT POINT)
    ↓
All Consumers (Components, Server, Tests)
```

**Critical Rules:**
- **ONLY** `src/config/load.ts` may import from `src/config/generated/`
- **ALL** other files must import via `import { appConfig } from '@/config'`
- **NO** hardcoded values for colors, spacing, fonts, UI text (except mechanically derived)
- **NO** direct imports from `theme/*.config.ts` or `components/*.config.ts`
- Config schema uses Zod `strict()` - validation failures cause immediate `process.exit(1)`

**After modifying config.toml:**
1. Run `pnpm run generate:config` to regenerate TypeScript types
2. Run `pnpm run generate:reference` to update documentation
3. Verify with `pnpm run test` (includes config validation tests)

### Frontend Structure (`src/`)

- **Components:** React 19 components using appConfig for all styling/text
  - `src/components/common/` - Reusable UI components (Button, Badge, Dialog, etc.)
  - `src/components/layout/` - Layout components (PageLayout, Navigation, Header)
  - All component styles and text come from `appConfig.components.*` and `appConfig.theme.*`
- **Pages:** Route-level components in `src/pages/`
- **Config Import Pattern:** `import { appConfig } from '@/config'` then destructure `const { theme, components, ui } = appConfig`
- **No Inline Styles:** All styling via config tokens (142 UI text hardcodes and 26 inline styles eliminated)

### Backend Structure (`server/`)

- **Hono API:** RESTful API with domain-based routes
  - `server/routes/` - API routes per domain (material, kunden, posten, etc.)
  - `server/db/` - SQLite database setup and migrations
  - `server/validation/` - Zod schemas for request validation
  - `server/services/` - Business logic layer
- **Config Access:** Server can import appConfig for runtime configuration
- **Database:** SQLite with better-sqlite3

### ENV & Secrets Workflow

**Hard Rules:**
- `.env.example` defines all required ENV keys (without values)
- `.env` is generated via `pnpm run env:pull` from KeePass (gitignored)
- Frontend: Only access `import.meta.env.VITE_*` variables
- Backend: Only access `process.env.*` variables
- **NEVER** read KeePass/secrets directly in application code
- All ports/hosts/URLs are concrete values in `.env`

### TypeScript Aliases

- `@/*` resolves to `src/*` (configured in tsconfig.json and vite.config.ts)
- Frontend uses `tsconfig.json`, Backend uses `tsconfig.server.json`

### Tech Stack Core

- **Frontend:** React 19 + TypeScript + Vite + Tailwind CSS 4
- **Backend:** Node.js + Hono + better-sqlite3
- **Testing:** Vitest (unit) + Playwright (E2E) + fast-check (property-based)
- **Validation:** Zod (runtime validation for config and API)
- **Config:** TOML → TypeScript code generation

## Important Conventions

### File Headers
Every file should have a header with version, timestamps, and changelog:
```typescript
/**
 * @file        filename.ts
 * @description Brief description
 * @version     0.1.0
 * @created     2026-01-06 12:00:00 CET
 * @updated     2026-01-06 12:00:00 CET
 * @author      Author Name
 *
 * @changelog
 *   0.1.0 - 2026-01-06 - Initial implementation
 */
```

### Naming Conventions
- **Components:** PascalCase (e.g., `PageLayout`, `MaterialTable`)
- **Files:** kebab-case (e.g., `page-layout.tsx`, `material-table.tsx`)
- **Hooks:** camelCase with `use` prefix (e.g., `useAppConfig`, `useMaterialData`)
- **UI Text:** German (in config.toml)
- **Code Identifiers:** English

### Config-Only Development
- All colors from `appConfig.theme.colors.*`
- All spacing from `appConfig.theme.spacing.*`
- All UI text from `appConfig.ui.labels/titles/descriptions/buttons.*`
- All component config from `appConfig.components.*`
- No magic numbers, no hardcoded strings in components

### Grid-Based Layout
- Desktop: 4-column grid layout
- Mobile: Stacked layout
- Pattern: Table left, Detail/Panel right (e.g., MaterialPage)

## Project-Specific Notes

### Auth/Login
- Currently **disabled** (`auth.enabled = false` in config.toml)
- Not part of current scope - no JWT integration yet

### Database Schema
- Source of truth: `docs/plan/db-schema-helper.md`
- Material and Kunden are coupled via KundenPostenMat
- Offene Posten tracked in KundenPostenNoMat

### Module Separation
- Frontend in `src/`, Backend in `server/` (kept strictly separated)
- No `frontend/`, `backend/`, `packages/`, or `apps/` directories

### Related Documentation
- `docs/RULES.md` - Comprehensive coding rules and conventions
- `docs/ARCHITECTURE.md` - Detailed architecture documentation
- `docs/WORKFLOW.md` - Development workflow and commands
- `CONFIG_ARCHITECTURE_SUMMARY.md` - Config architecture implementation details
- `AGENTS.md` - AI agent instructions and repository guidelines

## Critical Validation

The repository includes `tests/config.validation.test.ts` which enforces:
- No direct imports of `src/config/generated/*` (except from load.ts)
- No imports of eliminated configs (spacingConfig, breakpointsConfig)
- Config schema validation catches drift
- Runs in CI/CD to prevent architecture violations
