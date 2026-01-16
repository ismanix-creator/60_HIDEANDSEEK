/**
 * @file        MaterialPage.tsx
 * @description Material-Verwaltung mit Bar/Kombi-Buchungen und Historie
 * @version     1.6.1
 * @created     2026-01-07 01:36:51 CET
 * @updated     2026-01-12 17:30:00 CET
 * @author      Akki Scholze
 *
 * @changelog
 *   1.6.1 - 2026-01-12 17:30:00 - Material-Tabelle: Fortschrittsbalken sichtbar gemacht (kontrastierter Track + Border)
 *   1.6.0 - 2026-01-12 16:05:00 - Material-Tabelle: Truncate-Formate + Bestands-Fortschrittsbalken
 *   1.5.0 - 2026-01-12 13:25:00 - UI: Monats-Navigation (zentrierte Buttons) über der Tabelle
 *   1.4.0 - 2026-01-11 22:35:00 - Feature: Action Buttons mit disabled-State für Empty Rows
 *   1.3.0 - 2026-01-11 18:35:00 - Fixed: Config-Zugriff appConfig.* → appConfig.* (validation/errors/labels/buttons/etc., Config-Struktur-Migration)
 *   1.2.0 - 2026-01-11 03:41:48 - Fixed: floating promises in onClick handlers (void wrapper)
 *   1.1.0 - 2026-01-11 - Fixed: floating promises + unsafe-any errors in API responses
 *   1.0.0 - 2026-01-10 06:30:00 - Config-Fix: Fehlende Labels durch Hardcodes ersetzt (Task 2.3.6)
 *   0.9.0 - 2026-01-10 00:16:26 - Alle verbleibenden Hardcodes durch appConfig.labels.* ersetzt (Task 2.3.1 komplett)
 *   0.8.0 - 2026-01-10 01:10:34 - 44 verbleibende Hardcodes durch appConfig.* ersetzt (Phase 2.3.1 Final)
 *   0.7.0 - 2026-01-09 21:51:40 - 9 verbleibende Hardcodes durch appConfig.labels.* ersetzt (Phase 2.3.B)
 *   0.6.0 - 2026-01-09 20:55:55 - 44 UI-Text-Hardcodes entfernt (Phase 2.3.1)
 *   0.5.1 - 2026-01-09 - Bezeichnung-Spalte als Monospace (type: 'input')
 *   0.5.0 - 2026-01-09 - Button als actions Prop an PageLayout übergeben (horizontal zentriert)
 *   0.4.0 - 2026-01-09 - Grid-Layout entfernt (Tabelle volle Breite), Historie-Dialog hinzugefügt, Header entfernt
 *   0.3.4 - 2026-01-08 - Dialog-Inhalte + Aktionen horizontal zentriert und verschlankt
 *   0.3.3 - 2026-01-08 - Dialog-Felder horizontal zentriert/verschlankt
 *   0.3.2 - 2026-01-08 - Validierung/Fehlermeldung im Material-Dialog (Erstellen) sichtbar gemacht
 *   0.3.1 - 2026-01-08 - Preis-Schritte (EK Stück 0.10, EK Gesamt 5.0, VK Stück 0.10) und Min-Grenze 0
 *   0.3.0 - 2026-01-08 - Material-Dialog neu aufgebaut (Datum-Picker, EK-Stück/Gesamt Umschalter, VK Stückpflicht)
 *   0.2.0 - 2026-01-08 - Preisumschaltung (Stück/Gesamt) im Material-Dialog + Berechnungen korrigiert
 *   0.1.0 - 2026-01-07 - Initial implementation mit BAR/KOMBI-Dialogen
 */

import { useEffect, useMemo, useState } from 'react';
import { MainApp } from '@/components/layout/mainapp';
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
  UpdateMaterialRequest,
  CreateBarBewegungRequest,
  CreateKombiBewegungRequest
} from '@/types';

// Formatierungs-Helpers
const formatInteger = (value: number): string => formatNumberTruncate(value, 0);
const formatCurrencyInt = (value: number): string => formatCurrencyTruncate(value, 0);
const formatCurrencyTwo = (value: number): string => formatCurrencyTruncate(value, 2);

export function MaterialPage() {
  const api = useApi();

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
  const [kombiDialogOpen, setKombiDialogOpen] = useState(false);
  const [historieDialogOpen, setHistorieDialogOpen] = useState(false);
  const [selectedMaterial, setSelectedMaterial] = useState<Material | null>(null);

  // Preissteuerung für Material-Dialog
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
    einnahmen_kombi: 0,
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

  const [kombiFormData, setKombiFormData] = useState<CreateKombiBewegungRequest>({
    material_id: 0,
    kunde_id: 0,
    datum: new Date().toISOString().split('T')[0],
    menge: 0,
    preis: 0,
    notiz: ''
  });

  const [preisMode, setPreisMode] = useState<'stueck' | 'gesamt'>('stueck');
  const calcEkStueckAusGesamt = (gesamt: number, menge: number) => (menge > 0 ? gesamt / menge : 0);

  const [selectedMonth, setSelectedMonth] = useState<string>(() => {
    const now = new Date();
    return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
  });
  const [monthPickerOpen, setMonthPickerOpen] = useState(false);

  const monthFormatter = useMemo(
    () =>
      new Intl.DateTimeFormat('de-DE', {
        month: 'long',
        year: 'numeric'
      }),
    []
  );

  const relativeMonthFormatter = useMemo(
    () =>
      new Intl.RelativeTimeFormat('de-DE', {
        numeric: 'auto'
      }),
    []
  );

  const toMonthKeyFromString = (value: string | null | undefined): string | null => {
    if (!value) return null;
    const parsed = new Date(value);
    if (Number.isNaN(parsed.getTime())) return null;
    return `${parsed.getFullYear()}-${String(parsed.getMonth() + 1).padStart(2, '0')}`;
  };

  const formatMonthLabel = (monthKey: string): string => {
    const [yearStr, monthStr] = monthKey.split('-');
    const year = Number(yearStr);
    const month = Number(monthStr);

    if (!Number.isFinite(year) || !Number.isFinite(month)) {
      return monthKey;
    }

    return monthFormatter.format(new Date(year, month - 1, 1));
  };

  const shiftMonth = (monthKey: string, delta: number): string => {
    const [yearStr, monthStr] = monthKey.split('-');
    const year = Number(yearStr);
    const month = Number(monthStr);

    const baseDate = Number.isFinite(year) && Number.isFinite(month) ? new Date(year, month - 1, 1) : new Date();
    baseDate.setMonth(baseDate.getMonth() + delta);
    return `${baseDate.getFullYear()}-${String(baseDate.getMonth() + 1).padStart(2, '0')}`;
  };

  const availableMonths = useMemo(() => {
    const unique = new Set<string>();

    materialien.forEach((item) => {
      const key = toMonthKeyFromString(item.datum);
      if (key) {
        unique.add(key);
      }
    });

    return Array.from(unique).sort((a, b) => (a > b ? -1 : 1));
  }, [materialien]);

  const fallbackMonth = availableMonths[0] ?? selectedMonth;

  useEffect(() => {
    if (!availableMonths.includes(selectedMonth)) {
      setSelectedMonth(fallbackMonth);
    }
  }, [availableMonths, fallbackMonth, selectedMonth]);

  const handleMonthStep = (delta: number) => {
    setSelectedMonth((current) => shiftMonth(current || fallbackMonth, delta));
    setMonthPickerOpen(false);
  };

  const handleMonthSelect = (monthKey: string) => {
    setSelectedMonth(monthKey);
    setMonthPickerOpen(false);
  };

  const filteredMaterialien = useMemo(
    () => materialien.filter((m) => toMonthKeyFromString(m.datum) === selectedMonth),
    [materialien, selectedMonth]
  );

  // Load Material
  const loadMaterial = async () => {
    setLoading(true);
    setError(null);
    try {
      const [matResult, kundenResult] = await Promise.all([
        api.fetch<Material[]>('/api/material'),
        api.fetch<Kunde[]>('/api/kunden')
      ]);

      if (matResult.success && matResult.data) {
        setMaterialien(matResult.data);
      } else {
        setError(matResult.error || 'Fehler beim Laden der Materialien');
      }

      if (kundenResult.success && kundenResult.data) {
        setKunden(kundenResult.data);
      }
    } catch (err) {
      setError(appConfig.errors.network_error);
    } finally {
      setLoading(false);
    }
  };

  // Load Historie for selected Material
  const loadHistorie = async (materialId: number): Promise<void> => {
    try {
      const result = await api.fetch<MaterialHistorieItem[]>(`/api/material/${materialId}/historie`);
      if (result.success && result.data) {
        setHistorie(result.data);
      }
    } catch (err) {
      console.error('Fehler beim Laden der Historie', err);
    }
  };

  /**
   * Öffnet Historie-Dialog für ein Material
   */
  const openHistorieDialog = (material: Material) => {
    setSelectedMaterial(material);
    void loadHistorie(material.id);
    setHistorieDialogOpen(true);
  };

  useEffect(() => {
    void loadMaterial();
  }, []);

  // Create Material
  const handleCreate = async (): Promise<void> => {
    setError(null);
    if (!formData.datum) {
      setError(appConfig.validation.date_required);
      return;
    }
    if (!formData.bezeichnung.trim()) {
      setError(appConfig.validation.designation_required);
      return;
    }
    if (formData.menge <= 0) {
      setError(appConfig.validation.quantity_must_be_positive);
      return;
    }
    if (ekPreisMode === 'stueck' && formData.ek_stueck <= 0) {
      setError(appConfig.validation.ek_stueck_must_be_positive);
      return;
    }
    if (ekPreisMode === 'gesamt' && formData.ek_gesamt <= 0) {
      setError(appConfig.validation.ek_gesamt_must_be_positive);
      return;
    }
    if (formData.vk_stueck <= 0) {
      setError(appConfig.validation.vk_stueck_must_be_positive);
      return;
    }

    const ekGesamt = ekPreisMode === 'stueck' ? formData.ek_stueck * formData.menge : formData.ek_gesamt;
    const vkStueck = formData.vk_stueck;
    const bestand = formData.menge;
    const gewinnTheoretisch = (vkStueck - formData.ek_stueck) * formData.menge;

    const baseName = formData.bezeichnung.trim().toUpperCase();
    if (!baseName) {
      setError(appConfig.validation.designation_required);
      return;
    }
    const monthPart = (() => {
      const d = new Date(formData.datum);
      const m = Number.isFinite(d.getTime()) ? d.getMonth() + 1 : NaN;
      return Number.isFinite(m) ? String(m).padStart(2, '0') : '??';
    })();
    const existingCount = materialien.filter((m) => m.bezeichnung.toUpperCase().startsWith(baseName)).length;
    const nextIndex = existingCount + 1;
    const finalName = `${baseName}${nextIndex}/${monthPart}`;

    try {
      const result = await api.fetch('/api/material', {
        method: 'POST',
        body: JSON.stringify({
          ...formData,
          bezeichnung: finalName,
          ek_gesamt: ekGesamt,
          bestand,
          einnahmen_bar: 0,
          einnahmen_kombi: 0,
          gewinn_aktuell: 0,
          gewinn_theoretisch: gewinnTheoretisch,
          notiz: formData.notiz?.toUpperCase() ?? ''
        })
      });
      if (result.success) {
        setCreateDialogOpen(false);
        resetForm();
        void loadMaterial();
      } else {
        setError(result.error || appConfig.errors.create_failed);
      }
    } catch (err) {
      setError(appConfig.errors.network_error);
    }
  };

  // Update Material
  const handleUpdate = async (): Promise<void> => {
    if (!selectedMaterial) return;
    try {
      const ekGesamt = ekPreisMode === 'stueck' ? formData.ek_stueck * formData.menge : formData.ek_gesamt;
      const bestand = formData.menge;
      const gewinnTheoretisch = (formData.vk_stueck - formData.ek_stueck) * formData.menge;
      const updateData: UpdateMaterialRequest = {
        id: selectedMaterial.id,
        ...formData,
        ek_gesamt: ekGesamt,
        bestand,
        gewinn_theoretisch: gewinnTheoretisch
      };
      const result = await api.fetch(`/api/material/${selectedMaterial.id}`, {
        method: 'PUT',
        body: JSON.stringify(updateData)
      });
      if (result.success) {
        setEditDialogOpen(false);
        setSelectedMaterial(null);
        resetForm();
        void loadMaterial();
      } else {
        setError(result.error || appConfig.errors.update_failed);
      }
    } catch (err) {
      setError(appConfig.errors.network_error);
    }
  };

  // Delete Material
  const handleDelete = async (): Promise<void> => {
    if (!selectedMaterial) return;
    try {
      const result = await api.fetch(`/api/material/${selectedMaterial.id}`, {
        method: 'DELETE'
      });
      if (result.success) {
        setDeleteDialogOpen(false);
        setSelectedMaterial(null);
        void loadMaterial();
      } else {
        setError(result.error || appConfig.errors.delete_failed);
      }
    } catch (err) {
      setError(appConfig.errors.network_error);
    }
  };

  // Preis-Helpers für Material-Dialog (Einkauf)
  const handleCreateEkMode = (mode: 'stueck' | 'gesamt') => {
    setEkPreisMode(mode);
    setFormData((prev) => {
      if (mode === 'gesamt') {
        return { ...prev, ek_gesamt: prev.ek_stueck * prev.menge };
      }
      return { ...prev };
    });
  };

  const handleCreateMengeChange = (value: string) => {
    const menge = parseFloat(value) || 0;
    setFormData((prev) => {
      const next: CreateMaterialRequest = { ...prev, menge, bestand: menge };
      if (ekPreisMode === 'stueck') {
        next.ek_gesamt = next.ek_stueck * menge;
      } else {
        next.ek_stueck = calcEkStueckAusGesamt(prev.ek_gesamt, menge);
      }
      next.gewinn_theoretisch = (prev.vk_stueck - next.ek_stueck) * menge;
      return next;
    });
  };

  const handleCreateEkPreisChange = (value: string) => {
    const preis = parseFloat(value) || 0;
    setFormData((prev) => {
      const next = { ...prev };
      if (ekPreisMode === 'stueck') {
        next.ek_stueck = preis;
        next.ek_gesamt = preis * prev.menge;
      } else {
        next.ek_gesamt = preis;
        next.ek_stueck = calcEkStueckAusGesamt(preis, prev.menge);
      }
      next.gewinn_theoretisch = (prev.vk_stueck - next.ek_stueck) * prev.menge;
      return next;
    });
  };

  const handleCreateVkStueckChange = (value: string) => {
    const preis = parseFloat(value) || 0;
    setFormData((prev) => ({
      ...prev,
      vk_stueck: preis,
      gewinn_theoretisch: (preis - prev.ek_stueck) * prev.menge
    }));
  };

  // Bar Bewegung
  const handleBarBewegung = async (): Promise<void> => {
    try {
      // Calculate price based on mode
      const finalPreis = preisMode === 'stueck' ? barFormData.menge * barFormData.preis : barFormData.preis;

      const data = { ...barFormData, preis: finalPreis };

      const result = await api.fetch('/api/material/bewegung-bar', {
        method: 'POST',
        body: JSON.stringify(data)
      });
      if (result.success) {
        setBarDialogOpen(false);
        resetBarForm();
        void loadMaterial();
        if (selectedMaterial) {
          void loadHistorie(selectedMaterial.id);
        }
      } else {
        setError(result.error || appConfig.errors.create_failed);
      }
    } catch (err) {
      setError(appConfig.errors.network_error);
    }
  };

  // Kombi Bewegung
  const handleKombiBewegung = async (): Promise<void> => {
    try {
      // Calculate price based on mode
      const finalPreis = preisMode === 'stueck' ? kombiFormData.menge * kombiFormData.preis : kombiFormData.preis;

      const data = { ...kombiFormData, preis: finalPreis };

      const result = await api.fetch('/api/material/bewegung-kombi', {
        method: 'POST',
        body: JSON.stringify(data)
      });
      if (result.success) {
        setKombiDialogOpen(false);
        resetKombiForm();
        void loadMaterial();
        if (selectedMaterial) {
          void loadHistorie(selectedMaterial.id);
        }
      } else {
        setError(result.error || appConfig.errors.create_failed);
      }
    } catch (err) {
      setError(appConfig.errors.network_error);
    }
  };

  // Open Edit Dialog
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
      einnahmen_kombi: m.einnahmen_kombi,
      gewinn_aktuell: m.gewinn_aktuell,
      gewinn_theoretisch: m.gewinn_theoretisch,
      notiz: m.notiz || ''
    });
    setEkPreisMode('stueck');
    setEditDialogOpen(true);
  };

  // Open Delete Dialog
  const openDeleteDialog = (m: Material) => {
    setSelectedMaterial(m);
    setDeleteDialogOpen(true);
  };

  // Open Bar Dialog
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

  // Open Kombi Dialog
  const openKombiDialog = (m: Material) => {
    setSelectedMaterial(m);
    setKombiFormData({
      material_id: m.id,
      kunde_id: 0,
      datum: new Date().toISOString().split('T')[0],
      menge: 0,
      preis: m.vk_stueck,
      notiz: ''
    });
    setPreisMode('stueck');
    void loadHistorie(m.id);
    setKombiDialogOpen(true);
  };

  // Reset Forms
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
      einnahmen_kombi: 0,
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

  const resetKombiForm = () => {
    setKombiFormData({
      material_id: 0,
      kunde_id: 0,
      datum: new Date().toISOString().split('T')[0],
      menge: 0,
      preis: 0,
      notiz: ''
    });
    setPreisMode('stueck');
  };

  // Table Columns mit Auto-Rendering (Table.tsx)
  const columns = appConfig.pages.material.table.columns.map((col) => ({
    key: col.key,
    label: col.label,
    type: col.key === 'bestand' ? 'stock' : (col.type as 'text' | 'number' | 'currency' | 'date' | 'status' | 'actions' | 'input' | 'stock' | undefined),
    // ProgressBar Auto-Rendering für Bestand
    stockCurrent: col.key === 'bestand' ? (m: Material) => m.bestand : undefined,
    stockMax: col.key === 'bestand' ? (m: Material) => m.menge : undefined,
    // Custom Renders für spezielle Formatierungen
    render: col.key === 'datum' ? (m: Material) => formatDate(m.datum) :
            col.key === 'menge' ? (m: Material) => formatInteger(m.menge) :
            col.key === 'ek_stueck' ? (m: Material) => formatCurrencyTwo(m.ek_stueck) :
            col.key === 'ek_gesamt' ? (m: Material) => formatCurrencyInt(m.ek_gesamt) :
            col.key === 'vk_stueck' ? (m: Material) => formatCurrencyTwo(m.vk_stueck) :
            col.key === 'einnahmen' ? (m: Material) => formatCurrencyInt(m.einnahmen_bar + m.einnahmen_kombi) :
            col.key === 'aussenstaende' ? () => formatCurrencyInt(0) :
            col.key === 'theor_einnahmen' ? (m: Material) => formatCurrencyInt(m.vk_stueck * m.menge) :
            (col.key === 'gewinn' || col.key === 'gewinn_aktuell') ? (m: Material) => {
              const earned = (m.einnahmen_bar || 0) + (m.einnahmen_kombi || 0);
              const profit = earned - (m.ek_gesamt || 0);
              return formatCurrencyInt(profit);
            } : undefined,
    actions: col.key === 'actions' ? (m: Material) => [
      { type: 'bar' as const, onClick: () => void openBarDialog(m) },
      { type: 'rechnung' as const, onClick: () => void openKombiDialog(m) },
      { type: 'edit' as const, onClick: () => void openEditDialog(m) },
      { type: 'delete' as const, onClick: () => void openDeleteDialog(m) }
    ] : undefined
  }));

  return (
    <MainApp title={appConfig.page_titles.material}>
      <div className="space-y-4">
        {/* Error */}
        {error && <div className="p-4 bg-red-500/10 border border-red-500 rounded text-red-400">{error}</div>}

        {/* Button-Reihe: Neu + Monats-Navigation über der Tabelle */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <Button.Action type="prevMonth" onClick={() => handleMonthStep(-1)} />
            <div className="relative">
              <Button.Rect onClick={() => setMonthPickerOpen((open) => !open)}>
                <Calendar />
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
                      role="option"
                      aria-selected={monthKey === selectedMonth}
                    >
                      <span className="capitalize">{formatMonthLabel(monthKey)}</span>
                      <span className="text-xs text-neutral-400">{monthKey}</span>
                    </button>
                  ))}

                  {availableMonths.length === 0 && (
                    <div className="px-3 py-2 text-center text-sm text-neutral-300 capitalize">
                      {formatMonthLabel(selectedMonth)}
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

            <Button.Action type="nextMonth" onClick={() => handleMonthStep(1)} />
          </div>
          <Button.Action type="new" onClick={() => setCreateDialogOpen(true)} />
        </div>

        {/* Table - VOLLE BREITE */
        <Table
          data={filteredMaterialien}
          columns={columns}
          loading={loading}
          emptyMessage={appConfig.empty_states.no_material_posts}
          onRowClick={(m) => void openHistorieDialog(m)}
        />

        {/* Create Material Dialog */}
        <Dialog
          open={createDialogOpen}
          onClose={() => {
            setCreateDialogOpen(false);
            setError(null);
            resetForm();
          }}
          title={appConfig.components.dialog_titles.new_material}
          actions={
            <>
              <Button.Rect
                type="cancel"
                onClick={() => {
                  setCreateDialogOpen(false);
                  setError(null);
                  resetForm();
                }}
              />
              <Button.Rect onClick={() => void handleCreate()}>{appConfig.components.buttons.create}</Button.Rect>
            </>
          }
        >
          <div className="space-y-4 flex flex-col items-center text-center">
            {createDialogOpen && error && (
              <div className="p-3 rounded border border-red-500/60 bg-red-500/10 text-sm text-red-300 max-w-sm w-full">
                {error}
              </div>
            )}
            <Input
              label={appConfig.labels.date}
              type="date"
              value={formData.datum}
              onChange={(e) => setFormData({ ...formData, datum: e.target.value })}
              className="w-full max-w-sm text-center"
            />
            <Input
              label={appConfig.labels.designation}
              value={formData.bezeichnung}
              onChange={(e) => setFormData({ ...formData, bezeichnung: e.target.value.toUpperCase() })}
              className="w-full max-w-sm text-center"
            />
            <Input
              label={appConfig.labels.quantity}
              type="number"
              min={0}
              step="0.01"
              value={formData.menge}
              onChange={(e) => handleCreateMengeChange(e.target.value)}
              className="w-full max-w-sm text-center"
            />
            <div className="space-y-2 w-full max-w-sm">
              <div className="flex gap-2 justify-center">
                <Button.Rect onClick={() => handleCreateEkMode('stueck')}>
                  {appConfig.labels.purchase_price}
                </Button.Rect>
                <Button.Rect onClick={() => handleCreateEkMode('gesamt')}>
                  EK Gesamt
                </Button.Rect>
              </div>
              <Input
                label={ekPreisMode === 'stueck' ? appConfig.labels.purchase_price : 'EK Gesamt'}
                type="number"
                min={0}
                step={ekPreisMode === 'stueck' ? '0.1' : '5'}
                value={ekPreisMode === 'stueck' ? formData.ek_stueck : formData.ek_gesamt}
                onChange={(e) => handleCreateEkPreisChange(e.target.value)}
                className="w-full"
              />
              <p className="text-sm text-neutral-400 text-center">
                {ekPreisMode === 'stueck'
                  ? `EK Gesamt: ${formatCurrency(formData.ek_stueck * formData.menge || 0)}`
                  : `${appConfig.labels.purchase_price}: ${formatCurrency(calcEkStueckAusGesamt(formData.ek_gesamt, formData.menge) || 0)}`}
              </p>
            </div>
            <Input
              label={appConfig.labels.price_per_unit}
              type="number"
              min={0}
              step="0.1"
              value={formData.vk_stueck}
              onChange={(e) => handleCreateVkStueckChange(e.target.value)}
              className="w-full max-w-sm text-center"
            />
            <Input
              label={appConfig.labels.note}
              value={formData.notiz}
              onChange={(e) => setFormData({ ...formData, notiz: e.target.value.toUpperCase() })}
              className="w-full max-w-sm text-center"
            />
          </div>
        </Dialog>

        {/* Edit Material Dialog */}
        <Dialog
          open={editDialogOpen}
          onClose={() => {
            setEditDialogOpen(false);
            setSelectedMaterial(null);
            resetForm();
          }}
          title={appConfig.components.dialog_titles.edit_material}
          actions={
            <>
              <Button.Rect
                type="cancel"
                onClick={() => {
                  setEditDialogOpen(false);
                  setSelectedMaterial(null);
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
              label={appConfig.labels.designation}
              value={formData.bezeichnung}
              onChange={(e) => setFormData({ ...formData, bezeichnung: e.target.value })}
            />
            <Input
              label={appConfig.labels.quantity}
              type="number"
              min={0}
              step="0.01"
              value={formData.menge}
              onChange={(e) => setFormData({ ...formData, menge: parseFloat(e.target.value) || 0 })}
            />
            <Input
              label={appConfig.labels.purchase_price}
              type="number"
              min={0}
              step="0.1"
              value={formData.ek_stueck}
              onChange={(e) => setFormData({ ...formData, ek_stueck: parseFloat(e.target.value) || 0 })}
            />
            <Input
              label={appConfig.labels.price_per_unit}
              type="number"
              min={0}
              step="0.1"
              value={formData.vk_stueck}
              onChange={(e) => handleCreateVkStueckChange(e.target.value)}
            />
            <div className="space-y-2">
              <div className="flex gap-2">
                <Button.Rect onClick={() => handleCreateEkMode('stueck')}>
                  {appConfig.labels.purchase_price}
                </Button.Rect>
                <Button.Rect onClick={() => handleCreateEkMode('gesamt')}>
                  EK Gesamt
                </Button.Rect>
              </div>
              <Input
                label={ekPreisMode === 'stueck' ? appConfig.labels.purchase_price : 'EK Gesamt'}
                type="number"
                min={0}
                step={ekPreisMode === 'stueck' ? '0.1' : '5'}
                value={ekPreisMode === 'stueck' ? formData.ek_stueck : formData.ek_gesamt}
                onChange={(e) => handleCreateEkPreisChange(e.target.value)}
              />
              <p className="text-sm text-neutral-400">
                {ekPreisMode === 'stueck'
                  ? `EK Gesamt: ${formatCurrency(formData.ek_stueck * formData.menge || 0)}`
                  : `${appConfig.labels.purchase_price}: ${formatCurrency(calcEkStueckAusGesamt(formData.ek_gesamt, formData.menge) || 0)}`}
              </p>
            </div>
            <Input
              label={appConfig.labels.note}
              value={formData.notiz}
              onChange={(e) => setFormData({ ...formData, notiz: e.target.value })}
            />
          </div>
        </Dialog>

        {/* Delete Material Dialog */}
        <Dialog
          open={deleteDialogOpen}
          onClose={() => {
            setDeleteDialogOpen(false);
            setSelectedMaterial(null);
          }}
          title={appConfig.components.dialog_titles.delete_material}
          actions={
            <>
              <Button.Rect
                type="cancel"
                onClick={() => {
                  setDeleteDialogOpen(false);
                  setSelectedMaterial(null);
                }}
              />
              <Button.Rect onClick={() => void handleDelete()}>
                {appConfig.components.buttons.delete}
              </Button.Rect>
            </>
          }
        >
          <p className="text-neutral-300">
            {appConfig.messages.confirm_delete_material.replace('{name}', selectedMaterial?.bezeichnung || '')}
          </p>
        </Dialog>

        {/* Bar Bewegung Dialog */}
        <Dialog
          open={barDialogOpen}
          onClose={() => {
            setBarDialogOpen(false);
            setSelectedMaterial(null);
            resetBarForm();
          }}
          title={`Bar-Verkauf: ${selectedMaterial?.bezeichnung || ''}`}
          actions={
            <>
              <Button.Rect
                type="cancel"
                onClick={() => {
                  setBarDialogOpen(false);
                  setSelectedMaterial(null);
                  resetBarForm();
                }}
              />
              <Button.Rect onClick={() => void handleBarBewegung()}>
                {appConfig.components.buttons.record}
              </Button.Rect>
            </>
          }
        >
          <div className="space-y-4">
            <div className="p-4 bg-neutral-800 rounded">
              <p className="text-neutral-400 text-sm">Verfügbar</p>
              <p className="text-2xl font-semibold text-neutral-50">{selectedMaterial?.bestand.toFixed(2) || '0.00'}</p>
            </div>
            <Input
              label={appConfig.labels.date}
              type="date"
              value={barFormData.datum}
              onChange={(e) => setBarFormData({ ...barFormData, datum: e.target.value })}
            />
            <Input
              label={appConfig.labels.quantity}
              type="number"
              step="0.01"
              value={barFormData.menge}
              onChange={(e) => setBarFormData({ ...barFormData, menge: parseFloat(e.target.value) || 0 })}
            />
            <div className="space-y-2">
              <div className="flex gap-2">
                <Button.Rect onClick={() => setPreisMode('stueck')}>
                  Preis/Stück
                </Button.Rect>
                <Button.Rect onClick={() => setPreisMode('gesamt')}>
                  Preis Gesamt
                </Button.Rect>
              </div>
              <Input
                label={preisMode === 'stueck' ? 'Preis pro Stück' : 'Preis Gesamt'}
                type="number"
                step="0.01"
                value={barFormData.preis}
                onChange={(e) => setBarFormData({ ...barFormData, preis: parseFloat(e.target.value) || 0 })}
              />
              {preisMode === 'stueck' && (
                <p className="text-sm text-neutral-400">
                  Gesamt: {formatCurrency(barFormData.menge * barFormData.preis)}
                </p>
              )}
            </div>
            <Input
              label={appConfig.labels.info}
              value={barFormData.info}
              onChange={(e) => setBarFormData({ ...barFormData, info: e.target.value })}
            />
            <Input
              label={appConfig.labels.note}
              value={barFormData.notiz}
              onChange={(e) => setBarFormData({ ...barFormData, notiz: e.target.value })}
            />
          </div>
        </Dialog>

        {/* Kombi Bewegung Dialog */}
        <Dialog
          open={kombiDialogOpen}
          onClose={() => {
            setKombiDialogOpen(false);
            setSelectedMaterial(null);
            resetKombiForm();
          }}
          title={`Kombi-Buchung: ${selectedMaterial?.bezeichnung || ''}`}
          actions={
            <>
              <Button.Rect
                type="cancel"
                onClick={() => {
                  setKombiDialogOpen(false);
                  setSelectedMaterial(null);
                  resetKombiForm();
                }}
              />
              <Button.Rect onClick={() => void handleKombiBewegung()}>
                {appConfig.components.buttons.record}
              </Button.Rect>
            </>
          }
        >
          <div className="space-y-4">
            <div className="p-4 bg-neutral-800 rounded">
              <p className="text-neutral-400 text-sm">Verfügbar</p>
              <p className="text-2xl font-semibold text-neutral-50">{selectedMaterial?.bestand.toFixed(2) || '0.00'}</p>
            </div>
            <Select
              label={appConfig.labels.name}
              value={kombiFormData.kunde_id.toString()}
              onChange={(e) => setKombiFormData({ ...kombiFormData, kunde_id: parseInt(e.target.value) })}
              options={kunden.map((k) => ({ value: k.id.toString(), label: k.name }))}
            />
            <Input
              label={appConfig.labels.date}
              type="date"
              value={kombiFormData.datum}
              onChange={(e) => setKombiFormData({ ...kombiFormData, datum: e.target.value })}
            />
            <Input
              label={appConfig.labels.quantity}
              type="number"
              step="0.01"
              value={kombiFormData.menge}
              onChange={(e) => setKombiFormData({ ...kombiFormData, menge: parseFloat(e.target.value) || 0 })}
            />
            <div className="space-y-2">
              <div className="flex gap-2">
                <Button.Rect onClick={() => setPreisMode('stueck')}>
                  Preis/Stück
                </Button.Rect>
                <Button.Rect onClick={() => setPreisMode('gesamt')}>
                  Preis Gesamt
                </Button.Rect>
              </div>
              <Input
                label={preisMode === 'stueck' ? 'Preis pro Stück' : 'Preis Gesamt'}
                type="number"
                step="0.01"
                value={kombiFormData.preis}
                onChange={(e) => setKombiFormData({ ...kombiFormData, preis: parseFloat(e.target.value) || 0 })}
              />
              {preisMode === 'stueck' && (
                <p className="text-sm text-neutral-400">
                  Gesamt: {formatCurrency(kombiFormData.menge * kombiFormData.preis)}
                </p>
              )}
            </div>
            <Input
              label={appConfig.labels.note}
              value={kombiFormData.notiz}
              onChange={(e) => setKombiFormData({ ...kombiFormData, notiz: e.target.value })}
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
          title={
            selectedMaterial
              ? `${appConfig.components.dialog_titles.history}: ${selectedMaterial.bezeichnung}`
              : appConfig.components.dialog_titles.history
          }
          actions={
            <Button
              onClick={() => {
                setHistorieDialogOpen(false);
                setSelectedMaterial(null);
                setHistorie([]);
              }}
            >
              {appConfig.components.buttons.close}
            </Button>
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
                    <p>
                      {appConfig.labels.quantity}: {item.menge.toFixed(2)}
                    </p>
                    <p>Preis: {formatCurrency(item.preis)}</p>
                    {item.kunde_name && <p>Kunde: {item.kunde_name}</p>}
                    {item.info && (
                      <p>
                        {appConfig.labels.info.replace(' (optional)', '')}: {item.info}
                      </p>
                    )}
                    {item.notiz && (
                      <p>
                        {appConfig.labels.note.replace(' (optional)', '')}: {item.notiz}
                      </p>
                    )}
                  </div>
                </Infobox>
              ))}
            </div>
          ) : (
            <p className="text-neutral-400 text-sm text-center py-4">{appConfig.empty_states.no_history}</p>
          )}
        </Dialog>
      </div>
    </MainApp>
  );
}
