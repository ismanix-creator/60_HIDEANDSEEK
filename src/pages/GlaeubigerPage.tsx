/**
 * @file        GlaeubigerPage.tsx
 * @description Gläubiger-Verwaltung Seite
 * @version     1.2.0
 * @created     2026-01-07 01:36:51 CET
 * @updated     2026-01-11 22:35:00 CET
 * @author      Akki Scholze
 *
 * @changelog
 *   1.2.0 - 2026-01-11 22:35:00 - Feature: Action Buttons mit disabled-State für Empty Rows
 *   1.1.0 - 2026-01-11 - Fixed: floating promises + type signatures
 *   1.0.0 - 2026-01-10 18:30:00 - TASK 2.5: Zahlungshistorie Dialog vollständig implementiert (Final)
 *   0.8.0 - 2026-01-10 15:42:37 - Inline-Style für Monospace-Font im Betrag entfernt (Task 2.4.1)
 *   0.7.0 - 2026-01-10 00:30:15 - Hardcodes für Fälligkeit, Notiz und Monospace-Font entfernt (Phase 2.3.3)
 *   0.6.0 - 2026-01-09 23:45:00 - Alle verbleibenden Hardcodes entfernt (Phase 2.3 Final)
 *   0.5.0 - 2026-01-09 21:51:40 - 4 verbleibende Hardcodes durch appConfig.labels.* ersetzt (Phase 2.3.B)
 *   0.4.0 - 2026-01-09 21:03:15 - 30 UI-Text-Hardcodes entfernt (Phase 2.3.3)
 *   0.3.1 - 2026-01-09 - Name + Betrag-Spalten als Monospace (type: 'input')
 *   0.3.0 - 2026-01-09 - Button als actions Prop an PageLayout übergeben (horizontal zentriert)
 *   0.2.0 - 2026-01-09 - Doppelten Header entfernt (PageLayout zeigt bereits Titel)
 *   0.1.0 - 2026-01-07 - Initial implementation
 */

import { useState, useEffect } from 'react';
import { MainApp } from '@/components/layout/MainApp';
import { Table, isEmptyRow } from '@/components/ui/Table';
import { Button } from '@/components/ui/Button';
import { Dialog } from '@/components/ui/Dialog';
import { Input } from '@/components/ui/Input';
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
        setError(result.error || appConfig.errors.load_failed);
      }
    } catch (err) {
      setError(appConfig.errors.network_error);
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
        void loadGlaeubiger();
      } else {
        setError(result.error || appConfig.errors.create_failed);
      }
    } catch (err) {
      setError(appConfig.errors.network_error);
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
        void loadGlaeubiger();
      } else {
        setError(result.error || appConfig.errors.update_failed);
      }
    } catch (err) {
      setError(appConfig.errors.network_error);
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
        void loadGlaeubiger();
      } else {
        setError(result.error || appConfig.errors.delete_failed);
      }
    } catch (err) {
      setError(appConfig.errors.network_error);
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
        void loadGlaeubiger();
      } else {
        setError(result.error || appConfig.errors.booking_failed);
      }
    } catch (err) {
      setError(appConfig.errors.network_error);
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
    void loadZahlungsHistorie(g.id);
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

  // Table Columns mit inline renders und actions via property
  const columns = appConfig.components.table.glaeubiger.columns.map((col) => ({
    key: col.key,
    label: col.label,
    type: col.type as 'text' | 'number' | 'currency' | 'date' | 'status' | 'actions' | 'input' | undefined,
    render:
      col.key === 'datum'
        ? (g: Glaeubiger) => formatDate(g.datum)
        : col.key === 'betrag'
          ? (g: Glaeubiger) => formatCurrency(g.betrag)
          : col.key === 'bezahlt'
            ? (g: Glaeubiger) => formatCurrency(g.bezahlt)
            : col.key === 'offen'
              ? (g: Glaeubiger) => formatCurrency(g.offen)
              : col.key === 'faelligkeit'
                ? (g: Glaeubiger) => (g.faelligkeit ? formatDate(g.faelligkeit) : '-')
                : col.key === 'status'
                  ? (g: Glaeubiger) => (
                      <span
                        className={`px-2 py-1 rounded text-sm ${
                          g.status === 'bezahlt'
                            ? 'bg-green-500/20 text-green-300'
                            : g.status === 'teilbezahlt'
                              ? 'bg-yellow-500/20 text-yellow-300'
                              : 'bg-red-500/20 text-red-300'
                        }`}
                      >
                        {g.status === 'bezahlt' ? 'Bezahlt' : g.status === 'teilbezahlt' ? 'Teilbezahlt' : 'Offen'}
                      </span>
                    )
                  : undefined,
    actions:
      col.key === 'actions'
        ? (g: Glaeubiger) => {
            const acts = [];
            if (!isEmptyRow(g) && g.offen > 0) {
              acts.push({ type: 'zahlung' as const, onClick: () => void openZahlungDialog(g) });
            }
            acts.push({ type: 'edit' as const, onClick: () => void openEditDialog(g) });
            acts.push({ type: 'delete' as const, onClick: () => void openDeleteDialog(g) });
            return acts;
          }
        : undefined
  }));

  return (
    <MainApp title="Gläubiger">
      <div className="space-y-4">
        {/* Error */}
        {error && <div className="p-4 bg-red-500/10 border border-red-500 rounded text-red-400">{error}</div>}

        {/* Button-Reihe über der Tabelle */}
        <div className="flex justify-end mb-4">
          <Button.Action type="new" onClick={() => setCreateDialogOpen(true)} />
        </div>

        {/* Table */}
        <Table
          data={glaeubiger}
          columns={columns}
          loading={loading}
          emptyMessage={appConfig.empty_states.no_creditors}
          onRowClick={(g) => openHistorieDialog(g)}
        />

        {/* Create Dialog */}
        <Dialog
          open={createDialogOpen}
          onClose={() => {
            setCreateDialogOpen(false);
            resetForm();
          }}
          title={appConfig.components.dialog_titles.new_creditor}
          actions={
            <>
              <Button.Rect
                type="cancel"
                onClick={() => {
                  setCreateDialogOpen(false);
                  resetForm();
                }}
              />
              <Button.Rect onClick={() => void handleCreate()}>{appConfig.components.buttons.create}</Button.Rect>
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
            setSelectedGlaeubiger(null);
            resetForm();
          }}
          title={appConfig.components.dialog_titles.edit_creditor}
          actions={
            <>
              <Button.Rect
                type="cancel"
                onClick={() => {
                  setEditDialogOpen(false);
                  setSelectedGlaeubiger(null);
                  resetForm();
                }}
              />
              <Button.Rect type="save" onClick={() => void handleUpdate()} />
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
            setSelectedGlaeubiger(null);
          }}
          title={appConfig.components.dialog_titles.delete_creditor}
          actions={
            <>
              <Button.Rect
                type="cancel"
                onClick={() => {
                  setDeleteDialogOpen(false);
                  setSelectedGlaeubiger(null);
                }}
              />
              <Button.Rect onClick={() => void handleDelete()}>{appConfig.components.buttons.delete}</Button.Rect>
            </>
          }
        >
          <p className="text-neutral-300">
            {appConfig.messages.confirm_delete_creditor.replace('{name}', selectedGlaeubiger?.name || '')}
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
          title={appConfig.components.dialog_titles.record_payment}
          actions={
            <>
              <Button.Rect
                type="cancel"
                onClick={() => {
                  setZahlungDialogOpen(false);
                  setSelectedGlaeubiger(null);
                  setZahlungbetrag(0);
                }}
              />
              <Button.Rect onClick={() => void handleZahlung()}>{appConfig.components.buttons.record}</Button.Rect>
            </>
          }
        >
          <div className="space-y-4">
            <div className="p-4 bg-neutral-800 rounded">
              <p className="text-neutral-400 text-sm">{appConfig.labels.open_amount}</p>
              <p className="text-2xl font-semibold text-neutral-50">{formatCurrency(selectedGlaeubiger?.offen || 0)}</p>
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
            setSelectedGlaeubiger(null);
            setZahlungsHistorie([]);
          }}
          title={
            selectedGlaeubiger
              ? `${appConfig.components.dialog_titles.history}: ${selectedGlaeubiger.name}`
              : appConfig.components.dialog_titles.history
          }
          actions={
            <Button
              onClick={() => {
                setHistorieDialogOpen(false);
                setSelectedGlaeubiger(null);
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
                      <span
                        className={`px-2 py-1 rounded text-sm ${
                          payment.status === 'bezahlt'
                            ? 'bg-green-500/20 text-green-300'
                            : payment.status === 'teilbezahlt'
                              ? 'bg-yellow-500/20 text-yellow-300'
                              : 'bg-red-500/20 text-red-300'
                        }`}
                      >
                        {payment.status === 'bezahlt'
                          ? 'Bezahlt'
                          : payment.status === 'teilbezahlt'
                            ? 'Teilbezahlt'
                            : 'Offen'}
                      </span>
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
    </MainApp>
  );
}
