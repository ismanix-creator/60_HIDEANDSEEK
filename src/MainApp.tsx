/**
 * @file        MainApp.tsx
 * @description Container-Orchestrator mit React Router
 * @version     0.1.0
 * @created     2026-01-17T02:28:23+01:00
 * @updated     2026-01-17T02:28:23+01:00
 * @author      Akki Scholze
 *
 * @changelog
 *   0.1.0 - 2026-01-17 - Container-Architektur Refactoring: MainApp als Router-Orchestrator
 */

import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Dashboard } from '@/components/layout/areas/dashboard';
import {
  MaterialPage,
  KundenPage,
  GlaeubigerPage,
  SchuldnerPage,
  SettingsPage,
  SetupPage,
  LoginPage
} from '@/pages';

export function MainApp() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/material" element={<MaterialPage />} />
        <Route path="/kunden" element={<KundenPage />} />
        <Route path="/glaeubiger" element={<GlaeubigerPage />} />
        <Route path="/schuldner" element={<SchuldnerPage />} />
        <Route path="/settings" element={<SettingsPage />} />
        <Route path="/setup" element={<SetupPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
