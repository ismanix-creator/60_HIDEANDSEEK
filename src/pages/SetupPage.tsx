/**
 * @file        SetupPage.tsx
 * @description Setup Page (Admin Bootstrap + Customer Signup)
 * @version     1.0.0
 * @created     2026-01-08 01:45:00 CET
 * @updated     2026-01-08 01:45:00 CET
 * @author      Akki Scholze
 *
 * @changelog
 *   1.0.0 - 2026-01-08 - Initial setup page
 */

import { useState } from 'react';
import { appConfig } from '@/config';

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
    <div style={{ padding: '2rem', maxWidth: '600px', margin: '0 auto' }}>
      <h1>Setup</h1>

      <div style={{ marginBottom: '2rem', display: 'flex', gap: '1rem' }}>
        <button
          onClick={() => setMode('bootstrap')}
          style={{
            padding: '0.5rem 1rem',
            background: mode === 'bootstrap' ? '#2196f3' : '#3d3d3d',
            color: '#fff',
            border: 'none',
            cursor: 'pointer'
          }}
        >
          Admin Bootstrap
        </button>
        <button
          onClick={() => setMode('signup')}
          style={{
            padding: '0.5rem 1rem',
            background: mode === 'signup' ? '#2196f3' : '#3d3d3d',
            color: '#fff',
            border: 'none',
            cursor: 'pointer'
          }}
        >
          Customer Signup
        </button>
      </div>

      {mode === 'bootstrap' && (
        <div>
          <h2>Admin Bootstrap</h2>
          <p>First-run admin setup. Only available if admin account is in bootstrap status.</p>
          <form onSubmit={handleBootstrap}>
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
            <div style={{ marginBottom: '1rem' }}>
              <label style={{ display: 'block', marginBottom: '0.5rem' }}>Display Name</label>
              <input
                type="text"
                value={form.displayName}
                onChange={(e) => setForm({ ...form, displayName: e.target.value })}
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
            <div style={{ marginBottom: '1rem' }}>
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
                padding: '0.75rem 1.5rem',
                background: '#2196f3',
                color: '#fff',
                border: 'none',
                cursor: loading ? 'not-allowed' : 'pointer'
              }}
            >
              {loading ? 'Processing...' : 'Bootstrap Admin'}
            </button>
          </form>
        </div>
      )}

      {mode === 'signup' && (
        <div>
          <h2>Customer Signup</h2>
          <p>Register as a customer. Your account will be pending until admin approves.</p>
          <form onSubmit={handleSignup}>
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
            <div style={{ marginBottom: '1rem' }}>
              <label style={{ display: 'block', marginBottom: '0.5rem' }}>Display Name</label>
              <input
                type="text"
                value={form.displayName}
                onChange={(e) => setForm({ ...form, displayName: e.target.value })}
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
            <div style={{ marginBottom: '1rem' }}>
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
                padding: '0.75rem 1.5rem',
                background: '#27ae60',
                color: '#fff',
                border: 'none',
                cursor: loading ? 'not-allowed' : 'pointer'
              }}
            >
              {loading ? 'Processing...' : 'Sign Up'}
            </button>
          </form>
        </div>
      )}

      {status && (
        <div
          style={{
            marginTop: '2rem',
            padding: '1rem',
            background: status.type === 'success' ? '#27ae60' : '#e74c3c',
            color: '#fff',
            borderRadius: '4px'
          }}
        >
          {status.message}
        </div>
      )}
    </div>
  );
}
