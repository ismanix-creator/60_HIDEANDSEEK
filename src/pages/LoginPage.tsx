/**
 * @file        LoginPage.tsx
 * @description Login Page (prepared but not enforced by default)
 * @version     1.0.0
 * @created     2026-01-08 01:50:00 CET
 * @updated     2026-01-08 01:50:00 CET
 * @author      Akki Scholze
 *
 * @changelog
 *   1.0.0 - 2026-01-08 - Initial login page
 */

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { appConfig } from '@/config';

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
    <div style={{ padding: '2rem', maxWidth: '400px', margin: '5rem auto' }}>
      <h1>Login</h1>
      <p style={{ color: '#999', marginBottom: '2rem' }}>
        {appConfig.auth.enabled ? 'Login required' : 'Auth disabled (dev mode)'}
      </p>

      <form onSubmit={handleLogin}>
        <div style={{ marginBottom: '1rem' }}>
          <label style={{ display: 'block', marginBottom: '0.5rem' }}>Username</label>
          <input
            type="text"
            value={form.username}
            onChange={(e) => setForm({ ...form, username: e.target.value })}
            required
            style={{
              width: '100%',
              padding: '0.5rem',
              background: '#2d2d2d',
              color: '#fff',
              border: '1px solid #3d3d3d'
            }}
          />
        </div>
        <div style={{ marginBottom: '1.5rem' }}>
          <label style={{ display: 'block', marginBottom: '0.5rem' }}>Password</label>
          <input
            type="password"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            required
            style={{
              width: '100%',
              padding: '0.5rem',
              background: '#2d2d2d',
              color: '#fff',
              border: '1px solid #3d3d3d'
            }}
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          style={{
            width: '100%',
            padding: '0.75rem',
            background: '#2196f3',
            color: '#fff',
            border: 'none',
            cursor: loading ? 'not-allowed' : 'pointer',
            fontSize: '1rem'
          }}
        >
          {loading ? 'Logging in...' : 'Login'}
        </button>
      </form>

      {error && (
        <div
          style={{
            marginTop: '1.5rem',
            padding: '1rem',
            background: '#e74c3c',
            color: '#fff',
            borderRadius: '4px'
          }}
        >
          {error}
        </div>
      )}

      <div style={{ marginTop: '2rem', textAlign: 'center' }}>
        <a href="/setup" style={{ color: '#2196f3', textDecoration: 'none' }}>
          Need an account? Go to Setup
        </a>
      </div>
    </div>
  );
}
