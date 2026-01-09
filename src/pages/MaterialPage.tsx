/**
 * @file        MaterialPage.tsx
 * @description Material-Verwaltung mit Bar/Kombi-Buchungen und Historie
 * @version     0.6.0
 * @created     2026-01-07 01:36:51 CET
 * @updated     2026-01-09 20:55:55 CET
 * @author      Akki Scholze
 *
 * @changelog
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

import { useState, useEffect } from 'react';
import { PageLayout } from '@/components/layout/PageLayout';
import { Table } from '@/components/ui/Table';
import { Button } from '@/components/ui/Button';
import { Dialog } from '@/components/ui/Dialog';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Infobox } from '@/components/ui/Infobox';
import { useApi } from '@/hooks/useApi';
import { formatCurrency, formatDate } from '@/utils/format';
import { appConfig } from '@/config';
import { PackagePlus, Banknote, FileText, Pencil, Trash2 } from 'lucide-react';
import type {
  Material,
  Kunde,
  MaterialHistorieItem,
  CreateMaterialRequest,
  UpdateMaterialRequest,
  CreateBarBewegungRequest,
  CreateKombiBewegungRequest
} from '@/types';

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
        setError(matResult.error || appConfig.ui.errors.load_failed);
      }

      if (kundenResult.success && kundenResult.data) {
        setKunden(kundenResult.data);
      }
    } catch (err) {
      setError(appConfig.ui.errors.network_error);
    } finally {
      setLoading(false);
    }
  };

  // Load Historie for selected Material
  const loadHistorie = async (materialId: number) => {
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
    loadHistorie(material.id);
    setHistorieDialogOpen(true);
  };

  useEffect(() => {
    loadMaterial();
  }, []);

  // Create Material
  const handleCreate = async () => {
    setError(null);
    if (!formData.datum) {
      setError(appConfig.ui.validation.date_required);
      return;
    }
    if (!formData.bezeichnung.trim()) {
      setError(appConfig.ui.validation.designation_required);
      return;
    }
    if (formData.menge <= 0) {
      setError(appConfig.ui.validation.quantity_must_be_positive);
      return;
    }
    if (ekPreisMode === 'stueck' && formData.ek_stueck <= 0) {
      setError(appConfig.ui.validation.ek_stueck_must_be_positive);
      return;
    }
    if (ekPreisMode === 'gesamt' && formData.ek_gesamt <= 0) {
      setError(appConfig.ui.validation.ek_gesamt_must_be_positive);
      return;
    }
    if (formData.vk_stueck <= 0) {
      setError(appConfig.ui.validation.vk_stueck_must_be_positive);
      return;
    }

    const ekGesamt = ekPreisMode === 'stueck' ? formData.ek_stueck * formData.menge : formData.ek_gesamt;
    const vkStueck = formData.vk_stueck;
    const bestand = formData.menge;
    const gewinnTheoretisch = (vkStueck - formData.ek_stueck) * formData.menge;

    const baseName = formData.bezeichnung.trim().toUpperCase();
    if (!baseName) {
      setError(appConfig.ui.validation.designation_required);
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
        loadMaterial();
      } else {
        setError(result.error || appConfig.ui.errors.create_failed);
      }
    } catch (err) {
      setError(appConfig.ui.errors.network_error);
    }
  };

  // Update Material
  const handleUpdate = async () => {
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
        loadMaterial();
      } else {
        setError(result.error || appConfig.ui.errors.update_failed);
      }
    } catch (err) {
      setError(appConfig.ui.errors.network_error);
    }
  };

  // Delete Material
  const handleDelete = async () => {
    if (!selectedMaterial) return;
    try {
      const result = await api.fetch(`/api/material/${selectedMaterial.id}`, {
        method: 'DELETE'
      });
      if (result.success) {
        setDeleteDialogOpen(false);
        setSelectedMaterial(null);
        loadMaterial();
      } else {
        setError(result.error || appConfig.ui.errors.delete_failed);
      }
    } catch (err) {
      setError(appConfig.ui.errors.network_error);
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
  const handleBarBewegung = async () => {
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
        loadMaterial();
        if (selectedMaterial) {
          loadHistorie(selectedMaterial.id);
        }
      } else {
        setError(result.error || appConfig.ui.errors.create_failed);
      }
    } catch (err) {
      setError(appConfig.ui.errors.network_error);
    }
  };

  // Kombi Bewegung
  const handleKombiBewegung = async () => {
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
        loadMaterial();
        if (selectedMaterial) {
          loadHistorie(selectedMaterial.id);
        }
      } else {
        setError(result.error || appConfig.ui.errors.create_failed);
      }
    } catch (err) {
      setError(appConfig.ui.errors.network_error);
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
    loadHistorie(m.id);
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
    loadHistorie(m.id);
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

  // Table Columns
  const columns = [
    { key: 'datum', label: appConfig.ui.labels.date, render: (m: Material) => formatDate(m.datum) },
    { key: 'bezeichnung', label: appConfig.ui.labels.designation, type: 'input' as const },
    { key: 'menge', label: appConfig.ui.labels.quantity, render: (m: Material) => m.menge.toFixed(2) },
    { key: 'ek_stueck', label: 'EK Stück', render: (m: Material) => formatCurrency(m.ek_stueck) },
    { key: 'ek_gesamt', label: 'EK Gesamt', render: (m: Material) => formatCurrency(m.ek_gesamt) },
    { key: 'vk_stueck', label: 'VK Stück', render: (m: Material) => formatCurrency(m.vk_stueck) },
    { key: 'bestand', label: 'Bestand', render: (m: Material) => m.bestand.toFixed(2) },
    {
      key: 'einnahmen',
      label: 'Einnahmen',
      render: (m: Material) => formatCurrency(m.einnahmen_bar + m.einnahmen_kombi)
    },
    { key: 'gewinn_aktuell', label: 'Gewinn', render: (m: Material) => formatCurrency(m.gewinn_aktuell) },
    {
      key: 'actions',
      label: 'Aktionen',
      render: (m: Material) => (
        <div className="flex gap-2 flex-wrap">
          <Button icon={<Banknote />} iconOnly size="sm" variant="success" onClick={() => openBarDialog(m)} title={appConfig.ui.tooltips.bar_transaction} />
          <Button icon={<FileText />} iconOnly size="sm" variant="primary" onClick={() => openKombiDialog(m)} title={appConfig.ui.tooltips.kombi_transaction} />
          <Button icon={<Pencil />} iconOnly size="sm" variant="secondary" onClick={() => openEditDialog(m)} title={appConfig.ui.tooltips.edit} />
          <Button icon={<Trash2 />} iconOnly size="sm" variant="danger" onClick={() => openDeleteDialog(m)} title={appConfig.ui.tooltips.delete} />
        </div>
      )
    }
  ];

  return (
    <PageLayout 
      title={appConfig.ui.page_titles.material}
      actions={
        <Button icon={<PackagePlus />} iconOnly variant="transparent" size="lg" onClick={() => setCreateDialogOpen(true)} title={appConfig.ui.dialog_titles.new_material} />
      }
    >
      <div className="space-y-4">
        {/* Error */}
        {error && <div className="p-4 bg-red-500/10 border border-red-500 rounded text-red-400">{error}</div>}

        {/* Table - VOLLE BREITE */}
        <Table 
          data={materialien} 
          columns={columns} 
          loading={loading} 
          emptyMessage={appConfig.ui.empty_states.no_material_posts}
          onRowClick={(m) => openHistorieDialog(m)}
        />

        {/* Dialogs */}
        {/* Create Material Dialog */}
        <Dialog
          open={createDialogOpen}
          onClose={() => {
            setCreateDialogOpen(false);
            setError(null);
            resetForm();
          }}
          title={appConfig.ui.dialog_titles.new_material}
          actions={
            <>
              <Button
                variant="secondary"
                onClick={() => {
                  setCreateDialogOpen(false);
                  setError(null);
                  resetForm();
                }}
              >
                {appConfig.ui.buttons.cancel}
              </Button>
              <Button onClick={handleCreate}>{appConfig.ui.buttons.create}</Button>
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
              label={appConfig.ui.labels.date}
              type="date"
              value={formData.datum}
              onChange={(e) => setFormData({ ...formData, datum: e.target.value })}
              className="w-full max-w-sm text-center"
            />
            <Input
              label={appConfig.ui.labels.designation}
              value={formData.bezeichnung}
              onChange={(e) => setFormData({ ...formData, bezeichnung: e.target.value.toUpperCase() })}
              className="w-full max-w-sm text-center"
            />
            <Input
              label={appConfig.ui.labels.quantity}
              type="number"
              min={0}
              step="0.01"
              value={formData.menge}
              onChange={(e) => handleCreateMengeChange(e.target.value)}
              className="w-full max-w-sm text-center"
            />
            <div className="space-y-2 w-full max-w-sm">
              <div className="flex gap-2 justify-center">
                <Button
                  size="sm"
                  variant={ekPreisMode === 'stueck' ? 'primary' : 'secondary'}
                  onClick={() => handleCreateEkMode('stueck')}
                >
                  EK Stück
                </Button>
                <Button
                  size="sm"
                  variant={ekPreisMode === 'gesamt' ? 'primary' : 'secondary'}
                  onClick={() => handleCreateEkMode('gesamt')}
                >
                  EK Gesamt
                </Button>
              </div>
              <Input
                label={ekPreisMode === 'stueck' ? 'EK Stück' : 'EK Gesamt'}
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
                  : `EK Stück: ${formatCurrency(calcEkStueckAusGesamt(formData.ek_gesamt, formData.menge) || 0)}`}
              </p>
            </div>
            <Input
              label="VK Stück (Mindest-VK)"
              type="number"
              min={0}
              step="0.1"
              value={formData.vk_stueck}
              onChange={(e) => handleCreateVkStueckChange(e.target.value)}
              className="w-full max-w-sm text-center"
            />
            <Input
              label="Notiz (optional)"
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
          title={appConfig.ui.dialog_titles.edit_material}
          actions={
            <>
              <Button
                variant="secondary"
                onClick={() => {
                  setEditDialogOpen(false);
                  setSelectedMaterial(null);
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
              label={appConfig.ui.labels.designation}
              value={formData.bezeichnung}
              onChange={(e) => setFormData({ ...formData, bezeichnung: e.target.value })}
            />
            <Input
              label={appConfig.ui.labels.quantity}
              type="number"
              min={0}
              step="0.01"
              value={formData.menge}
              onChange={(e) => setFormData({ ...formData, menge: parseFloat(e.target.value) || 0 })}
            />
            <Input
              label="EK Stück"
              type="number"
              min={0}
              step="0.1"
              value={formData.ek_stueck}
              onChange={(e) => setFormData({ ...formData, ek_stueck: parseFloat(e.target.value) || 0 })}
            />
            <Input
              label="VK Stück (Mindest-VK)"
              type="number"
              min={0}
              step="0.1"
              value={formData.vk_stueck}
              onChange={(e) => handleCreateVkStueckChange(e.target.value)}
            />
            <div className="space-y-2">
              <div className="flex gap-2">
                <Button
                  size="sm"
                  variant={ekPreisMode === 'stueck' ? 'primary' : 'secondary'}
                  onClick={() => handleCreateEkMode('stueck')}
                >
                  EK Stück
                </Button>
                <Button
                  size="sm"
                  variant={ekPreisMode === 'gesamt' ? 'primary' : 'secondary'}
                  onClick={() => handleCreateEkMode('gesamt')}
                >
                  EK Gesamt
                </Button>
              </div>
              <Input
                label={ekPreisMode === 'stueck' ? 'EK Stück' : 'EK Gesamt'}
                type="number"
                min={0}
                step={ekPreisMode === 'stueck' ? '0.1' : '5'}
                value={ekPreisMode === 'stueck' ? formData.ek_stueck : formData.ek_gesamt}
                onChange={(e) => handleCreateEkPreisChange(e.target.value)}
              />
              <p className="text-sm text-neutral-400">
                {ekPreisMode === 'stueck'
                  ? `EK Gesamt: ${formatCurrency(formData.ek_stueck * formData.menge || 0)}`
                  : `EK Stück: ${formatCurrency(calcEkStueckAusGesamt(formData.ek_gesamt, formData.menge) || 0)}`}
              </p>
            </div>
            <Input
              label="Notiz (optional)"
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
          title={appConfig.ui.dialog_titles.delete_material}
          actions={
            <>
              <Button
                variant="secondary"
                onClick={() => {
                  setDeleteDialogOpen(false);
                  setSelectedMaterial(null);
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
          <p className="text-neutral-300">
            {appConfig.ui.messages.confirm_delete_material.replace('{name}', selectedMaterial?.bezeichnung || '')}
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
              <Button
                variant="secondary"
                onClick={() => {
                  setBarDialogOpen(false);
                  setSelectedMaterial(null);
                  resetBarForm();
                }}
              >
                {appConfig.ui.buttons.cancel}
              </Button>
              <Button variant="success" onClick={handleBarBewegung}>
                {appConfig.ui.buttons.record}
              </Button>
            </>
          }
        >
          <div className="space-y-4">
            <div className="p-4 bg-neutral-800 rounded">
              <p className="text-neutral-400 text-sm">Verfügbar</p>
              <p className="text-2xl font-semibold text-neutral-50">{selectedMaterial?.bestand.toFixed(2) || '0.00'}</p>
            </div>
            <Input
              label={appConfig.ui.labels.date}
              type="date"
              value={barFormData.datum}
              onChange={(e) => setBarFormData({ ...barFormData, datum: e.target.value })}
            />
            <Input
              label={appConfig.ui.labels.quantity}
              type="number"
              step="0.01"
              value={barFormData.menge}
              onChange={(e) => setBarFormData({ ...barFormData, menge: parseFloat(e.target.value) || 0 })}
            />
            <div className="space-y-2">
              <div className="flex gap-2">
                <Button
                  size="sm"
                  variant={preisMode === 'stueck' ? 'primary' : 'secondary'}
                  onClick={() => setPreisMode('stueck')}
                >
                  Preis/Stück
                </Button>
                <Button
                  size="sm"
                  variant={preisMode === 'gesamt' ? 'primary' : 'secondary'}
                  onClick={() => setPreisMode('gesamt')}
                >
                  Preis Gesamt
                </Button>
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
              label="Info (optional)"
              value={barFormData.info}
              onChange={(e) => setBarFormData({ ...barFormData, info: e.target.value })}
            />
            <Input
              label="Notiz (optional)"
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
              <Button
                variant="secondary"
                onClick={() => {
                  setKombiDialogOpen(false);
                  setSelectedMaterial(null);
                  resetKombiForm();
                }}
              >
                {appConfig.ui.buttons.cancel}
              </Button>
              <Button variant="primary" onClick={handleKombiBewegung}>
                {appConfig.ui.buttons.record}
              </Button>
            </>
          }
        >
          <div className="space-y-4">
            <div className="p-4 bg-neutral-800 rounded">
              <p className="text-neutral-400 text-sm">Verfügbar</p>
              <p className="text-2xl font-semibold text-neutral-50">{selectedMaterial?.bestand.toFixed(2) || '0.00'}</p>
            </div>
            <Select
              label={appConfig.ui.labels.name}
              value={kombiFormData.kunde_id.toString()}
              onChange={(e) => setKombiFormData({ ...kombiFormData, kunde_id: parseInt(e.target.value) })}
              options={kunden.map((k) => ({ value: k.id.toString(), label: k.name }))}
            />
            <Input
              label={appConfig.ui.labels.date}
              type="date"
              value={kombiFormData.datum}
              onChange={(e) => setKombiFormData({ ...kombiFormData, datum: e.target.value })}
            />
            <Input
              label={appConfig.ui.labels.quantity}
              type="number"
              step="0.01"
              value={kombiFormData.menge}
              onChange={(e) => setKombiFormData({ ...kombiFormData, menge: parseFloat(e.target.value) || 0 })}
            />
            <div className="space-y-2">
              <div className="flex gap-2">
                <Button
                  size="sm"
                  variant={preisMode === 'stueck' ? 'primary' : 'secondary'}
                  onClick={() => setPreisMode('stueck')}
                >
                  Preis/Stück
                </Button>
                <Button
                  size="sm"
                  variant={preisMode === 'gesamt' ? 'primary' : 'secondary'}
                  onClick={() => setPreisMode('gesamt')}
                >
                  Preis Gesamt
                </Button>
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
              label="Notiz (optional)"
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
          title={selectedMaterial ? `Historie: ${selectedMaterial.bezeichnung}` : "Historie"}
          actions={
            <Button onClick={() => {
              setHistorieDialogOpen(false);
              setSelectedMaterial(null);
              setHistorie([]);
            }}>
              {appConfig.ui.buttons.close}
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
            <p className="text-neutral-400 text-sm text-center py-4">
              {appConfig.ui.empty_states.no_history}
            </p>
          )}
        </Dialog>
      </div>
    </PageLayout>
  );
}
