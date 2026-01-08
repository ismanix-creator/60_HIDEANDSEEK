/**
 * @file        glaeubiger.test.ts
 * @description Integration Tests fuer Glaeubiger-Endpunkte
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

describe('Glaeubiger API', () => {
  it('creates and lists glaeubiger', async () => {
    const app = createTestApp();

    const createRes = await app.request('/api/glaeubiger', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        datum: '2026-01-07',
        name: 'Lieferant A',
        betrag: 500
      })
    });

    expect(createRes.status).toBe(201);
    const created = (await createRes.json()) as { success: boolean; data: { offen: number } };
    expect(created.success).toBe(true);
    expect(created.data.offen).toBe(500);

    const listRes = await app.request('/api/glaeubiger');
    const list = await listRes.json();
    expect(list.success).toBe(true);
    expect(list.data.length).toBe(1);
  });

  it('updates glaeubiger', async () => {
    const app = createTestApp();

    const createRes = await app.request('/api/glaeubiger', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        datum: '2026-01-07',
        name: 'Lieferant B',
        betrag: 250
      })
    });
    const created = (await createRes.json()) as { success: boolean; data: { id: number } };

    const updateRes = await app.request(`/api/glaeubiger/${created.data.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ faelligkeit: '2026-02-07' })
    });

    expect(updateRes.status).toBe(200);
    const updated = (await updateRes.json()) as { success: boolean; data: { faelligkeit: string } };
    expect(updated.success).toBe(true);
    expect(updated.data.faelligkeit).toBe('2026-02-07');
  });

  it('processes zahlung for glaeubiger', async () => {
    const app = createTestApp();

    const createRes = await app.request('/api/glaeubiger', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        datum: '2026-01-07',
        name: 'Lieferant C',
        betrag: 1000
      })
    });
    const created = (await createRes.json()) as { success: boolean; data: { id: number } };

    const zahlungRes = await app.request(`/api/glaeubiger/${created.data.id}/zahlung`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ betrag: 500 })
    });

    expect(zahlungRes.status).toBe(200);
    const result = (await zahlungRes.json()) as { success: boolean; data: { bezahlt: number; offen: number; status: string } };
    expect(result.success).toBe(true);
    expect(result.data.bezahlt).toBe(500);
    expect(result.data.offen).toBe(500);
    expect(result.data.status).toBe('offen');
  });

  it('marks glaeubiger as bezahlt when fully paid', async () => {
    const app = createTestApp();

    const createRes = await app.request('/api/glaeubiger', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        datum: '2026-01-07',
        name: 'Lieferant D',
        betrag: 300
      })
    });
    const created = (await createRes.json()) as { success: boolean; data: { id: number } };

    const zahlungRes = await app.request(`/api/glaeubiger/${created.data.id}/zahlung`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ betrag: 300 })
    });

    expect(zahlungRes.status).toBe(200);
    const result = await zahlungRes.json();
    expect(result.success).toBe(true);
    expect(result.data.bezahlt).toBe(300);
    expect(result.data.offen).toBe(0);
    expect(result.data.status).toBe('bezahlt');
  });

  it('deletes glaeubiger', async () => {
    const app = createTestApp();

    const createRes = await app.request('/api/glaeubiger', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        datum: '2026-01-07',
        name: 'Lieferant E',
        betrag: 100
      })
    });
    const created = (await createRes.json()) as { success: boolean; data: { id: number } };

    const deleteRes = await app.request(`/api/glaeubiger/${created.data.id}`, {
      method: 'DELETE'
    });

    expect(deleteRes.status).toBe(200);
    const deleted = (await deleteRes.json()) as { success: boolean };
    expect(deleted.success).toBe(true);

    const listRes = await app.request('/api/glaeubiger');
    const list = (await listRes.json()) as { success: boolean; data: unknown[] };
    expect(list.data.length).toBe(0);
  });
});
