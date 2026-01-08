/**
 * @file        request-logger.ts
 * @description Request-Logging mit Correlation ID
 * @version     0.1.0
 * @created     2026-01-06 22:20:42 CET
 * @updated     2026-01-06 22:20:42 CET
 * @author      agenten-koordinator
 *
 * @changelog
 *   0.1.0 - 2026-01-06 - Initial scaffold
 */

import { createMiddleware } from 'hono/factory';
import { randomUUID } from 'crypto';
import type { AppEnv } from '../types.js';

export const requestLogger = createMiddleware<AppEnv>(async (c, next) => {
  const requestId = randomUUID();
  c.set('requestId', requestId);
  c.header('X-Request-Id', requestId);

  const start = Date.now();
  await next();
  const durationMs = Date.now() - start;

  console.info(
    {
      requestId,
      method: c.req.method,
      path: c.req.path,
      status: c.res.status,
      durationMs
    },
    'request'
  );
});
