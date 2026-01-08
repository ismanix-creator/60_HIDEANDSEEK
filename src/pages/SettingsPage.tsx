/**
 * @file        SettingsPage.tsx
 * @description Einstellungen Seite mit Admin User Management
 * @version     1.0.0
 * @created     2026-01-07 01:36:51 CET
 * @updated     2026-01-08 01:58:00 CET
 * @author      agenten-koordinator
 *
 * @changelog
 *   1.0.0 - 2026-01-08 - Admin User Management implementiert
 *   0.1.0 - 2026-01-07 - Initial placeholder
 */

import { useState, useEffect } from 'react';
import { PageLayout } from '@/components/layout/PageLayout';

interface User {
  id: string;
  username: string;
  display_name: string | null;
  role: 'admin' | 'user';
  status: 'bootstrap' | 'pending' | 'active' | 'disabled';
  kunde_id: number | null;
  created_at: string;
}

interface Kunde {
  id: number;
  name: string;
}

export function SettingsPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [kunden, setKunden] = useState<Kunde[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedKunde, setSelectedKunde] = useState<Record<string, number>>({});
  const [message, setMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);

  // Load users and kunden
  useEffect(() => {
    Promise.all([fetch('/api/admin/users').then((r) => r.json()), fetch('/api/kunden').then((r) => r.json())])
      .then(([usersData, kundenData]) => {
        setUsers(usersData);
        setKunden(kundenData);
      })
      .catch((err) => {
        setMessage({ text: `Fehler beim Laden: ${err.message}`, type: 'error' });
      })
      .finally(() => setLoading(false));
  }, []);

  const handleApprove = async (userId: string) => {
    const kundeId = selectedKunde[userId];
    if (!kundeId) {
      setMessage({ text: 'Bitte Kunde auswählen', type: 'error' });
      return;
    }

    try {
      const res = await fetch(`/api/admin/users/${userId}/approve`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ kunde_id: kundeId })
      });

      if (!res.ok) throw new Error(await res.text());

      setUsers((prev) => prev.map((u) => (u.id === userId ? { ...u, status: 'active', kunde_id: kundeId } : u)));
      setMessage({ text: 'User aktiviert', type: 'success' });
    } catch (err: any) {
      setMessage({ text: `Fehler: ${err.message}`, type: 'error' });
    }
  };

  const handleDisable = async (userId: string) => {
    if (!confirm('User wirklich deaktivieren?')) return;

    try {
      const res = await fetch(`/api/admin/users/${userId}/disable`, { method: 'POST' });
      if (!res.ok) throw new Error(await res.text());

      setUsers((prev) => prev.map((u) => (u.id === userId ? { ...u, status: 'disabled' } : u)));
      setMessage({ text: 'User deaktiviert', type: 'success' });
    } catch (err: any) {
      setMessage({ text: `Fehler: ${err.message}`, type: 'error' });
    }
  };

  if (loading) {
    return (
      <PageLayout title="Einstellungen">
        <div className="flex items-center justify-center h-64">
          <p className="text-neutral-400">Laden...</p>
        </div>
      </PageLayout>
    );
  }

  const pendingUsers = users.filter((u) => u.status === 'pending');
  const activeUsers = users.filter((u) => u.status === 'active');
  const disabledUsers = users.filter((u) => u.status === 'disabled');

  return (
    <PageLayout title="Einstellungen">
      <div className="space-y-8">
        {message && (
          <div
            className={`p-4 rounded-md ${message.type === 'error' ? 'bg-red-100 text-red-900' : 'bg-green-100 text-green-900'}`}
          >
            {message.text}
          </div>
        )}

        {/* Pending Users */}
        <section>
          <h2 className="text-xl font-bold mb-4">Pending Users ({pendingUsers.length})</h2>
          {pendingUsers.length === 0 ? (
            <p className="text-neutral-400">Keine pending users</p>
          ) : (
            <div className="space-y-4">
              {pendingUsers.map((user) => (
                <div key={user.id} className="border rounded-md p-4 space-y-2">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-bold">{user.display_name || user.username}</p>
                      <p className="text-sm text-neutral-600">@{user.username}</p>
                      <p className="text-xs text-neutral-500">
                        Erstellt: {new Date(user.created_at).toLocaleString('de-DE')}
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-2 items-center">
                    <select
                      value={selectedKunde[user.id] || ''}
                      onChange={(e) => setSelectedKunde((prev) => ({ ...prev, [user.id]: Number(e.target.value) }))}
                      className="border rounded px-3 py-2 flex-1"
                    >
                      <option value="">-- Kunde auswählen --</option>
                      {kunden.map((k) => (
                        <option key={k.id} value={k.id}>
                          {k.name}
                        </option>
                      ))}
                    </select>
                    <button
                      onClick={() => handleApprove(user.id)}
                      className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
                    >
                      Freischalten
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Active Users */}
        <section>
          <h2 className="text-xl font-bold mb-4">Aktive Users ({activeUsers.length})</h2>
          {activeUsers.length === 0 ? (
            <p className="text-neutral-400">Keine aktiven users</p>
          ) : (
            <div className="space-y-2">
              {activeUsers.map((user) => {
                const kunde = kunden.find((k) => k.id === user.kunde_id);
                return (
                  <div key={user.id} className="border rounded-md p-4 flex justify-between items-center">
                    <div>
                      <p className="font-bold">{user.display_name || user.username}</p>
                      <p className="text-sm text-neutral-600">
                        @{user.username} • {user.role === 'admin' ? 'Administrator' : `Kunde: ${kunde?.name || 'N/A'}`}
                      </p>
                    </div>
                    {user.role !== 'admin' && (
                      <button
                        onClick={() => handleDisable(user.id)}
                        className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
                      >
                        Deaktivieren
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </section>

        {/* Disabled Users */}
        {disabledUsers.length > 0 && (
          <section>
            <h2 className="text-xl font-bold mb-4">Deaktivierte Users ({disabledUsers.length})</h2>
            <div className="space-y-2">
              {disabledUsers.map((user) => (
                <div key={user.id} className="border rounded-md p-4 opacity-50">
                  <p className="font-bold">{user.display_name || user.username}</p>
                  <p className="text-sm text-neutral-600">@{user.username}</p>
                </div>
              ))}
            </div>
          </section>
        )}
      </div>
    </PageLayout>
  );
}
