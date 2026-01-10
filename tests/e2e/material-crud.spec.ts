/**
 * @file        tests/e2e/material-crud.spec.ts
 * @description E2E Test - Material CRUD Flow (Create/Read/Update/Delete)
 * @version     1.0.0
 * @created     2026-01-10 21:00:00 CET
 * @updated     2026-01-10 21:00:00 CET
 * @author      QA-Test-Entwickler (Phase 4.3)
 *
 * @changelog
 *   1.0.0 - 2026-01-10 - Initial: Material CRUD E2E Tests
 *                         - Material erstellen (Happy Path)
 *                         - Material bearbeiten
 *                         - Material löschen
 *                         - Validierung: Fehler bei fehlenden Feldern
 */

import { test, expect } from '@playwright/test';

test.describe('Material CRUD Flow', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/material');
    await page.waitForLoadState('networkidle');
  });

  /**
   * Test 1: Material erstellen (Happy Path)
   * Flow:
   * 1. Klick auf "Neues Material" Button
   * 2. Dialog öffnet sich
   * 3. Fülle Formular aus (Name, Beschreibung)
   * 4. Klick auf "Speichern"
   * 5. Dialog schließt
   * 6. Material erscheint in Tabelle
   */
  test('Material erstellen erfolgreich', async ({ page }) => {
    // Klick auf "Neues Material" Button (mit Plus-Icon)
    const newMaterialButton = page.getByRole('button', { name: /neues material/i });
    await expect(newMaterialButton).toBeVisible();
    await newMaterialButton.click();

    // Dialog öffnet sich
    const dialog = page.getByRole('dialog');
    await expect(dialog).toBeVisible();

    // Fülle Formular aus
    const materialName = `Test-Material-${Date.now()}`;
    const materialDescription = 'E2E Test Material Beschreibung';

    await page.getByLabel(/name/i).fill(materialName);
    await page.getByLabel(/beschreibung/i).fill(materialDescription);

    // Klick auf "Speichern" Button im Dialog
    const saveButton = dialog.getByRole('button', { name: /speichern/i });
    await saveButton.click();

    // Dialog schließt (warte auf Schließen)
    await expect(dialog).not.toBeVisible({ timeout: 5000 });

    // Material erscheint in Tabelle
    // Custom React Table verwendet divs, kein <table>
    // Suche nach dem Material-Namen in der Tabelle
    const tableContent = page.locator('div').filter({ hasText: materialName });
    await expect(tableContent).toBeVisible();
  });

  /**
   * Test 2: Material Dialog öffnen und abbrechen
   * Flow:
   * 1. Klick auf "Neues Material" Button
   * 2. Dialog öffnet sich
   * 3. Klick auf "Abbrechen" oder Schließen-Button
   * 4. Dialog schließt ohne Material zu erstellen
   */
  test('Material Dialog abbrechen', async ({ page }) => {
    // Klick auf "Neues Material" Button
    const newMaterialButton = page.getByRole('button', { name: /neues material/i });
    await newMaterialButton.click();

    // Dialog öffnet sich
    const dialog = page.getByRole('dialog');
    await expect(dialog).toBeVisible();

    // Klick auf "Abbrechen" Button (oder Schließen-X)
    const cancelButton = dialog.getByRole('button', { name: /abbrechen/i });
    if (await cancelButton.isVisible()) {
      await cancelButton.click();
    } else {
      // Falls kein Abbrechen-Button, suche Schließen-Icon (X)
      const closeButton = dialog.locator('button[aria-label="Close"]');
      if (await closeButton.isVisible()) {
        await closeButton.click();
      }
    }

    // Dialog schließt
    await expect(dialog).not.toBeVisible({ timeout: 5000 });
  });

  /**
   * Test 3: Material bearbeiten
   * Flow:
   * 1. Wähle existierendes Material aus Tabelle
   * 2. Klick auf "Bearbeiten" Button
   * 3. Dialog öffnet sich mit vorausgefüllten Daten
   * 4. Ändere Daten
   * 5. Klick auf "Speichern"
   * 6. Änderungen erscheinen in Tabelle
   */
  test.skip('Material bearbeiten erfolgreich', async ({ page: _page }) => {
    // TODO: Implement nach Material-API vollständig implementiert
    // Benötigt:
    // - Edit-Button in Tabelle
    // - PUT /api/materials/:id Endpoint
    // - Dialog mit vorausgefüllten Daten
  });

  /**
   * Test 4: Material löschen
   * Flow:
   * 1. Wähle existierendes Material aus Tabelle
   * 2. Klick auf "Löschen" Button
   * 3. Bestätigungs-Dialog öffnet sich
   * 4. Klick auf "Bestätigen"
   * 5. Material verschwindet aus Tabelle
   */
  test.skip('Material löschen erfolgreich', async ({ page: _page }) => {
    // TODO: Implement nach Material-API vollständig implementiert
    // Benötigt:
    // - Delete-Button in Tabelle
    // - DELETE /api/materials/:id Endpoint
    // - Bestätigungs-Dialog
  });

  /**
   * Test 5: Validierung - Fehler bei fehlenden Feldern
   * Flow:
   * 1. Klick auf "Neues Material" Button
   * 2. Dialog öffnet sich
   * 3. Lasse Pflichtfelder leer
   * 4. Klick auf "Speichern"
   * 5. Fehler-Meldung erscheint
   * 6. Dialog bleibt offen
   */
  test('Material Validierung - Fehlende Pflichtfelder', async ({ page }) => {
    // Klick auf "Neues Material" Button
    const newMaterialButton = page.getByRole('button', { name: /neues material/i });
    await newMaterialButton.click();

    // Dialog öffnet sich
    const dialog = page.getByRole('dialog');
    await expect(dialog).toBeVisible();

    // Lasse Felder leer und klick auf "Speichern"
    const saveButton = dialog.getByRole('button', { name: /speichern/i });
    await saveButton.click();

    // Dialog bleibt offen (warte kurz und prüfe)
    await page.waitForTimeout(1000);
    await expect(dialog).toBeVisible();

    // TODO: Prüfe auf Fehler-Meldung (wenn implementiert)
    // z.B. "Name ist erforderlich"
  });
});
