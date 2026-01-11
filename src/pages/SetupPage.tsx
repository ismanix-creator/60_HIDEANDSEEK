/**
 * @file        SetupPage.tsx
 * @description Setup Page (Admin Bootstrap + Customer Signup)
 * @version     1.4.0
 * @created     2026-01-08 01:45:00 CET
 * @updated     2026-01-11 03:06:28 CET
 * @author      Akki Scholze
 *
 * @changelog
 *   1.4.0 - 2026-01-11 - Fixed: floating promises + type signatures
 *   1.3.0 - 2026-01-11 - P1: appConfig.client.apiUrl vollständig entfernt, api.fetch statt window.fetch
 *   1.1.0 - 2026-01-10 - Inline-Styles durch UI-Components ersetzt (Button, Input, Infobox)
 *   1.0.0 - 2026-01-08 - Initial setup page
 */

import { useState } from 'react';
import { appConfig } from '@/config';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Infobox } from '@/components/ui/Infobox';
import { useApi } from '@/hooks';

type BootstrapResponse = {
  userId: string;
  message?: string;
  error?: string;
};

type SignupResponse = {
  userId: string;
  status?: string;
  message?: string;
  error?: string;
};

export function SetupPage() {
  const api = useApi();
  const [mode, setMode] = useState<'bootstrap' | 'signup'>('bootstrap');
  const [form, setForm] = useState({ username: '', displayName: '', password: '' });
  const [status, setStatus] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const [loading, setLoading] = useState(false);

  const handleBootstrap = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault();
    setLoading(true);
    setStatus(null);

    try {
      const result = await api.fetch<BootstrapResponse>('/api/auth/bootstrap-admin', {
        method: 'POST',
        body: JSON.stringify(form)
      });

      if (!result.success || !result.data) {
        throw new Error(result.error || 'Bootstrap failed');
      }

      setStatus({ type: 'success', message: 'Admin bootstrap successful! You can now login.' });
      setForm({ username: '', displayName: '', password: '' });
    } catch (error: unknown) {
      const err = error as any;
      setStatus({ type: 'error', message: err.message });
    } finally {
      setLoading(false);
    }
  };

  const handleSignup = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault();
    setLoading(true);
    setStatus(null);

    try {
      const result = await api.fetch<SignupResponse>('/api/auth/signup', {
        method: 'POST',
        body: JSON.stringify(form)
      });

      if (!result.success || !result.data) {
        throw new Error(result.error || 'Signup failed');
      }

      setStatus({
        type: 'success',
        message: `Signup successful! Status: ${result.data.status}. Waiting for admin approval.`
      });
      setForm({ username: '', displayName: '', password: '' });
    } catch (error: unknown) {
      const err = error as any;
      setStatus({ type: 'error', message: err.message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        padding: appConfig.spacing.xxl,
        maxWidth: '600px',
        margin: '0 auto'
      }}
    >
      <h1>Setup</h1>

      <div
        style={{
          marginBottom: appConfig.spacing.xxl,
          display: 'flex',
          gap: appConfig.spacing.md
        }}
      >
        <Button kind="rect" onClick={() => setMode('bootstrap')}>
          Admin Bootstrap
        </Button>
        <Button kind="rect" onClick={() => setMode('signup')}>
          Customer Signup
        </Button>
      </div>

      {mode === 'bootstrap' && (
        <div>
          <h2>Admin Bootstrap</h2>
          <p>First-run admin setup. Only available if admin account is in bootstrap status.</p>
          <form onSubmit={handleBootstrap}>
            <div style={{ marginBottom: appConfig.spacing.lg }}>
              <Input
                type="text"
                label="Username"
                value={form.username}
                onChange={(e) => setForm({ ...form, username: e.target.value })}
                required
              />
            </div>
            <div style={{ marginBottom: appConfig.spacing.lg }}>
              <Input
                type="text"
                label="Display Name"
                value={form.displayName}
                onChange={(e) => setForm({ ...form, displayName: e.target.value })}
                required
              />
            </div>
            <div style={{ marginBottom: appConfig.spacing.lg }}>
              <Input
                type="password"
                label="Password"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                required
              />
            </div>
            <Button type="submit" disabled={loading} kind="rect">
              {loading ? 'Processing...' : 'Bootstrap Admin'}
            </Button>
          </form>
        </div>
      )}

      {mode === 'signup' && (
        <div>
          <h2>Customer Signup</h2>
          <p>Register as a customer. Your account will be pending until admin approves.</p>
          <form onSubmit={handleSignup}>
            <div style={{ marginBottom: appConfig.spacing.lg }}>
              <Input
                type="text"
                label="Username"
                value={form.username}
                onChange={(e) => setForm({ ...form, username: e.target.value })}
                required
              />
            </div>
            <div style={{ marginBottom: appConfig.spacing.lg }}>
              <Input
                type="text"
                label="Display Name"
                value={form.displayName}
                onChange={(e) => setForm({ ...form, displayName: e.target.value })}
                required
              />
            </div>
            <div style={{ marginBottom: appConfig.spacing.lg }}>
              <Input
                type="password"
                label="Password"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                required
              />
            </div>
            <Button type="submit" disabled={loading} kind="rect">
              {loading ? 'Processing...' : 'Sign Up'}
            </Button>
          </form>
        </div>
      )}

      {status && (
        <div style={{ marginTop: appConfig.spacing.xxl }}>
          <Infobox variant={status.type === 'success' ? 'success' : 'error'}>{status.message}</Infobox>
        </div>
      )}
    </div>
  );
}
