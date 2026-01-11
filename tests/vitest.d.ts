/**
 * @file        tests/vitest.d.ts
 * @description Type definitions for Vitest with jest-dom matchers
 * @version     1.0.1
 * @created     2026-01-10 01:20:00 CET
 * @updated     2026-01-10 01:25:00 CET
 * @author      Akki Scholze (QA-Test-Entwickler)
 *
 * @changelog
 *   1.0.1 - 2026-01-10 - Fix: Remove jest import (nicht verfügbar)
 *   1.0.0 - 2026-01-10 - Initial type definitions
 */

import type { TestingLibraryMatchers } from '@testing-library/jest-dom/matchers';

declare module 'vitest' {
  // eslint-disable-next-line @typescript-eslint/no-empty-object-type
  interface Assertion<T = any> extends TestingLibraryMatchers<T, void> {}
}
