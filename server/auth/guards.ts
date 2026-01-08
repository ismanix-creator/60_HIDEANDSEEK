/**
 * @file        guards.ts
 * @description Auth guards and access control (respects auth.enabled flag)
 * @version     1.0.0
 * @created     2026-01-08 01:10:00 CET
 * @updated     2026-01-08 01:10:00 CET
 * @author      Akki Scholze
 *
 * @changelog
 *   1.0.0 - 2026-01-08 - Initial guards with conditional enforcement
 */

import type { Context, Next } from 'hono';
import type { Database } from 'better-sqlite3';
import { appConfig } from '../../src/config/index.js';

export interface User {
  id: string;
  username: string;
  display_name: string;
  role: 'admin' | 'user';
  status: 'bootstrap' | 'pending' | 'active' | 'disabled';
  kunde_id: number | null;
}

/**
 * Get auth config from SoT (safe default for tests)
 */
export function getAuthConfig() {
  try {
    // Check if appConfig is defined and has auth property
    if (appConfig && appConfig.auth) {
      return appConfig.auth;
    }
    // Fallback for tests
    return { enabled: false, mode: 'password_required' as const, admin_bootstrap_user_id: 'admin' };
  } catch {
    // Fallback for tests without config.toml
    return { enabled: false, mode: 'password_required' as const, admin_bootstrap_user_id: 'admin' };
  }
}

/**
 * Middleware: Maybe require user (based on auth.enabled)
 * If auth.enabled=false: pass through without check
 * If auth.enabled=true: enforce x-user-id header and load user
 */
export function maybeRequireUser(db: Database) {
  return async (c: Context, next: Next) => {
    const authConfig = getAuthConfig();

    // If auth disabled: pass through (dev mode or tests)
    if (!authConfig.enabled) {
      return next();
    }

    // Auth enabled: require user
    const userId = c.req.header('x-user-id');
    if (!userId) {
      return c.json({ error: 'Unauthorized: x-user-id header required' }, 401);
    }

    // Load user from DB
    const stmt = db.prepare('SELECT * FROM users WHERE id = ? AND status = ?');
    const user = stmt.get(userId, 'active') as User | undefined;

    if (!user) {
      return c.json({ error: 'Unauthorized: invalid or inactive user' }, 401);
    }

    // Store user in context
    c.set('user', user);
    return next();
  };
}

/**
 * Assert kunde access (for user role)
 * Admin can access all, user can only access their assigned kunde_id
 */
export function assertKundeAccess(user: User | undefined, kundeId: number): void {
  if (!user) {
    throw new Error('Forbidden: no user context');
  }

  if (user.role === 'admin') {
    return; // Admin can access all
  }

  if (user.kunde_id !== kundeId) {
    throw new Error(`Forbidden: user can only access kunde_id=${user.kunde_id}`);
  }
}

/**
 * Require admin role
 */
export function requireAdmin(c: Context): User {
  const user = c.get('user') as User | undefined;
  if (!user || user.role !== 'admin') {
    throw new Error('Forbidden: admin role required');
  }
  return user;
}
