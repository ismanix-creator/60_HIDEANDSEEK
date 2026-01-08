/**
 * @file        errors.ts
 * @description Standardisiertes Fehlermodell fuer API
 * @version     0.1.0
 * @created     2026-01-06 22:20:42 CET
 * @updated     2026-01-06 22:20:42 CET
 * @author      Akki Scholze
 *
 * @changelog
 *   0.1.0 - 2026-01-06 - Initial scaffold
 */

import type { ZodError } from 'zod';

export class AppError extends Error {
  public statusCode: number;
  public code: string;
  public details?: unknown;

  constructor(message: string, code: string, statusCode: number, details?: unknown) {
    super(message);
    this.code = code;
    this.statusCode = statusCode;
    this.details = details;
  }
}

export function badRequest(message: string, details?: unknown) {
  return new AppError(message, 'VALIDATION_ERROR', 400, details);
}

export function notFound(message: string) {
  return new AppError(message, 'NOT_FOUND', 404);
}

export function conflict(message: string) {
  return new AppError(message, 'CONFLICT', 409);
}

export function fromZodError(error: ZodError) {
  return badRequest('Validation failed', error.flatten());
}

export function toErrorResponse(error: unknown) {
  if (error instanceof AppError) {
    return {
      status: error.statusCode,
      body: {
        success: false,
        error: error.message,
        code: error.code,
        issues: error.details ?? null
      }
    };
  }

  return {
    status: 500,
    body: {
      success: false,
      error: 'Internal server error',
      code: 'INTERNAL_ERROR',
      issues: null
    }
  };
}
