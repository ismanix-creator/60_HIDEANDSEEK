/**
 * @file        LoginPage.tsx
 * @description Login Page (prepared but not enforced by default)
 * @version     1.1.0
 * @created     2026-01-08 01:50:00 CET
 * @updated     2026-01-10 10:30:00 CET
 * @author      Akki Scholze
 *
 * @changelog
 *   1.1.0 - 2026-01-10 - Inline-Styles durch UI-Components (Button, Input) ersetzt
 *   1.0.0 - 2026-01-08 - Initial login page
 */

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { appConfig } from '@/config';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';

export function LoginPage() {
  const [form, setForm] = useState({ username: '', password: '' });
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await fetch(`${appConfig.client.apiUrl}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Login failed');
      }

      // Store user in localStorage
      localStorage.setItem('userId', data.userId);
      localStorage.setItem('username', data.username);
      localStorage.setItem('role', data.role);
      if (data.kundeId) {
        localStorage.setItem('kundeId', String(data.kundeId));
      }

      // Redirect to main app
      navigate('/material');
    } catch (error: any) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        padding: appConfig.theme.spacing.xl,
        maxWidth: '400px',
        margin: `${appConfig.theme.spacing.xxl} auto`
      }}
    >
      <h1>Login</h1>
      <p
        style={{
          color: appConfig.theme.colors.neutral['500'],
          marginBottom: appConfig.theme.spacing.xl
        }}
      >
        {appConfig.auth.enabled ? 'Login required' : 'Auth disabled (dev mode)'}
      </p>

      <form onSubmit={handleLogin}>
        <div style={{ marginBottom: appConfig.theme.spacing.md }}>
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
            type="password"
            label="Password"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            required
          />
        </div>
        <Button
          type="submit"
          disabled={loading}
          fullWidth
          variant="primary"
          size="btn"
        >
          {loading ? 'Logging in...' : 'Login'}
        </Button>
      </form>

      {error && (
        <div
          style={{
            marginTop: appConfig.theme.spacing.lg,
            padding: appConfig.theme.spacing.md,
            background: appConfig.theme.colors.status.error,
            color: appConfig.theme.colors.neutral['50'],
            borderRadius: appConfig.theme.borderRadius.md
          }}
        >
          {error}
        </div>
      )}

      <div
        style={{
          marginTop: appConfig.theme.spacing.xl,
          textAlign: 'center'
        }}
      >
        <a
          href="/setup"
          style={{
            color: appConfig.theme.colors.primary['500'],
            textDecoration: 'none'
          }}
        >
          Need an account? Go to Setup
        </a>
      </div>
    </div>
  );
}
