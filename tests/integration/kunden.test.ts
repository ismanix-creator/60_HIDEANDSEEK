/**
 * @file        kunden.test.ts
 * @description Integration Tests fuer Kunden-Endpunkte
 * @version     0.1.0
 * @created     2026-01-06 23:20:12 CET
 * @updated     2026-01-06 23:20:12 CET
 * @author      agenten-koordinator
 *
 * @changelog
 *   0.1.0 - 2026-01-06 - Initial scaffold
 */

import { describe, expect, it } from 'vitest';
import { createApp } from '../../server/app';
import { initializeSchema, openDatabase } from '../../server/db/connection';

function createTestApp() {
  const db = openDatabase(':memory:');
  initializeSchema(db);
  return createApp(db);
}

describe('Kunden API', () => {
  it('creates and lists kunden', async () => {
    const app = createTestApp();
    const createRes = await app.request('/api/kunden', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: 'Kunde A' })
    });

    expect(createRes.status).toBe(201);
    const created = (await createRes.json()) as { success: boolean; data: { id: number; name: string } };
    expect(created.success).toBe(true);

    const listRes = await app.request('/api/kunden');
    const list = (await listRes.json()) as { success: boolean; data: unknown[] };
    expect(list.success).toBe(true);
    expect(list.data.length).toBe(1);
  });
});
