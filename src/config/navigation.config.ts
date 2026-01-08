/**
 * @file        navigation.config.ts
 * @description Navigation Configuration (derived from config.toml)
 * @version     1.0.0
 * @created     2026-01-07 01:18:02 CET
 * @updated     2026-01-08 02:20:00 CET
 * @author      agenten-koordinator
 *
 * @usage
 *   import { navigationConfig } from '@/config';
 *
 * @changelog
 *   1.0.0 - 2026-01-08 - Config-driven: lädt Items aus appConfig.navigation
 *   0.1.0 - 2026-01-07 - Initial version mit hardcoded Items
 */

import { appConfig } from './load.js';

/**
 * Navigation Config aus config.toml
 */
export const navigationConfig = {
  items: appConfig.navigation.items
} as const;
