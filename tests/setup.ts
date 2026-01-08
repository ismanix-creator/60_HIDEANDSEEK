/**
 * @file        tests/setup.ts
 * @description Vitest Setup für Tests
 * @version     1.0.0
 * @created     2026-01-08 16:00:00 CET
 * @updated     2026-01-08 16:00:00 CET
 * @author      agenten-koordinator
 *
 * @changelog
 *   1.0.0 - 2026-01-08 - Vitest Setup erstellt
 */

import { expect, afterEach } from 'vitest';
import { cleanup } from '@testing-library/react';
import * as matchers from '@testing-library/jest-dom/matchers';

// Extend Vitest's expect with jest-dom matchers
expect.extend(matchers);

// Cleanup after each test
afterEach(() => {
  cleanup();
});
