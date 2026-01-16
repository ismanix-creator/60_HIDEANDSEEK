/**
 * @file        ProgressBar.demo.tsx
 * @description Demo-Datei zur Demonstration der ProgressBar-Komponente
 * @version     1.0.0
 * @created     2026-01-16 02:12:35 CET
 * @updated     2026-01-16 02:12:35 CET
 * @author      Akki Scholze
 *
 * @description
 *   Demo-Beispiele für die ProgressBar-Komponente mit allen 3 Varianten.
 *   Diese Datei kann als Referenz für die Integration verwendet werden.
 */

import { ProgressBar } from '@/components/ui';

/**
 * Demo-Komponente mit allen ProgressBar-Varianten
 */
export function ProgressBarDemo() {
  return (
    <div style={{ padding: '2rem', display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      
      {/* Variante 1: Fortschritt 0→100% */}
      <div>
        <h3 style={{ marginBottom: '1rem' }}>Fortschritt (0→100%)</h3>
        
        <div style={{ marginBottom: '0.5rem' }}>
          <p style={{ marginBottom: '0.25rem', fontSize: '0.875rem' }}>25% bezahlt</p>
          <ProgressBar variant="progressPercent" value={25} />
        </div>
        
        <div style={{ marginBottom: '0.5rem' }}>
          <p style={{ marginBottom: '0.25rem', fontSize: '0.875rem' }}>50% bezahlt</p>
          <ProgressBar variant="progressPercent" value={50} />
        </div>
        
        <div style={{ marginBottom: '0.5rem' }}>
          <p style={{ marginBottom: '0.25rem', fontSize: '0.875rem' }}>75% bezahlt</p>
          <ProgressBar variant="progressPercent" value={75} />
        </div>
        
        <div>
          <p style={{ marginBottom: '0.25rem', fontSize: '0.875rem' }}>100% bezahlt</p>
          <ProgressBar variant="progressPercent" value={100} />
        </div>
      </div>

      {/* Variante 2: Fortschritt 0→110% (erweitert) */}
      <div>
        <h3 style={{ marginBottom: '1rem' }}>Fortschritt erweitert (0→110%)</h3>
        
        <div style={{ marginBottom: '0.5rem' }}>
          <p style={{ marginBottom: '0.25rem', fontSize: '0.875rem' }}>50% bezahlt</p>
          <ProgressBar variant="progressPercent110" value={50} />
        </div>
        
        <div style={{ marginBottom: '0.5rem' }}>
          <p style={{ marginBottom: '0.25rem', fontSize: '0.875rem' }}>100% bezahlt</p>
          <ProgressBar variant="progressPercent110" value={100} />
        </div>
        
        <div>
          <p style={{ marginBottom: '0.25rem', fontSize: '0.875rem' }}>110% bezahlt (Überzahlung)</p>
          <ProgressBar variant="progressPercent110" value={110} />
        </div>
      </div>

      {/* Variante 3: Bestand (inverted: 100→0) */}
      <div>
        <h3 style={{ marginBottom: '1rem' }}>Bestand (inverted: 100→0)</h3>
        
        <div style={{ marginBottom: '0.5rem' }}>
          <p style={{ marginBottom: '0.25rem', fontSize: '0.875rem' }}>Voller Bestand (50 von 50)</p>
          <ProgressBar variant="stock" current={50} max={50} />
        </div>
        
        <div style={{ marginBottom: '0.5rem' }}>
          <p style={{ marginBottom: '0.25rem', fontSize: '0.875rem' }}>Mittlerer Bestand (25 von 50)</p>
          <ProgressBar variant="stock" current={25} max={50} />
        </div>
        
        <div style={{ marginBottom: '0.5rem' }}>
          <p style={{ marginBottom: '0.25rem', fontSize: '0.875rem' }}>Niedriger Bestand (10 von 50)</p>
          <ProgressBar variant="stock" current={10} max={50} />
        </div>
        
        <div>
          <p style={{ marginBottom: '0.25rem', fontSize: '0.875rem' }}>Kein Bestand (0 von 50)</p>
          <ProgressBar variant="stock" current={0} max={50} />
        </div>
      </div>

      {/* Beispiel: Integration in Tabelle */}
      <div>
        <h3 style={{ marginBottom: '1rem' }}>Beispiel: Tabellen-Integration</h3>
        <div style={{ border: '1px solid #444', borderRadius: '8px', padding: '1rem' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 200px', gap: '1rem', alignItems: 'center' }}>
            <span>Material A (Bestand: 30/50)</span>
            <ProgressBar variant="stock" current={30} max={50} />
          </div>
          
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 200px', gap: '1rem', alignItems: 'center', marginTop: '0.5rem' }}>
            <span>Kunde XY (Bezahlt: 75%)</span>
            <ProgressBar variant="progressPercent" value={75} />
          </div>
        </div>
      </div>
    </div>
  );
}

/**
 * Beispiel-Integration in Material-Tabelle
 */
export function MaterialTableIntegrationExample() {
  // In der Material-Tabelle würde man die ProgressBar so verwenden:
  const materialData = {
    bezeichnung: 'Schrauben M8',
    menge: 100,
    gebucht: 70,
    bestand: 30
  };

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
      <span>{materialData.bezeichnung}</span>
      <ProgressBar 
        variant="stock" 
        current={materialData.bestand} 
        max={materialData.menge} 
      />
    </div>
  );
}

/**
 * Beispiel-Integration in Kunden-Tabelle (Fortschritt)
 */
export function KundenTableIntegrationExample() {
  // In der Kunden-Tabelle würde man die ProgressBar so verwenden:
  const kundenData = {
    name: 'Kunde ABC',
    gesamt: 1000,
    bezahlt: 750,
    fortschritt: 75 // (bezahlt / gesamt) * 100
  };

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
      <span>{kundenData.name}</span>
      <ProgressBar 
        variant="progressPercent" 
        value={kundenData.fortschritt} 
      />
    </div>
  );
}
