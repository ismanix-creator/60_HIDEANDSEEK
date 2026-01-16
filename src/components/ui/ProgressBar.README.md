# ProgressBar Component

**Version:** 1.0.0  
**Created:** 2026-01-16 02:12:35 CET  
**100% config-driven** – keine UI-/Layout-Hardcodes

---

## Übersicht

Die `ProgressBar`-Komponente bietet 3 Varianten für unterschiedliche Anwendungsfälle:

1. **progressPercent** – Fortschritt 0→100% (Standard)
2. **progressPercent110** – Fortschritt 0→110% (erweiterte Skala für Überzahlungen)
3. **stock** – Bestand (inverted: 100→0, Farbe wechselt von grün→rot)

---

## Features

✅ **100% config-driven** aus `config.toml`  
✅ **Farben** aus `theme.colors.progress` (Farbskala 0-100 in 5%-Schritten)  
✅ **Konfiguration** aus `components.progressbar.scale.*`  
✅ **Wert im Balken** (Prozent oder reale Zahl)  
✅ **Smooth Transitions** für Wert- und Farbänderungen  
✅ **TypeScript-typisiert** (`ProgressBarProps` in `ui.types.ts`)

---

## Konfiguration (config.toml)

### Base Config
```toml
[components.progressbar]
height = "18px"
radius = "12px"
padding = "2px"
```

### Variante: progressPercent (0→100%)
```toml
[components.progressbar.scale.progressPercent]
themeScalePath = "theme.colors.progress"
min = 0
max = 100
step = 5
direction = "normal"
showValueInsideBar = true
unit = "%"
```

### Variante: progressPercent110 (0→110%)
```toml
[components.progressbar.scale.progressPercent110]
themeScalePath = "theme.colors.progress"
min = 0
max = 110
step = 5
direction = "normal"
clampColorAtMaxScaleKey = "100"  # Farbe bleibt bei 100% grün
showValueInsideBar = true
unit = "%"
```

### Variante: stock (Bestand, inverted)
```toml
[components.progressbar.scale.stock]
themeScalePath = "theme.colors.progress"
direction = "inverted"  # 100% = grün, 0% = rot
showValueInsideBar = true
unit = ""  # keine Einheit (zeigt reale Zahl)
```

### Farbskala (theme.colors.progress)
```toml
[theme.colors.progress]
"0" = "#7a7a7a"    # Grau (leer/0%)
"5" = "#7a0000"    # Dunkelrot
"10" = "#7a0000"
...
"50" = "#b58400"   # Orange
...
"75" = "#b2c403"   # Hellgrün
...
"95" = "#24960d"   # Grün
"100" = "#008a10"  # Dunkelgrün (voll/100%)
```

---

## Verwendung

### Import
```tsx
import { ProgressBar } from '@/components/ui';
```

### Beispiel 1: Fortschritt 0→100%
```tsx
// Kunde hat 75% bezahlt
<ProgressBar variant="progressPercent" value={75} />
// Zeigt: "75%" im grün-gelblichen Balken
```

### Beispiel 2: Fortschritt 0→110% (Überzahlung)
```tsx
// Kunde hat 110% bezahlt
<ProgressBar variant="progressPercent110" value={110} />
// Zeigt: "110%" im grünen Balken (Farbe clamped bei 100%)
```

### Beispiel 3: Bestand (inverted)
```tsx
// Material: 30 Stück von 50 verfügbar
<ProgressBar variant="stock" current={30} max={50} />
// Zeigt: "30" im Balken (60% = orange-gelb, da inverted)
```

---

## Integration in Tabellen

### Material-Tabelle (Bestand)
```tsx
// columns definition
{
  key: 'bestand',
  label: 'Bestand',
  render: (row) => (
    <ProgressBar 
      variant="stock" 
      current={row.menge - row.gebucht}  // Bestand = Menge - Gebucht
      max={row.menge} 
    />
  )
}
```

### Kunden-Tabelle (Fortschritt)
```tsx
// columns definition
{
  key: 'fortschritt',
  label: 'Fortschritt',
  render: (row) => {
    const percent = row.gesamt > 0 
      ? (row.bezahlt / row.gesamt) * 100 
      : 0;
    
    return <ProgressBar variant="progressPercent" value={percent} />;
  }
}
```

### Schuldner/Gläubiger-Tabelle
```tsx
{
  key: 'fortschritt',
  label: 'Fortschritt',
  render: (row) => {
    const percent = row.betrag > 0 
      ? (row.bezahlt / row.betrag) * 100 
      : 0;
    
    return <ProgressBar variant="progressPercent" value={percent} />;
  }
}
```

---

## Props (TypeScript)

```typescript
export interface ProgressBarProps {
  /**
   * Variante der ProgressBar:
   * - 'progressPercent': Fortschritt 0→100% (default scale)
   * - 'progressPercent110': Fortschritt 0→110% (erweiterte Skala)
   * - 'stock': Bestand (inverted: 100→0)
   */
  variant: 'progressPercent' | 'progressPercent110' | 'stock';

  /**
   * Aktueller Wert (für progressPercent/progressPercent110)
   */
  value?: number;

  /**
   * Aktueller Bestand (für stock-Variante)
   */
  current?: number;

  /**
   * Maximaler Bestand (für stock-Variante)
   */
  max?: number;

  /**
   * Optionale CSS-Klasse
   */
  className?: string;
}
```

---

## Styling-Regeln (100% config-driven)

❌ **VERBOTEN in .tsx:**
- `display: flex/grid`
- `alignItems/justifyContent`
- `cursor`
- `transition`
- `border: none`
- `outline: none`
- `backgroundColor: 'transparent'`

✅ **ERLAUBT (aus config):**
- `components.progressbar.height`
- `components.progressbar.radius`
- `components.progressbar.padding`
- `theme.colors.progress.*`

---

## Demo

Siehe: `src/components/ui/ProgressBar.demo.tsx`

---

## Version History

- **1.0.0** (2026-01-16 02:12:35 CET) – Initial version mit 3 Varianten
