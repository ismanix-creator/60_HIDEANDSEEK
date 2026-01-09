/**
 * @file        env-from-keepass.ts
 * @description Erzeugt .env aus KeePassXC Custom Attributes (Global + Projekt), gefiltert via .env.example
 * @version     0.3.0
 * @created     2026-01-08 17:25:00 CET
 * @updated     2026-01-08 16:30:00 CET
 * @author      Akki Scholze
 *
 * @changelog
 *   0.3.0 - 2026-01-08 - Keyfile-only unlock (kein Master-Password), OPTIONAL-Section Support
 *   0.2.0 - 2026-01-08 - Parsing via keepassxc-cli show --all (KEY: VALUE Zeilen), Missing-Key Fail
 *   0.1.0 - 2026-01-08 - Initiale Implementierung (Global -> Projekt Override, Whitelist aus .env.example)
 */

import { readFileSync, writeFileSync, renameSync, existsSync } from 'node:fs';
import { resolve, join } from 'node:path';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = resolve(__filename, '..');

const PROJECT_ROOT = resolve(__dirname, '..');
const ENV_EXAMPLE_PATH = join(PROJECT_ROOT, '.env.example');
const ENV_TMP_PATH = join(PROJECT_ROOT, '.env.tmp');
const ENV_PATH = join(PROJECT_ROOT, '.env');

const KEEPASS_DB = '/home/akki/vault/secrets/Secrets.kdbx';
const KEEPASS_KEYFILE = '/home/akki/vault/secrets/Secrets.keyx';
const GLOBAL_ENTRY_PATH = '02_Global/.env';
const PROJECT_ENTRY_PATH = '03_Projects/.env';

type AttrMap = Record<string, string>;

const STD_FIELDS = new Set(['title', 'username', 'password', 'url', 'notes', 'uuid', 'tags']);

function fail(message: string): never {
  console.error(`[env-from-keepass] ERROR: ${message}`);
  process.exit(1);
}

function runKeepass(args: string[], purpose: string): string {
  if (!existsSync(KEEPASS_KEYFILE)) {
    fail(`Keyfile not found: ${KEEPASS_KEYFILE}`);
  }
  const result = spawnSync('keepassxc-cli', args, {
    encoding: 'utf-8',
    stdio: ['ignore', 'pipe', 'inherit']
  });
  if (result.error) {
    fail(`${purpose} failed: ${result.error.message}`);
  }
  if (result.status !== 0) {
    fail(`${purpose} failed with code ${result.status}`);
  }
  return result.stdout;
}

function parseKeyValueLines(output: string): AttrMap {
  const map: AttrMap = {};
  output
    .split('\n')
    .map((l) => l.trim())
    .filter(Boolean)
    .forEach((line) => {
      const match = line.match(/^([A-Z0-9_]+):\s*(.*)$/);
      if (!match) return;
      const key = match[1].trim();
      const keyLower = key.toLowerCase();
      if (STD_FIELDS.has(keyLower)) return;
      const value = match[2] ?? '';
      map[key] = value;
    });
  return map;
}

function readEntryAttributes(entryPath: string, expectedUsername: string): AttrMap {
  const out = runKeepass(['show', '--no-password', '--key-file', KEEPASS_KEYFILE, '--all', '-s', KEEPASS_DB, entryPath], `read entry ${entryPath}`);

  const userLine = out
    .split('\n')
    .map((l) => l.trim())
    .find((l) => l.toLowerCase().startsWith('username:'));
  const username = userLine ? userLine.split(':').slice(1).join(':').trim() : '';
  if (username !== expectedUsername) {
    fail(`Entry ${entryPath} username mismatch (found "${username}", expected "${expectedUsername}")`);
  }

  const attrs = parseKeyValueLines(out);
  return attrs;
}

interface KeySpec {
  required: string[];
  optional: string[];
}

function readAllowedKeys(examplePath: string): KeySpec {
  if (!existsSync(examplePath)) {
    fail(`.env.example not found at ${examplePath}`);
  }
  const content = readFileSync(examplePath, 'utf-8');
  const lines = content.split('\n').map((line) => line.trim());
  
  const required: string[] = [];
  const optional: string[] = [];
  let inOptionalSection = false;

  for (const line of lines) {
    if (line.startsWith('# OPTIONAL')) {
      inOptionalSection = true;
      continue;
    }
    if (!line || line.startsWith('#') || !line.includes('=')) continue;
    
    const key = line.replace(/=.*/, '').trim();
    if (!key) continue;
    
    if (inOptionalSection) {
      optional.push(key);
    } else {
      required.push(key);
    }
  }

  if (required.length === 0 && optional.length === 0) {
    fail('Whitelist from .env.example is empty');
  }
  return { required, optional };
}

function formatValue(value: string): string {
  if (value.includes(' ') || value.includes('#')) {
    const escaped = value.replace(/\\/g, '\\\\').replace(/"/g, '\\"');
    return `"${escaped}"`;
  }
  return value;
}

function main() {
  console.log('[env-from-keepass] Starting…');

  const keySpec = readAllowedKeys(ENV_EXAMPLE_PATH);
  const allKeys = [...keySpec.required, ...keySpec.optional];

  const globalAttrs = readEntryAttributes(GLOBAL_ENTRY_PATH, 'Global');
  console.log(`[env-from-keepass] Loaded ${Object.keys(globalAttrs).length} keys from global`);

  const projectAttrs = readEntryAttributes(PROJECT_ENTRY_PATH, '60_HIDEANDSEEK');
  console.log(`[env-from-keepass] Loaded ${Object.keys(projectAttrs).length} keys from project`);

  const merged: AttrMap = { ...globalAttrs, ...projectAttrs };

  const missingRequired: string[] = [];
  const missingOptional: string[] = [];
  const lines: string[] = [];
  
  for (const key of allKeys) {
    const val = merged[key];
    if (typeof val === 'undefined') {
      if (keySpec.required.includes(key)) {
        missingRequired.push(key);
      } else {
        missingOptional.push(key);
      }
      lines.push(`${key}=`);
    } else {
      lines.push(`${key}=${formatValue(val)}`);
    }
  }

  if (missingOptional.length > 0) {
    console.warn(`[env-from-keepass] WARNING: Missing optional keys: ${missingOptional.join(', ')}`);
  }

  if (missingRequired.length > 0) {
    fail(`Missing required keys in KeePass data: ${missingRequired.join(', ')}`);
  }

  writeFileSync(ENV_TMP_PATH, lines.join('\n') + '\n', { encoding: 'utf-8', mode: 0o600 });
  renameSync(ENV_TMP_PATH, ENV_PATH);
  console.log(`[env-from-keepass] Wrote .env with ${lines.length} keys`);
}

main();
