/**
 * @file        tests/unit/button.test.tsx
 * @description Unit-Tests für Button-Komponente (Config-Loading + Rendering)
 * @version     1.0.0
 * @created     2026-01-10 01:15:00 CET
 * @updated     2026-01-10 01:15:00 CET
 * @author      Akki Scholze (QA-Test-Entwickler)
 *
 * @changelog
 *   1.0.0 - 2026-01-10 - Initial test suite (Phase 4.1)
 */

import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { Button } from '@/components/ui/Button';
import { appConfig } from '@/config';

describe('Button Component', () => {
  describe('Config Loading', () => {
    it('should load button config from appConfig', () => {
      expect(appConfig.components.button).toBeDefined();
      expect(appConfig.components.button.variants).toBeDefined();
      expect(appConfig.components.button.sizes).toBeDefined();
    });

    it('should have all required variants in config', () => {
      const variants = ['primary', 'secondary', 'outline', 'ghost', 'danger', 'success', 'warning', 'transparent'];
      variants.forEach((variant) => {
        expect(appConfig.components.button.variants).toHaveProperty(variant);
      });
    });

    it('should have all required sizes in config', () => {
      const sizes = ['xs', 'sm', 'md', 'lg', 'xl'];
      sizes.forEach((size) => {
        expect(appConfig.components.button.sizes).toHaveProperty(size);
      });
    });

    it('should have variant-specific styles in config', () => {
      const primaryVariant = appConfig.components.button.variants.primary;
      expect(primaryVariant.bg).toBeDefined();
      expect(primaryVariant.text).toBeDefined();
      expect(primaryVariant.hover).toBeDefined();
    });

    it('should have size-specific styles in config', () => {
      const mdSize = appConfig.components.button.sizes.md;
      expect(mdSize.height).toBeDefined();
      expect(mdSize.padding).toBeDefined();
      expect(mdSize.fontSize).toBeDefined();
    });
  });

  describe('Rendering', () => {
    it('should render with default variant (primary)', () => {
      render(<Button>Test Button</Button>);
      expect(screen.getByRole('button', { name: 'Test Button' })).toBeInTheDocument();
    });

    it('should render secondary variant', () => {
      render(<Button variant="secondary">Secondary</Button>);
      const button = screen.getByRole('button', { name: 'Secondary' });
      expect(button).toBeInTheDocument();
    });

    it('should render danger variant', () => {
      render(<Button variant="danger">Danger</Button>);
      const button = screen.getByRole('button', { name: 'Danger' });
      expect(button).toBeInTheDocument();
    });

    it('should render with different sizes', () => {
      const { rerender } = render(<Button size="sm">Small</Button>);
      expect(screen.getByRole('button', { name: 'Small' })).toBeInTheDocument();

      rerender(<Button size="lg">Large</Button>);
      expect(screen.getByRole('button', { name: 'Large' })).toBeInTheDocument();
    });

    it('should apply custom className', () => {
      render(<Button className="custom-class">Test</Button>);
      const button = screen.getByRole('button', { name: 'Test' });
      expect(button).toHaveClass('custom-class');
    });

    it('should apply custom title attribute', () => {
      render(<Button title="Custom Title">Test</Button>);
      const button = screen.getByRole('button', { name: 'Test' });
      expect(button).toHaveAttribute('title', 'Custom Title');
    });
  });

  describe('Interactivity', () => {
    it('should call onClick handler when clicked', () => {
      const handleClick = vi.fn();
      render(<Button onClick={handleClick}>Click Me</Button>);
      
      const button = screen.getByRole('button', { name: 'Click Me' });
      fireEvent.click(button);
      
      expect(handleClick).toHaveBeenCalledTimes(1);
    });

    it('should not call onClick when disabled', () => {
      const handleClick = vi.fn();
      render(<Button onClick={handleClick} disabled>Disabled</Button>);
      
      const button = screen.getByRole('button', { name: 'Disabled' });
      fireEvent.click(button);
      
      expect(handleClick).not.toHaveBeenCalled();
    });

    it('should be disabled when loading', () => {
      render(<Button loading>Loading</Button>);
      const button = screen.getByRole('button', { name: 'Loading' });
      expect(button).toBeDisabled();
    });

    it('should apply disabled attribute', () => {
      render(<Button disabled>Disabled</Button>);
      const button = screen.getByRole('button', { name: 'Disabled' });
      expect(button).toBeDisabled();
    });
  });

  describe('States', () => {
    it('should show loading state', () => {
      const { container } = render(<Button loading>Loading</Button>);
      // Loading indicator (Loader2 icon) should be present as SVG
      const loadingIcon = container.querySelector('svg');
      expect(loadingIcon).not.toBeNull();
    });
  });

  describe('Styling', () => {
    it('should apply config-driven height for size', () => {
      const { container } = render(<Button size="md">Test</Button>);
      const button = container.firstChild as HTMLElement;
      const expectedHeight = appConfig.components.button.sizes.md.height;
      expect(button.style.height).toBe(expectedHeight);
    });

    it('should apply variant-specific background color', () => {
      const { container } = render(<Button variant="primary">Test</Button>);
      const button = container.firstChild as HTMLElement;
      // Config-driven color should be applied
      expect(button.style.backgroundColor).toBeTruthy();
    });
  });

  describe('Icon Support', () => {
    it('should render icon-only button', () => {
      render(<Button iconOnly>Icon</Button>);
      
      const button = screen.getByRole('button', { name: 'Icon' });
      expect(button).toBeInTheDocument();
    });

    it('should render button with fullWidth style', () => {
      const { container } = render(<Button fullWidth>Full Width</Button>);
      const button = container.firstChild as HTMLElement;
      expect(button.style.width).toBe('100%');
    });
  });
});
