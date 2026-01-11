/**
 * @file        generate-config-from-toml.cjs
 * @description Generiert config-from-toml.ts aus config.toml
 * @version     0.2.0
 * @created     2026-01-06 19:14:38 CET
 * @updated     2026-01-11 14:35:00 CET
 * @author      Akki Scholze
 *
 * @changelog
 *   0.2.0 - 2026-01-11 14:35:00 CET - Updated header comments to reflect config.schema.ts 2.0.0 changes (removed nested objects)
 *   0.1.0 - 2026-01-06 - Initial scaffold
 */

const fs = require('fs');
const path = require('path');
const toml = require('toml');

const configPath = path.resolve(__dirname, '..', 'config.toml');
const outputPath = path.resolve(__dirname, '..', 'src', 'config', 'generated', 'config-from-toml.ts');

const raw = fs.readFileSync(configPath, 'utf-8');
const parsed = toml.parse(raw);

// Dynamische Zeitstempel
const now = new Date();
const timestamp = now.toISOString().replace('T', ' ').split('.')[0] + ' CET';

const header = `/**
 * @file        config-from-toml.ts
 * @description Generated config from config.toml (do not edit)
 * @version     2.5.0
 * @created     2026-01-06 19:14:38 CET
 * @updated     ${timestamp}
 * @author      Akki Scholze
 */\n\n`;

const body = `export const configFromToml = ${JSON.stringify(parsed, null, 2)} as const;\n`;

fs.mkdirSync(path.dirname(outputPath), { recursive: true });
fs.writeFileSync(outputPath, header + body, 'utf-8');
console.log(`Generated: ${outputPath}`);
