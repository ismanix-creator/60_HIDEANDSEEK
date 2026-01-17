/**
 * @file        postcss.config.js
 * @description PostCSS-Konfiguration mit Tailwind
 * @version     0.2.0
 * @created     2026-01-06 19:14:38 CET
 * @updated     2026-01-17T20:29:00+01:00
 * @author      Akki Scholze
 *
 * @changelog
 *   0.2.0 - 2026-01-17 - Fix: Tailwind v3 Plugins (tailwindcss + autoprefixer)
 *   0.1.0 - 2026-01-06 - Initial scaffold
 */

export default {
  plugins: {
    tailwindcss: {},
    autoprefixer: {}
  }
};
