# API-Structure - 60_HIDEANDSEEK

**Backend-Framework**: Hono 4.6.14 (Node.js Web Framework)

**API-Routes** (aus `server/index.ts` + `server/routes/`):

### Materials API
- `GET /api/materials` - Liste aller Materialien
- `GET /api/materials/:id` - Einzelnes Material
- `POST /api/materials` - Neues Material erstellen
- `PUT /api/materials/:id` - Material aktualisieren
- `DELETE /api/materials/:id` - Material löschen

### Hideouts API
- `GET /api/hideouts` - Liste aller Verstecke
- `GET /api/hideouts/:id` - Einzelnes Versteck
- `POST /api/hideouts` - Neues Versteck erstellen
- `PUT /api/hideouts/:id` - Versteck aktualisieren
- `DELETE /api/hideouts/:id` - Versteck löschen

### Stock API
- `GET /api/stock` - Gesamtbestand (alle Materialien + Verstecke)
- `GET /api/stock/material/:materialId` - Bestand eines Materials über alle Verstecke
- `GET /api/stock/hideout/:hideoutId` - Bestand eines Verstecks (alle Materialien)
- `PUT /api/stock` - Bestand aktualisieren (Material + Versteck + Quantity)

### Transfer API
- `GET /api/transfers` - Liste aller Transfers
- `GET /api/transfers/material/:materialId` - Transfers für ein Material
- `POST /api/transfers` - Neuen Transfer erstellen
- `DELETE /api/transfers/:id` - Transfer löschen (optional, falls implementiert)

### History API
- `GET /api/history` - Gesamte Historie (mit Query-Params für Filter)
- `GET /api/history/entity/:entityType/:entityId` - Historie für spezifische Entity

**Route-Organization**:
- Feature-based Organization: `/api/{resource}`
- RESTful-Conventions (GET/POST/PUT/DELETE)
- Keine Versionierung (v1/v2) implementiert
- Routes definiert in: `server/routes/materials.ts`, `server/routes/hideouts.ts`, etc.

**Request/Response-Format**:
- **Content-Type**: `application/json`
- **Validation**: Zod-Schemas für Request-Bodies
- **Response-Format**:
  ```typescript
  // Success
  { success: true, data: T }
  
  // Error
  { success: false, error: string, details?: unknown }

Error-Handling:

HTTP-Status-Codes:
200 OK - Success
201 Created - Resource created
400 Bad Request - Validation-Error
404 Not Found - Resource nicht gefunden
500 Internal Server Error - Server-Fehler
Zod-Validation-Errors werden formatiert zurückgegeben
SQLite-Constraint-Errors (UNIQUE, FK) werden abgefangen
Authentication:

Nicht implementiert (lokale App, keine Auth nötig)
Keine JWT, keine Sessions, keine OAuth