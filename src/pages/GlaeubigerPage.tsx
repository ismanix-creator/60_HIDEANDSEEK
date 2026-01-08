/**
 * @file        GlaeubigerPage.tsx
 * @description Gläubiger-Verwaltung Seite
 * @version     0.1.0
 * @created     2026-01-07 01:36:51 CET
 * @updated     2026-01-07 01:36:51 CET
 * @author      frontend-entwickler
 *
 * @changelog
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
        setError(result.error || 'Fehler beim Laden');
      }
    } catch (err) {
      setError('Netzwerkfehler');
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
        setError(result.error || 'Fehler beim Erstellen');
      }
    } catch (err) {
      setError('Netzwerkfehler');
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
        setError(result.error || 'Fehler beim Aktualisieren');
      }
    } catch (err) {
      setError('Netzwerkfehler');
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
        setError(result.error || 'Fehler beim Löschen');
      }
    } catch (err) {
      setError('Netzwerkfehler');
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
        setError(result.error || 'Fehler beim Verbuchen');
      }
    } catch (err) {
      setError('Netzwerkfehler');
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
    { key: 'datum', label: 'Datum', render: (g: Glaeubiger) => formatDate(g.datum) },
    { key: 'name', label: 'Name' },
    { key: 'betrag', label: 'betrag', render: (g: Glaeubiger) => formatCurrency(g.betrag) },
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
            <Button size="sm" variant="success" onClick={() => openZahlungDialog(g)}>
              Zahlung
            </Button>
          )}
          <Button size="sm" variant="secondary" onClick={() => openEditDialog(g)}>
            Bearbeiten
          </Button>
          <Button size="sm" variant="danger" onClick={() => openDeleteDialog(g)}>
            Löschen
          </Button>
        </div>
      )
    }
  ];

  return (
    <PageLayout title="Gläubiger">
      <div className="space-y-4">
        {/* Header */}
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-semibold text-neutral-50">Gläubiger-Verwaltung</h2>
          <Button onClick={() => setCreateDialogOpen(true)}>Neuer Gläubiger</Button>
        </div>

        {/* Error */}
        {error && <div className="p-4 bg-red-500/10 border border-red-500 rounded text-red-400">{error}</div>}

        {/* Table */}
        <Table data={glaeubiger} columns={columns} loading={loading} emptyMessage="Keine Gläubiger vorhanden" />

        {/* Create Dialog */}
        <Dialog
          open={createDialogOpen}
          onClose={() => {
            setCreateDialogOpen(false);
            resetForm();
          }}
          title="Neuer Gläubiger"
          actions={
            <>
              <Button
                variant="secondary"
                onClick={() => {
                  setCreateDialogOpen(false);
                  resetForm();
                }}
              >
                Abbrechen
              </Button>
              <Button onClick={handleCreate}>Erstellen</Button>
            </>
          }
        >
          <div className="space-y-4">
            <Input
              label="Datum"
              type="date"
              value={formData.datum}
              onChange={(e) => setFormData({ ...formData, datum: e.target.value })}
            />
            <Input
              label="Name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            />
            <Input
              label="betrag"
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
          title="Gläubiger bearbeiten"
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
                Abbrechen
              </Button>
              <Button onClick={handleUpdate}>Speichern</Button>
            </>
          }
        >
          <div className="space-y-4">
            <Input
              label="Datum"
              type="date"
              value={formData.datum}
              onChange={(e) => setFormData({ ...formData, datum: e.target.value })}
            />
            <Input
              label="Name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            />
            <Input
              label="betrag"
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
          title="Gläubiger löschen"
          actions={
            <>
              <Button
                variant="secondary"
                onClick={() => {
                  setDeleteDialogOpen(false);
                  setSelectedGlaeubiger(null);
                }}
              >
                Abbrechen
              </Button>
              <Button variant="danger" onClick={handleDelete}>
                Löschen
              </Button>
            </>
          }
        >
          <p className="text-neutral-300">Möchten Sie den Gläubiger "{selectedGlaeubiger?.name}" wirklich löschen?</p>
        </Dialog>

        {/* Zahlung Dialog */}
        <Dialog
          open={zahlungDialogOpen}
          onClose={() => {
            setZahlungDialogOpen(false);
            setSelectedGlaeubiger(null);
            setZahlungbetrag(0);
          }}
          title="Zahlung verbuchen"
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
                Abbrechen
              </Button>
              <Button onClick={handleZahlung}>Verbuchen</Button>
            </>
          }
        >
          <div className="space-y-4">
            <div className="p-4 bg-neutral-800 rounded">
              <p className="text-neutral-400 text-sm">Offener betrag</p>
              <p className="text-2xl font-semibold text-neutral-50">{formatCurrency(selectedGlaeubiger?.offen || 0)}</p>
            </div>
            <Input
              label="Zahlungsbetrag"
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
