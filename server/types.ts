/**
 * @file        types.ts
 * @description Shared server types
 * @version     0.2.0
 * @created     2026-01-06 22:20:42 CET
 * @updated     2026-01-08 01:40:00 CET
 * @author      Akki Scholze
 *
 * @changelog
 *   0.2.0 - 2026-01-08 - Added user to context variables
 *   0.1.0 - 2026-01-06 - Initial scaffold
 */

import type Database from 'better-sqlite3';
import type { User } from './auth/guards.js';

export type AppEnv = {
  Variables: {
    db: Database.Database;
    requestId: string;
    user?: User;
  };
};
