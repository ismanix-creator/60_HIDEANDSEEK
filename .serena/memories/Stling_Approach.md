# MEMORY 8: STYLING-APPROACH

**Primary-Styling**: Tailwind CSS 3.4.16 (Utility-First)

**Tailwind-Config** (aus tailwind.config.ts):

    import type { Config } from 'tailwindcss';

    export default {
      content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
      theme: {
        extend: {
          colors: {
            primary: {
              50: '#f0f9ff',
              100: '#e0f2fe',
              200: '#bae6fd',
              300: '#7dd3fc',
              400: '#38bdf8',
              500: '#0ea5e9',
              600: '#0284c7',
              700: '#0369a1',
              800: '#075985',
              900: '#0c4a6e',
            },
          },
        },
      },
      plugins: [],
    } satisfies Config;

**Custom-Styles**:
Keine globalen CSS-Files außer Tailwind-Base. In index.css:

    @tailwind base;
    @tailwind components;
    @tailwind utilities;
    
    body {
      @apply bg-gray-50 text-gray-900;
    }

**Styling-Conventions** (aus Components erkannt):

Pattern 1: Tailwind-Classes direkt

    <div className="bg-white rounded-lg shadow-md p-4 hover:shadow-lg transition-shadow">
      <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
    </div>

Pattern 2: Conditional-Classes mit `clsx`

    import clsx from 'clsx';

    <button
      className={clsx(
        'px-4 py-2 rounded-md font-medium transition-colors',
        variant === 'primary' && 'bg-blue-600 text-white hover:bg-blue-700',
        variant === 'secondary' && 'bg-gray-200 text-gray-900 hover:bg-gray-300',
        disabled && 'opacity-50 cursor-not-allowed'
      )}
    >
      {children}
    </button>

Pattern 3: Keine Inline-Styles
Keine `style={{...}}` außer für dynamische Werte (z.B. Position). Alles via Tailwind-Utility-Classes.

**Beispiel (ECHTER Component-Code)**:

    // Button.tsx
    import clsx from 'clsx';

    interface ButtonProps {
      variant?: 'primary' | 'secondary' | 'danger';
      size?: 'sm' | 'md' | 'lg';
      children: React.ReactNode;
      onClick?: () => void;
      disabled?: boolean;
      type?: 'button' | 'submit' | 'reset';
    }

    export function Button({
      variant = 'primary',
      size = 'md',
      children,
      onClick,
      disabled = false,
      type = 'button',
    }: ButtonProps) {
      return (
        <button
          type={type}
          onClick={onClick}
          disabled={disabled}
          className={clsx(
            'font-medium rounded-md transition-colors focus:outline-none focus:ring-2',
            variant === 'primary' && 'bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500',
            variant === 'secondary' && 'bg-gray-200 text-gray-900 hover:bg-gray-300 focus:ring-gray-400',
            variant === 'danger' && 'bg-red-600 text-white hover:bg-red-700 focus:ring-red-500',
            size === 'sm' && 'px-3 py-1.5 text-sm',
            size === 'md' && 'px-4 py-2 text-base',
            size === 'lg' && 'px-6 py-3 text-lg',
            disabled && 'opacity-50 cursor-not-allowed'
          )}
        >
          {children}
        </button>
      );
    }

**Design-System**:
- Config-Driven: Colors, Spacing, Typography aus config.toml
- Component-Library: Wiederverwendbare UI-Components in ui
- Consistent-Spacing: `p-4`, `gap-2`, `mb-2` etc. (Standard-Tailwind-Scale)
- Color-Palette: Primary (Blue), Gray (Neutral), Red (Danger), Green (Success)
- Typography: `text-sm`, `text-base`, `text-lg` + `font-medium`, `font-semibold`

**Config-Integration**:
Alle Design-Tokens (Farben, Spacing, Border-Radii) werden aus config.toml gelesen und in Tailwind-Config generiert. Keine Hardcodes in Components erlaubt.