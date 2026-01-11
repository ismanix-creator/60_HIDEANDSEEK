/**
 * @file        footer.tsx
 * @description Footer-Bereich fuer PageLayout mit konfigurierbarem Grid
 * @version     0.1.0
 * @created     2026-01-12 10:45:00 CET
 * @updated     2026-01-12 10:45:00 CET
 * @author      Akki Scholze
 *
 * @changelog
 *   0.1.0 - 2026-01-12 - Initial version mit dynamischen Grid-Spalten
 */

import type { CSSProperties, ReactNode } from 'react';

export interface FooterAreaProps {
  style: CSSProperties;
  columns: number;
  children: ReactNode;
}

export function FooterArea({ style, columns, children }: FooterAreaProps) {
  const gridStyle: CSSProperties = {
    display: 'grid',
    gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))`,
    gap: typeof style.gap === 'string' ? style.gap : undefined,
    width: '100%'
  };

  return (
    <footer style={style}>
      <div style={gridStyle}>{children}</div>
    </footer>
  );
}
