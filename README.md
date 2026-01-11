# 60_HIDEANDSEEK

> **Konfigurationsgetriebene Material-Tracker-App**

---

## Übersicht

Diese App ist zu 100% config-driven: **Alle Konfigurationen werden ausschließlich über `config.toml` gesteuert.**

- **Frontend:** React 18 + TypeScript
- **Backend:** Node.js (Hono API)
- **Datenbank:** SQLite
- **Config:** Single Source of Truth: `config.toml`

---

## Setup

```bash
pnpm install
pnpm run generate:config   # Typed Config aus config.toml generieren
pnpm run dev               # Vite-Dev-Server starten
pnpm run server            # API-Server starten
```

---

## Architektur: 100% Config.toml-Driven (Phase 2 ✅)

```
config.toml (Single Source of Truth)
    ↓
pnpm generate:config
    ↓
src/config/generated/config-from-toml.ts
    ↓
src/config/load.ts (EINZIGER Importeur von generated/)
    ↓ (Zod strict-Validation)
appConfig singleton
    ↓
src/config/index.ts (SINGLE IMPORT POINT)
    ↓
Alle Consumers (UI Components, Server, Tests)
```

### Kernprinzipien
- **100% config.toml-driven:** Keine *.config.ts mehr außerhalb von Config-System
- **Theme:** Alle Werte aus `appConfig.*` (colors, spacing, breakpoints, fonts, shadows, etc.)
- **Components:** Alle Werte aus `appConfig.components.*`
- **UI-Texte:** Alle aus `appConfig.ui.*` (labels, titles, descriptions, buttons, etc.)
- **Keine Hardcodes:** Keine Inline-Styles, keine festen Texte, keine Magic Numbers

### Importmuster (Validiert ✅)
- **Nur** `src/config/index.ts` darf importiert werden:  
  ```ts
  import { appConfig } from '@/config';
  const { theme, components, ui } = appConfig;
  ```
- **Kein** Import von `generated/` oder `load.ts` außerhalb von `index.ts`
- **Kein** Import von eliminated configs (spacingConfig, breakpointsConfig)

### Zod strict-Validation (Enforced ✅)
- Das Config-Schema wird mit Zod `strict()` validiert
- Bei Fehlern: **Sofortiger Abbruch** (`process.exit(1)`)
- Unbekannte Keys werden abgelehnt

---

## Keine Hardcodes, keine Inline-Styles
- **Alle** UI-Texte, Farben, Spacing, Radii etc. kommen aus der Config.
- **Keine** Inline-Styles oder Hardcodes in Komponenten.

---

## Migrationserfolg (Phase 2 Abgeschlossen ✅)

### Option B Implementation
- ✅ **spacingConfig eliminiert:** Alle Spacing-Werte direkt in `appConfig.spacing`
- ✅ **breakpointsConfig eliminiert:** Alle Breakpoint-Werte direkt in `appConfig.breakpoints`
- ✅ **Keine *.config.ts imports:** Theme/Component-Configs nur über appConfig

### Hardcode & Inline-Style Eliminierung
- ✅ **142 UI-Text-Hardcodes entfernt:** Alle Texte aus `appConfig.ui.labels/titles/descriptions/buttons`
- ✅ **26 Inline-Styles entfernt:** Alle Styles aus `appConfig.colors/spacing/shadows`

### Komponenten-Migration
- ✅ **Alle** 21+ Komponenten nutzen ausschließlich `appConfig`
- ✅ **Keine** Direct Imports aus `config/generated/` außer in `load.ts`
- ✅ **Keine** Direct Imports aus `theme/*.config.ts` oder `components/*.config.ts`
- ✅ **Tests**: `tests/config.validation.test.ts` prüft Config-Drift und Import-Pattern in CI/CD

---

## Beispiele

### Config-Import (korrekt)
```ts
import { appConfig } from '@/config';
const { theme, components } = appConfig;
```

### Falscher Import (verboten)
```ts
// ❌ import { config } from './config/generated/config-from-toml';
// ❌ import { config } from './config/load';
```

---

## Weitere Infos
- Siehe `docs/RULES.md` für Coding Style und Projektregeln.
- Siehe `CONFIG_ARCHITECTURE_SUMMARY.md` für Details zur Config-Pipeline.
