/**
 * @file        auth.routes.ts
 * @description Auth endpoints (bootstrap, signup, login)
 * @version     1.0.0
 * @created     2026-01-08 01:15:00 CET
 * @updated     2026-01-08 01:15:00 CET
 * @author      Akki Scholze
 *
 * @changelog
 *   1.0.0 - 2026-01-08 - Initial auth routes
 */

import { Hono } from 'hono';
import type { Database } from 'better-sqlite3';
import type { AppEnv } from '../types.js';
import { hashPassword, verifyPassword } from '../auth/password.js';
import { getAuthConfig } from '../auth/guards.js';

export function createAuthRoutes(db: Database) {
  const app = new Hono<AppEnv>();

  /**
   * POST /api/auth/bootstrap-admin
   * First-run admin setup
   */
  app.post('/bootstrap-admin', async (c) => {
    try {
      const body = await c.req.json();
      const { username, displayName, password } = body;

      if (!username || !displayName || !password) {
        return c.json({ error: 'Missing required fields' }, 400);
      }

      const authConfig = getAuthConfig();
      const bootstrapId = authConfig.admin_bootstrap_user_id;

      // Check bootstrap user exists and is in bootstrap status
      const stmt = db.prepare('SELECT * FROM users WHERE id = ? AND status = ?');
      const bootstrapUser = stmt.get(bootstrapId, 'bootstrap');

      if (!bootstrapUser) {
        return c.json({ error: 'Bootstrap already completed or invalid' }, 400);
      }

      // Hash password
      const { hash, salt } = hashPassword(password);

      // Update bootstrap user
      const updateStmt = db.prepare(`
        UPDATE users 
        SET username = ?, 
            display_name = ?, 
            password_hash = ?, 
            password_salt = ?, 
            password_set_at = ?,
            status = 'active',
            updated_at = ?
        WHERE id = ?
      `);

      const now = new Date().toISOString();
      updateStmt.run(username, displayName, hash, salt, now, now, bootstrapId);

      return c.json({ userId: bootstrapId, message: 'Admin bootstrap successful' });
    } catch (error) {
      console.error('Bootstrap error:', error);
      return c.json({ error: 'Bootstrap failed' }, 500);
    }
  });

  /**
   * POST /api/auth/signup
   * Customer self-signup (creates pending user)
   */
  app.post('/signup', async (c) => {
    try {
      const body = await c.req.json();
      const { username, displayName, password } = body;

      if (!username || !displayName || !password) {
        return c.json({ error: 'Missing required fields' }, 400);
      }

      // Check username not taken
      const checkStmt = db.prepare('SELECT id FROM users WHERE username = ?');
      const existing = checkStmt.get(username);
      if (existing) {
        return c.json({ error: 'Username already exists' }, 400);
      }

      // Hash password
      const { hash, salt } = hashPassword(password);

      // Create pending user
      const userId = `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      const now = new Date().toISOString();

      const insertStmt = db.prepare(`
        INSERT INTO users (
          id, username, display_name, role, status, kunde_id,
          password_hash, password_salt, password_set_at,
          requested_at, created_at, updated_at
        ) VALUES (?, ?, ?, 'user', 'pending', NULL, ?, ?, ?, ?, ?, ?)
      `);

      insertStmt.run(userId, username, displayName, hash, salt, now, now, now, now);

      return c.json({
        userId,
        status: 'pending',
        message: 'Signup successful. Waiting for admin approval.'
      });
    } catch (error) {
      console.error('Signup error:', error);
      return c.json({ error: 'Signup failed' }, 500);
    }
  });

  /**
   * POST /api/auth/login
   * Login endpoint (username + password)
   */
  app.post('/login', async (c) => {
    try {
      const body = await c.req.json();
      const { username, password } = body;

      if (!username || !password) {
        return c.json({ error: 'Missing username or password' }, 400);
      }

      // Find user by username
      const stmt = db.prepare('SELECT * FROM users WHERE username = ?');
      const user = stmt.get(username) as any;

      if (!user) {
        return c.json({ error: 'Invalid credentials' }, 401);
      }

      // Verify password
      if (!user.password_hash || !user.password_salt) {
        return c.json({ error: 'Password not set' }, 401);
      }

      const valid = verifyPassword(password, user.password_hash, user.password_salt);
      if (!valid) {
        return c.json({ error: 'Invalid credentials' }, 401);
      }

      // Check status
      if (user.status !== 'active') {
        return c.json(
          {
            error: `Account status: ${user.status}`,
            status: user.status
          },
          403
        );
      }

      // Return user info (no password fields)
      return c.json({
        userId: user.id,
        username: user.username,
        displayName: user.display_name,
        role: user.role,
        kundeId: user.kunde_id
      });
    } catch (error) {
      console.error('Login error:', error);
      return c.json({ error: 'Login failed' }, 500);
    }
  });

  return app;
}
