/**
 * @file        admin.routes.ts
 * @description Admin endpoints (user management, approval)
 * @version     1.0.0
 * @created     2026-01-08 01:20:00 CET
 * @updated     2026-01-08 01:20:00 CET
 * @author      Akki Scholze
 *
 * @changelog
 *   1.0.0 - 2026-01-08 - Initial admin routes
 */

import { Hono } from 'hono';
import type { Database } from 'better-sqlite3';
import type { AppEnv } from '../types.js';
import { hashPassword } from '../auth/password.js';
import { getAuthConfig, requireAdmin } from '../auth/guards.js';

export function createAdminRoutes(db: Database) {
  const app = new Hono<AppEnv>();

  /**
   * GET /api/admin/users
   * List all users (filtered by status optional)
   */
  app.get('/users', (c) => {
    try {
      // If auth.enabled=true, require admin
      const authConfig = getAuthConfig();
      if (authConfig.enabled) {
        requireAdmin(c);
      }

      const status = c.req.query('status'); // optional filter

      let stmt;
      let users;

      if (status) {
        stmt = db.prepare(`
          SELECT id, username, display_name, role, status, kunde_id, 
                 requested_at, approved_at, approved_by, created_at, updated_at
          FROM users 
          WHERE status = ?
          ORDER BY created_at DESC
        `);
        users = stmt.all(status);
      } else {
        stmt = db.prepare(`
          SELECT id, username, display_name, role, status, kunde_id, 
                 requested_at, approved_at, approved_by, created_at, updated_at
          FROM users 
          ORDER BY created_at DESC
        `);
        users = stmt.all();
      }

      return c.json({ users });
    } catch (error: any) {
      console.error('List users error:', error);
      return c.json({ error: error.message || 'Failed to list users' }, 500);
    }
  });

  /**
   * POST /api/admin/users/:id/approve
   * Approve pending user (assign kunde_id, set status=active)
   */
  app.post('/users/:id/approve', async (c) => {
    try {
      const authConfig = getAuthConfig();
      if (authConfig.enabled) {
        requireAdmin(c);
      }

      const userId = c.req.param('id');
      const body = await c.req.json();
      const { kundeId } = body;

      if (!kundeId || typeof kundeId !== 'number') {
        return c.json({ error: 'kundeId (number) required' }, 400);
      }

      // Check user exists and is pending
      const checkStmt = db.prepare('SELECT * FROM users WHERE id = ?');
      const user = checkStmt.get(userId) as any;

      if (!user) {
        return c.json({ error: 'User not found' }, 404);
      }

      if (user.status !== 'pending') {
        return c.json({ error: `User status is ${user.status}, expected pending` }, 400);
      }

      // Check kunde exists
      const kundeStmt = db.prepare('SELECT id FROM kunden WHERE id = ?');
      const kunde = kundeStmt.get(kundeId);
      if (!kunde) {
        return c.json({ error: 'Kunde not found' }, 404);
      }

      // Approve user
      const now = new Date().toISOString();
      const currentUser = c.get('user');
      const adminUserId = currentUser?.id || 'system';

      const updateStmt = db.prepare(`
        UPDATE users 
        SET kunde_id = ?, 
            status = 'active', 
            approved_at = ?,
            approved_by = ?,
            updated_at = ?
        WHERE id = ?
      `);

      updateStmt.run(kundeId, now, adminUserId, now, userId);

      // Return updated user
      const updatedUser = checkStmt.get(userId);
      return c.json({ user: updatedUser, message: 'User approved' });
    } catch (error: any) {
      console.error('Approve user error:', error);
      return c.json({ error: error.message || 'Failed to approve user' }, 500);
    }
  });

  /**
   * POST /api/admin/users/:id/disable
   * Disable user
   */
  app.post('/users/:id/disable', async (c) => {
    try {
      const authConfig = getAuthConfig();
      if (authConfig.enabled) {
        requireAdmin(c);
      }

      const userId = c.req.param('id');

      const stmt = db.prepare(`
        UPDATE users 
        SET status = 'disabled', updated_at = ?
        WHERE id = ?
      `);

      const now = new Date().toISOString();
      stmt.run(now, userId);

      return c.json({ message: 'User disabled' });
    } catch (error: any) {
      console.error('Disable user error:', error);
      return c.json({ error: error.message || 'Failed to disable user' }, 500);
    }
  });

  /**
   * POST /api/admin/users/:id/password
   * Reset/set user password (admin only)
   */
  app.post('/users/:id/password', async (c) => {
    try {
      const authConfig = getAuthConfig();
      if (authConfig.enabled) {
        requireAdmin(c);
      }

      const userId = c.req.param('id');
      const body = await c.req.json();
      const { password } = body;

      if (!password || typeof password !== 'string') {
        return c.json({ error: 'password (string) required' }, 400);
      }

      // Hash new password
      const { hash, salt } = hashPassword(password);

      const stmt = db.prepare(`
        UPDATE users 
        SET password_hash = ?, 
            password_salt = ?, 
            password_set_at = ?,
            updated_at = ?
        WHERE id = ?
      `);

      const now = new Date().toISOString();
      stmt.run(hash, salt, now, now, userId);

      return c.json({ message: 'Password updated' });
    } catch (error: any) {
      console.error('Password reset error:', error);
      return c.json({ error: error.message || 'Failed to reset password' }, 500);
    }
  });

  return app;
}
