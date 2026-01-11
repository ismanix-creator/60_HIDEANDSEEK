/**
 * @file        App.tsx
 * @description Root-Komponente mit React Router und Navigation
 * @version     0.4.0
 * @created     2026-01-06 19:14:38 CET
 * @updated     2026-01-08 01:55:00 CET
 * @author      Akki Scholze
 *
 * @changelog
 *   0.4.0 - 2026-01-08 - Setup und Login Pages hinzugefügt
 *   0.3.0 - 2026-01-07 - Navigation-Komponente integriert
 *   0.2.0 - 2026-01-07 - React Router Integration mit allen Pages
 *   0.1.0 - 2026-01-06 - Initial scaffold
 */

import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { MaterialPage, KundenPage, GlaeubigerPage, SchuldnerPage, SettingsPage } from '@/pages';
import { SetupPage } from '@/pages/SetupPage';
import { LoginPage } from '@/pages/LoginPage';

export function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/material" replace />} />
        <Route path="/material" element={<MaterialPage />} />
        <Route path="/kunden" element={<KundenPage />} />
        <Route path="/glaeubiger" element={<GlaeubigerPage />} />
        <Route path="/schuldner" element={<SchuldnerPage />} />
        <Route path="/settings" element={<SettingsPage />} />
        <Route path="/setup" element={<SetupPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="*" element={<Navigate to="/material" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
