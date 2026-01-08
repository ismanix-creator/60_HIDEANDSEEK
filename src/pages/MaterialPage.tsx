/**
 * @file        MaterialPage.tsx
 * @description Material-Verwaltung mit Bar/Kombi-Buchungen und Historie
 * @version     0.1.0
 * @created     2026-01-07 01:36:51 CET
 * @updated     2026-01-07 01:36:51 CET
 * @author      frontend-entwickler
 *
 * @changelog
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
import { useResponsive } from '@/hooks/useResponsive';
import { formatCurrency, formatDate } from '@/utils/format';
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
  const { isMobile } = useResponsive();

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
  const [selectedMaterial, setSelectedMaterial] = useState<Material | null>(null);

  // Form States
  const [formData, setFormData] = useState<CreateMaterialRequest>({
    datum: new Date().toISOString().split('T')[0],
    bezeichnung: '',
    menge: 0,
    ek_stueck: 0,
    vk_stueck: 0,
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
        setError(matResult.error || 'Fehler beim Laden');
      }

      if (kundenResult.success && kundenResult.data) {
        setKunden(kundenResult.data);
      }
    } catch (err) {
      setError('Netzwerkfehler');
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

  useEffect(() => {
    loadMaterial();
  }, []);

  // Create Material
  const handleCreate = async () => {
    try {
      const result = await api.fetch('/api/material', {
        method: 'POST',
        body: JSON.stringify(formData)
      });
      if (result.success) {
        setCreateDialogOpen(false);
        resetForm();
        loadMaterial();
      } else {
        setError(result.error || 'Fehler beim Erstellen');
      }
    } catch (err) {
      setError('Netzwerkfehler');
    }
  };

  // Update Material
  const handleUpdate = async () => {
    if (!selectedMaterial) return;
    try {
      const updateData: UpdateMaterialRequest = {
        id: selectedMaterial.id,
        ...formData
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
        setError(result.error || 'Fehler beim Aktualisieren');
      }
    } catch (err) {
      setError('Netzwerkfehler');
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
        setError(result.error || 'Fehler beim Löschen');
      }
    } catch (err) {
      setError('Netzwerkfehler');
    }
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
        setError(result.error || 'Fehler beim Buchen');
      }
    } catch (err) {
      setError('Netzwerkfehler');
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
        setError(result.error || 'Fehler beim Buchen');
      }
    } catch (err) {
      setError('Netzwerkfehler');
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
      vk_stueck: m.vk_stueck,
      notiz: m.notiz || ''
    });
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
      vk_stueck: 0,
      notiz: ''
    });
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
    { key: 'datum', label: 'Datum', render: (m: Material) => formatDate(m.datum) },
    { key: 'bezeichnung', label: 'Bezeichnung' },
    { key: 'menge', label: 'Menge', render: (m: Material) => m.menge.toFixed(2) },
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
          <Button size="sm" variant="success" onClick={() => openBarDialog(m)}>
            BAR
          </Button>
          <Button size="sm" variant="primary" onClick={() => openKombiDialog(m)}>
            KOMBI
          </Button>
          <Button size="sm" variant="secondary" onClick={() => openEditDialog(m)}>
            Bearbeiten
          </Button>
          <Button size="sm" variant="danger" onClick={() => openDeleteDialog(m)}>
            Löschen
          </Button>
        </div>
      )
    }
  ];

  return (
    <PageLayout title="Material">
      <div className={isMobile ? 'space-y-6' : 'grid grid-cols-[70%_30%] gap-6'}>
        {/* Left Column: Table */}
        <div className="space-y-4">
          {/* Header */}
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-semibold text-neutral-50">Material-Verwaltung</h2>
            <Button onClick={() => setCreateDialogOpen(true)}>Neues Material</Button>
          </div>

          {/* Error */}
          {error && <div className="p-4 bg-red-500/10 border border-red-500 rounded text-red-400">{error}</div>}

          {/* Table */}
          <Table data={materialien} columns={columns} loading={loading} emptyMessage="Kein Material vorhanden" />
        </div>

        {/* Right Column: Historie */}
        <div className="space-y-4">
          <h3 className="text-xl font-semibold text-neutral-50">Historie</h3>
          {selectedMaterial && historie.length > 0 ? (
            <div className="space-y-2">
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
            <p className="text-neutral-400 text-sm">
              {selectedMaterial
                ? 'Keine Historie vorhanden'
                : 'Wählen Sie ein Material aus, um die Historie anzuzeigen'}
            </p>
          )}
        </div>

        {/* Dialogs */}
        {/* Create Material Dialog */}
        <Dialog
          open={createDialogOpen}
          onClose={() => {
            setCreateDialogOpen(false);
            resetForm();
          }}
          title="Neues Material"
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
              label="Bezeichnung"
              value={formData.bezeichnung}
              onChange={(e) => setFormData({ ...formData, bezeichnung: e.target.value })}
            />
            <Input
              label="Menge"
              type="number"
              step="0.01"
              value={formData.menge}
              onChange={(e) => setFormData({ ...formData, menge: parseFloat(e.target.value) || 0 })}
            />
            <Input
              label="EK Stück"
              type="number"
              step="0.01"
              value={formData.ek_stueck}
              onChange={(e) => setFormData({ ...formData, ek_stueck: parseFloat(e.target.value) || 0 })}
            />
            <Input
              label="VK Stück"
              type="number"
              step="0.01"
              value={formData.vk_stueck}
              onChange={(e) => setFormData({ ...formData, vk_stueck: parseFloat(e.target.value) || 0 })}
            />
            <Input
              label="Notiz (optional)"
              value={formData.notiz}
              onChange={(e) => setFormData({ ...formData, notiz: e.target.value })}
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
          title="Material bearbeiten"
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
              label="Bezeichnung"
              value={formData.bezeichnung}
              onChange={(e) => setFormData({ ...formData, bezeichnung: e.target.value })}
            />
            <Input
              label="Menge"
              type="number"
              step="0.01"
              value={formData.menge}
              onChange={(e) => setFormData({ ...formData, menge: parseFloat(e.target.value) || 0 })}
            />
            <Input
              label="EK Stück"
              type="number"
              step="0.01"
              value={formData.ek_stueck}
              onChange={(e) => setFormData({ ...formData, ek_stueck: parseFloat(e.target.value) || 0 })}
            />
            <Input
              label="VK Stück"
              type="number"
              step="0.01"
              value={formData.vk_stueck}
              onChange={(e) => setFormData({ ...formData, vk_stueck: parseFloat(e.target.value) || 0 })}
            />
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
          title="Material löschen"
          actions={
            <>
              <Button
                variant="secondary"
                onClick={() => {
                  setDeleteDialogOpen(false);
                  setSelectedMaterial(null);
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
          <p className="text-neutral-300">
            Möchten Sie das Material "{selectedMaterial?.bezeichnung}" wirklich löschen?
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
                Abbrechen
              </Button>
              <Button variant="success" onClick={handleBarBewegung}>
                Buchen
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
              label="Datum"
              type="date"
              value={barFormData.datum}
              onChange={(e) => setBarFormData({ ...barFormData, datum: e.target.value })}
            />
            <Input
              label="Menge"
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
                Abbrechen
              </Button>
              <Button variant="primary" onClick={handleKombiBewegung}>
                Buchen
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
              label="Kunde"
              value={kombiFormData.kunde_id.toString()}
              onChange={(e) => setKombiFormData({ ...kombiFormData, kunde_id: parseInt(e.target.value) })}
              options={kunden.map((k) => ({ value: k.id.toString(), label: k.name }))}
            />
            <Input
              label="Datum"
              type="date"
              value={kombiFormData.datum}
              onChange={(e) => setKombiFormData({ ...kombiFormData, datum: e.target.value })}
            />
            <Input
              label="Menge"
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
      </div>
    </PageLayout>
  );
}
