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
import { MainApp } from '@/components/layout/mainapp';
import { Table, isEmptyRow } from '@/components/ui/Table';
import { Button } from '@/components/ui/Button';
import { Dialog } from '@/components/ui/Dialog';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { useApi } from '@/hooks/useApi';
import { formatCurrency, formatDate } from '@/utils/format';
import { appConfig } from '@/config';
import { ChevronLeft, ChevronRight, User } from 'lucide-react';
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
  const [kundenPickerOpen, setKundenPickerOpen] = useState(false);

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
          <span
            className={`px-2 py-1 rounded text-sm ${
              k.status === 'bezahlt'
                ? 'bg-green-500/20 text-green-300'
                : k.status === 'teilbezahlt'
                  ? 'bg-yellow-500/20 text-yellow-300'
                  : 'bg-red-500/20 text-red-300'
            }`}
          >
            {k.status === 'bezahlt' ? 'Bezahlt' : k.status === 'teilbezahlt' ? 'Teilbezahlt' : 'Offen'}
          </span>
        );
      default:
        return undefined;
    }
  };

  const overviewColumns = appConfig.components.table.kunden.columns.map((col) => ({
    key: col.key,
    label: col.label,
    type: col.type as 'text' | 'number' | 'currency' | 'date' | 'status' | 'actions' | 'input' | undefined,
    render: col.key === 'actions' ? undefined : getOverviewColumnRender(col.key),
    actions:
      col.key === 'actions'
        ? (k: KundeWithSummary) => [
            {
              type: 'edit' as const,
              onClick: () => {
                setView('detail');
                setSelectedKunde(k);
                setKundeFormData({ name: k.name });
                setEditKundeDialogOpen(true);
              }
            },
            {
              type: 'delete' as const,
              onClick: () => {
                setView('detail');
                setSelectedKunde(k);
                setDeleteKundeDialogOpen(true);
              }
            }
          ]
        : undefined
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
          <span
            className={`px-2 py-1 rounded text-sm ${
              p.status === 'bezahlt'
                ? 'bg-green-500/20 text-green-300'
                : p.status === 'teilbezahlt'
                  ? 'bg-yellow-500/20 text-yellow-300'
                  : 'bg-red-500/20 text-red-300'
            }`}
          >
            {p.status === 'bezahlt' ? 'Bezahlt' : p.status === 'teilbezahlt' ? 'Teilbezahlt' : 'Offen'}
          </span>
        );
      default:
        return undefined;
    }
  };

  const postenMatColumns = appConfig.components.table.kunden.mat.columns.map((col) => ({
    key: col.key,
    label: col.label,
    type: col.type as 'text' | 'number' | 'currency' | 'date' | 'status' | 'actions' | 'input' | undefined,
    render: col.key === 'actions' ? undefined : getPostenMatColumnRender(col.key),
    actions:
      col.key === 'actions'
        ? (p: KundenPostenMat) => {
            if (!isEmptyRow(p) && p.offen > 0) {
              return [{ type: 'zahlung' as const, onClick: () => openZahlungDialog(p, 'mat') }];
            }
            return [];
          }
        : undefined
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
          <span
            className={`px-2 py-1 rounded text-sm ${
              p.status === 'bezahlt'
                ? 'bg-green-500/20 text-green-300'
                : p.status === 'teilbezahlt'
                  ? 'bg-yellow-500/20 text-yellow-300'
                  : 'bg-red-500/20 text-red-300'
            }`}
          >
            {p.status === 'bezahlt' ? 'Bezahlt' : p.status === 'teilbezahlt' ? 'Teilbezahlt' : 'Offen'}
          </span>
        );
      default:
        return undefined;
    }
  };

  const postenNoMatColumns = appConfig.components.table.kunden.nomat.columns.map((col) => ({
    key: col.key,
    label: col.label,
    type: col.type as 'text' | 'number' | 'currency' | 'date' | 'status' | 'actions' | 'input' | undefined,
    render: col.key === 'actions' ? undefined : getPostenNoMatColumnRender(col.key),
    actions:
      col.key === 'actions'
        ? (p: KundenPostenNoMat) => {
            if (!isEmptyRow(p) && p.offen > 0) {
              return [{ type: 'zahlung' as const, onClick: () => openZahlungDialog(p, 'nomat') }];
            }
            return [];
          }
        : undefined
  }));

  // Render Overview
  if (view === 'overview') {
    return (
      <MainApp title={appConfig.page_titles.customers}>
        <div className="space-y-4">
          {/* Error */}
          {error && <div className="p-4 bg-red-500/10 border border-red-500 rounded text-red-400">{error}</div>}

          {/* Button-Reihe über der Tabelle */}
          <div className="flex justify-end mb-4">
            <Button.Action type="new" onClick={() => setCreateKundeDialogOpen(true)} />
          </div>

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
                <Button.Rect
                  type="cancel"
                  onClick={() => {
                    setCreateKundeDialogOpen(false);
                    setKundeFormData({ name: '' });
                  }}
                />
                <Button.Rect onClick={() => void handleCreateKunde()}>
                  {appConfig.components.buttons.create}
                </Button.Rect>
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
      </MainApp>
    );
  }

  // Render Detail
  return (
    <MainApp title={`Kunde: ${selectedKunde?.name || ''}`}>
      <div className="space-y-6">
        {/* Error */}
        {error && <div className="p-4 bg-red-500/10 border border-red-500 rounded text-red-400">{error}</div>}

        {/* Button-Reihe: Navigation (Zurück/Prev/Picker/Next) + Edit/Delete */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <Button.Action type="back" onClick={handleBackToOverview} />
            <Button.Action
              type="prevMonth"
              onClick={() => {
                const currentIndex = kunden.findIndex((k) => k.id === selectedKunde?.id);
                if (currentIndex > 0) {
                  handleRowClick(kunden[currentIndex - 1]);
                }
              }}
            />
            <div className="relative">
              <Button.Rect onClick={() => setKundenPickerOpen((open) => !open)}>
                <User size={18} />
                <span>{selectedKunde?.name || 'Kunde auswählen'}</span>
              </Button.Rect>
              {kundenPickerOpen && (
                <div className="absolute top-full left-0 mt-2 w-64 bg-neutral-800 border border-neutral-700 rounded-lg shadow-lg z-50 max-h-96 overflow-y-auto">
                  {kunden.map((k) => (
                    <button
                      key={k.id}
                      type="button"
                      onClick={() => {
                        handleRowClick(k);
                        setKundenPickerOpen(false);
                      }}
                      className={`w-full px-4 py-3 text-left text-sm transition-colors ${
                        k.id === selectedKunde?.id
                          ? 'bg-neutral-600 text-white font-medium'
                          : 'text-neutral-300 hover:bg-neutral-700 hover:text-white'
                      }`}
                    >
                      {k.name}
                    </button>
                  ))}
                </div>
              )}
            </div>
            <Button.Action
              type="nextMonth"
              onClick={() => {
                const currentIndex = kunden.findIndex((k) => k.id === selectedKunde?.id);
                if (currentIndex < kunden.length - 1) {
                  handleRowClick(kunden[currentIndex + 1]);
                }
              }}
            />
          </div>
          <div className="flex gap-2">
            <Button.Rect
              onClick={() => {
                if (selectedKunde) {
                  setKundeFormData({ name: selectedKunde.name });
                  setEditKundeDialogOpen(true);
                }
              }}
            >
              {appConfig.components.buttons.edit}
            </Button.Rect>
            <Button.Rect onClick={() => setDeleteKundeDialogOpen(true)}>
              {appConfig.components.buttons.delete}
            </Button.Rect>
          </div>
        </div>

        {/* Material-Posten */}
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <h3 className="text-xl font-semibold text-neutral-50">Material-Posten</h3>
            <Button.Rect type="setup" onClick={() => setCreatePostenMatDialogOpen(true)}>
              Neuer Material-Posten
            </Button.Rect>
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
              <Button.Rect onClick={() => setCreatePostenNoMatDialogOpen(true)}>
                {appConfig.components.dialog_titles.new_other_post}
              </Button.Rect>
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
              <Button.Rect
                type="cancel"
                onClick={() => {
                  setEditKundeDialogOpen(false);
                  setKundeFormData({ name: '' });
                }}
              />
              <Button.Rect type="save" onClick={() => void handleUpdateKunde()} />
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
              <Button.Rect type="cancel" onClick={() => setDeleteKundeDialogOpen(false)} />
              <Button.Rect onClick={() => void handleDeleteKunde()}>{appConfig.components.buttons.delete}</Button.Rect>
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
              <Button.Rect
                type="cancel"
                onClick={() => {
                  setCreatePostenMatDialogOpen(false);
                  resetPostenMatForm();
                }}
              />
              <Button.Rect onClick={handleCreatePostenMat}>{appConfig.components.buttons.create}</Button.Rect>
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
              <Button.Rect
                type="cancel"
                onClick={() => {
                  setCreatePostenNoMatDialogOpen(false);
                  resetPostenNoMatForm();
                }}
              />
              <Button.Rect onClick={handleCreatePostenNoMat}>{appConfig.components.buttons.create}</Button.Rect>
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
              <Button.Rect
                type="cancel"
                onClick={() => {
                  setZahlungDialogOpen(false);
                  setSelectedPosten(null);
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
    </MainApp>
  );
}
