/**
 * @file        bootstrap-admin.ts
 * @description Bootstrap admin user seeding (idempotent)
 * @version     1.1.1
 * @created     2026-01-08 01:35:00 CET
 * @updated     2026-01-11 15:30:00 CET
 * @author      Akki Scholze
 *
 * @changelog
 *   1.1.1 - 2026-01-11 - Fixed tsconfig to recognize all server files
 *   1.1.0 - 2026-01-11 - Removed src/config import (use backendConfig)
 *   1.0.0 - 2026-01-08 - Initial bootstrap seed
 */

import type { Database } from 'better-sqlite3';
import { backendConfig } from '../config/app.config.js';

/**
 * Ensure bootstrap admin user exists (idempotent)
 */
export function ensureBootstrapAdmin(db: Database): void {
  const bootstrapId = backendConfig.auth.admin_bootstrap_user_id;

  // Check if already exists (by ID)
  const existing = db.prepare('SELECT id, username, role, status FROM users WHERE id = ?').get(bootstrapId) as
    | { id: number | string; username: string | null; role: string | null; status: string | null }
    | undefined;

  if (existing) {
    console.log(
      `Bootstrap admin already exists (id=${existing.id}, username=${existing.username ?? 'NULL'}, role=${existing.role ?? 'NULL'}, status=${existing.status ?? 'NULL'}).`
    );
    return;
  }

  // Create bootstrap admin
  const now = new Date().toISOString();
  const insertStmt = db.prepare(`
    INSERT INTO users (
      id, username, display_name, role, status, kunde_id,
      password_hash, password_salt, password_set_at,
      requested_at, approved_at, approved_by,
      created_at, updated_at
    ) VALUES (?, ?, ?, 'admin', 'bootstrap', NULL, NULL, NULL, NULL, NULL, NULL, NULL, ?, ?)
  `);

  insertStmt.run(
    bootstrapId,
    'admin', // placeholder username
    'Admin', // placeholder display name
    now,
    now
  );

  console.log(`Bootstrap admin created (id=${bootstrapId}, username=admin, status=bootstrap).`);
}
