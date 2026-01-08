/**
 * @file        generate-config-from-toml.cjs
 * @description Generiert config-from-toml.ts aus config.toml
 * @version     0.1.0
 * @created     2026-01-06 19:14:38 CET
 * @updated     2026-01-06 19:14:38 CET
 * @author      Akki Scholze
 *
 * @changelog
 *   0.1.0 - 2026-01-06 - Initial scaffold
 */

const fs = require('fs');
const path = require('path');
const toml = require('toml');

const configPath = path.resolve(__dirname, '..', 'config.toml');
const outputPath = path.resolve(__dirname, '..', 'src', 'config', 'generated', 'config-from-toml.ts');

const raw = fs.readFileSync(configPath, 'utf-8');
const parsed = toml.parse(raw);

const header = `/**\n * @file        config-from-toml.ts\n * @description Generated config from config.toml (do not edit)\n * @version     0.1.0\n * @created     2026-01-06 19:14:38 CET\n * @updated     2026-01-06 19:14:38 CET\n * @author      Akki Scholze

const body = `export const configFromToml = ${JSON.stringify(parsed, null, 2)} as const;\n`;

fs.mkdirSync(path.dirname(outputPath), { recursive: true });
fs.writeFileSync(outputPath, header + body, 'utf-8');
console.log(`Generated: ${outputPath}`);
