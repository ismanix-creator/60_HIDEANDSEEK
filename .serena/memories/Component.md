# MEMORY 7: COMPONENT-PATTERN

**Component-Types** (aus components):

**1. Layout-Components**
- PageLayout.tsx - Main-Layout-Wrapper mit Navigation
- `src/components/layout/Navigation.tsx` - Top-Navigation-Bar
- `src/components/layout/Container.tsx` - Content-Container mit Padding/Max-Width

**2. Feature-Components**

Materials:
- `src/components/materials/MaterialList.tsx` - Liste aller Materialien
- `src/components/materials/MaterialCard.tsx` - Einzelne Material-Card
- `src/components/materials/MaterialForm.tsx` - Create/Edit-Form für Material
- `src/components/materials/MaterialStock.tsx` - Stock-Übersicht für Material

Hideouts:
- `src/components/hideouts/HideoutList.tsx` - Liste aller Verstecke
- `src/components/hideouts/HideoutCard.tsx` - Einzelne Versteck-Card
- `src/components/hideouts/HideoutForm.tsx` - Create/Edit-Form für Versteck

Transfers:
- `src/components/transfers/TransferList.tsx` - Liste aller Transfers
- `src/components/transfers/TransferForm.tsx` - Transfer-Formular
- `src/components/transfers/TransferHistory.tsx` - Transfer-Historie-View

**3. Shared/Common-Components**
- Button.tsx - Wiederverwendbarer Button
- `src/components/ui/Card.tsx` - Card-Container
- Input.tsx - Form-Input-Field
- Select.tsx - Dropdown-Select
- `src/components/ui/Modal.tsx` - Modal-Dialog
- Badge.tsx - Status/Info-Badge

**Props-Pattern** (TypeScript):

Interface für Props (bevorzugt über Type):

    interface MaterialCardProps {
      material: Material;
      onEdit?: (id: number) => void;
      onDelete?: (id: number) => void;
      showStock?: boolean;
    }

Component mit Destructuring:

    export function MaterialCard({ 
      material, 
      onEdit, 
      onDelete,
      showStock = false
    }: MaterialCardProps) {
      // ...
    }

Häufige Patterns:
- Optional-Props mit `?` (z.B. `onEdit?`)
- Default-Values im Destructuring
- Keine `React.FC` (Plain Function Components)
- Type-Imports separate: `import type { Material } from '@/types'`

**Beispiel (ECHTER Code aus Projekt)**:

    // src/components/materials/MaterialCard.tsx
    import { Pencil, Trash2 } from 'lucide-react';
    import type { Material } from '@/types/material-types';

    interface MaterialCardProps {
      material: Material;
      onEdit: (id: number) => void;
      onDelete: (id: number) => void;
    }

    export function MaterialCard({ material, onEdit, onDelete }: MaterialCardProps) {
      return (
        <div className="bg-white rounded-lg shadow-md p-4 hover:shadow-lg transition-shadow">
          <div className="flex justify-between items-start mb-2">
            <h3 className="text-lg font-semibold text-gray-900">{material.name}</h3>
            <div className="flex gap-2">
              <button
                onClick={() => onEdit(material.id)}
                className="p-1 text-blue-600 hover:text-blue-800"
                aria-label="Bearbeiten"
              >
                <Pencil size={18} />
              </button>
              <button
                onClick={() => onDelete(material.id)}
                className="p-1 text-red-600 hover:text-red-800"
                aria-label="Löschen"
              >
                <Trash2 size={18} />
              </button>
            </div>
          </div>
          {material.description && (
            <p className="text-sm text-gray-600 mb-2">{material.description}</p>
          )}
          <div className="text-sm text-gray-500">
            Einheit: <span className="font-medium">{material.unit}</span>
          </div>
        </div>
      );
    }

**Hooks-Usage**:
- Standard-Hooks: `useState`, `useEffect`, `useContext`, `useCallback`, `useMemo`
- React Router: `useNavigate`, `useParams`, `useLocation`
- Custom-Hooks: `useMaterials`, `useHideouts`, `useTransfers`, `useHistory`

**Custom-Hooks** (aus hooks + Context):

    // src/hooks/useMaterials.ts
    // Wrapper um MaterialContext für einfacheren Zugriff
    export function useMaterials() {
      const context = useContext(MaterialContext);
      if (!context) {
        throw new Error('useMaterials must be used within MaterialProvider');
      }
      return context;
    }

    // src/hooks/useDebounce.ts
    // Debounce-Hook für Search-Inputs
    export function useDebounce<T>(value: T, delay: number): T {
      const [debouncedValue, setDebouncedValue] = useState(value);
      
      useEffect(() => {
        const handler = setTimeout(() => setDebouncedValue(value), delay);
        return () => clearTimeout(handler);
      }, [value, delay]);
      
      return debouncedValue;
    }