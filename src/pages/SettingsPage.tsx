/**
 * @file        SettingsPage.tsx
 * @description Einstellungen Seite mit Admin User Management
 * @version     1.4.0
 * @created     2026-01-07 01:36:51 CET
 * @updated     2026-01-11 03:06:28 CET
 * @author      Akki Scholze
 *
 * @changelog
 *   1.4.0 - 2026-01-11 - Fixed: floating promises + type signatures
 *   1.3.0 - 2026-01-11 - P1: useApi Hook integriert, window.fetch entfernt
 *   1.1.0 - 2026-01-10 - UI-Components (Button, Select) statt Hardcoded Tailwind
 *   1.0.0 - 2026-01-08 - Admin User Management implementiert
 *   0.1.0 - 2026-01-07 - Initial placeholder
 */

import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { PageLayout } from '@/components/layout/PageLayout';
import { Button } from '@/components/ui/Button';
import { Select } from '@/components/ui/Select';
import { useApi } from '@/hooks';

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
  const api = useApi();
  const navigate = useNavigate();
  const [users, setUsers] = useState<User[]>([]);
  const [kunden, setKunden] = useState<Kunde[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedKunde, setSelectedKunde] = useState<Record<string, number>>({});
  const [message, setMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);

  // Load users and kunden
  useEffect(() => {
    const load = async (): Promise<void> => {
      const [usersResult, kundenResult] = await Promise.all([
        api.fetch<{ users: User[] }>('/api/admin/users'),
        api.fetch<Kunde[]>('/api/kunden')
      ]);
      if (usersResult.success && usersResult.data) {
        setUsers(usersResult.data.users);
      }
      if (kundenResult.success && kundenResult.data) {
        setKunden(kundenResult.data);
      }
      setLoading(false);
    };
    void load().catch((err: unknown) => {
      setMessage({ text: `Fehler beim Laden: ${err instanceof Error ? err.message : 'Unknown error'}`, type: 'error' });
      setLoading(false);
    });
  }, [api]);

  const handleApprove = async (userId: string): Promise<void> => {
    const kundeId = selectedKunde[userId];
    if (!kundeId) {
      setMessage({ text: 'Bitte Kunde auswählen', type: 'error' });
      return;
    }

    try {
      const result = await api.fetch(`/api/admin/users/${userId}/approve`, {
        method: 'POST',
        body: JSON.stringify({ kunde_id: kundeId })
      });

      if (!result.success) throw new Error(result.error || 'Approval failed');

      setUsers((prev) => prev.map((u) => (u.id === userId ? { ...u, status: 'active', kunde_id: kundeId } : u)));
      setMessage({ text: 'User aktiviert', type: 'success' });
    } catch (err: unknown) {
      const error = err as any;
      setMessage({ text: `Fehler: ${error.message}`, type: 'error' });
    }
  };

  const handleDisable = async (userId: string): Promise<void> => {
    if (!confirm('User wirklich deaktivieren?')) return;

    try {
      const result = await api.fetch(`/api/admin/users/${userId}/disable`, { method: 'POST' });
      if (!result.success) throw new Error(result.error || 'Disable failed');

      setUsers((prev) => prev.map((u) => (u.id === userId ? { ...u, status: 'disabled' } : u)));
      setMessage({ text: 'User deaktiviert', type: 'success' });
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Unbekannter Fehler';
      setMessage({ text: `Fehler: ${errorMessage}`, type: 'error' });
    }
  };

  if (loading) {
    return (
      <PageLayout title="Einstellungen" showBackButton={true}>
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
            className={`p-4 rounded-md ${
              message.type === 'error' ? 'bg-red-100 text-red-900' : 'bg-green-100 text-green-900'
            }`}
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
                    <Select
                      value={String(selectedKunde[user.id] || '')}
                      onChange={(val) => setSelectedKunde((prev) => ({ ...prev, [user.id]: Number(val) }))}
                      options={[
                        { value: '', label: '-- Kunde auswählen --' },
                        ...kunden.map((k) => ({ value: String(k.id), label: k.name }))
                      ]}
                      className="flex-1"
                    />
                    <Button kind="rect" intent="save" onClick={() => void handleApprove(user.id)}>
                      Freischalten
                    </Button>
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
                      <Button kind="rect" onClick={() => void handleDisable(user.id)}>
                        Deaktivieren
                      </Button>
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

        {/* Setup Section */}
        <section>
          <h2 className="text-xl font-bold mb-4">Admin Setup</h2>
          <p className="text-neutral-600 mb-4">Zugang zur initialen System-Konfiguration</p>
          <Button kind="rect" onClick={() => navigate('/setup')}>
            Zur Setup-Seite
          </Button>
        </section>
      </div>
    </PageLayout>
  );
}
