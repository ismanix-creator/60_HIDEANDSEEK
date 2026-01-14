/**
 * @file        SchuldnerPage.tsx
 * @description Schuldner-Verwaltung Seite
 * @version     1.2.0
 * @created     2026-01-07 01:36:51 CET
 * @updated     2026-01-11 22:35:00 CET
 * @author      Akki Scholze
 *
 * @changelog
 *   1.2.0 - 2026-01-11 22:35:00 - Feature: Action Buttons mit disabled-State für Empty Rows
 *   1.1.0 - 2026-01-11 - Fixed: floating promises + type signatures
 *   1.0.0 - 2026-01-10 18:30:00 - TASK 2.5: Zahlungshistorie Dialog vollständig implementiert (Final)
 *   0.8.1 - 2026-01-10 04:26:18 - TASK 2.4.2: Header-Update (keine inline-styles vorhanden, bereits bereinigt in 0.7.1)
 *   0.7.1 - 2026-01-10 02:15:23 - TASK 2.4.2: Inline Monospace-Style entfernt (betrag Spalte)
 *   0.6.1 - 2026-01-10 00:20:42 - TASK 2.3.4: Überprüfung abgeschlossen - keine Hardcodes gefunden (bereits vollständig config-driven)
 *   0.6.0 - 2026-01-10 19:22:00 - Font-Familie Hardcode entfernt (appConfig.theme.typography.monospace)
 *   0.5.0 - 2026-01-09 23:45:00 - Alle verbleibenden Hardcodes entfernt (Phase 2.3 Final)
 *   0.4.0 - 2026-01-09 - 19 Hardcodes durch appConfig.* ersetzt (Phase 2.3)
 *   0.3.1 - 2026-01-09 - Name + Betrag-Spalten als Monospace (type: 'input')
 *   0.3.0 - 2026-01-09 - Button als actions Prop an PageLayout übergeben (horizontal zentriert)
 *   0.2.0 - 2026-01-09 - Doppelten Header entfernt (PageLayout zeigt bereits Titel)
 *   0.1.0 - 2026-01-07 - Initial implementation
 */

import { useState, useEffect } from 'react';
import { PageLayout } from '@/components/layout/PageLayout';
import { Table, isEmptyRow } from '@/components/ui/Table';
import { Button } from '@/components/ui/Button';
import { Dialog } from '@/components/ui/Dialog';
import { Input } from '@/components/ui/Input';
import { Badge } from '@/components/ui/Badge';
import { useApi } from '@/hooks/useApi';
import { formatCurrency, formatDate } from '@/utils/format';
import { HandCoins, Pencil, Trash2, DollarSign, Plus } from 'lucide-react';
import type { Schuldner, CreateSchuldnerRequest, UpdateSchuldnerRequest, ZahlungRequest } from '@/types';
import { appConfig } from '@/config';

export function SchuldnerPage() {
  const api = useApi();
  const [schuldner, setSchuldner] = useState<Schuldner[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Dialog States
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [zahlungDialogOpen, setZahlungDialogOpen] = useState(false);
  const [historieDialogOpen, setHistorieDialogOpen] = useState(false);
  const [selectedSchuldner, setSelectedSchuldner] = useState<Schuldner | null>(null);
  const [zahlungsHistorie, setZahlungsHistorie] = useState<unknown[]>([]);

  // Form States
  const [formData, setFormData] = useState<CreateSchuldnerRequest>({
    datum: new Date().toISOString().split('T')[0],
    name: '',
    betrag: 0,
    faelligkeit: '',
    notiz: ''
  });
  const [zahlungbetrag, setZahlungbetrag] = useState<number>(0);

  // Load Schuldner
  const loadSchuldner = async (): Promise<void> => {
    setLoading(true);
    setError(null);
    try {
      const result = await api.fetch<Schuldner[]>('/api/schuldner');
      if (result.success && result.data) {
        setSchuldner(result.data);
      } else {
        setError(result.error || appConfig.errors.load_failed);
      }
    } catch (err) {
      setError(appConfig.errors.network_error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void loadSchuldner();
  }, []);

  // Create Schuldner
  const handleCreate = async (): Promise<void> => {
    try {
      const result = await api.fetch('/api/schuldner', {
        method: 'POST',
        body: JSON.stringify(formData)
      });
      if (result.success) {
        setCreateDialogOpen(false);
        resetForm();
        void loadSchuldner();
      } else {
        setError(result.error || appConfig.errors.create_failed);
      }
    } catch (err) {
      setError(appConfig.errors.network_error);
    }
  };

  // Update Schuldner
  const handleUpdate = async (): Promise<void> => {
    if (!selectedSchuldner) return;
    try {
      const updateData: UpdateSchuldnerRequest = {
        id: selectedSchuldner.id,
        ...formData
      };
      const result = await api.fetch(`/api/schuldner/${selectedSchuldner.id}`, {
        method: 'PUT',
        body: JSON.stringify(updateData)
      });
      if (result.success) {
        setEditDialogOpen(false);
        setSelectedSchuldner(null);
        resetForm();
        void loadSchuldner();
      } else {
        setError(result.error || appConfig.errors.update_failed);
      }
    } catch (err) {
      setError(appConfig.errors.network_error);
    }
  };

  // Delete Schuldner
  const handleDelete = async (): Promise<void> => {
    if (!selectedSchuldner) return;
    try {
      const result = await api.fetch(`/api/schuldner/${selectedSchuldner.id}`, {
        method: 'DELETE'
      });
      if (result.success) {
        setDeleteDialogOpen(false);
        setSelectedSchuldner(null);
        void loadSchuldner();
      } else {
        setError(result.error || appConfig.errors.delete_failed);
      }
    } catch (err) {
      setError(appConfig.errors.network_error);
    }
  };

  // Zahlung verbuchen
  const handleZahlung = async (): Promise<void> => {
    if (!selectedSchuldner) return;
    try {
      const zahlungData: ZahlungRequest = { betrag: zahlungbetrag };
      const result = await api.fetch(`/api/schuldner/${selectedSchuldner.id}/zahlung`, {
        method: 'POST',
        body: JSON.stringify(zahlungData)
      });
      if (result.success) {
        setZahlungDialogOpen(false);
        setSelectedSchuldner(null);
        setZahlungbetrag(0);
        void loadSchuldner();
      } else {
        setError(result.error || appConfig.errors.booking_failed);
      }
    } catch (err) {
      setError(appConfig.errors.network_error);
    }
  };

  // Open Edit Dialog
  const openEditDialog = (s: Schuldner) => {
    setSelectedSchuldner(s);
    setFormData({
      datum: s.datum,
      name: s.name,
      betrag: s.betrag,
      faelligkeit: s.faelligkeit || '',
      notiz: s.notiz || ''
    });
    setEditDialogOpen(true);
  };

  // Open Delete Dialog
  const openDeleteDialog = (s: Schuldner) => {
    setSelectedSchuldner(s);
    setDeleteDialogOpen(true);
  };

  // Open Zahlung Dialog
  const openZahlungDialog = (s: Schuldner) => {
    setSelectedSchuldner(s);
    setZahlungbetrag(s.offen);
    setZahlungDialogOpen(true);
  };

  // Open Historie Dialog
  const openHistorieDialog = (s: Schuldner) => {
    setSelectedSchuldner(s);
    setZahlungsHistorie([]);
    setHistorieDialogOpen(true);
    void loadZahlungsHistorie(s.id);
  };

  // Load Zahlungshistorie
  const loadZahlungsHistorie = async (schuldnerId: number): Promise<void> => {
    try {
      const result = await api.fetch(`/api/schuldner/${schuldnerId}/zahlungen`);
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
  const getColumnRender = (key: string) => {
    switch (key) {
      case 'datum':
        return (s: Schuldner) => formatDate(s.datum);
      case 'betrag':
        return (s: Schuldner) => formatCurrency(s.betrag);
      case 'bezahlt':
        return (s: Schuldner) => formatCurrency(s.bezahlt);
      case 'offen':
        return (s: Schuldner) => formatCurrency(s.offen);
      case 'faelligkeit':
        return (s: Schuldner) => (s.faelligkeit ? formatDate(s.faelligkeit) : '-');
      case 'status':
        return (s: Schuldner) => (
          <Badge variant={s.status === 'bezahlt' ? 'success' : s.status === 'teilbezahlt' ? 'warning' : 'error'}>
            {s.status === 'bezahlt'
              ? appConfig.status.paid
              : s.status === 'teilbezahlt'
                ? appConfig.status.partial
                : appConfig.status.open}
          </Badge>
        );
      case 'actions':
        return (s: Schuldner) => (
          <div className="flex gap-2">
            {!isEmptyRow(s) && s.offen > 0 && (
              <Button kind="act" onClick={() => openZahlungDialog(s)}>
                <DollarSign />
              </Button>
            )}
            <Button kind="act" disabled={isEmptyRow(s)} onClick={() => openEditDialog(s)}>
              <Pencil />
            </Button>
            <Button kind="act" disabled={isEmptyRow(s)} onClick={() => openDeleteDialog(s)}>
              <Trash2 />
            </Button>
          </div>
        );
      default:
        return undefined;
    }
  };

  const columns = appConfig.components.table.schuldner.columns.map((col) => ({
    key: col.key,
    label: col.label,
    type: col.type as 'text' | 'number' | 'currency' | 'date' | 'status' | 'actions' | 'input' | undefined,
    render: getColumnRender(col.key)
  }));

  return (
    <PageLayout
      title={appConfig.page_titles.debtors}
      showBackButton={true}
      actions={
        <Button kind="new" onClick={() => setCreateDialogOpen(true)}>
          <div style={{ position: 'relative', display: 'inline-flex' }}>
            <HandCoins />
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
          data={schuldner}
          columns={columns}
          loading={loading}
          emptyMessage={appConfig.empty_states.no_debtors}
          onRowClick={(s) => openHistorieDialog(s)}
        />

        {/* Create Dialog */}
        <Dialog
          open={createDialogOpen}
          onClose={() => {
            setCreateDialogOpen(false);
            resetForm();
          }}
          title={appConfig.components.dialog_titles.new_debtor}
          actions={
            <>
              <Button
                kind="rect"
                onClick={() => {
                  setCreateDialogOpen(false);
                  resetForm();
                }}
              >
                {appConfig.components.buttons.cancel}
              </Button>
              <Button onClick={() => void handleCreate()}>{appConfig.components.buttons.create}</Button>
            </>
          }
        >
          <div className="space-y-4">
            <Input
              label={appConfig.labels.date}
              type="date"
              value={formData.datum}
              onChange={(e) => setFormData({ ...formData, datum: e.target.value })}
            />
            <Input
              label={appConfig.labels.name}
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            />
            <Input
              label={appConfig.labels.amount}
              type="number"
              step="0.01"
              value={formData.betrag}
              onChange={(e) => setFormData({ ...formData, betrag: parseFloat(e.target.value) || 0 })}
            />
            <Input
              label={appConfig.labels.due_date}
              type="date"
              value={formData.faelligkeit}
              onChange={(e) => setFormData({ ...formData, faelligkeit: e.target.value })}
            />
            <Input
              label={appConfig.labels.note}
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
            setSelectedSchuldner(null);
            resetForm();
          }}
          title={appConfig.components.dialog_titles.edit_debtor}
          actions={
            <>
              <Button
                kind="rect"
                onClick={() => {
                  setEditDialogOpen(false);
                  setSelectedSchuldner(null);
                  resetForm();
                }}
              >
                {appConfig.components.buttons.cancel}
              </Button>
              <Button onClick={() => void handleUpdate()}>{appConfig.components.buttons.save}</Button>
            </>
          }
        >
          <div className="space-y-4">
            <Input
              label={appConfig.labels.date}
              type="date"
              value={formData.datum}
              onChange={(e) => setFormData({ ...formData, datum: e.target.value })}
            />
            <Input
              label={appConfig.labels.name}
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            />
            <Input
              label={appConfig.labels.amount}
              type="number"
              step="0.01"
              value={formData.betrag}
              onChange={(e) => setFormData({ ...formData, betrag: parseFloat(e.target.value) || 0 })}
            />
            <Input
              label={appConfig.labels.due_date}
              type="date"
              value={formData.faelligkeit}
              onChange={(e) => setFormData({ ...formData, faelligkeit: e.target.value })}
            />
            <Input
              label={appConfig.labels.note}
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
            setSelectedSchuldner(null);
          }}
          title={appConfig.components.dialog_titles.delete_debtor}
          actions={
            <>
              <Button
                kind="rect"
                onClick={() => {
                  setDeleteDialogOpen(false);
                  setSelectedSchuldner(null);
                }}
              >
                {appConfig.components.buttons.cancel}
              </Button>
              <Button kind="rect" onClick={() => void handleDelete()}>
                {appConfig.components.buttons.delete}
              </Button>
            </>
          }
        >
          <p className="text-neutral-300">
            {appConfig.messages.confirm_delete_debtor.replace('{name}', selectedSchuldner?.name || '')}
          </p>
        </Dialog>

        {/* Zahlung Dialog */}
        <Dialog
          open={zahlungDialogOpen}
          onClose={() => {
            setZahlungDialogOpen(false);
            setSelectedSchuldner(null);
            setZahlungbetrag(0);
          }}
          title={appConfig.components.dialog_titles.record_payment}
          actions={
            <>
              <Button
                kind="rect"
                onClick={() => {
                  setZahlungDialogOpen(false);
                  setSelectedSchuldner(null);
                  setZahlungbetrag(0);
                }}
              >
                {appConfig.components.buttons.cancel}
              </Button>
              <Button onClick={() => void handleZahlung()}>{appConfig.components.buttons.record}</Button>
            </>
          }
        >
          <div className="space-y-4">
            <div className="p-4 bg-neutral-800 rounded">
              <p className="text-neutral-400 text-sm">{appConfig.labels.open_amount}</p>
              <p className="text-2xl font-semibold text-neutral-50">{formatCurrency(selectedSchuldner?.offen || 0)}</p>
            </div>
            <Input
              label={appConfig.labels.payment_amount}
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
            setSelectedSchuldner(null);
            setZahlungsHistorie([]);
          }}
          title={
            selectedSchuldner
              ? `${appConfig.components.dialog_titles.history}: ${selectedSchuldner.name}`
              : appConfig.components.dialog_titles.history
          }
          actions={
            <Button
              onClick={() => {
                setHistorieDialogOpen(false);
                setSelectedSchuldner(null);
                setZahlungsHistorie([]);
              }}
            >
              {appConfig.components.buttons.close}
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
                        <p className="text-lg font-semibold text-neutral-50">
                          {formatCurrency(Number(payment.betrag))}
                        </p>
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
                          ? appConfig.status.paid
                          : payment.status === 'teilbezahlt'
                            ? appConfig.status.partial
                            : appConfig.status.open}
                      </Badge>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <p className="text-neutral-400 text-sm text-center py-4">{appConfig.empty_states.no_history}</p>
          )}
        </Dialog>
      </div>
    </PageLayout>
  );
}
