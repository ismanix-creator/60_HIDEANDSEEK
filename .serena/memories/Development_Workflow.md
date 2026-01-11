# MEMORY 10: DEVELOPMENT-WORKFLOW

**Scripts** (aus package.json):

    "dev": "vite"
    "build": "tsc && vite build"
    "preview": "vite preview"
    "server": "tsx watch server/index.ts"
    "server:prod": "NODE_ENV=production tsx server/index.ts"
    "lint": "eslint . --ext ts,tsx --report-unused-disable-directives --max-warnings 0"
    "test": "vitest"
    "test:ui": "vitest --ui"
    "test:e2e": "playwright test"
    "test:e2e:ui": "playwright test --ui"
    "generate:config": "tsx scripts/generate-config.ts"
    "generate:reference": "tsx scripts/generate-reference.ts"
    "db:migrate": "tsx server/db/migrate.ts"
    "db:seed": "tsx server/db/seed.ts"

**Wichtigste Commands**:
- Dev-Server: `pnpm dev` (Vite Dev-Server auf Port 5173)
- API-Server: `pnpm run server` (Hono-Server mit Hot-Reload via tsx watch)
- Build: `pnpm run build` (TypeScript-Check + Vite-Build)
- Tests: `pnpm run test` (Vitest Unit-Tests) und `pnpm run test:e2e` (Playwright E2E-Tests)
- Linting: `pnpm run lint` (ESLint mit max 0 Warnings)
- Type-Check: `tsc --noEmit` (manuell, nicht als Script)
- Config-Generation: `pnpm run generate:config` (Types aus config.toml) und `pnpm run generate:reference` (Docs aus config.toml)
- Database: `pnpm run db:migrate` (SQLite-Schema erstellen) und `pnpm run db:seed` (Test-Daten einfügen)

**Environment-Variables** (aus .env.example):

Frontend (Vite):
- `VITE_API_URL=http://localhost:3000` - Backend-URL für Frontend-API-Calls
- `VITE_APP_NAME=HideAndSeek` - App-Name für UI

Backend (Hono):
- `BACKEND_HOST=localhost` - Host für Hono-Server
- `BACKEND_PORT=3000` - Port für Hono-Server
- `SQLITE_DB_PATH=./server/db/hideandseek.db` - Pfad zur SQLite-Datenbank-Datei

Optional (Development):
- `NODE_ENV=development` - Environment-Modus

**Git-Workflow**:
- Main-Branch: `main`
- Branch-Strategy: Nicht dokumentiert (wahrscheinlich Feature-Branches + main)
- Remote: Lokal (keine öffentliche Remote-URL)

**IDE-Setup** (aus settings.json):

    "editor.formatOnSave": true
    "editor.defaultFormatter": "esbenp.prettier-vscode"
    "editor.codeActionsOnSave": {
      "source.fixAll.eslint": true
    }
    "typescript.tsdk": "node_modules/typescript/lib"
    "typescript.enablePromptUseWorkspaceTsdk": true

**EditorConfig** (aus `.editorconfig`):

    [*]
    indent_style = space
    indent_size = 2
    end_of_line = lf
    charset = utf-8
    trim_trailing_whitespace = true
    insert_final_newline = true

    [*.md]
    trim_trailing_whitespace = false

**Deployment**:
- Aktuell: Lokal (Development-Mode)
- Production: Nicht konfiguriert (keine Vercel/Netlify/Docker-Config gefunden)
- Build-Output: dist (Frontend), Server als Node.js-Prozess
- Mögliche Deployment-Targets: Static-Hosting (Vercel/Netlify) für Frontend, Node.js-Server (VPS/PM2) für Backend, Docker (keine Dockerfile vorhanden)

**Development-Workflow** (Empfohlen):

1. `pnpm install` - Dependencies installieren
2. `pnpm run db:migrate` - Datenbank-Schema erstellen
3. `pnpm run db:seed` - Test-Daten einfügen (optional)
4. Terminal 1: `pnpm run server` - Backend starten (Port 3000)
5. Terminal 2: `pnpm dev` - Frontend starten (Port 5173)
6. Browser: `http://localhost:5173`
7. Entwickeln mit Hot-Reload (Frontend + Backend)
8. Vor Commit: `pnpm run lint` + `pnpm run test` + `pnpm run build`

**Config-Workflow** (bei Änderungen an config.toml):

1. config.toml bearbeiten
2. `pnpm run generate:config` - Types regenerieren
3. `pnpm run generate:reference` - Docs aktualisieren
4. Validierung erfolgt automatisch (Zod strict mode)
5. Frontend/Backend neu starten für Config-Updates

**Review-Checkliste** (vor Commit/PR):
- Config-only Änderungen (keine Hardcodes)
- File-Header mit Version/Changelog aktualisiert
- `pnpm run lint` erfolgreich
- `pnpm run test` erfolgreich
- `pnpm run build` erfolgreich
- UI-Texte auf Deutsch, Code-Identifiers auf Englisch