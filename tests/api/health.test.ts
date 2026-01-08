/**
 * @file        health.test.ts
 * @description API Contract Test fuer /api/health
 * @version     0.1.0
 * @created     2026-01-08 15:20:04 CET
 * @updated     2026-01-08 15:20:04 CET
 * @author      codex
 *
 * @changelog
 *   0.1.0 - 2026-01-08 - Health Endpoint Vertragstest
 */

import { describe, expect, it } from 'vitest';
import { createApp } from '../../server/app';
import { createTestDb } from '../helpers/testDb';

describe('API Health', () => {
  it('liefert success true', async () => {
    const { db, cleanup } = createTestDb(':memory:');
    const app = createApp(db);

    const response = await app.request('/api/health');
    expect(response.status).toBe(200);

    const body = await response.json();
    expect(body).toEqual({ success: true });

    cleanup();
  });
});
