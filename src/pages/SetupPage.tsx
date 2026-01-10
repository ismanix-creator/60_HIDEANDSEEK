/**
 * @file        SetupPage.tsx
 * @description Setup Page (Admin Bootstrap + Customer Signup)
 * @version     1.1.0
 * @created     2026-01-08 01:45:00 CET
 * @updated     2026-01-10 10:15:32 CET
 * @author      Akki Scholze
 *
 * @changelog
 *   1.1.0 - 2026-01-10 - Inline-Styles durch UI-Components ersetzt (Button, Input, Infobox)
 *   1.0.0 - 2026-01-08 - Initial setup page
 */

import { useState } from 'react';
import { appConfig } from '@/config';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Infobox } from '@/components/ui/Infobox';

export function SetupPage() {
  const [mode, setMode] = useState<'bootstrap' | 'signup'>('bootstrap');
  const [form, setForm] = useState({ username: '', displayName: '', password: '' });
  const [status, setStatus] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const [loading, setLoading] = useState(false);

  const handleBootstrap = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setStatus(null);

    try {
      const res = await fetch(`${appConfig.client.apiUrl}/api/auth/bootstrap-admin`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Bootstrap failed');
      }

      setStatus({ type: 'success', message: 'Admin bootstrap successful! You can now login.' });
      setForm({ username: '', displayName: '', password: '' });
    } catch (error: any) {
      setStatus({ type: 'error', message: error.message });
    } finally {
      setLoading(false);
    }
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setStatus(null);

    try {
      const res = await fetch(`${appConfig.client.apiUrl}/api/auth/signup`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Signup failed');
      }

      setStatus({
        type: 'success',
        message: `Signup successful! Status: ${data.status}. Waiting for admin approval.`
      });
      setForm({ username: '', displayName: '', password: '' });
    } catch (error: any) {
      setStatus({ type: 'error', message: error.message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        padding: appConfig.theme.spacing.xxl,
        maxWidth: '600px',
        margin: '0 auto'
      }}
    >
      <h1>Setup</h1>

      <div
        style={{
          marginBottom: appConfig.theme.spacing.xxl,
          display: 'flex',
          gap: appConfig.theme.spacing.md
        }}
      >
        <Button
          variant={mode === 'bootstrap' ? 'primary' : 'secondary'}
          onClick={() => setMode('bootstrap')}
        >
          Admin Bootstrap
        </Button>
        <Button
          variant={mode === 'signup' ? 'primary' : 'secondary'}
          onClick={() => setMode('signup')}
        >
          Customer Signup
        </Button>
      </div>

      {mode === 'bootstrap' && (
        <div>
          <h2>Admin Bootstrap</h2>
          <p>First-run admin setup. Only available if admin account is in bootstrap status.</p>
          <form onSubmit={handleBootstrap}>
            <div style={{ marginBottom: appConfig.theme.spacing.lg }}>
              <Input
                type="text"
                label="Username"
                value={form.username}
                onChange={(e) => setForm({ ...form, username: e.target.value })}
                required
              />
            </div>
            <div style={{ marginBottom: appConfig.theme.spacing.lg }}>
              <Input
                type="text"
                label="Display Name"
                value={form.displayName}
                onChange={(e) => setForm({ ...form, displayName: e.target.value })}
                required
              />
            </div>
            <div style={{ marginBottom: appConfig.theme.spacing.lg }}>
              <Input
                type="password"
                label="Password"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                required
              />
            </div>
            <Button type="submit" disabled={loading} variant="primary">
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
            <div style={{ marginBottom: appConfig.theme.spacing.lg }}>
              <Input
                type="text"
                label="Username"
                value={form.username}
                onChange={(e) => setForm({ ...form, username: e.target.value })}
                required
              />
            </div>
            <div style={{ marginBottom: appConfig.theme.spacing.lg }}>
              <Input
                type="text"
                label="Display Name"
                value={form.displayName}
                onChange={(e) => setForm({ ...form, displayName: e.target.value })}
                required
              />
            </div>
            <div style={{ marginBottom: appConfig.theme.spacing.lg }}>
              <Input
                type="password"
                label="Password"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                required
              />
            </div>
            <Button type="submit" disabled={loading} variant="success">
              {loading ? 'Processing...' : 'Sign Up'}
            </Button>
          </form>
        </div>
      )}

      {status && (
        <div style={{ marginTop: appConfig.theme.spacing.xxl }}>
          <Infobox variant={status.type === 'success' ? 'success' : 'error'}>
            {status.message}
          </Infobox>
        </div>
      )}
    </div>
  );
}
