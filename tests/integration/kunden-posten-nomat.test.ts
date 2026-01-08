/**
 * @file        kunden-posten-nomat.test.ts
 * @description Integration Tests fuer KundenPostenNoMat-Endpunkte
 * @version     0.1.0
 * @created     2026-01-07 00:47:18 CET
 * @updated     2026-01-07 00:47:18 CET
 * @author      backend-entwickler
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

describe('KundenPostenNoMat API', () => {
  it('creates and lists kunden-posten-nomat', async () => {
    const app = createTestApp();

    // Create kunde
    const kundeRes = await app.request('/api/kunden', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: 'Kunde A' })
    });
    const kunde = await kundeRes.json();

    // Create kunden-posten-nomat
    const createRes = await app.request('/api/kunden-posten-nomat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        kunde_id: kunde.data.id,
        datum: '2026-01-07',
        bezeichnung: 'Sonstige Leistung',
        betrag: 100
      })
    });

    expect(createRes.status).toBe(201);
    const created = (await createRes.json()) as { success: boolean; data: { offen: number } };
    expect(created.success).toBe(true);
    expect(created.data.offen).toBe(100);

    // List all
    const listRes = await app.request('/api/kunden-posten-nomat');
    const list = (await listRes.json()) as { success: boolean; data: unknown[] };
    expect(list.success).toBe(true);
    expect(list.data.length).toBe(1);
  });

  it('updates kunden-posten-nomat', async () => {
    const app = createTestApp();

    // Create kunde
    const kundeRes = await app.request('/api/kunden', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: 'Kunde B' })
    });
    const kunde = await kundeRes.json();

    // Create
    const createRes = await app.request('/api/kunden-posten-nomat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        kunde_id: kunde.data.id,
        datum: '2026-01-07',
        bezeichnung: 'Service',
        betrag: 50
      })
    });
    const created = (await createRes.json()) as { success: boolean; data: { id: number } };

    // Update
    const updateRes = await app.request(`/api/kunden-posten-nomat/${created.data.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ notiz: 'Test-Notiz' })
    });

    expect(updateRes.status).toBe(200);
    const updated = (await updateRes.json()) as { success: boolean; data: { notiz: string } };
    expect(updated.success).toBe(true);
    expect(updated.data.notiz).toBe('Test-Notiz');
  });

  it('processes zahlung for kunden-posten-nomat', async () => {
    const app = createTestApp();

    // Create kunde
    const kundeRes = await app.request('/api/kunden', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: 'Kunde C' })
    });
    const kunde = await kundeRes.json();

    // Create posten
    const createRes = await app.request('/api/kunden-posten-nomat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        kunde_id: kunde.data.id,
        datum: '2026-01-07',
        bezeichnung: 'Beratung',
        betrag: 200
      })
    });
    const created = (await createRes.json()) as { success: boolean; data: { id: number } };

    // Process payment
    const zahlungRes = await app.request(`/api/kunden-posten-nomat/${created.data.id}/zahlung`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ betrag: 100 })
    });

    expect(zahlungRes.status).toBe(200);
    const result = (await zahlungRes.json()) as { success: boolean; data: { bezahlt: number; offen: number; status: string } };
    expect(result.success).toBe(true);
    expect(result.data.bezahlt).toBe(100);
    expect(result.data.offen).toBe(100);
    expect(result.data.status).toBe('offen');
  });

  it('lists kunden-posten-nomat by kunde', async () => {
    const app = createTestApp();

    // Create kunde
    const kundeRes = await app.request('/api/kunden', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: 'Kunde D' })
    });
    const kunde = await kundeRes.json();

    // Create two posten
    await app.request('/api/kunden-posten-nomat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        kunde_id: kunde.data.id,
        datum: '2026-01-07',
        bezeichnung: 'Leistung 1',
        betrag: 50
      })
    });

    await app.request('/api/kunden-posten-nomat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        kunde_id: kunde.data.id,
        datum: '2026-01-08',
        bezeichnung: 'Leistung 2',
        betrag: 75
      })
    });

    // List by kunde
    const listRes = await app.request(`/api/kunden-posten-nomat/kunde/${kunde.data.id}`);
    const list = (await listRes.json()) as { success: boolean; data: unknown[] };
    expect(list.success).toBe(true);
    expect(list.data.length).toBe(2);
  });
});
