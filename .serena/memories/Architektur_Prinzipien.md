# Architecture Principles - 60_HIDEANDSEEK

**Projekt-Struktur** (ECHTE Struktur aus src/):

/src/
├── components/ # UI-Komponenten (Layout, Features)
├── config/ # Config-Loading & Generated Types
├── context/ # React Context (Material, Hideout, Transfer)
├── hooks/ # Custom React Hooks
├── pages/ # Page-Level Components
├── services/ # API-Services (Backend-Kommunikation)
├── types/ # TypeScript Type Definitions
└── utils/ # Utility Functions


**Feature-Organization**:
Das Projekt ist feature-orientiert organisiert mit Contexts pro Domain:
- `/src/context/MaterialContext.tsx` - Material-Management
- `/src/context/HideoutContext.tsx` - Versteck-Management
- `/src/context/TransferContext.tsx` - Transfer-Operationen
- `/src/context/HistoryContext.tsx` - Änderungs-Historie

Jeder Context enthält:
- State-Management für die Domain
- API-Calls via Services
- Business-Logic für CRUD-Operationen

**Component-Pattern**:

**Feature-Organization**:
Das Projekt ist feature-orientiert organisiert mit Contexts pro Domain:
- `/src/context/MaterialContext.tsx` - Material-Management
- `/src/context/HideoutContext.tsx` - Versteck-Management
- `/src/context/TransferContext.tsx` - Transfer-Operationen
- `/src/context/HistoryContext.tsx` - Änderungs-Historie

Jeder Context enthält:
- State-Management für die Domain
- API-Calls via Services
- Business-Logic für CRUD-Operationen

**Component-Pattern**:
/src/components/
├── layout/ # Layout-Komponenten (PageLayout, Navigation)
├── materials/ # Material-spezifische Components
├── hideouts/ # Hideout-spezifische Components
├── transfers/ # Transfer-spezifische Components
└── ui/ # Shared UI-Komponenten (Buttons, Cards, etc.)


Components sind funktional mit TypeScript-Interfaces für Props.

**State-Management**:
- React Context API für globalen State
- Contexts pro Domain (Material, Hideout, Transfer, History)
- Local State mit `useState` für Component-Level State
- Keine externe State-Library (Redux, Zustand, etc.)

**Routing**:
- React Router DOM 7.1.3
- Route-Definitionen in `/src/pages/`
- Lazy-Loading nicht implementiert

**Styling-Approach**:
- Tailwind CSS als primäres Styling-System
- Config-driven Design Tokens aus `config.toml`
- Keine CSS-Modules, keine Styled-Components
- Utility-First-Approach mit Tailwind-Classes

**Config-Driven**:
- **Zentrale Config**: `config.toml` (Single Source of Truth)
- Generated Types: `src/config/generated/`
- Config-Loading: `src/config/load.ts` + `src/config/index.ts`
- Zod-Validation mit `strict()` für alle Config-Werte
- **Keine Hardcodes**: UI-Texte, Farben, Spacing, Radii aus Config