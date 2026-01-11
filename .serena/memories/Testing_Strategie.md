# MEMORY 9: TESTING-STRATEGY

**Test-Setup**:
- Unit-Test-Framework: Vitest 2.1.8
- E2E-Framework: Playwright 1.49.1
- Testing-Library: @testing-library/react 16.1.0 + @testing-library/jest-dom 6.6.3

**Test-Files** (Struktur erkannt):

Unit-Tests in unit:
- `tests/unit/services/material-service.test.ts` - Material-API-Service Tests
- `tests/unit/services/hideout-service.test.ts` - Hideout-API-Service Tests
- `tests/unit/services/transfer-service.test.ts` - Transfer-API-Service Tests
- `tests/unit/utils/format-date.test.ts` - Date-Formatter Tests
- `tests/unit/utils/validation.test.ts` - Validation-Helper Tests
- `tests/unit/components/MaterialCard.test.tsx` - MaterialCard-Component Tests
- `tests/unit/components/Button.test.tsx` - Button-Component Tests

E2E-Tests in e2e:
- `tests/e2e/materials.spec.ts` - Material-Management Flow
- `tests/e2e/hideouts.spec.ts` - Hideout-Management Flow
- `tests/e2e/transfers.spec.ts` - Transfer-Flow

**Naming-Pattern**:
- Unit-Tests: `*.test.ts` oder `*.test.tsx`
- E2E-Tests: `*.spec.ts`
- Location: Separate tests folder (nicht co-located)

**Test-Coverage** (aus vitest.config.ts):

    export default defineConfig({
      test: {
        environment: 'jsdom',
        globals: true,
        setupFiles: './tests/setup.ts',
      },
    });

Kein Coverage-Threshold definiert. Coverage kann manuell mit `pnpm run test:coverage` generiert werden (falls Script vorhanden).

**Mocking-Approach** (aus Test-Code erkannt):

Service-Mocking (Unit-Tests):

    import { vi } from 'vitest';
    import * as materialService from '@/services/material-service';

    describe('MaterialService', () => {
      beforeEach(() => {
        global.fetch = vi.fn();
      });

      it('should fetch materials', async () => {
        const mockMaterials = [{ id: 1, name: 'Test', unit: 'kg' }];
        (global.fetch as any).mockResolvedValueOnce({
          ok: true,
          json: async () => ({ success: true, data: mockMaterials }),
        });

        const result = await materialService.getMaterials();
        expect(result).toEqual(mockMaterials);
      });
    });

Component-Mocking (React-Tests):

    import { render, screen, fireEvent } from '@testing-library/react';
    import { MaterialCard } from '@/components/materials/MaterialCard';

    describe('MaterialCard', () => {
      const mockMaterial = {
        id: 1,
        name: 'Test Material',
        unit: 'kg',
        description: 'Test',
        created_at: '2024-01-01',
        last_updated: '2024-01-01',
      };

      it('should call onEdit when edit button clicked', () => {
        const onEdit = vi.fn();
        render(<MaterialCard material={mockMaterial} onEdit={onEdit} onDelete={vi.fn()} />);
        
        fireEvent.click(screen.getByLabelText('Bearbeiten'));
        expect(onEdit).toHaveBeenCalledWith(1);
      });
    });

E2E-Tests (Playwright):

    import { test, expect } from '@playwright/test';

    test.describe('Materials Page', () => {
      test('should create new material', async ({ page }) => {
        await page.goto('http://localhost:5173/materials');
        
        await page.click('text=Neues Material');
        await page.fill('input[name="name"]', 'Test Material');
        await page.selectOption('select[name="unit"]', 'kg');
        await page.click('button[type="submit"]');
        
        await expect(page.locator('text=Test Material')).toBeVisible();
      });
    });

**CI-Integration**:
Nicht im Projekt gefunden (keine GitHub-Actions-Config). Tests werden manuell ausgeführt:
- `pnpm run test` - Unit-Tests
- `pnpm run test:e2e` - E2E-Tests

**Test-Commands** (aus package.json):

    "test": "vitest"
    "test:ui": "vitest --ui"
    "test:e2e": "playwright test"
    "test:e2e:ui": "playwright test --ui"

**Test-Workflow**:
1. Unit-Tests laufen bei jeder Code-Änderung (watch-mode mit `pnpm run test`)
2. E2E-Tests vor Deployment ausführen
3. Keine automatischen Pre-Commit-Hooks (manuell via `pnpm run test`)