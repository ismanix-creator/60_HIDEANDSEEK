/**
 * @file        LoginPage.tsx
 * @description Login Page (prepared but not enforced by default)
 * @version     1.3.0
 * @created     2026-01-08 01:50:00 CET
 * @updated     2026-01-11 03:06:28 CET
 * @author      Akki Scholze
 *
 * @changelog
 *   1.3.0 - 2026-01-11 - Fixed: floating promises + type signatures
 *   1.2.0 - 2026-01-11 - useApi integriert und appConfig.client.apiUrl entfernt
 *   1.0.0 - 2026-01-08 - Initial login page
 */

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { appConfig } from '@/config';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { useApi } from '@/hooks';

type LoginResponse = {
  userId: string;
  username: string;
  displayName?: string;
  role: string;
  kundeId?: number | null;
  status?: string;
  message?: string;
  error?: string;
};

export function LoginPage() {
  const api = useApi();
  const [form, setForm] = useState({ username: '', password: '' });
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const result = await api.fetch<LoginResponse>('/api/auth/login', {
        method: 'POST',
        body: JSON.stringify(form)
      });

      if (!result.success || !result.data) {
        throw new Error(result.error || 'Login failed');
      }

      const { userId, username, displayName, role, kundeId } = result.data;

      localStorage.setItem('userId', String(userId));
      localStorage.setItem('username', username);
      if (displayName) {
        localStorage.setItem('displayName', displayName);
      }
      localStorage.setItem('role', role);
      if (typeof kundeId !== 'undefined' && kundeId !== null) {
        localStorage.setItem('kundeId', String(kundeId));
      }

      void navigate('/material');
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Login failed';
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        padding: appConfig.theme.spacing.layout.areaPadding,
        maxWidth: '400px',
        margin: `${appConfig.theme.spacing.layout.pagePadding} auto`
      }}
    >
      <h1>Login</h1>
      <p
        style={{
          color: appConfig.theme.colors.neutral['700'],
          marginBottom: appConfig.theme.spacing.layout.areaPadding
        }}
      >
        {appConfig.auth.enabled ? 'Login erforderlich' : 'Auth deaktiviert (dev mode)'}
      </p>

      <form onSubmit={(e) => void handleLogin(e)}>
        <div style={{ marginBottom: appConfig.theme.spacing.dialog.contentGap }}>
          <Input
            type="text"
            label="Username"
            value={form.username}
            onChange={(e) => setForm({ ...form, username: e.target.value })}
            required
          />
        </div>
        <div style={{ marginBottom: appConfig.theme.spacing.dialog.padding }}>
          <Input
            type="password"
            label="Password"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            required
          />
        </div>
        <Button type="submit" disabled={loading} fullWidth kind="rect">
          {loading ? 'Logging in...' : 'Login'}
        </Button>
      </form>

      {error && (
        <div
          style={{
            marginTop: appConfig.theme.spacing.dialog.padding,
            padding: appConfig.theme.spacing.dialog.contentGap,
            background: appConfig.theme.colors.red['500'],
            color: appConfig.theme.colors.white['50'],
            borderRadius: appConfig.theme.border.radius.md
          }}
        >
          {error}
        </div>
      )}

      <div
        style={{
          marginTop: appConfig.theme.spacing.layout.areaPadding,
          textAlign: 'center'
        }}
      >
        <a
          href="/setup"
          style={{
            color: appConfig.theme.colors.blue['500'],
            textDecoration: 'none'
          }}
        >
          Need an account? Go to Setup
        </a>
      </div>
    </div>
  );
}
