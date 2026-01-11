/**
 * @file        guards.ts
 * @description Auth guards and access control (respects auth.enabled flag)
 * @version     1.1.1
 * @created     2026-01-08 01:10:00 CET
 * @updated     2026-01-11 15:30:00 CET
 * @author      Akki Scholze
 *
 * @changelog
 *   1.1.1 - 2026-01-11 - Confirmed backendConfig import (no src/config), lint clean
 *   1.1.0 - 2026-01-11 - Removed src/config import (use backendConfig), strict backend/frontend separation
 *   1.0.1 - 2026-01-11 - P2: getAuthConfig fail-fast + test-only fallback (strict Config SoT)
 *   1.0.0 - 2026-01-08 - Initial guards with conditional enforcement
 */

/* eslint-disable no-undef */

import type { Context, Next } from 'hono';
import type { Database } from 'better-sqlite3';
import { backendConfig } from '../config/app.config.js';

export interface User {
  id: string;
  username: string;
  display_name: string;
  role: 'admin' | 'user';
  status: 'bootstrap' | 'pending' | 'active' | 'disabled';
  kunde_id: number | null;
}

/**
 * Get auth config from SoT (backendConfig.auth)
 * Fail-fast in runtime. Test-only fallback only if NODE_ENV === 'test'
 */
export function getAuthConfig() {
  if (!backendConfig || !backendConfig.auth) {
    // Test-only fallback: allow in test env only
    if (process.env.NODE_ENV === 'test') {
      return { enabled: false, mode: 'password_required' as const, admin_bootstrap_user_id: 'admin' };
    }
    // Runtime: fail-fast on config error
    throw new Error('[Config Error] backendConfig.auth is missing. Check config.toml and server/config/app.config.ts');
  }
  return backendConfig.auth;
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
