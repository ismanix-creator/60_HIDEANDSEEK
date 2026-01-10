/**
 * @file        tests/unit/badge.test.tsx
 * @description Unit-Tests für Badge-Komponente (Config-Loading + Rendering)
 * @version     1.0.0
 * @created     2026-01-10 01:15:00 CET
 * @updated     2026-01-10 01:15:00 CET
 * @author      Akki Scholze (QA-Test-Entwickler)
 *
 * @changelog
 *   1.0.0 - 2026-01-10 - Initial test suite (Phase 4.1)
 */

import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Badge } from '@/components/ui/Badge';
import { appConfig } from '@/config';

describe('Badge Component', () => {
  describe('Config Loading', () => {
    it('should load badge config from appConfig', () => {
      expect(appConfig.components.badge).toBeDefined();
      expect(appConfig.components.badge.base).toBeDefined();
      expect(appConfig.components.badge.variants).toBeDefined();
    });

    it('should have all required variants in config', () => {
      const variants = ['success', 'error', 'warning', 'pending', 'neutral'];
      variants.forEach((variant) => {
        expect(appConfig.components.badge.variants).toHaveProperty(variant);
      });
    });

    it('should have base styles in config', () => {
      expect(appConfig.components.badge.base.fontSize).toBeDefined();
      expect(appConfig.components.badge.base.fontWeight).toBeDefined();
      expect(appConfig.components.badge.base.padding).toBeDefined();
    });
  });

  describe('Rendering', () => {
    it('should render with default variant (neutral)', () => {
      render(<Badge>Test Badge</Badge>);
      expect(screen.getByText('Test Badge')).toBeInTheDocument();
    });

    it('should render success variant', () => {
      render(<Badge variant="success">Success</Badge>);
      const badge = screen.getByText('Success');
      expect(badge).toBeInTheDocument();
    });

    it('should render error variant', () => {
      render(<Badge variant="error">Error</Badge>);
      const badge = screen.getByText('Error');
      expect(badge).toBeInTheDocument();
    });

    it('should render warning variant', () => {
      render(<Badge variant="warning">Warning</Badge>);
      const badge = screen.getByText('Warning');
      expect(badge).toBeInTheDocument();
    });

    it('should render pending variant', () => {
      render(<Badge variant="pending">Pending</Badge>);
      const badge = screen.getByText('Pending');
      expect(badge).toBeInTheDocument();
    });

    it('should render with icon by default', () => {
      const { container } = render(<Badge variant="success">With Icon</Badge>);
      const icon = container.querySelector('svg');
      expect(icon).toBeInTheDocument();
    });

    it('should render without icon when showIcon is false', () => {
      const { container } = render(<Badge variant="success" showIcon={false}>No Icon</Badge>);
      const icon = container.querySelector('svg');
      expect(icon).not.toBeInTheDocument();
    });

    it('should apply custom className', () => {
      const { container } = render(<Badge className="custom-class">Test</Badge>);
      const badge = container.firstChild;
      expect(badge).toHaveClass('custom-class');
    });
  });

  describe('Styling', () => {
    it('should apply config-driven fontSize', () => {
      const { container } = render(<Badge>Test</Badge>);
      const badge = container.firstChild as HTMLElement;
      const fontSize = appConfig.components.badge.base.fontSize;
      expect(badge.style.fontSize).toBe(fontSize);
    });

    it('should apply variant-specific background color', () => {
      const { container } = render(<Badge variant="success">Test</Badge>);
      const badge = container.firstChild as HTMLElement;
      // Config-driven color should be applied
      expect(badge.style.backgroundColor).toBeTruthy();
    });
  });
});
