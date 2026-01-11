/**
 * @file        tests/unit/button.test.tsx
 * @description Unit-Tests für Button-Komponente (Config-Loading + Rendering)
 * @version     1.2.0
 * @created     2026-01-10 01:15:00 CET
 * @updated     2026-01-11 18:00:00 CET
 * @author      Akki Scholze (QA-Test-Entwickler)
 *
 * @changelog
 *   1.2.0 - 2026-01-11 18:00:00 CET - Updated for new Button types (nav/new/act/tab/rect)
 *   1.1.0 - 2026-01-11 03:20:00 CET - Updated for new Button API (kind | intent, no variant/size)
 *   1.0.0 - 2026-01-10 - Initial test suite (Phase 4.1)
 */

import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { Button } from '@/components/ui/Button';
import { appConfig } from '@/config';

describe('Button Component', () => {
  describe('Config Loading', () => {
    it('should load button config from appConfig', () => {
      expect(appConfig.button).toBeDefined();
      expect(appConfig.button.nav).toBeDefined();
      expect(appConfig.button.new).toBeDefined();
      expect(appConfig.button.act).toBeDefined();
      expect(appConfig.button.tab).toBeDefined();
      expect(appConfig.button.rect).toBeDefined();
    });

    it('should have all required button types in config', () => {
      const types = ['nav', 'new', 'act', 'tab', 'rect'];
      types.forEach((type) => {
        expect(appConfig.button).toHaveProperty(type);
      });
    });

    it('should have icon button styles in config', () => {
      const navButton = appConfig.button.nav;
      expect(navButton.bg).toBeDefined();
      expect(navButton.icon).toBeDefined();
      expect(navButton.hoverBg).toBeDefined();
      expect(navButton.iconSize).toBeDefined();
    });

    it('should have rect button styles in config', () => {
      const rectButton = appConfig.button.rect;
      expect(rectButton.bg).toBeDefined();
      expect(rectButton.text).toBeDefined();
      expect(rectButton.hoverBg).toBeDefined();
      expect(rectButton.saveBg).toBeDefined();
      expect(rectButton.saveHoverBg).toBeDefined();
      expect(rectButton.height).toBeDefined();
      expect(rectButton.padding).toBeDefined();
      expect(rectButton.fontSize).toBeDefined();
      expect(rectButton.iconSize).toBeDefined();
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

    it('should render with kind="act"', () => {
      render(<Button kind="act">📦</Button>);
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
      // Loading text is replaced with '...', so we can't query by 'Loading'
      const button = screen.getByRole('button');
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
      // Loading indicator (...) should be present instead of children text
      const button = container.querySelector('button');
      expect(button?.textContent).toBe('...');
    });
  });

  describe('Styling', () => {
    it('should apply config-driven height for rect kind', () => {
      const { container } = render(<Button kind="rect">Test</Button>);
      const button = container.firstChild as HTMLElement;
      const expectedHeight = appConfig.button.rect.height;
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
      // fullWidth is applied via className 'w-full'
      expect(button.className).toContain('w-full');
    });
  });

  describe('Icon Button Types', () => {
    it('should render act button (action in tables)', () => {
      render(<Button kind="act">📦</Button>);
      const button = screen.getByRole('button', { name: '📦' });
      expect(button).toBeInTheDocument();
    });

    it('should have appropriate icon size from config', () => {
      const { container } = render(<Button kind="act">📦</Button>);
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
