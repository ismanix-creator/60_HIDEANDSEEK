# Naming Conventions - 60_HIDEANDSEEK

**Files** (aus tatsächlichen Files erkannt):
- Components: `PascalCase.tsx` (z.B. `MaterialList.tsx`, `HideoutCard.tsx`)
- Context: `PascalCase.tsx` mit `Context`-Suffix (z.B. `MaterialContext.tsx`)
- Services: `kebab-case.ts` (z.B. `material-service.ts`, `hideout-service.ts`)
- Types: `kebab-case.ts` (z.B. `material-types.ts`, `api-types.ts`)
- Tests: `.test.ts` oder `.test.tsx` (z.B. `material-service.test.ts`)
- Config: `kebab-case.ts` (z.B. `load.ts`, `index.ts`)
- Pages: `PascalCase.tsx` (z.B. `MaterialsPage.tsx`, `HideoutsPage.tsx`)

**Beispiele aus Code**:
PageLayout.tsx
src/components/materials/MaterialList.tsx
src/components/hideouts/HideoutCard.tsx
src/context/MaterialContext.tsx
src/services/material-service.ts
src/types/material-types.ts
src/hooks/useMaterials.ts
src/pages/MaterialsPage.tsx
index.ts
src/utils/format-date.ts


**Variables/Functions** (aus Code erkannt):
- Variablen: `camelCase` (z.B. `materialId`, `hideoutName`)
- Konstanten: `UPPER_SNAKE_CASE` für echte Konstanten, `camelCase` für Config-Werte
- Functions: `camelCase` (z.B. `getMaterials`, `updateHideout`)
- React-Components: `PascalCase` (z.B. `MaterialList`, `HideoutCard`)
- React-Hooks: `use*` prefix (z.B. `useMaterials`, `useHideouts`)

**Types/Interfaces** (TypeScript):
- Naming: `PascalCase` ohne Prefix
- **Keine I-Prefixes** (nicht `IMaterial`, sondern `Material`)
- **Keine T-Prefixes** (nicht `TMaterial`, sondern `Material`)
- Types bevorzugt über Interfaces (außer bei Erweiterung nötig)
- Generics: `T`, `K`, `V` (Standard-Convention)

**Database** (SQLite-Schema aus server/db/schema.sql):
- Tables: `snake_case`, **singular** (z.B. `material`, `hideout`, `transfer`)
- Columns: `snake_case` (z.B. `hideout_id`, `created_at`, `last_updated`)
- IDs: `INTEGER PRIMARY KEY AUTOINCREMENT`
- Timestamps: `created_at`, `last_updated` (ISO8601-Strings)
- Soft-Delete: **Nicht implementiert** (Hard-Deletes via `ON DELETE CASCADE`)

**Beispiel-Schema**:
```sql
CREATE TABLE material (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    description TEXT,
    unit TEXT NOT NULL,
    min_quantity REAL,
    created_at TEXT NOT NULL,
    last_updated TEXT NOT NULL
);

CREATE TABLE hideout (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL UNIQUE,
    location TEXT,
    description TEXT,
    created_at TEXT NOT NULL,
    last_updated TEXT NOT NULL
);

CREATE TABLE stock (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    material_id INTEGER NOT NULL,
    hideout_id INTEGER NOT NULL,
    quantity REAL NOT NULL DEFAULT 0,
    FOREIGN KEY (material_id) REFERENCES material(id) ON DELETE CASCADE,
    FOREIGN KEY (hideout_id) REFERENCES hideout(id) ON DELETE CASCADE,
    UNIQUE(material_id, hideout_id)
);