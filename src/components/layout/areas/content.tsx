/**
 * @file        content.tsx
 * @description Content-Bereich fuer PageLayout (Startpage-ready), rendert Children unveraendert
 * @version     0.1.0
 * @created     2026-01-11 16:20:00 CET
 * @updated     2026-01-11 16:20:00 CET
 * @author      Akki Scholze
 *
 * @changelog
 *   0.1.0 - 2026-01-11 - Extraktion aus PageLayout, Content-Container gekapselt
 */

import type { CSSProperties, ReactNode } from 'react';

export interface ContentAreaProps {
  style: CSSProperties;
  children: ReactNode;
}

export function ContentArea({ style, children }: ContentAreaProps) {
  return <main style={style}>{children}</main>;
}
