/**
 * @file        vite.config.ts
 * @description Vite-Konfiguration (Ports/Hosts via ENV; config.toml bleibt SoT für App-Config)
 * @version     0.4.0
 * @created     2026-01-06 19:14:38 CET
 * @updated     2026-01-08 02:45:00 CET
 * @author      agenten-koordinator
 *
 * @changelog
 *   0.4.0 - 2026-01-08 - Global ENV loading via src/config/env.ts (HIDEANDSEEK_* mapping)
 *   0.3.0 - 2026-01-08 - Robustere ENV-Port/Host Auswertung + optional sourcemap toggle
 *   0.2.0 - 2026-01-07 - strictPort: true hinzugefuegt (Port 5173 MUSS frei sein)
 *   0.1.0 - 2026-01-06 - Initial scaffold
 */

import './src/config/env';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'node:path';

function readPort(envValue: string | undefined, fallback: number): number {
  const n = Number(envValue);
  return Number.isFinite(n) ? n : fallback;
}

function readCsv(envValue: string | undefined, fallback: string[]): string[] {
  if (!envValue) return fallback;
  return envValue
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean);
}

const backendHost = process.env.BACKEND_HOST ?? 'localhost';
const backendPort = readPort(process.env.BACKEND_PORT, 3001);

const frontendPort = readPort(process.env.FRONTEND_PORT, 5173);
const allowedHosts = readCsv(process.env.VITE_ALLOWED_HOSTS, ['localhost', '.ngrok-free.dev']);

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
