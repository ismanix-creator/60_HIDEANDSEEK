/**
 * @file        GlaeubigerPage.tsx
 * @description Gläubiger-Verwaltung Seite
 * @version     1.1.0
 * @created     2026-01-07 01:36:51 CET
 * @updated     2026-01-11 03:06:28 CET
 * @author      Akki Scholze
 *
 * @changelog
 *   1.1.0 - 2026-01-11 - Fixed: floating promises + type signatures
 *   1.0.0 - 2026-01-10 18:30:00 - TASK 2.5: Zahlungshistorie Dialog vollständig implementiert (Final)
 *   0.8.0 - 2026-01-10 15:42:37 - Inline-Style für Monospace-Font im Betrag entfernt (Task 2.4.1)
 *   0.7.0 - 2026-01-10 00:30:15 - Hardcodes für Fälligkeit, Notiz und Monospace-Font entfernt (Phase 2.3.3)
 *   0.6.0 - 2026-01-09 23:45:00 - Alle verbleibenden Hardcodes entfernt (Phase 2.3 Final)
 *   0.5.0 - 2026-01-09 21:51:40 - 4 verbleibende Hardcodes durch appConfig.ui.labels.* ersetzt (Phase 2.3.B)
 *   0.4.0 - 2026-01-09 21:03:15 - 30 UI-Text-Hardcodes entfernt (Phase 2.3.3)
 *   0.3.1 - 2026-01-09 - Name + Betrag-Spalten als Monospace (type: 'input')
 *   0.3.0 - 2026-01-09 - Button als actions Prop an PageLayout übergeben (horizontal zentriert)
 *   0.2.0 - 2026-01-09 - Doppelten Header entfernt (PageLayout zeigt bereits Titel)
 *   0.1.0 - 2026-01-07 - Initial implementation
 */

import { useState, useEffect } from 'react';
import { PageLayout } from '@/components/layout/PageLayout';
import { Table } from '@/components/ui/Table';
import { Button } from '@/components/ui/Button';
import { Dialog } from '@/components/ui/Dialog';
import { Input } from '@/components/ui/Input';
import { Badge } from '@/components/ui/Badge';
import { useApi } from '@/hooks/useApi';
import { formatCurrency, formatDate } from '@/utils/format';
import { appConfig } from '@/config';
import { HandCoins, Pencil, Trash2, DollarSign, Plus } from 'lucide-react';
import type { Glaeubiger, CreateGlaeubigerRequest, UpdateGlaeubigerRequest, ZahlungRequest } from '@/types';

export function GlaeubigerPage() {
  const api = useApi();
  const [glaeubiger, setGlaeubiger] = useState<Glaeubiger[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Dialog States
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [zahlungDialogOpen, setZahlungDialogOpen] = useState(false);
  const [historieDialogOpen, setHistorieDialogOpen] = useState(false);
  const [selectedGlaeubiger, setSelectedGlaeubiger] = useState<Glaeubiger | null>(null);
  const [zahlungsHistorie, setZahlungsHistorie] = useState<unknown[]>([]);

  // Form States
  const [formData, setFormData] = useState<CreateGlaeubigerRequest>({
    datum: new Date().toISOString().split('T')[0],
    name: '',
    betrag: 0,
    faelligkeit: '',
    notiz: ''
  });
  const [zahlungbetrag, setZahlungbetrag] = useState<number>(0);

  // Load Gläubiger
  const loadGlaeubiger = async (): Promise<void> => {
    setLoading(true);
    setError(null);
    try {
      const result = await api.fetch<Glaeubiger[]>('/api/glaeubiger');
      if (result.success && result.data) {
        setGlaeubiger(result.data);
      } else {
        setError(result.error || appConfig.ui.errors.load_failed);
      }
    } catch (err) {
      setError(appConfig.ui.errors.network_error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void loadGlaeubiger();
  }, []);

  // Create Gläubiger
  const handleCreate = async (): Promise<void> => {
    try {
      const result = await api.fetch('/api/glaeubiger', {
        method: 'POST',
        body: JSON.stringify(formData)
      });
      if (result.success) {
        setCreateDialogOpen(false);
        resetForm();
        loadGlaeubiger();
      } else {
        setError(result.error || appConfig.ui.errors.create_failed);
      }
    } catch (err) {
      setError(appConfig.ui.errors.network_error);
    }
  };

  // Update Gläubiger
  const handleUpdate = async (): Promise<void> => {
    if (!selectedGlaeubiger) return;
    try {
      const updateData: UpdateGlaeubigerRequest = {
        id: selectedGlaeubiger.id,
        ...formData
      };
      const result = await api.fetch(`/api/glaeubiger/${selectedGlaeubiger.id}`, {
        method: 'PUT',
        body: JSON.stringify(updateData)
      });
      if (result.success) {
        setEditDialogOpen(false);
        setSelectedGlaeubiger(null);
        resetForm();
        loadGlaeubiger();
      } else {
        setError(result.error || appConfig.ui.errors.update_failed);
      }
    } catch (err) {
      setError(appConfig.ui.errors.network_error);
    }
  };

  // Delete Gläubiger
  const handleDelete = async (): Promise<void> => {
    if (!selectedGlaeubiger) return;
    try {
      const result = await api.fetch(`/api/glaeubiger/${selectedGlaeubiger.id}`, {
        method: 'DELETE'
      });
      if (result.success) {
        setDeleteDialogOpen(false);
        setSelectedGlaeubiger(null);
        loadGlaeubiger();
      } else {
        setError(result.error || appConfig.ui.errors.delete_failed);
      }
    } catch (err) {
      setError(appConfig.ui.errors.network_error);
    }
  };

  // Zahlung verbuchen
  const handleZahlung = async (): Promise<void> => {
    if (!selectedGlaeubiger) return;
    try {
      const zahlungData: ZahlungRequest = { betrag: zahlungbetrag };
      const result = await api.fetch(`/api/glaeubiger/${selectedGlaeubiger.id}/zahlung`, {
        method: 'POST',
        body: JSON.stringify(zahlungData)
      });
      if (result.success) {
        setZahlungDialogOpen(false);
        setSelectedGlaeubiger(null);
        setZahlungbetrag(0);
        loadGlaeubiger();
      } else {
        setError(result.error || appConfig.ui.errors.booking_failed);
      }
    } catch (err) {
      setError(appConfig.ui.errors.network_error);
    }
  };

  // Open Edit Dialog
  const openEditDialog = (g: Glaeubiger) => {
    setSelectedGlaeubiger(g);
    setFormData({
      datum: g.datum,
      name: g.name,
      betrag: g.betrag,
      faelligkeit: g.faelligkeit || '',
      notiz: g.notiz || ''
    });
    setEditDialogOpen(true);
  };

  // Open Delete Dialog
  const openDeleteDialog = (g: Glaeubiger) => {
    setSelectedGlaeubiger(g);
    setDeleteDialogOpen(true);
  };

  // Open Zahlung Dialog
  const openZahlungDialog = (g: Glaeubiger) => {
    setSelectedGlaeubiger(g);
    setZahlungbetrag(g.offen);
    setZahlungDialogOpen(true);
  };

  // Open Historie Dialog
  const openHistorieDialog = (g: Glaeubiger) => {
    setSelectedGlaeubiger(g);
    setZahlungsHistorie([]);
    setHistorieDialogOpen(true);
    loadZahlungsHistorie(g.id);
  };

  // Load Zahlungshistorie
  const loadZahlungsHistorie = async (glaeubigerId: number): Promise<void> => {
    try {
      const result = await api.fetch(`/api/glaeubiger/${glaeubigerId}/zahlungen`);
      if (result.success && result.data) {
        setZahlungsHistorie(result.data as unknown[]);
      } else {
        setZahlungsHistorie([]);
      }
    } catch (err) {
      console.error('Fehler beim Laden der Zahlungshistorie', err);
      setZahlungsHistorie([]);
    }
  };

  // Reset Form
  const resetForm = () => {
    setFormData({
      datum: new Date().toISOString().split('T')[0],
      name: '',
      betrag: 0,
      faelligkeit: '',
      notiz: ''
    });
  };

  // Table Columns
  const columns = [
    { key: 'datum', label: appConfig.ui.labels.date, render: (g: Glaeubiger) => formatDate(g.datum) },
    { key: 'name', label: appConfig.ui.labels.name, type: 'input' as const },
    {
      key: 'betrag',
      label: appConfig.ui.labels.amount,
      type: 'input' as const,
      render: (g: Glaeubiger) => formatCurrency(g.betrag)
    },
    { key: 'bezahlt', label: appConfig.ui.labels.amount_paid, render: (g: Glaeubiger) => formatCurrency(g.bezahlt) },
    { key: 'offen', label: appConfig.ui.labels.open_amount, render: (g: Glaeubiger) => formatCurrency(g.offen) },
    {
      key: 'faelligkeit',
      label: appConfig.ui.labels.due_date,
      render: (g: Glaeubiger) => (g.faelligkeit ? formatDate(g.faelligkeit) : '-')
    },
    {
      key: 'status',
      label: appConfig.ui.labels.status,
      render: (g: Glaeubiger) => (
        <Badge variant={g.status === 'bezahlt' ? 'success' : g.status === 'teilbezahlt' ? 'warning' : 'error'}>
          {g.status === 'bezahlt'
            ? appConfig.ui.status.paid
            : g.status === 'teilbezahlt'
              ? appConfig.ui.status.partial
              : appConfig.ui.status.open}
        </Badge>
      )
    },
    {
      key: 'actions',
      label: appConfig.ui.labels.actions,
      render: (g: Glaeubiger) => (
        <div className="flex gap-2">
          {g.offen > 0 && (
            <Button kind="icon" onClick={() => openZahlungDialog(g)}>
              <DollarSign />
            </Button>
          )}
          <Button kind="icon" onClick={() => openEditDialog(g)}>
            <Pencil />
          </Button>
          <Button kind="icon" onClick={() => openDeleteDialog(g)}>
            <Trash2 />
          </Button>
        </div>
      )
    }
  ];

  return (
    <PageLayout
      title={appConfig.ui.page_titles.creditors}
      actions={
        <Button kind="icon" onClick={() => setCreateDialogOpen(true)}>
          <div style={{ position: 'relative', display: 'inline-flex' }}>
            <HandCoins style={{ transform: 'rotate(180deg) scaleX(-1)' }} />
            <Plus
              style={{
                position: 'absolute',
                bottom: '-4px',
                right: '-8px',
                width: '12px',
                height: '12px'
              }}
              strokeWidth={3}
            />
          </div>
        </Button>
      }
    >
      <div className="space-y-4">
        {/* Error */}
        {error && <div className="p-4 bg-red-500/10 border border-red-500 rounded text-red-400">{error}</div>}

        {/* Table */}
        <Table
          data={glaeubiger}
          columns={columns}
          loading={loading}
          emptyMessage={appConfig.ui.empty_states.no_creditors}
          onRowClick={(g) => openHistorieDialog(g)}
        />

        {/* Create Dialog */}
        <Dialog
          open={createDialogOpen}
          onClose={() => {
            setCreateDialogOpen(false);
            resetForm();
          }}
          title={appConfig.ui.dialog_titles.new_creditor}
          actions={
            <>
              <Button
                kind="rect"
                onClick={() => {
                  setCreateDialogOpen(false);
                  resetForm();
                }}
              >
                {appConfig.ui.buttons.cancel}
              </Button>
              <Button onClick={handleCreate}>{appConfig.ui.buttons.create}</Button>
            </>
          }
        >
          <div className="space-y-4">
            <Input
              label={appConfig.ui.labels.date}
              type="date"
              value={formData.datum}
              onChange={(e) => setFormData({ ...formData, datum: e.target.value })}
            />
            <Input
              label={appConfig.ui.labels.name}
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            />
            <Input
              label={appConfig.ui.labels.amount}
              type="number"
              step="0.01"
              value={formData.betrag}
              onChange={(e) => setFormData({ ...formData, betrag: parseFloat(e.target.value) || 0 })}
            />
            <Input
              label={appConfig.ui.labels.due_date}
              type="date"
              value={formData.faelligkeit}
              onChange={(e) => setFormData({ ...formData, faelligkeit: e.target.value })}
            />
            <Input
              label={appConfig.ui.labels.note}
              value={formData.notiz}
              onChange={(e) => setFormData({ ...formData, notiz: e.target.value })}
            />
          </div>
        </Dialog>

        {/* Edit Dialog */}
        <Dialog
          open={editDialogOpen}
          onClose={() => {
            setEditDialogOpen(false);
            setSelectedGlaeubiger(null);
            resetForm();
          }}
          title={appConfig.ui.dialog_titles.edit_creditor}
          actions={
            <>
              <Button
                kind="rect"
                onClick={() => {
                  setEditDialogOpen(false);
                  setSelectedGlaeubiger(null);
                  resetForm();
                }}
              >
                {appConfig.ui.buttons.cancel}
              </Button>
              <Button onClick={handleUpdate}>{appConfig.ui.buttons.save}</Button>
            </>
          }
        >
          <div className="space-y-4">
            <Input
              label={appConfig.ui.labels.date}
              type="date"
              value={formData.datum}
              onChange={(e) => setFormData({ ...formData, datum: e.target.value })}
            />
            <Input
              label={appConfig.ui.labels.name}
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            />
            <Input
              label={appConfig.ui.labels.amount}
              type="number"
              step="0.01"
              value={formData.betrag}
              onChange={(e) => setFormData({ ...formData, betrag: parseFloat(e.target.value) || 0 })}
            />
            <Input
              label={appConfig.ui.labels.due_date}
              type="date"
              value={formData.faelligkeit}
              onChange={(e) => setFormData({ ...formData, faelligkeit: e.target.value })}
            />
            <Input
              label={appConfig.ui.labels.note}
              value={formData.notiz}
              onChange={(e) => setFormData({ ...formData, notiz: e.target.value })}
            />
          </div>
        </Dialog>

        {/* Delete Dialog */}
        <Dialog
          open={deleteDialogOpen}
          onClose={() => {
            setDeleteDialogOpen(false);
            setSelectedGlaeubiger(null);
          }}
          title={appConfig.ui.dialog_titles.delete_creditor}
          actions={
            <>
              <Button
                kind="rect"
                onClick={() => {
                  setDeleteDialogOpen(false);
                  setSelectedGlaeubiger(null);
                }}
              >
                {appConfig.ui.buttons.cancel}
              </Button>
              <Button kind="rect" onClick={handleDelete}>
                {appConfig.ui.buttons.delete}
              </Button>
            </>
          }
        >
          <p className="text-neutral-300">
            {appConfig.ui.messages.confirm_delete_creditor.replace('{name}', selectedGlaeubiger?.name || '')}
          </p>
        </Dialog>

        {/* Zahlung Dialog */}
        <Dialog
          open={zahlungDialogOpen}
          onClose={() => {
            setZahlungDialogOpen(false);
            setSelectedGlaeubiger(null);
            setZahlungbetrag(0);
          }}
          title={appConfig.ui.dialog_titles.record_payment}
          actions={
            <>
              <Button
                kind="rect"
                onClick={() => {
                  setZahlungDialogOpen(false);
                  setSelectedGlaeubiger(null);
                  setZahlungbetrag(0);
                }}
              >
                {appConfig.ui.buttons.cancel}
              </Button>
              <Button onClick={handleZahlung}>{appConfig.ui.buttons.record}</Button>
            </>
          }
        >
          <div className="space-y-4">
            <div className="p-4 bg-neutral-800 rounded">
              <p className="text-neutral-400 text-sm">{appConfig.ui.labels.open_amount}</p>
              <p className="text-2xl font-semibold text-neutral-50">{formatCurrency(selectedGlaeubiger?.offen || 0)}</p>
            </div>
            <Input
              label={appConfig.ui.labels.payment_amount}
              type="number"
              step="0.01"
              value={zahlungbetrag}
              onChange={(e) => setZahlungbetrag(parseFloat(e.target.value) || 0)}
            />
          </div>
        </Dialog>

        {/* Historie Dialog */}
        <Dialog
          open={historieDialogOpen}
          onClose={() => {
            setHistorieDialogOpen(false);
            setSelectedGlaeubiger(null);
            setZahlungsHistorie([]);
          }}
          title={
            selectedGlaeubiger
              ? `${appConfig.ui.dialog_titles.history}: ${selectedGlaeubiger.name}`
              : appConfig.ui.dialog_titles.history
          }
          actions={
            <Button
              onClick={() => {
                setHistorieDialogOpen(false);
                setSelectedGlaeubiger(null);
                setZahlungsHistorie([]);
              }}
            >
              {appConfig.ui.buttons.close}
            </Button>
          }
        >
          {zahlungsHistorie.length > 0 ? (
            <div className="space-y-2 max-h-[60vh] overflow-y-auto">
              {zahlungsHistorie.map((item: unknown, idx: number) => {
                const payment = item as Record<string, unknown>;
                return (
                  <div key={idx} className="p-3 bg-neutral-800 rounded border border-neutral-700">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <p className="text-sm text-neutral-400">{formatDate(String(payment.datum))}</p>
                        <p className="text-lg font-semibold text-neutral-50">{formatCurrency(Number(payment.betrag))}</p>
                      </div>
                      <Badge
                        variant={
                          payment.status === 'bezahlt'
                            ? 'success'
                            : payment.status === 'teilbezahlt'
                              ? 'warning'
                              : 'error'
                        }
                      >
                        {payment.status === 'bezahlt'
                          ? appConfig.ui.status.paid
                          : payment.status === 'teilbezahlt'
                            ? appConfig.ui.status.partial
                            : appConfig.ui.status.open}
                      </Badge>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <p className="text-neutral-400 text-sm text-center py-4">{appConfig.ui.empty_states.no_history}</p>
          )}
        </Dialog>
      </div>
    </PageLayout>
  );
}
