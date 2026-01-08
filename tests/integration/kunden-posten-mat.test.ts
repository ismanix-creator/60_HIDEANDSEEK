/**
 * @file        kunden-posten-mat.test.ts
 * @description Integration Tests fuer KundenPostenMat-Endpunkte
 * @version     0.1.0
 * @created     2026-01-07 00:47:18 CET
 * @updated     2026-01-07 00:47:18 CET
 * @author      Akki Scholze
 *
 * @changelog
 *   0.1.0 - 2026-01-07 - Initial scaffold
 */

import { describe, expect, it } from 'vitest';
import { createApp } from '../../server/app';
import { initializeSchema, openDatabase } from '../../server/db/connection';

function createTestApp() {
  const db = openDatabase(':memory:');
  initializeSchema(db);
  return createApp(db);
}

describe('KundenPostenMat API', () => {
  it('creates and lists kunden-posten-mat', async () => {
    const app = createTestApp();

    // Create kunde
    const kundeRes = await app.request('/api/kunden', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: 'Kunde A' })
    });
    const kunde = await kundeRes.json();

    // Create material
    const materialRes = await app.request('/api/material', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        datum: '2026-01-07',
        bezeichnung: 'Test Material',
        menge: 10,
        ek_stueck: 5,
        ek_gesamt: 50,
        vk_stueck: 10,
        bestand: 10
      })
    });
    const material = await materialRes.json();

    // Create kunden-posten-mat
    const createRes = await app.request('/api/kunden-posten-mat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        kunde_id: kunde.data.id,
        material_id: material.data.id,
        datum: '2026-01-07',
        menge: 2,
        preis: 20 // Preis pro Stück
      })
    });

    expect(createRes.status).toBe(201);
    const created = (await createRes.json()) as { success: boolean; data: { offen: number } };
    expect(created.success).toBe(true);
    expect(created.data.offen).toBe(40); // menge 2 * preis 20 = 40

    // List all
    const listRes = await app.request('/api/kunden-posten-mat');
    const list = (await listRes.json()) as { success: boolean; data: unknown[] };
    expect(list.success).toBe(true);
    expect(list.data.length).toBe(1);
  });

  it('updates kunden-posten-mat', async () => {
    const app = createTestApp();

    // Create kunde
    const kundeRes = await app.request('/api/kunden', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: 'Kunde B' })
    });
    const kunde = await kundeRes.json();

    // Create material
    const materialRes = await app.request('/api/material', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        datum: '2026-01-07',
        bezeichnung: 'Test Material 2',
        menge: 5,
        ek_stueck: 2,
        ek_gesamt: 10,
        vk_stueck: 4,
        bestand: 5
      })
    });
    const material = await materialRes.json();

    // Create
    const createRes = await app.request('/api/kunden-posten-mat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        kunde_id: kunde.data.id,
        material_id: material.data.id,
        datum: '2026-01-07',
        menge: 1,
        preis: 4
      })
    });
    const created = (await createRes.json()) as { success: boolean; data: { id: number } };

    // Update
    const updateRes = await app.request(`/api/kunden-posten-mat/${created.data.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ notiz: 'Test-Notiz' })
    });

    expect(updateRes.status).toBe(200);
    const updated = (await updateRes.json()) as { success: boolean; data: { notiz: string } };
    expect(updated.success).toBe(true);
    expect(updated.data.notiz).toBe('Test-Notiz');
  });

  it('processes zahlung for kunden-posten-mat', async () => {
    const app = createTestApp();

    // Create kunde
    const kundeRes = await app.request('/api/kunden', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: 'Kunde C' })
    });
    const kunde = await kundeRes.json();

    // Create material
    const materialRes = await app.request('/api/material', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        datum: '2026-01-07',
        bezeichnung: 'Test Material 3',
        menge: 10,
        ek_stueck: 5,
        ek_gesamt: 50,
        vk_stueck: 10,
        bestand: 10
      })
    });
    const material = await materialRes.json();

    // Create posten
    const createRes = await app.request('/api/kunden-posten-mat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        kunde_id: kunde.data.id,
        material_id: material.data.id,
        datum: '2026-01-07',
        menge: 3,
        preis: 30 // Preis pro Stück
      })
    });
    const created = (await createRes.json()) as { success: boolean; data: { id: number } };

    // Process payment
    const zahlungRes = await app.request(`/api/kunden-posten-mat/${created.data.id}/zahlung`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ betrag: 15 })
    });

    expect(zahlungRes.status).toBe(200);
    const result = (await zahlungRes.json()) as { success: boolean; data: { bezahlt: number; offen: number; status: string } };
    expect(result.success).toBe(true);
    expect(result.data.bezahlt).toBe(15);
    expect(result.data.offen).toBe(75); // Gesamtbetrag 90 (3*30) - bezahlt 15 = 75
    expect(result.data.status).toBe('offen');
  });

  it('lists kunden-posten-mat by kunde', async () => {
    const app = createTestApp();

    // Create kunde
    const kundeRes = await app.request('/api/kunden', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: 'Kunde D' })
    });
    const kunde = await kundeRes.json();

    // Create material
    const materialRes = await app.request('/api/material', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        datum: '2026-01-07',
        bezeichnung: 'Test Material 4',
        menge: 5,
        ek_stueck: 2,
        ek_gesamt: 10,
        vk_stueck: 4,
        bestand: 5
      })
    });
    const material = await materialRes.json();

    // Create two posten
    await app.request('/api/kunden-posten-mat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        kunde_id: kunde.data.id,
        material_id: material.data.id,
        datum: '2026-01-07',
        menge: 1,
        preis: 4
      })
    });

    await app.request('/api/kunden-posten-mat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        kunde_id: kunde.data.id,
        material_id: material.data.id,
        datum: '2026-01-08',
        menge: 2,
        preis: 8
      })
    });

    // List by kunde
    const listRes = await app.request(`/api/kunden-posten-mat/kunde/${kunde.data.id}`);
    const list = (await listRes.json()) as { success: boolean; data: unknown[] };
    expect(list.success).toBe(true);
    expect(list.data.length).toBe(2);
  });
});
