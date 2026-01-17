/**
 * @file        GlaeubigerPage.tsx
 * @description Gläubiger-Verwaltung Seite
 * @version     2.0.0
 * @created     2026-01-07 01:36:51 CET
 * @updated     2026-01-17 20:11:08 CET
 * @author      Akki Scholze
 *
 * @changelog
 *   2.0.0 - 2026-01-17 - Refactor: 3-Spalten 2-Zeilen Grid-Layout implementiert, Zurück-Button hinzugefügt
 *   1.2.0 - 2026-01-11 22:35:00 - Feature: Action Buttons mit disabled-State für Empty Rows
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

import { useState, useEffect, type CSSProperties } from 'react';
import { useNavigate } from 'react-router-dom';
import { MainApp } from '@/components/layout/MainApp';
import { Table, isEmptyRow } from '@/components/ui/Table';
import { Button } from '@/components/ui/Button';
import { Dialog } from '@/components/ui/Dialog';
import { Input } from '@/components/ui/Input';
import { useApi } from '@/hooks/useApi';
import { formatCurrency, formatDate } from '@/utils/format';
import { appConfig } from '@/config';
import type { Glaeubiger, CreateGlaeubigerRequest, UpdateGlaeubigerRequest, ZahlungRequest } from '@/types';

export function GlaeubigerPage() {
  const navigate = useNavigate();
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
        setError(result.error || appConfig.ui.messages.error.loadFailed);
      }
    } catch (err) {
      setError(appConfig.ui.messages.error.networkError);
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
        setError(result.error || appConfig.ui.messages.error.createFailed);
      }
    } catch (err) {
      setError(appConfig.ui.messages.error.networkError);
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
        setError(result.error || appConfig.ui.messages.error.updateFailed);
      }
    } catch (err) {
      setError(appConfig.ui.messages.error.networkError);
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
        setError(result.error || appConfig.ui.messages.error.deleteFailed);
      }
    } catch (err) {
      setError(appConfig.ui.messages.error.networkError);
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
        setError(result.error || appConfig.ui.messages.error.bookFailed);
      }
    } catch (err) {
      setError(appConfig.ui.messages.error.networkError);
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

  // Grid Styles
  const gridStyle: CSSProperties = {
    display: appConfig.ui.pages.grid.style.display,
    gridTemplateColumns: appConfig.ui.pages.grid.style.gridTemplateColumns,
    gap: appConfig.ui.pages.grid.style.gap
  };

  const buttonRowStyle: CSSProperties = {
    display: appConfig.ui.pages.grid.buttonRow.style.display
  };

  const tableRowStyle: CSSProperties = {
    gridColumn: appConfig.ui.pages.grid.tableRow.style.gridColumn
  };

  // Table Columns mit inline renders und actions via property
  const columns = appConfig.components.table.columns.glaeubiger.order.map((colKey) => {
    const label = appConfig.components.table.columns.glaeubiger.labels[colKey] || colKey;
    return {
    key: colKey,
    label: label,
    type: undefined as 'text' | 'number' | 'currency' | 'date' | 'status' | 'actions' | 'input' | undefined,
    render:
      colKey === 'datum'
        ? (g: Glaeubiger) => formatDate(g.datum)
        : colKey === 'betrag'
          ? (g: Glaeubiger) => formatCurrency(g.betrag)
          : colKey === 'bezahlt'
            ? (g: Glaeubiger) => formatCurrency(g.bezahlt)
            : colKey === 'offen'
              ? (g: Glaeubiger) => formatCurrency(g.offen)
              : colKey === 'faelligkeit'
                ? (g: Glaeubiger) => (g.faelligkeit ? formatDate(g.faelligkeit) : '-')
                : colKey === 'status'
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
      colKey === 'actions'
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
    };
  });

  return (
    <MainApp title="Gläubiger">
      <div style={gridStyle}>
        {/* Zeile 1: Button-Navigation (3 Spalten) */}
        <div style={buttonRowStyle}>
          {/* Spalte 1: Leer */}
          <div />

          {/* Spalte 2: Leer */}
          <div />

          {/* Spalte 3: Neu + Zurück */}
          <div className="flex items-center justify-end gap-2">
            <Button.Action type="new" onClick={() => setCreateDialogOpen(true)} />
            <Button.Action type="back" onClick={() => navigate('/dashboard')} />
          </div>
        </div>

        {/* Error */}
        {error && (
          <div style={tableRowStyle} className="p-4 bg-red-500/10 border border-red-500 rounded text-red-400">
            {error}
          </div>
        )}

        {/* Zeile 2: Table über alle 3 Spalten */}
        <div style={tableRowStyle}>
          <Table
            data={glaeubiger}
            columns={columns}
            loading={loading}
            emptyMessage={appConfig.ui.empty.glaeubiger}
            onRowClick={(g) => openHistorieDialog(g)}
          />
        </div>

        {/* Create Dialog */}
        <Dialog
          open={createDialogOpen}
          onClose={() => {
            setCreateDialogOpen(false);
            resetForm();
          }}
          title={appConfig.ui.titles.dialog.newGlaeubiger}
          actions={
            <>
              <Button.Rect
                type="cancel"
                onClick={() => {
                  setCreateDialogOpen(false);
                  resetForm();
                }}
              />
              <Button.Rect onClick={() => void handleCreate()}>{appConfig.ui.buttons.erstellen}</Button.Rect>
            </>
          }
        >
          <div className="space-y-4">
            <Input
              label={appConfig.ui.labels.datum}
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
              label={appConfig.ui.labels.betrag}
              type="number"
              step="0.01"
              value={formData.betrag}
              onChange={(e) => setFormData({ ...formData, betrag: parseFloat(e.target.value) || 0 })}
            />
            <Input
              label={appConfig.ui.labels.faelligkeit}
              type="date"
              value={formData.faelligkeit}
              onChange={(e) => setFormData({ ...formData, faelligkeit: e.target.value })}
            />
            <Input
              label={appConfig.ui.labels.notiz}
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
          title={appConfig.ui.titles.dialog.editGlaeubiger}
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
              label={appConfig.ui.labels.datum}
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
              label={appConfig.ui.labels.betrag}
              type="number"
              step="0.01"
              value={formData.betrag}
              onChange={(e) => setFormData({ ...formData, betrag: parseFloat(e.target.value) || 0 })}
            />
            <Input
              label={appConfig.ui.labels.faelligkeit}
              type="date"
              value={formData.faelligkeit}
              onChange={(e) => setFormData({ ...formData, faelligkeit: e.target.value })}
            />
            <Input
              label={appConfig.ui.labels.notiz}
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
          title={appConfig.ui.titles.dialog.deleteGlaeubiger}
          actions={
            <>
              <Button.Rect
                type="cancel"
                onClick={() => {
                  setDeleteDialogOpen(false);
                  setSelectedGlaeubiger(null);
                }}
              />
              <Button.Rect onClick={() => void handleDelete()}>{appConfig.ui.buttons.loeschen}</Button.Rect>
            </>
          }
        >
          <p className="text-neutral-300">
            {appConfig.ui.messages.confirm.deleteGlaeubiger.replace('{name}', selectedGlaeubiger?.name || '')}
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
          title={appConfig.ui.titles.dialog.zahlungBuchen}
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
              <Button.Rect onClick={() => void handleZahlung()}>{appConfig.ui.buttons.buchen}</Button.Rect>
            </>
          }
        >
          <div className="space-y-4">
            <div className="p-4 bg-neutral-800 rounded">
              <p className="text-neutral-400 text-sm">{appConfig.ui.labels.offen}</p>
              <p className="text-2xl font-semibold text-neutral-50">{formatCurrency(selectedGlaeubiger?.offen || 0)}</p>
            </div>
            <Input
              label={appConfig.ui.labels.betrag}
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
              ? `${appConfig.ui.titles.dialog.history}: ${selectedGlaeubiger.name}`
              : appConfig.ui.titles.dialog.history
          }
          actions={
            <Button.Rect
              onClick={() => {
                setHistorieDialogOpen(false);
                setSelectedGlaeubiger(null);
                setZahlungsHistorie([]);
              }}
            >
              {appConfig.ui.buttons.schliessen}
            </Button.Rect>
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
            <p className="text-neutral-400 text-sm text-center py-4">{appConfig.ui.empty.historie}</p>
          )}
        </Dialog>
      </div>
    </MainApp>
  );
}
