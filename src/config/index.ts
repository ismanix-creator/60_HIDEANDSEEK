/**
 * @file        index.ts
 * @description Single Import Point für alle Config Consumers
 * @version     1.0.1
 * @created     2026-01-07 19:45:00 CET
 * @updated     2026-01-08 00:22:00 CET
 * @author      Akki Scholze
 *
 * @changelog
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
export { colorsConfig } from './theme/colors.config.js';
export { typographyConfig } from './theme/typography.config.js';
export { spacingConfig } from './theme/spacing.config.js';
export { iconsConfig } from './theme/icons.config.js';
export { breakpointsConfig } from './theme/breakpoints.config.js';
export { borderRadiusConfig } from './theme/borderRadius.config.js';
export { shadowsConfig } from './theme/shadows.config.js';

/**
 * Export component views (derived tokens)
 */
export { badgeConfig } from './components/badge.config.js';
export { buttonConfig } from './components/button.config.js';
export { dialogConfig } from './components/dialog.config.js';
export { dividerConfig } from './components/divider.config.js';
export { infoboxConfig } from './components/infobox.config.js';
export { inputConfig } from './components/input.config.js';
export { tableConfig } from './components/table.config.js';

/**
 * Export navigation config
 */
export { navigationConfig } from './navigation.config.js';
