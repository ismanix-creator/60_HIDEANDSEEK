/**
 * @file        GlaeubigerPage.tsx
 * @description Gläubiger-Verwaltung Seite
 * @version     0.4.0
 * @created     2026-01-07 01:36:51 CET
 * @updated     2026-01-09 21:03:15 CET
 * @author      Akki Scholze
 *
 * @changelog
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
import { HandCoins, Pencil, Trash2, DollarSign } from 'lucide-react';
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
  const [selectedGlaeubiger, setSelectedGlaeubiger] = useState<Glaeubiger | null>(null);

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
  const loadGlaeubiger = async () => {
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
    loadGlaeubiger();
  }, []);

  // Create Gläubiger
  const handleCreate = async () => {
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
  const handleUpdate = async () => {
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
  const handleDelete = async () => {
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
  const handleZahlung = async () => {
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
    { key: 'betrag', label: appConfig.ui.labels.amount, type: 'input' as const, render: (g: Glaeubiger) => <span style={{ fontFamily: 'JetBrains Mono, monospace' }}>{formatCurrency(g.betrag)}</span> },
    { key: 'bezahlt', label: 'Bezahlt', render: (g: Glaeubiger) => formatCurrency(g.bezahlt) },
    { key: 'offen', label: 'Offen', render: (g: Glaeubiger) => formatCurrency(g.offen) },
    {
      key: 'faelligkeit',
      label: 'Fälligkeit',
      render: (g: Glaeubiger) => (g.faelligkeit ? formatDate(g.faelligkeit) : '-')
    },
    {
      key: 'status',
      label: 'Status',
      render: (g: Glaeubiger) => (
        <Badge variant={g.status === 'bezahlt' ? 'success' : g.status === 'teilbezahlt' ? 'warning' : 'error'}>
          {g.status === 'bezahlt' ? 'Bezahlt' : g.status === 'teilbezahlt' ? 'Teilbezahlt' : 'Offen'}
        </Badge>
      )
    },
    {
      key: 'actions',
      label: 'Aktionen',
      render: (g: Glaeubiger) => (
        <div className="flex gap-2">
          {g.offen > 0 && (
            <Button icon={<DollarSign />} iconOnly size="sm" variant="success" onClick={() => openZahlungDialog(g)} title={appConfig.ui.tooltips.payment} />
          )}
          <Button icon={<Pencil />} iconOnly size="sm" variant="secondary" onClick={() => openEditDialog(g)} title={appConfig.ui.tooltips.edit} />
          <Button icon={<Trash2 />} iconOnly size="sm" variant="danger" onClick={() => openDeleteDialog(g)} title={appConfig.ui.tooltips.delete} />
        </div>
      )
    }
  ];

  return (
    <PageLayout 
      title={appConfig.ui.page_titles.creditors}
      actions={
        <Button icon={<HandCoins />} iconOnly variant="transparent" size="lg" onClick={() => setCreateDialogOpen(true)} title={appConfig.ui.dialog_titles.new_creditor} />
      }
    >
      <div className="space-y-4">
        {/* Error */}
        {error && <div className="p-4 bg-red-500/10 border border-red-500 rounded text-red-400">{error}</div>}

        {/* Table */}
        <Table data={glaeubiger} columns={columns} loading={loading} emptyMessage={appConfig.ui.empty_states.no_creditors} />

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
              label="Fälligkeit (optional)"
              type="date"
              value={formData.faelligkeit}
              onChange={(e) => setFormData({ ...formData, faelligkeit: e.target.value })}
            />
            <Input
              label="Notiz (optional)"
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
                variant="secondary"
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
              label="Fälligkeit (optional)"
              type="date"
              value={formData.faelligkeit}
              onChange={(e) => setFormData({ ...formData, faelligkeit: e.target.value })}
            />
            <Input
              label="Notiz (optional)"
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
                variant="secondary"
                onClick={() => {
                  setDeleteDialogOpen(false);
                  setSelectedGlaeubiger(null);
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
          <p className="text-neutral-300">{appConfig.ui.messages.confirm_delete_creditor.replace('{name}', selectedGlaeubiger?.name || '')}</p>
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
                variant="secondary"
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
              <p className="text-neutral-400 text-sm">Offener {appConfig.ui.labels.amount}</p>
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
      </div>
    </PageLayout>
  );
}
