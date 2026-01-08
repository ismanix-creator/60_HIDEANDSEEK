/**
 * @file        KundenPage.tsx
 * @description Kunden-Verwaltung mit Übersicht und Detail-Ansicht
 * @version     0.1.0
 * @created     2026-01-07 01:36:51 CET
 * @updated     2026-01-07 01:36:51 CET
 * @author      frontend-entwickler
 *
 * @changelog
 *   0.1.0 - 2026-01-07 - Initial implementation mit 2 Ansichten
 */

import { useState, useEffect } from 'react';
import { PageLayout } from '@/components/layout/PageLayout';
import { Table } from '@/components/ui/Table';
import { Button } from '@/components/ui/Button';
import { Dialog } from '@/components/ui/Dialog';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Badge } from '@/components/ui/Badge';
import { useApi } from '@/hooks/useApi';
import { formatCurrency, formatDate } from '@/utils/format';
import type {
  Kunde,
  KundeWithSummary,
  Material,
  KundenPostenMat,
  KundenPostenNoMat,
  CreateKundeRequest,
  UpdateKundeRequest,
  CreateKundenPostenMatRequest,
  CreateKundenPostenNoMatRequest,
  ZahlungRequest
} from '@/types';

type View = 'overview' | 'detail';

export function KundenPage() {
  const api = useApi();
  const [view, setView] = useState<View>('overview');
  const [selectedKunde, setSelectedKunde] = useState<Kunde | null>(null);

  // Overview Data
  const [kunden, setKunden] = useState<KundeWithSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Detail Data
  const [postenMat, setPostenMat] = useState<KundenPostenMat[]>([]);
  const [postenNoMat, setPostenNoMat] = useState<KundenPostenNoMat[]>([]);
  const [materialien, setMaterialien] = useState<Material[]>([]);
  const [detailLoading, setDetailLoading] = useState(false);

  // Dialog States
  const [createKundeDialogOpen, setCreateKundeDialogOpen] = useState(false);
  const [editKundeDialogOpen, setEditKundeDialogOpen] = useState(false);
  const [deleteKundeDialogOpen, setDeleteKundeDialogOpen] = useState(false);
  const [createPostenMatDialogOpen, setCreatePostenMatDialogOpen] = useState(false);
  const [createPostenNoMatDialogOpen, setCreatePostenNoMatDialogOpen] = useState(false);
  const [zahlungDialogOpen, setZahlungDialogOpen] = useState(false);

  // Form States
  const [kundeFormData, setKundeFormData] = useState<CreateKundeRequest>({ name: '' });
  const [postenMatFormData, setPostenMatFormData] = useState<CreateKundenPostenMatRequest>({
    kunde_id: 0,
    material_id: 0,
    datum: new Date().toISOString().split('T')[0],
    menge: 0,
    preis: 0,
    notiz: ''
  });
  const [postenNoMatFormData, setPostenNoMatFormData] = useState<CreateKundenPostenNoMatRequest>({
    kunde_id: 0,
    datum: new Date().toISOString().split('T')[0],
    bezeichnung: '',
    betrag: 0,
    notiz: ''
  });
  const [zahlungbetrag, setZahlungbetrag] = useState<number>(0);
  const [zahlungType, setZahlungType] = useState<'mat' | 'nomat'>('mat');
  const [selectedPosten, setSelectedPosten] = useState<KundenPostenMat | KundenPostenNoMat | null>(null);

  // Load Kunden Overview
  const loadKunden = async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await api.fetch<Kunde[]>('/api/kunden');
      if (result.success && result.data) {
        // Load Posten for each Kunde to calculate summary
        const kundenWithSummary = await Promise.all(
          result.data.map(async (kunde) => {
            const matResult = await api.fetch<KundenPostenMat[]>(`/api/kunden-posten-mat?kunde_id=${kunde.id}`);
            const nomatResult = await api.fetch<KundenPostenNoMat[]>(`/api/kunden-posten-nomat?kunde_id=${kunde.id}`);

            const matPosten = matResult.success && matResult.data ? matResult.data : [];
            const nomatPosten = nomatResult.success && nomatResult.data ? nomatResult.data : [];

            const gesamt =
              matPosten.reduce((sum, p) => sum + p.preis, 0) + nomatPosten.reduce((sum, p) => sum + p.betrag, 0);
            const bezahlt =
              matPosten.reduce((sum, p) => sum + p.bezahlt, 0) + nomatPosten.reduce((sum, p) => sum + p.bezahlt, 0);
            const offen =
              matPosten.reduce((sum, p) => sum + p.offen, 0) + nomatPosten.reduce((sum, p) => sum + p.offen, 0);

            const status: 'offen' | 'teilbezahlt' | 'bezahlt' =
              offen === 0 ? 'bezahlt' : bezahlt === 0 ? 'offen' : 'teilbezahlt';

            return {
              ...kunde,
              gesamt,
              bezahlt,
              offen,
              status
            };
          })
        );

        setKunden(kundenWithSummary);
      } else {
        setError(result.error || 'Fehler beim Laden');
      }
    } catch (err) {
      setError('Netzwerkfehler');
    } finally {
      setLoading(false);
    }
  };

  // Load Kunde Detail
  const loadKundeDetail = async (kundeId: number) => {
    setDetailLoading(true);
    setError(null);
    try {
      const [matResult, nomatResult, materialResult] = await Promise.all([
        api.fetch<KundenPostenMat[]>(`/api/kunden-posten-mat?kunde_id=${kundeId}`),
        api.fetch<KundenPostenNoMat[]>(`/api/kunden-posten-nomat?kunde_id=${kundeId}`),
        api.fetch<Material[]>('/api/material')
      ]);

      if (matResult.success && matResult.data) {
        setPostenMat(matResult.data);
      }
      if (nomatResult.success && nomatResult.data) {
        setPostenNoMat(nomatResult.data);
      }
      if (materialResult.success && materialResult.data) {
        setMaterialien(materialResult.data);
      }
    } catch (err) {
      setError('Netzwerkfehler');
    } finally {
      setDetailLoading(false);
    }
  };

  useEffect(() => {
    loadKunden();
  }, []);

  useEffect(() => {
    if (view === 'detail' && selectedKunde) {
      loadKundeDetail(selectedKunde.id);
    }
  }, [view, selectedKunde]);

  // Switch to Detail View
  const handleRowClick = (kunde: KundeWithSummary) => {
    setSelectedKunde(kunde);
    setView('detail');
  };

  // Back to Overview
  const handleBackToOverview = () => {
    setView('overview');
    setSelectedKunde(null);
    setPostenMat([]);
    setPostenNoMat([]);
  };

  // Create Kunde
  const handleCreateKunde = async () => {
    try {
      const result = await api.fetch('/api/kunden', {
        method: 'POST',
        body: JSON.stringify(kundeFormData)
      });
      if (result.success) {
        setCreateKundeDialogOpen(false);
        setKundeFormData({ name: '' });
        loadKunden();
      } else {
        setError(result.error || 'Fehler beim Erstellen');
      }
    } catch (err) {
      setError('Netzwerkfehler');
    }
  };

  // Update Kunde
  const handleUpdateKunde = async () => {
    if (!selectedKunde) return;
    try {
      const updateData: UpdateKundeRequest = {
        id: selectedKunde.id,
        name: kundeFormData.name
      };
      const result = await api.fetch(`/api/kunden/${selectedKunde.id}`, {
        method: 'PUT',
        body: JSON.stringify(updateData)
      });
      if (result.success) {
        setEditKundeDialogOpen(false);
        setKundeFormData({ name: '' });
        loadKunden();
        if (view === 'detail') {
          setSelectedKunde({ ...selectedKunde, name: kundeFormData.name });
        }
      } else {
        setError(result.error || 'Fehler beim Aktualisieren');
      }
    } catch (err) {
      setError('Netzwerkfehler');
    }
  };

  // Delete Kunde
  const handleDeleteKunde = async () => {
    if (!selectedKunde) return;
    try {
      const result = await api.fetch(`/api/kunden/${selectedKunde.id}`, {
        method: 'DELETE'
      });
      if (result.success) {
        setDeleteKundeDialogOpen(false);
        setSelectedKunde(null);
        loadKunden();
        if (view === 'detail') {
          handleBackToOverview();
        }
      } else {
        setError(result.error || 'Fehler beim Löschen');
      }
    } catch (err) {
      setError('Netzwerkfehler');
    }
  };

  // Create Posten Mat
  const handleCreatePostenMat = async () => {
    if (!selectedKunde) return;
    try {
      const data = { ...postenMatFormData, kunde_id: selectedKunde.id };
      const result = await api.fetch('/api/kunden-posten-mat', {
        method: 'POST',
        body: JSON.stringify(data)
      });
      if (result.success) {
        setCreatePostenMatDialogOpen(false);
        resetPostenMatForm();
        loadKundeDetail(selectedKunde.id);
      } else {
        setError(result.error || 'Fehler beim Erstellen');
      }
    } catch (err) {
      setError('Netzwerkfehler');
    }
  };

  // Create Posten NoMat
  const handleCreatePostenNoMat = async () => {
    if (!selectedKunde) return;
    try {
      const data = { ...postenNoMatFormData, kunde_id: selectedKunde.id };
      const result = await api.fetch('/api/kunden-posten-nomat', {
        method: 'POST',
        body: JSON.stringify(data)
      });
      if (result.success) {
        setCreatePostenNoMatDialogOpen(false);
        resetPostenNoMatForm();
        loadKundeDetail(selectedKunde.id);
      } else {
        setError(result.error || 'Fehler beim Erstellen');
      }
    } catch (err) {
      setError('Netzwerkfehler');
    }
  };

  // Zahlung verbuchen
  const handleZahlung = async () => {
    if (!selectedPosten) return;
    try {
      const zahlungData: ZahlungRequest = { betrag: zahlungbetrag };
      const endpoint =
        zahlungType === 'mat'
          ? `/api/kunden-posten-mat/${selectedPosten.id}/zahlung`
          : `/api/kunden-posten-nomat/${selectedPosten.id}/zahlung`;

      const result = await api.fetch(endpoint, {
        method: 'POST',
        body: JSON.stringify(zahlungData)
      });
      if (result.success) {
        setZahlungDialogOpen(false);
        setSelectedPosten(null);
        setZahlungbetrag(0);
        if (selectedKunde) {
          loadKundeDetail(selectedKunde.id);
        }
      } else {
        setError(result.error || 'Fehler beim Verbuchen');
      }
    } catch (err) {
      setError('Netzwerkfehler');
    }
  };

  // Open Zahlung Dialog
  const openZahlungDialog = (posten: KundenPostenMat | KundenPostenNoMat, type: 'mat' | 'nomat') => {
    setSelectedPosten(posten);
    setZahlungType(type);
    setZahlungbetrag(posten.offen);
    setZahlungDialogOpen(true);
  };

  // Reset Forms
  const resetPostenMatForm = () => {
    setPostenMatFormData({
      kunde_id: 0,
      material_id: 0,
      datum: new Date().toISOString().split('T')[0],
      menge: 0,
      preis: 0,
      notiz: ''
    });
  };

  const resetPostenNoMatForm = () => {
    setPostenNoMatFormData({
      kunde_id: 0,
      datum: new Date().toISOString().split('T')[0],
      bezeichnung: '',
      betrag: 0,
      notiz: ''
    });
  };

  // Overview Columns
  const overviewColumns = [
    { key: 'name', label: 'Name' },
    { key: 'gesamt', label: 'Gesamt', render: (k: KundeWithSummary) => formatCurrency(k.gesamt) },
    { key: 'bezahlt', label: 'Bezahlt', render: (k: KundeWithSummary) => formatCurrency(k.bezahlt) },
    { key: 'offen', label: 'Offen', render: (k: KundeWithSummary) => formatCurrency(k.offen) },
    {
      key: 'status',
      label: 'Status',
      render: (k: KundeWithSummary) => (
        <Badge variant={k.status === 'bezahlt' ? 'success' : k.status === 'teilbezahlt' ? 'warning' : 'error'}>
          {k.status === 'bezahlt' ? 'Bezahlt' : k.status === 'teilbezahlt' ? 'Teilbezahlt' : 'Offen'}
        </Badge>
      )
    }
  ];

  // Detail Columns
  const postenMatColumns = [
    { key: 'datum', label: 'Datum', render: (p: KundenPostenMat) => formatDate(p.datum) },
    {
      key: 'material',
      label: 'Material',
      render: (p: KundenPostenMat) => {
        const mat = materialien.find((m) => m.id === p.material_id);
        return mat?.bezeichnung || `Material #${p.material_id}`;
      }
    },
    { key: 'menge', label: 'Menge', render: (p: KundenPostenMat) => p.menge.toFixed(2) },
    { key: 'preis', label: 'Preis', render: (p: KundenPostenMat) => formatCurrency(p.preis) },
    { key: 'bezahlt', label: 'Bezahlt', render: (p: KundenPostenMat) => formatCurrency(p.bezahlt) },
    { key: 'offen', label: 'Offen', render: (p: KundenPostenMat) => formatCurrency(p.offen) },
    {
      key: 'status',
      label: 'Status',
      render: (p: KundenPostenMat) => (
        <Badge variant={p.status === 'bezahlt' ? 'success' : p.status === 'teilbezahlt' ? 'warning' : 'error'}>
          {p.status === 'bezahlt' ? 'Bezahlt' : p.status === 'teilbezahlt' ? 'Teilbezahlt' : 'Offen'}
        </Badge>
      )
    },
    {
      key: 'actions',
      label: 'Aktionen',
      render: (p: KundenPostenMat) => (
        <div className="flex gap-2">
          {p.offen > 0 && (
            <Button size="sm" variant="success" onClick={() => openZahlungDialog(p, 'mat')}>
              Zahlung
            </Button>
          )}
        </div>
      )
    }
  ];

  const postenNoMatColumns = [
    { key: 'datum', label: 'Datum', render: (p: KundenPostenNoMat) => formatDate(p.datum) },
    { key: 'bezeichnung', label: 'Bezeichnung' },
    { key: 'betrag', label: 'betrag', render: (p: KundenPostenNoMat) => formatCurrency(p.betrag) },
    { key: 'bezahlt', label: 'Bezahlt', render: (p: KundenPostenNoMat) => formatCurrency(p.bezahlt) },
    { key: 'offen', label: 'Offen', render: (p: KundenPostenNoMat) => formatCurrency(p.offen) },
    {
      key: 'status',
      label: 'Status',
      render: (p: KundenPostenNoMat) => (
        <Badge variant={p.status === 'bezahlt' ? 'success' : p.status === 'teilbezahlt' ? 'warning' : 'error'}>
          {p.status === 'bezahlt' ? 'Bezahlt' : p.status === 'teilbezahlt' ? 'Teilbezahlt' : 'Offen'}
        </Badge>
      )
    },
    {
      key: 'actions',
      label: 'Aktionen',
      render: (p: KundenPostenNoMat) => (
        <div className="flex gap-2">
          {p.offen > 0 && (
            <Button size="sm" variant="success" onClick={() => openZahlungDialog(p, 'nomat')}>
              Zahlung
            </Button>
          )}
        </div>
      )
    }
  ];

  // Render Overview
  if (view === 'overview') {
    return (
      <PageLayout title="Kunden">
        <div className="space-y-4">
          {/* Header */}
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-semibold text-neutral-50">Kunden-Übersicht</h2>
            <Button onClick={() => setCreateKundeDialogOpen(true)}>Neuer Kunde</Button>
          </div>

          {/* Error */}
          {error && <div className="p-4 bg-red-500/10 border border-red-500 rounded text-red-400">{error}</div>}

          {/* Table */}
          <Table
            data={kunden}
            columns={overviewColumns}
            loading={loading}
            emptyMessage="Keine Kunden vorhanden"
            onRowClick={handleRowClick}
          />

          {/* Create Kunde Dialog */}
          <Dialog
            open={createKundeDialogOpen}
            onClose={() => {
              setCreateKundeDialogOpen(false);
              setKundeFormData({ name: '' });
            }}
            title="Neuer Kunde"
            actions={
              <>
                <Button
                  variant="secondary"
                  onClick={() => {
                    setCreateKundeDialogOpen(false);
                    setKundeFormData({ name: '' });
                  }}
                >
                  Abbrechen
                </Button>
                <Button onClick={handleCreateKunde}>Erstellen</Button>
              </>
            }
          >
            <Input
              label="Name"
              value={kundeFormData.name}
              onChange={(e) => setKundeFormData({ name: e.target.value })}
            />
          </Dialog>
        </div>
      </PageLayout>
    );
  }

  // Render Detail
  return (
    <PageLayout title={`Kunde: ${selectedKunde?.name || ''}`}>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-4">
            <Button variant="secondary" onClick={handleBackToOverview}>
              ← Zurück
            </Button>
            <h2 className="text-2xl font-semibold text-neutral-50">{selectedKunde?.name}</h2>
          </div>
          <div className="flex gap-2">
            <Button
              variant="secondary"
              onClick={() => {
                if (selectedKunde) {
                  setKundeFormData({ name: selectedKunde.name });
                  setEditKundeDialogOpen(true);
                }
              }}
            >
              Bearbeiten
            </Button>
            <Button variant="danger" onClick={() => setDeleteKundeDialogOpen(true)}>
              Löschen
            </Button>
          </div>
        </div>

        {/* Error */}
        {error && <div className="p-4 bg-red-500/10 border border-red-500 rounded text-red-400">{error}</div>}

        {/* Material-Posten */}
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <h3 className="text-xl font-semibold text-neutral-50">Material-Posten</h3>
            <Button onClick={() => setCreatePostenMatDialogOpen(true)}>Neuer Posten</Button>
          </div>
          <Table
            data={postenMat}
            columns={postenMatColumns}
            loading={detailLoading}
            emptyMessage="Keine Material-Posten vorhanden"
          />
        </div>

        {/* Sonstige Posten */}
        {postenNoMat.length > 0 && (
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <h3 className="text-xl font-semibold text-neutral-50">Sonstige Posten</h3>
              <Button onClick={() => setCreatePostenNoMatDialogOpen(true)}>Neuer Posten</Button>
            </div>
            <Table
              data={postenNoMat}
              columns={postenNoMatColumns}
              loading={detailLoading}
              emptyMessage="Keine sonstigen Posten vorhanden"
            />
          </div>
        )}

        {/* Dialogs */}
        {/* Edit Kunde Dialog */}
        <Dialog
          open={editKundeDialogOpen}
          onClose={() => {
            setEditKundeDialogOpen(false);
            setKundeFormData({ name: '' });
          }}
          title="Kunde bearbeiten"
          actions={
            <>
              <Button
                variant="secondary"
                onClick={() => {
                  setEditKundeDialogOpen(false);
                  setKundeFormData({ name: '' });
                }}
              >
                Abbrechen
              </Button>
              <Button onClick={handleUpdateKunde}>Speichern</Button>
            </>
          }
        >
          <Input label="Name" value={kundeFormData.name} onChange={(e) => setKundeFormData({ name: e.target.value })} />
        </Dialog>

        {/* Delete Kunde Dialog */}
        <Dialog
          open={deleteKundeDialogOpen}
          onClose={() => setDeleteKundeDialogOpen(false)}
          title="Kunde löschen"
          actions={
            <>
              <Button variant="secondary" onClick={() => setDeleteKundeDialogOpen(false)}>
                Abbrechen
              </Button>
              <Button variant="danger" onClick={handleDeleteKunde}>
                Löschen
              </Button>
            </>
          }
        >
          <p className="text-neutral-300">
            Möchten Sie den Kunden "{selectedKunde?.name}" wirklich löschen? Alle zugehörigen Posten werden ebenfalls
            gelöscht.
          </p>
        </Dialog>

        {/* Create Posten Mat Dialog */}
        <Dialog
          open={createPostenMatDialogOpen}
          onClose={() => {
            setCreatePostenMatDialogOpen(false);
            resetPostenMatForm();
          }}
          title="Neuer Material-Posten"
          actions={
            <>
              <Button
                variant="secondary"
                onClick={() => {
                  setCreatePostenMatDialogOpen(false);
                  resetPostenMatForm();
                }}
              >
                Abbrechen
              </Button>
              <Button onClick={handleCreatePostenMat}>Erstellen</Button>
            </>
          }
        >
          <div className="space-y-4">
            <Input
              label="Datum"
              type="date"
              value={postenMatFormData.datum}
              onChange={(e) => setPostenMatFormData({ ...postenMatFormData, datum: e.target.value })}
            />
            <Select
              label="Material"
              value={postenMatFormData.material_id.toString()}
              onChange={(e) => setPostenMatFormData({ ...postenMatFormData, material_id: parseInt(e.target.value) })}
              options={materialien.map((m) => ({ value: m.id.toString(), label: m.bezeichnung }))}
            />
            <Input
              label="Menge"
              type="number"
              step="0.01"
              value={postenMatFormData.menge}
              onChange={(e) => setPostenMatFormData({ ...postenMatFormData, menge: parseFloat(e.target.value) || 0 })}
            />
            <Input
              label="Preis"
              type="number"
              step="0.01"
              value={postenMatFormData.preis}
              onChange={(e) => setPostenMatFormData({ ...postenMatFormData, preis: parseFloat(e.target.value) || 0 })}
            />
            <Input
              label="Notiz (optional)"
              value={postenMatFormData.notiz}
              onChange={(e) => setPostenMatFormData({ ...postenMatFormData, notiz: e.target.value })}
            />
          </div>
        </Dialog>

        {/* Create Posten NoMat Dialog */}
        <Dialog
          open={createPostenNoMatDialogOpen}
          onClose={() => {
            setCreatePostenNoMatDialogOpen(false);
            resetPostenNoMatForm();
          }}
          title="Neuer sonstiger Posten"
          actions={
            <>
              <Button
                variant="secondary"
                onClick={() => {
                  setCreatePostenNoMatDialogOpen(false);
                  resetPostenNoMatForm();
                }}
              >
                Abbrechen
              </Button>
              <Button onClick={handleCreatePostenNoMat}>Erstellen</Button>
            </>
          }
        >
          <div className="space-y-4">
            <Input
              label="Datum"
              type="date"
              value={postenNoMatFormData.datum}
              onChange={(e) => setPostenNoMatFormData({ ...postenNoMatFormData, datum: e.target.value })}
            />
            <Input
              label="Bezeichnung"
              value={postenNoMatFormData.bezeichnung}
              onChange={(e) => setPostenNoMatFormData({ ...postenNoMatFormData, bezeichnung: e.target.value })}
            />
            <Input
              label="betrag"
              type="number"
              step="0.01"
              value={postenNoMatFormData.betrag}
              onChange={(e) =>
                setPostenNoMatFormData({ ...postenNoMatFormData, betrag: parseFloat(e.target.value) || 0 })
              }
            />
            <Input
              label="Notiz (optional)"
              value={postenNoMatFormData.notiz}
              onChange={(e) => setPostenNoMatFormData({ ...postenNoMatFormData, notiz: e.target.value })}
            />
          </div>
        </Dialog>

        {/* Zahlung Dialog */}
        <Dialog
          open={zahlungDialogOpen}
          onClose={() => {
            setZahlungDialogOpen(false);
            setSelectedPosten(null);
            setZahlungbetrag(0);
          }}
          title="Zahlung verbuchen"
          actions={
            <>
              <Button
                variant="secondary"
                onClick={() => {
                  setZahlungDialogOpen(false);
                  setSelectedPosten(null);
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
              <p className="text-2xl font-semibold text-neutral-50">{formatCurrency(selectedPosten?.offen || 0)}</p>
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
