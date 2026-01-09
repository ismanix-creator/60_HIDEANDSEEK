/**
 * @file        SchuldnerPage.tsx
 * @description Schuldner-Verwaltung Seite
 * @version     0.4.0
 * @created     2026-01-07 01:36:51 CET
 * @updated     2026-01-09 21:48:22 CET
 * @author      Akki Scholze
 *
 * @changelog
 *   0.4.0 - 2026-01-09 - 19 Hardcodes durch appConfig.ui.* ersetzt (Phase 2.3)
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
import { Wallet, Pencil, Trash2, DollarSign } from 'lucide-react';
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
  const [selectedSchuldner, setSelectedSchuldner] = useState<Schuldner | null>(null);

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
  const loadSchuldner = async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await api.fetch<Schuldner[]>('/api/schuldner');
      if (result.success && result.data) {
        setSchuldner(result.data);
      } else {
        setError(result.error || 'Fehler beim Laden');
      }
    } catch (err) {
      setError('Netzwerkfehler');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSchuldner();
  }, []);

  // Create Schuldner
  const handleCreate = async () => {
    try {
      const result = await api.fetch('/api/schuldner', {
        method: 'POST',
        body: JSON.stringify(formData)
      });
      if (result.success) {
        setCreateDialogOpen(false);
        resetForm();
        loadSchuldner();
      } else {
        setError(result.error || 'Fehler beim Erstellen');
      }
    } catch (err) {
      setError('Netzwerkfehler');
    }
  };

  // Update Schuldner
  const handleUpdate = async () => {
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
        loadSchuldner();
      } else {
        setError(result.error || 'Fehler beim Aktualisieren');
      }
    } catch (err) {
      setError('Netzwerkfehler');
    }
  };

  // Delete Schuldner
  const handleDelete = async () => {
    if (!selectedSchuldner) return;
    try {
      const result = await api.fetch(`/api/schuldner/${selectedSchuldner.id}`, {
        method: 'DELETE'
      });
      if (result.success) {
        setDeleteDialogOpen(false);
        setSelectedSchuldner(null);
        loadSchuldner();
      } else {
        setError(result.error || 'Fehler beim Löschen');
      }
    } catch (err) {
      setError('Netzwerkfehler');
    }
  };

  // Zahlung verbuchen
  const handleZahlung = async () => {
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
        loadSchuldner();
      } else {
        setError(result.error || 'Fehler beim Verbuchen');
      }
    } catch (err) {
      setError('Netzwerkfehler');
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
    { key: 'datum', label: 'Datum', render: (s: Schuldner) => formatDate(s.datum) },
    { key: 'name', label: 'Name', type: 'input' as const },
    { key: 'betrag', label: 'betrag', type: 'input' as const, render: (s: Schuldner) => <span style={{ fontFamily: 'JetBrains Mono, monospace' }}>{formatCurrency(s.betrag)}</span> },
    { key: 'bezahlt', label: 'Bezahlt', render: (s: Schuldner) => formatCurrency(s.bezahlt) },
    { key: 'offen', label: 'Offen', render: (s: Schuldner) => formatCurrency(s.offen) },
    {
      key: 'faelligkeit',
      label: 'Fälligkeit',
      render: (s: Schuldner) => (s.faelligkeit ? formatDate(s.faelligkeit) : '-')
    },
    {
      key: 'status',
      label: 'Status',
      render: (s: Schuldner) => (
        <Badge variant={s.status === 'bezahlt' ? 'success' : s.status === 'teilbezahlt' ? 'warning' : 'error'}>
          {s.status === 'bezahlt' ? 'Bezahlt' : s.status === 'teilbezahlt' ? 'Teilbezahlt' : 'Offen'}
        </Badge>
      )
    },
    {
      key: 'actions',
      label: 'Aktionen',
      render: (s: Schuldner) => (
        <div className="flex gap-2">
          {s.offen > 0 && (
            <Button icon={<DollarSign />} iconOnly size="sm" variant="success" onClick={() => openZahlungDialog(s)} title={appConfig.ui.tooltips.record} />
          )}
          <Button icon={<Pencil />} iconOnly size="sm" variant="secondary" onClick={() => openEditDialog(s)} title={appConfig.ui.tooltips.edit} />
          <Button icon={<Trash2 />} iconOnly size="sm" variant="danger" onClick={() => openDeleteDialog(s)} title={appConfig.ui.tooltips.delete} />
        </div>
      )
    }
  ];

  return (
    <PageLayout 
      title={appConfig.ui.pages.debtors}
      actions={
        <Button icon={<Wallet />} iconOnly variant="transparent" size="lg" onClick={() => setCreateDialogOpen(true)} title={appConfig.ui.tooltips.create} />
      }
    >
      <div className="space-y-4">
        {/* Error */}
        {error && <div className="p-4 bg-red-500/10 border border-red-500 rounded text-red-400">{error}</div>}

        {/* Table */}
        <Table data={schuldner} columns={columns} loading={loading} emptyMessage={appConfig.ui.empty_states.no_debtors} />

        {/* Create Dialog */}
        <Dialog
          open={createDialogOpen}
          onClose={() => {
            setCreateDialogOpen(false);
            resetForm();
          }}
          title={appConfig.ui.dialogs.new_debtor}
          actions={
            <>
              <Button
                variant="secondary"
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
            setSelectedSchuldner(null);
            resetForm();
          }}
          title={appConfig.ui.dialogs.edit_debtor}
          actions={
            <>
              <Button
                variant="secondary"
                onClick={() => {
                  setEditDialogOpen(false);
                  setSelectedSchuldner(null);
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
            setSelectedSchuldner(null);
          }}
          title={appConfig.ui.dialogs.delete_debtor}
          actions={
            <>
              <Button
                variant="secondary"
                onClick={() => {
                  setDeleteDialogOpen(false);
                  setSelectedSchuldner(null);
                }}
              >
                {appConfig.ui.buttons.cancel}
              </Button>
              <Button variant="danger" onClick={handleDelete}>
                {appConfig.ui.buttons.delete}
              </Button>
            </>
          }
        >
          <p className="text-neutral-300">{appConfig.ui.messages.confirm_delete_debtor.replace('{name}', selectedSchuldner?.name || '')}</p>
        </Dialog>

        {/* Zahlung Dialog */}
        <Dialog
          open={zahlungDialogOpen}
          onClose={() => {
            setZahlungDialogOpen(false);
            setSelectedSchuldner(null);
            setZahlungbetrag(0);
          }}
          title={appConfig.ui.dialogs.record_payment}
          actions={
            <>
              <Button
                variant="secondary"
                onClick={() => {
                  setZahlungDialogOpen(false);
                  setSelectedSchuldner(null);
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
              <p className="text-2xl font-semibold text-neutral-50">{formatCurrency(selectedSchuldner?.offen || 0)}</p>
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
      </div>
    </PageLayout>
  );
}
