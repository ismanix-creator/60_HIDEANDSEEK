/**
 * @file        MaterialPage.tsx
 * @description Material-Verwaltung mit 3-Spalten-Grid Layout
 * @version     2.0.0
 * @created     2026-01-07 01:36:51 CET
 * @updated     2026-01-16 20:35:00 CET
 * @author      Akki Scholze
 *
 * @changelog
 *   2.0.0 - 2026-01-16 - Refactor: 3-Spalten-Grid Layout, kein MainApp Wrapper, config-driven
 *   1.6.1 - 2026-01-12 - Material-Tabelle: Fortschrittsbalken sichtbar gemacht
 */

import { useEffect, useMemo, useState, type CSSProperties } from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar } from 'lucide-react';
import { Table } from '@/components/ui/Table';
import { Button } from '@/components/ui/Button';
import { Dialog } from '@/components/ui/Dialog';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Infobox } from '@/components/ui/Infobox';
import { useApi } from '@/hooks/useApi';
import { formatCurrency, formatCurrencyTruncate, formatDate, formatNumberTruncate } from '@/utils/format';
import { appConfig } from '@/config';
import type {
  Material,
  Kunde,
  MaterialHistorieItem,
  CreateMaterialRequest,
  CreateBarBewegungRequest,
  CreateRechnungBewegungRequest
} from '@/types';

// Formatierungs-Helpers
const formatInteger = (value: number): string => formatNumberTruncate(value, 0);
const formatCurrencyInt = (value: number): string => formatCurrencyTruncate(value, 0);
const formatCurrencyTwo = (value: number): string => formatCurrencyTruncate(value, 2);

export function MaterialPage() {
  const api = useApi();
  const navigate = useNavigate();

  const [materialien, setMaterialien] = useState<Material[]>([]);
  const [kunden, setKunden] = useState<Kunde[]>([]);
  const [historie, setHistorie] = useState<MaterialHistorieItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Dialog States
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [barDialogOpen, setBarDialogOpen] = useState(false);
  const [rechnungDialogOpen, setRechnungDialogOpen] = useState(false);
  const [historieDialogOpen, setHistorieDialogOpen] = useState(false);
  const [selectedMaterial, setSelectedMaterial] = useState<Material | null>(null);
  const [ekPreisMode, setEkPreisMode] = useState<'stueck' | 'gesamt'>('stueck');

  // Form States
  const [formData, setFormData] = useState<CreateMaterialRequest>({
    datum: new Date().toISOString().split('T')[0],
    bezeichnung: '',
    menge: 0,
    ek_stueck: 0,
    ek_gesamt: 0,
    vk_stueck: 0,
    bestand: 0,
    einnahmen_bar: 0,
    einnahmen_rechnung: 0,
    gewinn_aktuell: 0,
    gewinn_theoretisch: 0,
    notiz: ''
  });

  const [barFormData, setBarFormData] = useState<CreateBarBewegungRequest>({
    material_id: 0,
    datum: new Date().toISOString().split('T')[0],
    menge: 0,
    preis: 0,
    info: '',
    notiz: ''
  });

  const [rechnungFormData, setRechnungFormData] = useState<CreateRechnungBewegungRequest>({
    material_id: 0,
    kunde_id: 0,
    datum: new Date().toISOString().split('T')[0],
    menge: 0,
    preis: 0,
    notiz: ''
  });

  const [preisMode, setPreisMode] = useState<'stueck' | 'gesamt'>('stueck');
  const [selectedMonth, setSelectedMonth] = useState<string>(() => {
    const now = new Date();
    return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
  });
  const [monthPickerOpen, setMonthPickerOpen] = useState(false);

  // Month Formatting
  const monthFormatter = useMemo(() => new Intl.DateTimeFormat('de-DE', { month: 'long', year: 'numeric' }), []);

  const formatMonthLabel = (monthKey: string): string => {
    const [yearStr, monthStr] = monthKey.split('-');
    const year = Number(yearStr);
    const month = Number(monthStr);
    if (!Number.isFinite(year) || !Number.isFinite(month)) return monthKey;
    return monthFormatter.format(new Date(year, month - 1, 1));
  };

  const toMonthKeyFromString = (value: string | null | undefined): string | null => {
    if (!value) return null;
    const parsed = new Date(value);
    if (Number.isNaN(parsed.getTime())) return null;
    return `${parsed.getFullYear()}-${String(parsed.getMonth() + 1).padStart(2, '0')}`;
  };

  const shiftMonth = (monthKey: string, delta: number): string => {
    const [yearStr, monthStr] = monthKey.split('-');
    const baseDate = new Date(Number(yearStr), Number(monthStr) - 1, 1);
    baseDate.setMonth(baseDate.getMonth() + delta);
    return `${baseDate.getFullYear()}-${String(baseDate.getMonth() + 1).padStart(2, '0')}`;
  };

  const availableMonths = useMemo(() => {
    const unique = new Set<string>();
    materialien.forEach((item) => {
      const key = toMonthKeyFromString(item.datum);
      if (key) unique.add(key);
    });
    return Array.from(unique).sort((a, b) => (a > b ? -1 : 1));
  }, [materialien]);

  const filteredMaterialien = useMemo(
    () => materialien.filter((m) => toMonthKeyFromString(m.datum) === selectedMonth),
    [materialien, selectedMonth]
  );

  // API Calls
  const loadMaterial = async () => {
    setLoading(true);
    setError(null);
    try {
      const [matResult, kundenResult] = await Promise.all([
        api.fetch<Material[]>('/api/material'),
        api.fetch<Kunde[]>('/api/kunden')
      ]);
      if (matResult.success && matResult.data) setMaterialien(matResult.data);
      else setError(matResult.error || 'Fehler beim Laden');
      if (kundenResult.success && kundenResult.data) setKunden(kundenResult.data);
    } catch {
      setError('Netzwerkfehler');
    } finally {
      setLoading(false);
    }
  };

  const loadHistorie = async (materialId: number): Promise<void> => {
    try {
      const result = await api.fetch<MaterialHistorieItem[]>(`/api/material/${materialId}/historie`);
      if (result.success && result.data) setHistorie(result.data);
    } catch (err) {
      console.error('Fehler Historie', err);
    }
  };

  useEffect(() => {
    void loadMaterial();
  }, []);

  // Handlers
  const handleMonthStep = (delta: number) => {
    setSelectedMonth((current) => shiftMonth(current, delta));
    setMonthPickerOpen(false);
  };

  const handleMonthSelect = (monthKey: string) => {
    setSelectedMonth(monthKey);
    setMonthPickerOpen(false);
  };

  const calcEkStueckAusGesamt = (gesamt: number, menge: number) => (menge > 0 ? gesamt / menge : 0);

  const handleCreate = async (): Promise<void> => {
    setError(null);
    if (!formData.datum || !formData.bezeichnung.trim() || formData.menge <= 0 || formData.vk_stueck <= 0) {
      setError('Pflichtfelder fehlen');
      return;
    }
    if (ekPreisMode === 'stueck' && formData.ek_stueck <= 0) {
      setError('EK Stück muss > 0 sein');
      return;
    }
    if (ekPreisMode === 'gesamt' && formData.ek_gesamt <= 0) {
      setError('EK Gesamt muss > 0 sein');
      return;
    }

    const ekGesamt = ekPreisMode === 'stueck' ? formData.ek_stueck * formData.menge : formData.ek_gesamt;
    const baseName = formData.bezeichnung.trim().toUpperCase();
    const monthPart = (() => {
      const d = new Date(formData.datum);
      return String(d.getMonth() + 1).padStart(2, '0');
    })();
    const existingCount = materialien.filter((m) => m.bezeichnung.toUpperCase().startsWith(baseName)).length;
    const finalName = `${baseName}${existingCount + 1}/${monthPart}`;

    try {
      const result = await api.fetch('/api/material', {
        method: 'POST',
        body: JSON.stringify({
          ...formData,
          bezeichnung: finalName,
          ek_gesamt: ekGesamt,
          bestand: formData.menge,
          gewinn_theoretisch: (formData.vk_stueck - formData.ek_stueck) * formData.menge,
          notiz: formData.notiz?.toUpperCase() ?? ''
        })
      });
      if (result.success) {
        setCreateDialogOpen(false);
        resetForm();
        void loadMaterial();
      } else {
        setError(result.error || 'Fehler beim Erstellen');
      }
    } catch {
      setError('Netzwerkfehler');
    }
  };

  const handleUpdate = async (): Promise<void> => {
    if (!selectedMaterial) return;
    try {
      const ekGesamt = ekPreisMode === 'stueck' ? formData.ek_stueck * formData.menge : formData.ek_gesamt;
      const result = await api.fetch(`/api/material/${selectedMaterial.id}`, {
        method: 'PUT',
        body: JSON.stringify({
          ...formData,
          id: selectedMaterial.id,
          ek_gesamt: ekGesamt,
          bestand: formData.menge,
          gewinn_theoretisch: (formData.vk_stueck - formData.ek_stueck) * formData.menge
        })
      });
      if (result.success) {
        setEditDialogOpen(false);
        setSelectedMaterial(null);
        resetForm();
        void loadMaterial();
      } else {
        setError(result.error || 'Fehler beim Aktualisieren');
      }
    } catch {
      setError('Netzwerkfehler');
    }
  };

  const handleDelete = async (): Promise<void> => {
    if (!selectedMaterial) return;
    try {
      const result = await api.fetch(`/api/material/${selectedMaterial.id}`, { method: 'DELETE' });
      if (result.success) {
        setDeleteDialogOpen(false);
        setSelectedMaterial(null);
        void loadMaterial();
      } else {
        setError(result.error || 'Fehler beim Löschen');
      }
    } catch {
      setError('Netzwerkfehler');
    }
  };

  const handleBarBewegung = async (): Promise<void> => {
    try {
      const finalPreis = preisMode === 'stueck' ? barFormData.menge * barFormData.preis : barFormData.preis;
      const result = await api.fetch('/api/material/bewegung-bar', {
        method: 'POST',
        body: JSON.stringify({ ...barFormData, preis: finalPreis })
      });
      if (result.success) {
        setBarDialogOpen(false);
        resetBarForm();
        void loadMaterial();
        if (selectedMaterial) void loadHistorie(selectedMaterial.id);
      } else {
        setError(result.error || 'Fehler');
      }
    } catch {
      setError('Netzwerkfehler');
    }
  };

  const handleRechnungBewegung = async (): Promise<void> => {
    try {
      const finalPreis =
        preisMode === 'stueck' ? rechnungFormData.menge * rechnungFormData.preis : rechnungFormData.preis;
      const result = await api.fetch('/api/material/bewegung-rechnung', {
        method: 'POST',
        body: JSON.stringify({ ...rechnungFormData, preis: finalPreis })
      });
      if (result.success) {
        setRechnungDialogOpen(false);
        resetRechnungForm();
        void loadMaterial();
        if (selectedMaterial) void loadHistorie(selectedMaterial.id);
      } else {
        setError(result.error || 'Fehler');
      }
    } catch {
      setError('Netzwerkfehler');
    }
  };

  // Dialog Openers
  const openEditDialog = (m: Material) => {
    setSelectedMaterial(m);
    setFormData({
      datum: m.datum,
      bezeichnung: m.bezeichnung,
      menge: m.menge,
      ek_stueck: m.ek_stueck,
      ek_gesamt: m.ek_gesamt,
      vk_stueck: m.vk_stueck,
      bestand: m.bestand,
      einnahmen_bar: m.einnahmen_bar,
      einnahmen_rechnung: m.einnahmen_rechnung,
      gewinn_aktuell: m.gewinn_aktuell,
      gewinn_theoretisch: m.gewinn_theoretisch,
      notiz: m.notiz || ''
    });
    setEditDialogOpen(true);
  };

  const openDeleteDialog = (m: Material) => {
    setSelectedMaterial(m);
    setDeleteDialogOpen(true);
  };

  const openBarDialog = (m: Material) => {
    setSelectedMaterial(m);
    setBarFormData({
      material_id: m.id,
      datum: new Date().toISOString().split('T')[0],
      menge: 0,
      preis: m.vk_stueck,
      info: '',
      notiz: ''
    });
    setPreisMode('stueck');
    void loadHistorie(m.id);
    setBarDialogOpen(true);
  };

  const openRechnungDialog = (m: Material) => {
    setSelectedMaterial(m);
    setRechnungFormData({
      material_id: m.id,
      kunde_id: 0,
      datum: new Date().toISOString().split('T')[0],
      menge: 0,
      preis: m.vk_stueck,
      notiz: ''
    });
    setPreisMode('stueck');
    void loadHistorie(m.id);
    setRechnungDialogOpen(true);
  };

  const openHistorieDialog = (m: Material) => {
    setSelectedMaterial(m);
    void loadHistorie(m.id);
    setHistorieDialogOpen(true);
  };

  // Form Resets
  const resetForm = () => {
    setFormData({
      datum: new Date().toISOString().split('T')[0],
      bezeichnung: '',
      menge: 0,
      ek_stueck: 0,
      ek_gesamt: 0,
      vk_stueck: 0,
      bestand: 0,
      einnahmen_bar: 0,
      einnahmen_rechnung: 0,
      gewinn_aktuell: 0,
      gewinn_theoretisch: 0,
      notiz: ''
    });
    setEkPreisMode('stueck');
  };

  const resetBarForm = () => {
    setBarFormData({
      material_id: 0,
      datum: new Date().toISOString().split('T')[0],
      menge: 0,
      preis: 0,
      info: '',
      notiz: ''
    });
    setPreisMode('stueck');
  };

  const resetRechnungForm = () => {
    setRechnungFormData({
      material_id: 0,
      kunde_id: 0,
      datum: new Date().toISOString().split('T')[0],
      menge: 0,
      preis: 0,
      notiz: ''
    });
    setPreisMode('stueck');
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

  // Table Columns
  const columns = [
    { key: 'datum', label: 'Datum', type: 'date' as const },
    { key: 'bezeichnung', label: 'Bezeichnung', type: 'input' as const },
    { key: 'menge', label: 'Menge', type: 'number' as const, render: (m: Material) => formatInteger(m.menge) },
    {
      key: 'bestand',
      label: 'Bestand',
      type: 'stock' as const,
      stockCurrent: (m: Material) => m.bestand,
      stockMax: (m: Material) => m.menge
    },
    {
      key: 'ek_stueck',
      label: 'EK/Stück',
      type: 'currency' as const,
      render: (m: Material) => formatCurrencyTwo(m.ek_stueck)
    },
    {
      key: 'ek_gesamt',
      label: 'EK Gesamt',
      type: 'currency' as const,
      render: (m: Material) => formatCurrencyInt(m.ek_gesamt)
    },
    {
      key: 'vk_stueck',
      label: 'VK/Stück',
      type: 'currency' as const,
      render: (m: Material) => formatCurrencyTwo(m.vk_stueck)
    },
    {
      key: 'einnahmen',
      label: 'Einnahmen',
      type: 'currency' as const,
      render: (m: Material) => formatCurrencyInt(m.einnahmen_bar + m.einnahmen_rechnung)
    },
    {
      key: 'theor_einnahmen',
      label: 'Theor. Einnahmen',
      type: 'currency' as const,
      render: (m: Material) => formatCurrencyInt(m.vk_stueck * m.menge)
    },
    {
      key: 'gewinn',
      label: 'Gewinn',
      type: 'currency' as const,
      render: (m: Material) => formatCurrencyInt(m.einnahmen_bar + m.einnahmen_rechnung - m.ek_gesamt)
    },
    {
      key: 'actions',
      label: 'Aktionen',
      type: 'actions' as const,
      actions: (m: Material) => [
        { type: 'bar' as const, onClick: () => void openBarDialog(m) },
        { type: 'rechnung' as const, onClick: () => void openRechnungDialog(m) },
        { type: 'edit' as const, onClick: () => void openEditDialog(m) },
        { type: 'delete' as const, onClick: () => void openDeleteDialog(m) }
      ]
    }
  ];

  return (
    <div style={gridStyle}>
      {/* Zeile 1: Button-Navigation (3 Spalten) */}
      <div style={buttonRowStyle}>
        {/* Spalte 1: Leer */}
        <div />

        {/* Spalte 2: Monats-Navigation */}
        <div className="flex items-center justify-center gap-3">
          <Button.Action type="prevMonth" onClick={() => handleMonthStep(-1)} />
          <div className="relative">
            <Button.Rect onClick={() => setMonthPickerOpen((open) => !open)}>
              <Calendar size={18} />
              <span className="capitalize">{formatMonthLabel(selectedMonth)}</span>
            </Button.Rect>

            {monthPickerOpen && (
              <div className="absolute left-1/2 z-10 mt-2 -translate-x-1/2 min-w-56 rounded-lg border border-neutral-700 bg-neutral-900/90 p-2 shadow-lg backdrop-blur">
                <div className="max-h-56 overflow-y-auto">
                  {availableMonths.map((monthKey) => (
                    <button
                      key={monthKey}
                      type="button"
                      onClick={() => handleMonthSelect(monthKey)}
                      className={`flex w-full items-center justify-between rounded px-3 py-2 text-left text-sm ${
                        monthKey === selectedMonth
                          ? 'bg-neutral-700 text-white'
                          : 'text-neutral-200 hover:bg-neutral-800'
                      }`}
                    >
                      <span className="capitalize">{formatMonthLabel(monthKey)}</span>
                      <span className="text-xs text-neutral-400">{monthKey}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
          <Button.Action type="nextMonth" onClick={() => handleMonthStep(1)} />
        </div>

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
          data={filteredMaterialien}
          columns={columns}
          loading={loading}
          emptyMessage="Keine Materialien vorhanden"
          onRowClick={(m) => void openHistorieDialog(m)}
        />
      </div>

      {/* Dialoge (unverändert - zu lang für Inline) */}
      <Dialog
        open={createDialogOpen}
        onClose={() => {
          setCreateDialogOpen(false);
          setError(null);
          resetForm();
        }}
        title="Neues Material"
        actions={
          <>
            <Button.Rect
              onClick={() => {
                setCreateDialogOpen(false);
                resetForm();
              }}
            >
              Abbrechen
            </Button.Rect>
            <Button.Rect onClick={() => void handleCreate()}>Erstellen</Button.Rect>
          </>
        }
      >
        <div className="space-y-3 w-full max-w-md">
          <Input
            label="Datum"
            type="date"
            value={formData.datum}
            onChange={(e) => setFormData({ ...formData, datum: e.target.value })}
            required
          />
          <Input
            label="Bezeichnung"
            value={formData.bezeichnung}
            onChange={(e) => setFormData({ ...formData, bezeichnung: e.target.value })}
            required
          />
          <Input
            label="Menge"
            type="number"
            value={String(formData.menge)}
            onChange={(e) => setFormData({ ...formData, menge: parseFloat(e.target.value) || 0 })}
            step="1"
            min={0}
            required
          />

          <div className="flex gap-2">
            <Button.Tab isActive={ekPreisMode === 'stueck'} onClick={() => setEkPreisMode('stueck')}>
              EK/Stück
            </Button.Tab>
            <Button.Tab isActive={ekPreisMode === 'gesamt'} onClick={() => setEkPreisMode('gesamt')}>
              EK Gesamt
            </Button.Tab>
          </div>

          {ekPreisMode === 'stueck' ? (
            <Input
              label="EK/Stück"
              type="number"
              value={String(formData.ek_stueck)}
              onChange={(e) => {
                const val = parseFloat(e.target.value) || 0;
                setFormData({ ...formData, ek_stueck: val, ek_gesamt: val * formData.menge });
              }}
              step="0.10"
              min={0}
              required
            />
          ) : (
            <Input
              label="EK Gesamt"
              type="number"
              value={String(formData.ek_gesamt)}
              onChange={(e) => {
                const val = parseFloat(e.target.value) || 0;
                setFormData({ ...formData, ek_gesamt: val, ek_stueck: calcEkStueckAusGesamt(val, formData.menge) });
              }}
              step="5.0"
              min={0}
              required
            />
          )}

          <Input
            label="VK/Stück"
            type="number"
            value={String(formData.vk_stueck)}
            onChange={(e) => setFormData({ ...formData, vk_stueck: parseFloat(e.target.value) || 0 })}
            step="0.10"
            min={0}
            required
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
          setSelectedMaterial(null);
          resetForm();
        }}
        title="Material bearbeiten"
        actions={
          <>
            <Button.Rect
              onClick={() => {
                setEditDialogOpen(false);
                setSelectedMaterial(null);
                resetForm();
              }}
            >
              Abbrechen
            </Button.Rect>
            <Button.Rect onClick={() => void handleUpdate()}>Speichern</Button.Rect>
          </>
        }
      >
        <div className="space-y-3 w-full max-w-md">
          <Input
            label="Datum"
            type="date"
            value={formData.datum}
            onChange={(e) => setFormData({ ...formData, datum: e.target.value })}
          />
          <Input
            label="Bezeichnung"
            value={formData.bezeichnung}
            onChange={(e) => setFormData({ ...formData, bezeichnung: e.target.value })}
          />
          <Input
            label="VK/Stück"
            type="number"
            value={String(formData.vk_stueck)}
            onChange={(e) => setFormData({ ...formData, vk_stueck: parseFloat(e.target.value) || 0 })}
            step="0.10"
          />
          <Input
            label="Notiz"
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
          setSelectedMaterial(null);
        }}
        title="Material löschen?"
        actions={
          <>
            <Button.Rect
              onClick={() => {
                setDeleteDialogOpen(false);
                setSelectedMaterial(null);
              }}
            >
              Abbrechen
            </Button.Rect>
            <Button.Rect onClick={() => void handleDelete()}>Löschen</Button.Rect>
          </>
        }
      >
        <p>Möchten Sie "{selectedMaterial?.bezeichnung}" wirklich löschen?</p>
      </Dialog>

      {/* Bar Dialog */}
      <Dialog
        open={barDialogOpen}
        onClose={() => {
          setBarDialogOpen(false);
          resetBarForm();
        }}
        title="BAR Buchung"
        actions={
          <>
            <Button.Rect
              onClick={() => {
                setBarDialogOpen(false);
                resetBarForm();
              }}
            >
              Abbrechen
            </Button.Rect>
            <Button.Rect onClick={() => void handleBarBewegung()}>Buchen</Button.Rect>
          </>
        }
      >
        <div className="space-y-3 w-full max-w-md">
          <Input
            label="Datum"
            type="date"
            value={barFormData.datum}
            onChange={(e) => setBarFormData({ ...barFormData, datum: e.target.value })}
          />
          <Input
            label="Menge"
            type="number"
            value={String(barFormData.menge)}
            onChange={(e) => setBarFormData({ ...barFormData, menge: parseFloat(e.target.value) || 0 })}
            step="1"
          />
          <div className="flex gap-2">
            <Button.Tab isActive={preisMode === 'stueck'} onClick={() => setPreisMode('stueck')}>
              Preis/Stück
            </Button.Tab>
            <Button.Tab isActive={preisMode === 'gesamt'} onClick={() => setPreisMode('gesamt')}>
              Preis Gesamt
            </Button.Tab>
          </div>
          <Input
            label="Preis"
            type="number"
            value={String(barFormData.preis)}
            onChange={(e) => setBarFormData({ ...barFormData, preis: parseFloat(e.target.value) || 0 })}
            step="0.10"
          />
          <Input
            label="Info"
            value={barFormData.info}
            onChange={(e) => setBarFormData({ ...barFormData, info: e.target.value })}
          />
          <Input
            label="Notiz"
            value={barFormData.notiz}
            onChange={(e) => setBarFormData({ ...barFormData, notiz: e.target.value })}
          />
        </div>
      </Dialog>

      {/* Rechnung Dialog */}
      <Dialog
        open={rechnungDialogOpen}
        onClose={() => {
          setRechnungDialogOpen(false);
          resetRechnungForm();
        }}
        title="Rechnung Buchung"
        actions={
          <>
            <Button.Rect
              onClick={() => {
                setRechnungDialogOpen(false);
                resetRechnungForm();
              }}
            >
              Abbrechen
            </Button.Rect>
            <Button.Rect onClick={() => void handleRechnungBewegung()}>Buchen</Button.Rect>
          </>
        }
      >
        <div className="space-y-3 w-full max-w-md">
          <Select
            label="Kunde"
            value={String(rechnungFormData.kunde_id)}
            onChange={(e) => setRechnungFormData({ ...rechnungFormData, kunde_id: parseInt(e.target.value) || 0 })}
            options={kunden.map((k) => ({ value: String(k.id), label: k.name }))}
          />
          <Input
            label="Datum"
            type="date"
            value={rechnungFormData.datum}
            onChange={(e) => setRechnungFormData({ ...rechnungFormData, datum: e.target.value })}
          />
          <Input
            label="Menge"
            type="number"
            value={String(rechnungFormData.menge)}
            onChange={(e) => setRechnungFormData({ ...rechnungFormData, menge: parseFloat(e.target.value) || 0 })}
            step="1"
          />
          <div className="flex gap-2">
            <Button.Tab isActive={preisMode === 'stueck'} onClick={() => setPreisMode('stueck')}>
              Preis/Stück
            </Button.Tab>
            <Button.Tab isActive={preisMode === 'gesamt'} onClick={() => setPreisMode('gesamt')}>
              Preis Gesamt
            </Button.Tab>
          </div>
          <Input
            label="Preis"
            type="number"
            value={String(rechnungFormData.preis)}
            onChange={(e) => setRechnungFormData({ ...rechnungFormData, preis: parseFloat(e.target.value) || 0 })}
            step="0.10"
          />
          <Input
            label="Notiz"
            value={rechnungFormData.notiz}
            onChange={(e) => setRechnungFormData({ ...rechnungFormData, notiz: e.target.value })}
          />
        </div>
      </Dialog>

      {/* Historie Dialog */}
      <Dialog
        open={historieDialogOpen}
        onClose={() => {
          setHistorieDialogOpen(false);
          setSelectedMaterial(null);
          setHistorie([]);
        }}
        title={selectedMaterial ? `Historie: ${selectedMaterial.bezeichnung}` : 'Historie'}
        actions={
          <Button.Rect
            onClick={() => {
              setHistorieDialogOpen(false);
              setSelectedMaterial(null);
              setHistorie([]);
            }}
          >
            Schließen
          </Button.Rect>
        }
      >
        {historie.length > 0 ? (
          <div className="space-y-2 max-h-[60vh] overflow-y-auto">
            {historie.map((item, idx) => (
              <Infobox
                key={idx}
                variant={item.typ === 'bar' ? 'success' : 'info'}
                title={`${item.typ.toUpperCase()} - ${formatDate(item.datum)}`}
              >
                <div className="space-y-1 text-sm">
                  <p>Menge: {item.menge.toFixed(2)}</p>
                  <p>Preis: {formatCurrency(item.preis)}</p>
                  {item.kunde_name && <p>Kunde: {item.kunde_name}</p>}
                  {item.info && <p>Info: {item.info}</p>}
                  {item.notiz && <p>Notiz: {item.notiz}</p>}
                </div>
              </Infobox>
            ))}
          </div>
        ) : (
          <p className="text-neutral-400 text-sm text-center py-4">Keine Historie vorhanden</p>
        )}
      </Dialog>
    </div>
  );
}
