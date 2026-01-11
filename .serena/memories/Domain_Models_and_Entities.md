# Domain-Models - 60_HIDEANDSEEK

**Hauptentitäten** (aus DB-Schema + TypeScript-Types):

1. **Material** (Grundmaterial)
   - Properties:
     - `id`: number (INTEGER PRIMARY KEY)
     - `name`: string (NOT NULL, Materialname)
     - `description`: string | null (Beschreibung)
     - `unit`: string (NOT NULL, Einheit: kg, Liter, Stück, etc.)
     - `min_quantity`: number | null (Mindestbestand)
     - `created_at`: string (ISO8601)
     - `last_updated`: string (ISO8601)
   - Beziehungen:
     - has-many → `Stock` (ein Material kann in mehreren Verstecken sein)
     - has-many → `Transfer` (Materialien können transferiert werden)
     - has-many → `History` (Änderungen werden geloggt)
   - Business-Rules:
     - Name muss unique sein (nicht im Schema, aber in UI-Logic)
     - Unit muss aus vordefinierter Liste sein (kg, g, L, ml, Stück, m, cm, Paar)
     - Min-Quantity optional für Warnungen

2. **Hideout** (Versteck/Lagerort)
   - Properties:
     - `id`: number (INTEGER PRIMARY KEY)
     - `name`: string (NOT NULL UNIQUE, Versteckname)
     - `location`: string | null (physische Location)
     - `description`: string | null
     - `created_at`: string (ISO8601)
     - `last_updated`: string (ISO8601)
   - Beziehungen:
     - has-many → `Stock` (ein Versteck kann mehrere Materialien lagern)
     - has-many → `Transfer` (source/target für Transfers)
   - Business-Rules:
     - Name muss unique sein (DB-Constraint)
     - Kann nicht gelöscht werden wenn Stock vorhanden (Cascade-Delete für Stock)

3. **Stock** (Bestandsmenge)
   - Properties:
     - `id`: number (INTEGER PRIMARY KEY)
     - `material_id`: number (NOT NULL, FK)
     - `hideout_id`: number (NOT NULL, FK)
     - `quantity`: number (NOT NULL, DEFAULT 0, Menge)
   - Beziehungen:
     - belongs-to → `Material`
     - belongs-to → `Hideout`
   - Business-Rules:
     - UNIQUE Constraint: `(material_id, hideout_id)` - ein Material nur einmal pro Versteck
     - Quantity kann 0 sein (kein Bestand)
     - Cascade-Delete bei Material oder Hideout-Löschung

4. **Transfer** (Materialbewegung)
   - Properties:
     - `id`: number (INTEGER PRIMARY KEY)
     - `material_id`: number (NOT NULL, FK)
     - `from_hideout_id`: number | null (FK, Quellversteck)
     - `to_hideout_id`: number | null (FK, Zielversteck)
     - `quantity`: number (NOT NULL, transferierte Menge)
     - `notes`: string | null (Notizen)
     - `created_at`: string (ISO8601)
   - Beziehungen:
     - belongs-to → `Material`
     - belongs-to → `Hideout` (from)
     - belongs-to → `Hideout` (to)
   - Business-Rules:
     - **from_hideout_id = NULL**: Neuzugang (Einkauf)
     - **to_hideout_id = NULL**: Verbrauch/Ausgang
     - **beide gesetzt**: Interner Transfer zwischen Verstecken
     - Quantity > 0 immer

5. **History** (Änderungs-Log)
   - Properties:
     - `id`: number (INTEGER PRIMARY KEY)
     - `entity_type`: string (NOT NULL, "material"|"hideout"|"stock"|"transfer")
     - `entity_id`: number (NOT NULL, ID der geänderten Entity)
     - `action`: string (NOT NULL, "created"|"updated"|"deleted"|"transferred")
     - `changes`: string (JSON, alte/neue Werte)
     - `created_at`: string (ISO8601)
   - Beziehungen:
     - Referenziert beliebige Entity (keine FK, nur ID + Type)
   - Business-Rules:
     - Read-Only nach Erstellung
     - JSON-changes-Field enthält Diff

**Entity-Relationships** (Visualisierung):
Material (1) ──┐
├── has-many ──> Stock (n)
Hideout (1) ───┘

Material (1) ──> has-many ──> Transfer (n) <── belongs-to ── Hideout (from/to)

Material/Hideout/Stock/Transfer ──> triggers ──> History (Audit-Log)


**Enums/Constants** (aus config.toml + code):
```typescript
// Units für Materialien
type MaterialUnit = "kg" | "g" | "L" | "ml" | "Stück" | "m" | "cm" | "Paar";

// History-Actions
type HistoryAction = "created" | "updated" | "deleted" | "transferred";

// Entity-Types
type EntityType = "material" | "hideout" | "stock" | "transfer";

// Transfer-Types (derived)
type TransferType = 
  | "incoming"  // from_hideout_id = NULL
  | "outgoing"  // to_hideout_id = NULL
  | "internal"; // beide gesetzt