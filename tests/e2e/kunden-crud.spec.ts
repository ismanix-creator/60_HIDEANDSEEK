/**
 * @file        tests/e2e/kunden-crud.spec.ts
 * @description E2E Test - Kunden CRUD Flow (Create/Read/Update/Delete)
 * @version     1.0.0
 * @created     2026-01-10 21:15:00 CET
 * @updated     2026-01-10 21:15:00 CET
 * @author      QA-Test-Entwickler (Phase 4.3)
 *
 * @changelog
 *   1.0.0 - 2026-01-10 - Initial: Kunden CRUD E2E Tests
 *                         - Kunde erstellen (Happy Path)
 *                         - Kunde bearbeiten
 *                         - Kunde löschen
 *                         - Validierung: Fehler bei fehlenden Feldern
 */

import { test, expect } from '@playwright/test';

test.describe('Kunden CRUD Flow', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/kunden');
    await page.waitForLoadState('networkidle');
  });

  /**
   * Test 1: Kunde erstellen (Happy Path)
   * Flow:
   * 1. Klick auf "Neuer Kunde" Button
   * 2. Dialog öffnet sich
   * 3. Fülle Formular aus (Name, Kontakt)
   * 4. Klick auf "Speichern"
   * 5. Dialog schließt
   * 6. Kunde erscheint in Tabelle
   */
  test('Kunde erstellen erfolgreich', async ({ page }) => {
    // Klick auf "Neuer Kunde" Button (mit Plus-Icon)
    const newKundeButton = page.getByRole('button', { name: /neuer kunde/i });
    await expect(newKundeButton).toBeVisible();
    await newKundeButton.click();

    // Dialog öffnet sich
    const dialog = page.getByRole('dialog');
    await expect(dialog).toBeVisible();

    // Fülle Formular aus
    const kundeName = `Test-Kunde-${Date.now()}`;
    const kundeContact = 'test@example.com';

    await page.getByLabel(/name/i).fill(kundeName);

    // Falls Kontakt-Feld existiert
    const contactInput = page.getByLabel(/kontakt|email|telefon/i);
    if (await contactInput.isVisible()) {
      await contactInput.fill(kundeContact);
    }

    // Klick auf "Speichern" Button im Dialog
    const saveButton = dialog.getByRole('button', { name: /speichern/i });
    await saveButton.click();

    // Dialog schließt (warte auf Schließen)
    await expect(dialog).not.toBeVisible({ timeout: 5000 });

    // Kunde erscheint in Tabelle
    const tableContent = page.locator('div').filter({ hasText: kundeName });
    await expect(tableContent).toBeVisible();
  });

  /**
   * Test 2: Kunde Dialog öffnen und abbrechen
   * Flow:
   * 1. Klick auf "Neuer Kunde" Button
   * 2. Dialog öffnet sich
   * 3. Klick auf "Abbrechen" oder Schließen-Button
   * 4. Dialog schließt ohne Kunde zu erstellen
   */
  test('Kunde Dialog abbrechen', async ({ page }) => {
    // Klick auf "Neuer Kunde" Button
    const newKundeButton = page.getByRole('button', { name: /neuer kunde/i });
    await newKundeButton.click();

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
   * Test 3: Kunde bearbeiten
   * Flow:
   * 1. Wähle existierenden Kunde aus Tabelle
   * 2. Klick auf "Bearbeiten" Button
   * 3. Dialog öffnet sich mit vorausgefüllten Daten
   * 4. Ändere Daten
   * 5. Klick auf "Speichern"
   * 6. Änderungen erscheinen in Tabelle
   */
  test.skip('Kunde bearbeiten erfolgreich', async ({ page: _page }) => {
    // TODO: Implement nach Kunden-API vollständig implementiert
    // Benötigt:
    // - Edit-Button in Tabelle
    // - PUT /api/kunden/:id Endpoint
    // - Dialog mit vorausgefüllten Daten
  });

  /**
   * Test 4: Kunde löschen
   * Flow:
   * 1. Wähle existierenden Kunde aus Tabelle
   * 2. Klick auf "Löschen" Button
   * 3. Bestätigungs-Dialog öffnet sich
   * 4. Klick auf "Bestätigen"
   * 5. Kunde verschwindet aus Tabelle
   */
  test.skip('Kunde löschen erfolgreich', async ({ page: _page }) => {
    // TODO: Implement nach Kunden-API vollständig implementiert
    // Benötigt:
    // - Delete-Button in Tabelle
    // - DELETE /api/kunden/:id Endpoint
    // - Bestätigungs-Dialog
  });

  /**
   * Test 5: Validierung - Fehler bei fehlenden Feldern
   * Flow:
   * 1. Klick auf "Neuer Kunde" Button
   * 2. Dialog öffnet sich
   * 3. Lasse Pflichtfelder leer
   * 4. Klick auf "Speichern"
   * 5. Fehler-Meldung erscheint
   * 6. Dialog bleibt offen
   */
  test('Kunde Validierung - Fehlende Pflichtfelder', async ({ page }) => {
    // Klick auf "Neuer Kunde" Button
    const newKundeButton = page.getByRole('button', { name: /neuer kunde/i });
    await newKundeButton.click();

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
