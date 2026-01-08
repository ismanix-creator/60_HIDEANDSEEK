/**
 * @file        generate-config-reference.cjs
 * @description Generiert eine Config-Referenz aus config.toml
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
const outputPath = path.resolve(__dirname, '..', 'docs', 'plan', 'config-reference-autogen.json');

const raw = fs.readFileSync(configPath, 'utf-8');
const parsed = toml.parse(raw);

const payload = {
  _meta: {
    version: '0.1.0',
    created: '2026-01-06 19:14:38 CET',
    updated: '2026-01-06 19:14:38 CET',
    changelog: ['0.1.0 - 2026-01-06 - Initial generation']
  },
  config: parsed
};

fs.mkdirSync(path.dirname(outputPath), { recursive: true });
fs.writeFileSync(outputPath, JSON.stringify(payload, null, 2), 'utf-8');
console.log(`Generated: ${outputPath}`);
