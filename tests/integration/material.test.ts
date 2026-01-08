/**
 * @file        material.test.ts
 * @description Integration Tests fuer Material-Endpunkte
 * @version     0.1.0
 * @created     2026-01-06 22:20:42 CET
 * @updated     2026-01-06 22:20:42 CET
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

describe('Material API', () => {
  it('creates and lists material', async () => {
    const app = createTestApp();
    const payload = {
      datum: '2026-01-06',
      bezeichnung: 'Holzbretter',
      menge: 10,
      ek_stueck: 5,
      ek_gesamt: 50,
      vk_stueck: 8,
      bestand: 10
    };

    const createRes = await app.request('/api/material', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    expect(createRes.status).toBe(201);
    const created = await createRes.json();
    expect(created.success).toBe(true);

    const listRes = await app.request('/api/material');
    const list = await listRes.json();
    expect(list.success).toBe(true);
    expect(list.data.length).toBe(1);
  });

  it('rejects bar movement if stock would go negative', async () => {
    const app = createTestApp();
    const materialRes = await app.request('/api/material', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        datum: '2026-01-06',
        bezeichnung: 'Schrauben',
        menge: 2,
        ek_stueck: 1,
        ek_gesamt: 2,
        vk_stueck: 2,
        bestand: 2
      })
    });
    const material = await materialRes.json();

    const moveRes = await app.request('/api/material-bewegungen-bar', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        material_id: material.data.id,
        datum: '2026-01-06',
        menge: 3,
        preis: 10
      })
    });

    expect(moveRes.status).toBe(400);
    const body = await moveRes.json();
    expect(body.success).toBe(false);
  });
});
