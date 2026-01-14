/**
 * @file        KundenPage.tsx
 * @description Kunden-Verwaltung mit Übersicht und Detail-Ansicht
 * @version     0.8.0
 * @created     2026-01-07 01:36:51 CET
 * @updated     2026-01-11 22:35:00 CET
 * @author      Akki Scholze
 *
 * @changelog
 *   0.8.0 - 2026-01-11 22:35:00 - Feature: Action Buttons mit disabled-State für Empty Rows (alle 3 Tabellen)
 *   0.7.0 - 2026-01-11 - Fixed: floating promises + unsafe-any errors
 *   0.6.0 - 2026-01-10 12:45:00 - Alle verbleibenden Hardcodes durch appConfig.* ersetzt (Phase 2.3.2 Final)
 *   0.5.0 - 2026-01-09 21:51:40 - 3 verbleibende Hardcodes durch appConfig.labels.* ersetzt (Phase 2.3.B)
 *   0.4.0 - 2026-01-09 21:00:20 - 38 UI-Text-Hardcodes entfernt (Phase 2.3.2)
 *   0.3.1 - 2026-01-09 - Name-Spalte als Monospace (type: 'input')
 *   0.3.0 - 2026-01-09 - Button als actions Prop an PageLayout übergeben (horizontal zentriert)
 *   0.2.0 - 2026-01-09 - Doppelten Header entfernt (PageLayout zeigt bereits Titel)
 *   0.1.0 - 2026-01-07 - Initial implementation mit 2 Ansichten
 */

import { useState, useEffect } from 'react';
import { PageLayout } from '@/components/layout/PageLayout';
import { Table, isEmptyRow } from '@/components/ui/Table';
import { Button } from '@/components/ui/Button';
import { Dialog } from '@/components/ui/Dialog';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Badge } from '@/components/ui/Badge';
import { useApi } from '@/hooks/useApi';
import { formatCurrency, formatDate } from '@/utils/format';
import { appConfig } from '@/config';
import { UserPlus, Pencil, Trash2, DollarSign } from 'lucide-react';
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
  const loadKunden = async (): Promise<void> => {
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
        setError(result.error || appConfig.errors.load_failed);
      }
    } catch (err) {
      setError(appConfig.errors.network_error);
    } finally {
      setLoading(false);
    }
  };

  // Load Kunde Detail
  const loadKundeDetail = async (kundeId: number): Promise<void> => {
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
      setError(appConfig.errors.network_error);
    } finally {
      setDetailLoading(false);
    }
  };

  useEffect(() => {
    void loadKunden();
  }, []);

  useEffect(() => {
    if (view === 'detail' && selectedKunde) {
      void loadKundeDetail(selectedKunde.id);
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
  const handleCreateKunde = async (): Promise<void> => {
    try {
      const result = await api.fetch('/api/kunden', {
        method: 'POST',
        body: JSON.stringify(kundeFormData)
      });
      if (result.success) {
        setCreateKundeDialogOpen(false);
        setKundeFormData({ name: '' });
        void loadKunden();
      } else {
        setError(result.error || appConfig.errors.create_failed);
      }
    } catch (err) {
      setError(appConfig.errors.network_error);
    }
  };

  // Update Kunde
  const handleUpdateKunde = async (): Promise<void> => {
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
        void loadKunden();
        if (view === 'detail') {
          setSelectedKunde({ ...selectedKunde, name: kundeFormData.name });
        }
      } else {
        setError(result.error || appConfig.errors.update_failed);
      }
    } catch (err) {
      setError(appConfig.errors.network_error);
    }
  };

  // Delete Kunde
  const handleDeleteKunde = async (): Promise<void> => {
    if (!selectedKunde) return;
    try {
      const result = await api.fetch(`/api/kunden/${selectedKunde.id}`, {
        method: 'DELETE'
      });
      if (result.success) {
        setDeleteKundeDialogOpen(false);
        setSelectedKunde(null);
        void loadKunden();
        if (view === 'detail') {
          handleBackToOverview();
        }
      } else {
        setError(result.error || appConfig.errors.delete_failed);
      }
    } catch (err) {
      setError(appConfig.errors.network_error);
    }
  };

  // Create Posten Mat
  const handleCreatePostenMat = async (): Promise<void> => {
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
        void loadKundeDetail(selectedKunde.id);
      } else {
        setError(result.error || appConfig.errors.create_failed);
      }
    } catch (err) {
      setError(appConfig.errors.network_error);
    }
  };

  // Create Posten NoMat
  const handleCreatePostenNoMat = async (): Promise<void> => {
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
        void loadKundeDetail(selectedKunde.id);
      } else {
        setError(result.error || appConfig.errors.create_failed);
      }
    } catch (err) {
      setError(appConfig.errors.network_error);
    }
  };

  // Zahlung verbuchen
  const handleZahlung = async (): Promise<void> => {
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
          void loadKundeDetail(selectedKunde.id);
        }
      } else {
        setError(result.error || appConfig.errors.booking_failed);
      }
    } catch (err) {
      setError(appConfig.errors.network_error);
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
  // Render functions per column
  const getOverviewColumnRender = (key: string) => {
    switch (key) {
      case 'gesamt':
        return (k: KundeWithSummary) => formatCurrency(k.gesamt);
      case 'bezahlt':
        return (k: KundeWithSummary) => formatCurrency(k.bezahlt);
      case 'offen':
        return (k: KundeWithSummary) => formatCurrency(k.offen);
      case 'status':
        return (k: KundeWithSummary) => (
          <Badge variant={k.status === 'bezahlt' ? 'success' : k.status === 'teilbezahlt' ? 'warning' : 'error'}>
            {k.status === 'bezahlt'
              ? 'Bezahlt'
              : k.status === 'teilbezahlt'
                ? 'Teilbezahlt'
                : appConfig.labels.open_amount}
          </Badge>
        );
      case 'actions':
        return (k: KundeWithSummary) => (
          <div className="flex gap-2">
            <Button
              kind="act"
              disabled={isEmptyRow(k)}
              onClick={() => {
                setView('detail');
                setSelectedKunde(k);
                setKundeFormData({ name: k.name });
                setEditKundeDialogOpen(true);
              }}
            >
              <Pencil />
            </Button>
            <Button
              kind="act"
              disabled={isEmptyRow(k)}
              onClick={() => {
                setView('detail');
                setSelectedKunde(k);
                setDeleteKundeDialogOpen(true);
              }}
            >
              <Trash2 />
            </Button>
          </div>
        );
      default:
        return undefined;
    }
  };

  const overviewColumns = appConfig.components.table.kunden.columns.map((col) => ({
    key: col.key,
    label: col.label,
    type: col.type as 'text' | 'number' | 'currency' | 'date' | 'status' | 'actions' | 'input' | undefined,
    render: getOverviewColumnRender(col.key)
  }));

  // Detail Columns
  const getPostenMatColumnRender = (key: string) => {
    switch (key) {
      case 'datum':
        return (p: KundenPostenMat) => formatDate(p.datum);
      case 'material':
        return (p: KundenPostenMat) => {
          const mat = materialien.find((m) => m.id === p.material_id);
          return mat?.bezeichnung || `Material #${p.material_id}`;
        };
      case 'menge':
        return (p: KundenPostenMat) => p.menge.toFixed(2);
      case 'preis':
        return (p: KundenPostenMat) => formatCurrency(p.preis);
      case 'bezahlt':
        return (p: KundenPostenMat) => formatCurrency(p.bezahlt);
      case 'offen':
        return (p: KundenPostenMat) => formatCurrency(p.offen);
      case 'status':
        return (p: KundenPostenMat) => (
          <Badge variant={p.status === 'bezahlt' ? 'success' : p.status === 'teilbezahlt' ? 'warning' : 'error'}>
            {p.status === 'bezahlt'
              ? 'Bezahlt'
              : p.status === 'teilbezahlt'
                ? 'Teilbezahlt'
                : appConfig.labels.open_amount}
          </Badge>
        );
      case 'actions':
        return (p: KundenPostenMat) => (
          <div className="flex gap-2">
            {!isEmptyRow(p) && p.offen > 0 && (
              <Button kind="act" onClick={() => openZahlungDialog(p, 'mat')}>
                <DollarSign />
              </Button>
            )}
          </div>
        );
      default:
        return undefined;
    }
  };

  const postenMatColumns = appConfig.components.table.kunden.mat.columns.map((col) => ({
    key: col.key,
    label: col.label,
    type: col.type as 'text' | 'number' | 'currency' | 'date' | 'status' | 'actions' | 'input' | undefined,
    render: getPostenMatColumnRender(col.key)
  }));

  const getPostenNoMatColumnRender = (key: string) => {
    switch (key) {
      case 'datum':
        return (p: KundenPostenNoMat) => formatDate(p.datum);
      case 'betrag':
        return (p: KundenPostenNoMat) => formatCurrency(p.betrag);
      case 'bezahlt':
        return (p: KundenPostenNoMat) => formatCurrency(p.bezahlt);
      case 'offen':
        return (p: KundenPostenNoMat) => formatCurrency(p.offen);
      case 'status':
        return (p: KundenPostenNoMat) => (
          <Badge variant={p.status === 'bezahlt' ? 'success' : p.status === 'teilbezahlt' ? 'warning' : 'error'}>
            {p.status === 'bezahlt'
              ? 'Bezahlt'
              : p.status === 'teilbezahlt'
                ? 'Teilbezahlt'
                : appConfig.labels.open_amount}
          </Badge>
        );
      case 'actions':
        return (p: KundenPostenNoMat) => (
          <div className="flex gap-2">
            {!isEmptyRow(p) && p.offen > 0 && (
              <Button kind="act" onClick={() => openZahlungDialog(p, 'nomat')}>
                <DollarSign />
              </Button>
            )}
          </div>
        );
      default:
        return undefined;
    }
  };

  const postenNoMatColumns = appConfig.components.table.kunden.nomat.columns.map((col) => ({
    key: col.key,
    label: col.label,
    type: col.type as 'text' | 'number' | 'currency' | 'date' | 'status' | 'actions' | 'input' | undefined,
    render: getPostenNoMatColumnRender(col.key)
  }));

  // Render Overview
  if (view === 'overview') {
    return (
      <PageLayout
        title={appConfig.page_titles.customers}
        showBackButton={true}
        actions={
          <Button kind="new" onClick={() => setCreateKundeDialogOpen(true)}>
            <UserPlus />
          </Button>
        }
      >
        <div className="space-y-4">
          {/* Error */}
          {error && <div className="p-4 bg-red-500/10 border border-red-500 rounded text-red-400">{error}</div>}

          {/* Table */}
          <Table
            data={kunden}
            columns={overviewColumns}
            loading={loading}
            emptyMessage={appConfig.empty_states.no_customers}
            onRowClick={handleRowClick}
          />

          {/* Create Kunde Dialog */}
          <Dialog
            open={createKundeDialogOpen}
            onClose={() => {
              setCreateKundeDialogOpen(false);
              setKundeFormData({ name: '' });
            }}
            title={appConfig.components.dialog_titles.new_customer}
            actions={
              <>
                <Button
                  kind="rect"
                  onClick={() => {
                    setCreateKundeDialogOpen(false);
                    setKundeFormData({ name: '' });
                  }}
                >
                  {appConfig.components.buttons.cancel}
                </Button>
                <Button onClick={() => void handleCreateKunde()}>{appConfig.components.buttons.create}</Button>
              </>
            }
          >
            <Input
              label={appConfig.labels.name}
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
    <PageLayout title={`Kunde: ${selectedKunde?.name || ''}`} showBackButton={true}>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-4">
            <Button kind="rect" onClick={handleBackToOverview}>
              ← {appConfig.components.buttons.cancel}
            </Button>
            <h2 className="text-2xl font-semibold text-neutral-50">{selectedKunde?.name}</h2>
          </div>
          <div className="flex gap-2">
            <Button
              kind="rect"
              onClick={() => {
                if (selectedKunde) {
                  setKundeFormData({ name: selectedKunde.name });
                  setEditKundeDialogOpen(true);
                }
              }}
            >
              {appConfig.components.buttons.edit}
            </Button>
            <Button kind="rect" onClick={() => setDeleteKundeDialogOpen(true)}>
              {appConfig.components.buttons.delete}
            </Button>
          </div>
        </div>

        {/* Error */}
        {error && <div className="p-4 bg-red-500/10 border border-red-500 rounded text-red-400">{error}</div>}

        {/* Material-Posten */}
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <h3 className="text-xl font-semibold text-neutral-50">Material-Posten</h3>
            <Button onClick={() => setCreatePostenMatDialogOpen(true)}>
              {appConfig.components.dialog_titles.new_material_post}
            </Button>
          </div>
          <Table
            data={postenMat}
            columns={postenMatColumns}
            loading={detailLoading}
            emptyMessage={appConfig.empty_states.no_material_posts}
          />
        </div>

        {/* Sonstige Posten */}
        {postenNoMat.length > 0 && (
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <h3 className="text-xl font-semibold text-neutral-50">Sonstige Posten</h3>
              <Button onClick={() => setCreatePostenNoMatDialogOpen(true)}>
                {appConfig.components.dialog_titles.new_other_post}
              </Button>
            </div>
            <Table
              data={postenNoMat}
              columns={postenNoMatColumns}
              loading={detailLoading}
              emptyMessage={appConfig.empty_states.no_other_posts}
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
          title={appConfig.components.dialog_titles.edit_customer}
          actions={
            <>
              <Button
                kind="rect"
                onClick={() => {
                  setEditKundeDialogOpen(false);
                  setKundeFormData({ name: '' });
                }}
              >
                {appConfig.components.buttons.cancel}
              </Button>
              <Button onClick={() => void handleUpdateKunde()}>{appConfig.components.buttons.save}</Button>
            </>
          }
        >
          <Input
            label={appConfig.labels.name}
            value={kundeFormData.name}
            onChange={(e) => setKundeFormData({ name: e.target.value })}
          />
        </Dialog>

        {/* Delete Kunde Dialog */}
        <Dialog
          open={deleteKundeDialogOpen}
          onClose={() => setDeleteKundeDialogOpen(false)}
          title={appConfig.components.dialog_titles.delete_customer}
          actions={
            <>
              <Button kind="rect" onClick={() => setDeleteKundeDialogOpen(false)}>
                {appConfig.components.buttons.cancel}
              </Button>
              <Button kind="rect" onClick={() => void handleDeleteKunde()}>
                {appConfig.components.buttons.delete}
              </Button>
            </>
          }
        >
          <p className="text-neutral-300">
            {appConfig.messages.confirm_delete_customer.replace('{name}', selectedKunde?.name || '')}
          </p>
        </Dialog>

        {/* Create Posten Mat Dialog */}
        <Dialog
          open={createPostenMatDialogOpen}
          onClose={() => {
            setCreatePostenMatDialogOpen(false);
            resetPostenMatForm();
          }}
          title={appConfig.components.dialog_titles.new_material_post}
          actions={
            <>
              <Button
                kind="rect"
                onClick={() => {
                  setCreatePostenMatDialogOpen(false);
                  resetPostenMatForm();
                }}
              >
                {appConfig.components.buttons.cancel}
              </Button>
              <Button onClick={handleCreatePostenMat}>{appConfig.components.buttons.create}</Button>
            </>
          }
        >
          <div className="space-y-4">
            <Input
              label={appConfig.labels.date}
              type="date"
              value={postenMatFormData.datum}
              onChange={(e) => setPostenMatFormData({ ...postenMatFormData, datum: e.target.value })}
            />
            <Select
              label={appConfig.labels.material}
              value={postenMatFormData.material_id.toString()}
              onChange={(e) => setPostenMatFormData({ ...postenMatFormData, material_id: parseInt(e.target.value) })}
              options={materialien.map((m) => ({ value: m.id.toString(), label: m.bezeichnung }))}
            />
            <Input
              label={appConfig.labels.quantity}
              type="number"
              step="0.01"
              value={postenMatFormData.menge}
              onChange={(e) => setPostenMatFormData({ ...postenMatFormData, menge: parseFloat(e.target.value) || 0 })}
            />
            <Input
              label={appConfig.labels.amount}
              type="number"
              step="0.01"
              value={postenMatFormData.preis}
              onChange={(e) => setPostenMatFormData({ ...postenMatFormData, preis: parseFloat(e.target.value) || 0 })}
            />
            <Input
              label={appConfig.labels.note}
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
          title={appConfig.components.dialog_titles.new_other_post}
          actions={
            <>
              <Button
                kind="rect"
                onClick={() => {
                  setCreatePostenNoMatDialogOpen(false);
                  resetPostenNoMatForm();
                }}
              >
                {appConfig.components.buttons.cancel}
              </Button>
              <Button onClick={handleCreatePostenNoMat}>{appConfig.components.buttons.create}</Button>
            </>
          }
        >
          <div className="space-y-4">
            <Input
              label={appConfig.labels.date}
              type="date"
              value={postenNoMatFormData.datum}
              onChange={(e) => setPostenNoMatFormData({ ...postenNoMatFormData, datum: e.target.value })}
            />
            <Input
              label={appConfig.labels.designation}
              value={postenNoMatFormData.bezeichnung}
              onChange={(e) => setPostenNoMatFormData({ ...postenNoMatFormData, bezeichnung: e.target.value })}
            />
            <Input
              label={appConfig.labels.amount}
              type="number"
              step="0.01"
              value={postenNoMatFormData.betrag}
              onChange={(e) =>
                setPostenNoMatFormData({ ...postenNoMatFormData, betrag: parseFloat(e.target.value) || 0 })
              }
            />
            <Input
              label={appConfig.labels.note}
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
          title={appConfig.components.dialog_titles.record_payment}
          actions={
            <>
              <Button
                kind="rect"
                onClick={() => {
                  setZahlungDialogOpen(false);
                  setSelectedPosten(null);
                  setZahlungbetrag(0);
                }}
              >
                {appConfig.components.buttons.cancel}
              </Button>
              <Button onClick={handleZahlung}>{appConfig.components.buttons.record}</Button>
            </>
          }
        >
          <div className="space-y-4">
            <div className="p-4 bg-neutral-800 rounded">
              <p className="text-neutral-400 text-sm">{appConfig.labels.open_amount}</p>
              <p className="text-2xl font-semibold text-neutral-50">{formatCurrency(selectedPosten?.offen || 0)}</p>
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
      </div>
    </PageLayout>
  );
}
