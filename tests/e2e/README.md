// @file        tests/e2e/README.md
// @description Anleitung für E2E-Tests
// @version     1.1.0
// @created     2026-01-08 15:00:00 CET
// @updated     2026-01-08 15:45:00 CET
// @author      agenten-koordinator
//
// @changelog
//   1.1.0 - 2026-01-08 - Wichtige Hinweise zu Server-Start hinzugefügt
//   1.0.0 - 2026-01-08 - E2E-Test-Anleitung erstellt

# E2E-Tests für Material-Tracker

## Übersicht

Die E2E-Tests verwenden **Playwright** und testen die gesamte Anwendung von der Benutzeroberfläche aus.

## Voraussetzungen

1. **Abhängigkeiten installieren:**
   ```bash
   pnpm install
   pnpm exec playwright install
   ```

2. **WICHTIG: Anwendung muss laufen!**
   
   Die Tests erwarten, dass Frontend UND Backend laufen:
   
   **Terminal 1 - Backend:**
   ```bash
   pnpm run server
   ```
   
   **Terminal 2 - Frontend:**
   ```bash
   pnpm dev
   ```

   Die Tests verwenden `baseURL: http://localhost:5173` aus `playwright.config.ts`.

## Tests ausführen

### Alle Tests ausführen

```bash
pnpm exec playwright test
```

### Einzelnen Test ausführen

```bash
pnpm exec playwright test tests/e2e/smoke.spec.ts
```

### Tests mit UI-Mode (interaktiv)

```bash
pnpm exec playwright test --ui
```

### Tests im Browser sichtbar ausführen (headed mode)

```bash
pnpm exec playwright test --headed
```

### Tests debuggen

```bash
pnpm exec playwright test --debug
```

## Test-Dateien

- **smoke.spec.ts** - Basis-Tests: HTML lädt, keine JS-Fehler
- **example.spec.ts** - Navigation und Seitenaufrufe
- **glaeubiger-schuldner.spec.ts** - Gläubiger/Schuldner-Seiten

## Test-Reports

Nach dem Testlauf wird ein HTML-Report generiert:

```bash
pnpm exec playwright show-report
```

Der Report wird in `playwright-report/` gespeichert.

## Konfiguration

Die Playwright-Konfiguration befindet sich in `playwright.config.ts`:

- **testDir:** `tests/e2e`
- **timeout:** 30 Sekunden pro Test
- **baseURL:** `http://localhost:5173`
- **webServer:** Startet automatisch `pnpm dev` wenn Tests laufen

## Bekannte Probleme

### JS-Fehler: "Cannot read properties of undefined (reading 'items')"

Dieser Fehler tritt auf, wenn die Config nicht korrekt geladen wurde. Stellen Sie sicher:
- Der Backend-Server läuft (`pnpm run server`)
- Die Config wurde generiert (`pnpm run generate:config`)
- Die Datenbank ist initialisiert

### Tests schlagen fehl: Elemente nicht gefunden

Die Tests sind defensiv geschrieben und erwarten grundlegende UI-Elemente. 
Falls die UI-Struktur geändert wurde, müssen die Selektoren angepasst werden.

## Best Practices

1. **Selektoren:** Verwende data-testid, text oder role Selektoren
2. **Wartezeiten:** Nutze `waitFor` und `expect` statt fixer Timeouts
3. **Isolation:** Jeder Test sollte unabhängig sein
4. **Cleanup:** Tests sollten keinen State hinterlassen

## Troubleshooting

### Test schlägt fehl: "page.goto: net::ERR_CONNECTION_REFUSED"

→ Frontend läuft nicht. Starte: `pnpm dev`

### Test schlägt fehl: API-Fehler

→ Backend läuft nicht. Starte: `pnpm run server`

### Browser startet nicht

→ Führe `pnpm exec playwright install` erneut aus.

### Tests sind sehr langsam

→ Reduziere Parallelität in `playwright.config.ts`:
```typescript
workers: 1
```

