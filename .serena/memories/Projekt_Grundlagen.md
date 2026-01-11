# Projekt: 60_HIDEANDSEEK

**Typ**: React-basierte Materialverwaltungs-Webanwendung mit Versteck-Management-System
**Hauptfunktion**: Verwaltung von Materialien, deren Lagerorten (Verstecken) und Bestandsmengen mit Tracking-Historie

**Tech-Stack** (Exakte Versionen):
- Frontend: React 18.3.1, TypeScript 5.6.2, Vite 5.4.2, Tailwind CSS 3.4.16
- Backend: Hono 4.6.14 (Node.js API-Framework)
- Database: SQLite mit better-sqlite3 3.11.3
- State: React Context API (kein externes State-Management)
- Forms: Native React Forms (keine externe Library)
- HTTP: Native Fetch API
- Testing: Vitest 2.1.8 (Unit), Playwright 1.49.1 (E2E)
- Weitere: Zod 3.24.1 (Validation), TOML 3.0.0 (Config), Lucide-React 0.469.0 (Icons)

**Deployment**: Lokal (Development-Server via Vite + Hono)
**Environment**: Europe/Berlin Timezone

**Dependencies-Highlights**:
- @hono/node-server: 1.13.7
- better-sqlite3: 3.11.3
- clsx: 2.1.1
- lucide-react: 0.469.0
- react: 18.3.1
- react-dom: 18.3.1
- tailwindcss: 3.4.16
- typescript: 5.6.2
- vite: 5.4.2
- vitest: 2.1.8
- zod: 3.24.1