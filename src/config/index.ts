/**
 * @file        index.ts
 * @description Single Import Point für alle Config Consumers
 * @version     1.1.0
 * @created     2026-01-07 19:45:00 CET
 * @updated     2026-01-09 20:52:34 CET
 * @author      Akki Scholze
 *
 * @changelog
 *   1.1.0 - 2026-01-09 - Component-Config-Imports entfernt (Phase 2.2 Cleanup)
 *   1.0.1 - 2026-01-08 - Added .js extensions for Node ESM compatibility
 *   1.0.0 - 2026-01-07 - Single import point für validated config
 */

/**
 * Export validated config
 */
export { appConfig } from './load.js';
export type { AppConfig, AppConfigTheme, AppConfigComponents } from './schema/config.schema.js';

/**
 * Export theme views (derived tokens)
 */
export { spacingConfig } from './theme/spacing.config.js';
export { breakpointsConfig } from './theme/breakpoints.config.js';

/**
 * Export navigation config
 */
export { navigationConfig } from './navigation.config.js';
