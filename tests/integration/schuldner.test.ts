/**
 * @file        schuldner.test.ts
 * @description Integration Tests fuer Schuldner-Endpunkte
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

describe('Schuldner API', () => {
  it('creates and lists schuldner', async () => {
    const app = createTestApp();

    const createRes = await app.request('/api/schuldner', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        datum: '2026-01-07',
        name: 'Firma A',
        betrag: 750
      })
    });

    expect(createRes.status).toBe(201);
    const created = (await createRes.json()) as { success: boolean; data: { id: number; offen: number } };
    expect(created.success).toBe(true);
    expect(created.data.offen).toBe(750);

    const listRes = await app.request('/api/schuldner');
    const list = (await listRes.json()) as { success: boolean; data: unknown[] };
    expect(list.success).toBe(true);
    expect(list.data.length).toBe(1);
  });

  it('updates schuldner', async () => {
    const app = createTestApp();

    const createRes = await app.request('/api/schuldner', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        datum: '2026-01-07',
        name: 'Firma B',
        betrag: 400
      })
    });
    const created = (await createRes.json()) as { success: boolean; data: { id: number } };

    const updateRes = await app.request(`/api/schuldner/${created.data.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ faelligkeit: '2026-03-01' })
    });

    expect(updateRes.status).toBe(200);
    const updated = (await updateRes.json()) as { success: boolean; data: { faelligkeit: string } };
    expect(updated.success).toBe(true);
    expect(updated.data.faelligkeit).toBe('2026-03-01');
  });

  it('processes zahlung for schuldner', async () => {
    const app = createTestApp();

    const createRes = await app.request('/api/schuldner', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        datum: '2026-01-07',
        name: 'Firma C',
        betrag: 1500
      })
    });
    const created = (await createRes.json()) as { success: boolean; data: { id: number } };

    const zahlungRes = await app.request(`/api/schuldner/${created.data.id}/zahlung`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ betrag: 750 })
    });

    expect(zahlungRes.status).toBe(200);
    const result = (await zahlungRes.json()) as { success: boolean; data: { bezahlt: number; offen: number; status: string } };
    expect(result.success).toBe(true);
    expect(result.data.bezahlt).toBe(750);
    expect(result.data.offen).toBe(750);
    expect(result.data.status).toBe('offen');
  });

  it('marks schuldner as bezahlt when fully paid', async () => {
    const app = createTestApp();

    const createRes = await app.request('/api/schuldner', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        datum: '2026-01-07',
        name: 'Firma D',
        betrag: 600
      })
    });
    const created = (await createRes.json()) as { success: boolean; data: { id: number } };

    const zahlungRes = await app.request(`/api/schuldner/${created.data.id}/zahlung`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ betrag: 600 })
    });

    expect(zahlungRes.status).toBe(200);
    const result = (await zahlungRes.json()) as { success: boolean; data: { bezahlt: number; offen: number; status: string } };
    expect(result.success).toBe(true);
    expect(result.data.bezahlt).toBe(600);
    expect(result.data.offen).toBe(0);
    expect(result.data.status).toBe('bezahlt');
  });

  it('deletes schuldner', async () => {
    const app = createTestApp();

    const createRes = await app.request('/api/schuldner', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        datum: '2026-01-07',
        name: 'Firma E',
        betrag: 200
      })
    });
    const created = (await createRes.json()) as { success: boolean; data: { id: number } };

    const deleteRes = await app.request(`/api/schuldner/${created.data.id}`, {
      method: 'DELETE'
    });

    expect(deleteRes.status).toBe(200);
    const deleted = (await deleteRes.json()) as { success: boolean };
    expect(deleted.success).toBe(true);

    const listRes = await app.request('/api/schuldner');
    const list = (await listRes.json()) as { success: boolean; data: unknown[] };
    expect(list.data.length).toBe(0);
  });
});
