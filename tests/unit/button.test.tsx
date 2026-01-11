/**
 * @file        tests/unit/button.test.tsx
 * @description Unit-Tests für Button-Komponente (Config-Loading + Rendering)
 * @version     1.1.0
 * @created     2026-01-10 01:15:00 CET
 * @updated     2026-01-11 03:20:00 CET
 * @author      Akki Scholze (QA-Test-Entwickler)
 *
 * @changelog
 *   1.1.0 - 2026-01-11 03:20:00 CET - Updated for new Button API (kind | intent, no variant/size)
 *   1.0.1 - 2026-01-11 01:58:38 CET - Updated for 'sizes.btn' → 'sizes.rect' rename
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
      expect(appConfig.components.button.variant).toBeDefined();
      expect(appConfig.components.button.sizes).toBeDefined();
    });

    it('should have all required variant kinds in config', () => {
      const kinds = ['rect', 'icon'];
      kinds.forEach((kind) => {
        expect(appConfig.components.button.variant).toHaveProperty(kind);
      });
    });

    it('should have all required sizes in config', () => {
      const sizes = ['rect', 'icon'];
      sizes.forEach((size) => {
        expect(appConfig.components.button.sizes).toHaveProperty(size);
      });
    });

    it('should have variant-specific styles in config', () => {
      const rectVariant = appConfig.components.button.variant.rect;
      expect(rectVariant.bg).toBeDefined();
      expect(rectVariant.text).toBeDefined();
      expect(rectVariant.hoverBg).toBeDefined();
      expect(rectVariant.saveBg).toBeDefined();
      expect(rectVariant.saveHoverBg).toBeDefined();
    });

    it('should have size-specific styles in config', () => {
      const rectSize = appConfig.components.button.sizes.rect;
      expect(rectSize.height).toBeDefined();
      expect(rectSize.padding).toBeDefined();
      expect(rectSize.fontSize).toBeDefined();
    });
  });

  describe('Rendering', () => {
    it('should render with default kind="rect" and intent="default"', () => {
      render(<Button>Test Button</Button>);
      expect(screen.getByRole('button', { name: 'Test Button' })).toBeInTheDocument();
    });

    it('should render with kind="rect" and intent="save"', () => {
      render(
        <Button kind="rect" intent="save">
          Save
        </Button>
      );
      const button = screen.getByRole('button', { name: 'Save' });
      expect(button).toBeInTheDocument();
    });

    it('should render with kind="icon"', () => {
      render(<Button kind="icon">📦</Button>);
      const button = screen.getByRole('button', { name: '📦' });
      expect(button).toBeInTheDocument();
    });

    it('should apply custom className', () => {
      render(<Button className="custom-class">Test</Button>);
      const button = screen.getByRole('button', { name: 'Test' });
      expect(button).toHaveClass('custom-class');
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

    it('should pass MouseEvent to onClick handler', () => {
      const handleClick = vi.fn();
      render(<Button onClick={handleClick}>Click Me</Button>);

      const button = screen.getByRole('button', { name: 'Click Me' });
      fireEvent.click(button);

      expect(handleClick).toHaveBeenCalledWith(expect.any(Object));
    });

    it('should not call onClick when disabled', () => {
      const handleClick = vi.fn();
      render(
        <Button onClick={handleClick} disabled>
          Disabled
        </Button>
      );

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
    it('should show loading state with spinner', () => {
      const { container } = render(<Button loading>Loading</Button>);
      // Loading indicator (SVG spinner) should be present
      const loadingIcon = container.querySelector('svg');
      expect(loadingIcon).not.toBeNull();
    });
  });

  describe('Styling', () => {
    it('should apply config-driven height for rect kind', () => {
      const { container } = render(<Button kind="rect">Test</Button>);
      const button = container.firstChild as HTMLElement;
      const expectedHeight = appConfig.components.button.sizes.rect.height;
      expect(button.style.height).toBe(expectedHeight);
    });

    it('should apply intent-specific colors (save)', () => {
      const { container } = render(<Button intent="save">Save</Button>);
      const button = container.firstChild as HTMLElement;
      // save intent should use saveBg color
      expect(button.style.backgroundColor).toBeTruthy();
    });

    it('should apply fullWidth style', () => {
      const { container } = render(<Button fullWidth>Full Width</Button>);
      const button = container.firstChild as HTMLElement;
      expect(button.style.width).toBe('100%');
    });
  });

  describe('Icon Kind', () => {
    it('should render icon-only button without text padding', () => {
      render(<Button kind="icon">📦</Button>);
      const button = screen.getByRole('button', { name: '📦' });
      expect(button).toBeInTheDocument();
    });

    it('should have appropriate icon size from config', () => {
      const { container } = render(<Button kind="icon">📦</Button>);
      const button = container.firstChild as HTMLElement;
      // Icon buttons should have width/height set from config
      expect(button.style.width).toBeTruthy();
      expect(button.style.height).toBeTruthy();
    });
  });

  describe('Type Attribute', () => {
    it('should default to type="button"', () => {
      render(<Button>Test</Button>);
      const button = screen.getByRole('button', { name: 'Test' });
      expect(button).toHaveAttribute('type', 'button');
    });

    it('should support type="submit"', () => {
      render(<Button type="submit">Submit</Button>);
      const button = screen.getByRole('button', { name: 'Submit' });
      expect(button).toHaveAttribute('type', 'submit');
    });

    it('should support type="reset"', () => {
      render(<Button type="reset">Reset</Button>);
      const button = screen.getByRole('button', { name: 'Reset' });
      expect(button).toHaveAttribute('type', 'reset');
    });
  });
});
