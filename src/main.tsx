/**
 * @file        main.tsx
 * @description App-Entry fuer React
 * @version     0.2.0
 * @created     2026-01-06 19:14:38 CET
 * @updated     2026-01-08 02:18:00 CET
 * @author      Akki Scholze
 *
 * @changelog
 *   0.2.0 - 2026-01-08 - AuthProvider wrapper hinzugefügt
 *   0.1.0 - 2026-01-06 - Initial scaffold
 */

import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { AuthProvider } from '@/context/AuthContext';
import { App } from './App';
import './index.css';

const rootElement = document.getElementById('root');

if (!rootElement) {
  throw new Error('Root element not found');
}

createRoot(rootElement).render(
  <StrictMode>
    <AuthProvider>
      <App />
    </AuthProvider>
  </StrictMode>
);
