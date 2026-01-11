# Code-Quality Rules - 60_HIDEANDSEEK

**TypeScript-Config** (aus `tsconfig.json`):
```json
{
  "compilerOptions": {
    "target": "ES2020",
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "moduleResolution": "bundler",
    "strict": true,
    "noImplicitAny": true,
    "strictNullChecks": true,
    "strictFunctionTypes": true,
    "strictBindCallApply": true,
    "strictPropertyInitialization": true,
    "noImplicitThis": true,
    "alwaysStrict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noImplicitReturns": true,
    "noFallthroughCasesInSwitch": true,
    "skipLibCheck": true,
    "esModuleInterop": true,
    "allowSyntheticDefaultImports": true,
    "forceConsistentCasingInFileNames": true,
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "react-jsx"
  }
}

Wichtigste Rules:

strict: true - Alle Strict-Checks aktiv
noImplicitAny: true - Kein implizites any
noUnusedLocals/Parameters: true - Keine ungenutzten Variablen/Parameter
noImplicitReturns: true - Alle Code-Paths müssen returnen
Linting (ESLint + @typescript-eslint):

Config: .eslintrc.cjs
Extends: @typescript-eslint/recommended
Plugins: react-hooks, react-refresh
Rules:
react-refresh/only-export-components - Warn
Keine zusätzlichen Custom-Rules
Formatting (Prettier nicht konfiguriert):

Keine Prettier-Config vorhanden
Default TypeScript/VS Code Formatting
Tab-Size: 2 (aus editorconfig oder IDE-Default)
Quotes: Single oder Double (nicht enforced)
Semicolons: Ja (TypeScript-Default)
Testing-Requirements:

Unit-Tests: Vitest 2.1.8

Config: vitest.config.ts
Test-Pattern: **/*.test.ts, **/*.test.tsx
Coverage: Nicht konfiguriert (kein threshold)
Environment: jsdom für React-Tests
E2E-Tests: Playwright 1.49.1

Config: playwright.config.ts
Test-Pattern: tests/e2e/**/*.spec.ts
Browsers: Chromium, Firefox, WebKit
Headless: Ja (CI-Mode)
Pre-Commit-Hooks:

Nicht konfiguriert (kein Husky, kein lint-staged)
Manuelle Checks via:
pnpm run lint
pnpm run test
pnpm run build
Import-Rules (aus tatsächlichem Code erkannt):

Relative Imports bevorzugt für lokale Files
Absolute Imports via Path-Alias @/ für src
Konfiguriert in vite.config.ts: resolve.alias
Import-Order (nicht enforced, aber Pattern erkannt):
React/External-Libraries
Internal-Imports (@/...)
Relative-Imports (./, ../)
Type-Imports (separate mit import type)
Beispiel:

import { useState } from 'react';import { Pencil, Trash2 } from 'lucide-react';import { useMaterials } from '@/context/MaterialContext';import type { Material } from '@/types/material-types';import { MaterialCard } from './MaterialCard';

import { useState } from 'react';
import { Pencil, Trash2 } from 'lucide-react';

import { useMaterials } from '@/context/MaterialContext';
import type { Material } from '@/types/material-types';

import { MaterialCard } from './MaterialCard';