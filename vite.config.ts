/**
 * @file        vite.config.ts
 * @description Vite-Konfiguration (Ports/Hosts via ENV; config.toml bleibt SoT für App-Config)
 * @version     0.4.1
 * @created     2026-01-06 19:14:38 CET
 * @updated     2026-01-08 18:15:00 CET
 * @author      Akki Scholze
 *
 * @changelog
 *   0.4.1 - 2026-01-08 - ENV ist Pflicht (keine Hardcoded Ports/Hosts)
 *   0.4.0 - 2026-01-08 - Global ENV loading via src/config/env.ts (HIDEANDSEEK_* mapping)
 *   0.3.0 - 2026-01-08 - Robustere ENV-Port/Host Auswertung + optional sourcemap toggle
 *   0.2.0 - 2026-01-07 - strictPort: true hinzugefuegt (Port 5173 MUSS frei sein)
 *   0.1.0 - 2026-01-06 - Initial scaffold
 */

import './src/config/env';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'node:path';

function requireNumber(name: string): number {
  const n = Number(process.env[name]);
  if (!Number.isFinite(n)) {
    throw new Error(`Missing numeric ENV ${name}`);
  }
  return n;
}

function requireString(name: string): string {
  const v = process.env[name];
  if (!v) {
    throw new Error(`Missing ENV ${name}`);
  }
  return v;
}

function parseCsvStrict(name: string): string[] {
  const raw = requireString(name);
  return raw
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean);
}

const backendHost = requireString('BACKEND_HOST');
const backendPort = requireNumber('BACKEND_PORT');

const frontendPort = requireNumber('FRONTEND_PORT');
const allowedHosts = parseCsvStrict('VITE_ALLOWED_HOSTS');

const enableSourcemap = process.env.VITE_SOURCEMAP === 'true' || process.env.NODE_ENV !== 'production';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src')
    }
  },
  server: {
    port: frontendPort,
    strictPort: true,
    host: true,
    allowedHosts,
    watch: {
      ignored: ['**/.pnpm-store/**', '**/.git/**']
    },
    proxy: {
      '/api': {
        target: `http://${backendHost}:${backendPort}`,
        changeOrigin: true
      }
    }
  },
  build: {
    outDir: 'dist',
    sourcemap: enableSourcemap
  }
});
