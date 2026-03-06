/**
 * @framingui/ui - Badge Component Tests
 * SPEC-UI-001: Comprehensive test coverage for Badge component
 */

import { render, screen } from '@testing-library/react';
import { axe } from 'vitest-axe';
import { describe, it, expect, vi } from 'vitest';
import { Badge } from '../badge';

describe('Badge', () => {
  // 1. Rendering Tests
  describe('Rendering', () => {
    it('renders without crashing', () => {
      render(<Badge>Badge</Badge>);
      expect(screen.getByText('Badge')).toBeInTheDocument();
    });

    it('renders with custom children', () => {
      render(<Badge>Custom Badge</Badge>);
      expect(screen.getByText('Custom Badge')).toBeInTheDocument();
    });

    it('renders with numeric content', () => {
      render(<Badge>99+</Badge>);
      expect(screen.getByText('99+')).toBeInTheDocument();
    });
  });

  // 2. Variant Tests
  describe('Variants', () => {
    const variants = ['default', 'secondary', 'destructive', 'outline'] as const;

    it.each(variants)('renders %s variant correctly', variant => {
      const { container } = render(<Badge variant={variant}>Test</Badge>);
      expect(container.firstChild).toBeInTheDocument();
    });

    it('applies default variant when no variant is specified', () => {
      const { container } = render(<Badge>Default</Badge>);
      const badge = container.firstChild as HTMLElement;
      expect(badge.className).toContain('bg-[var(--bg-primary)]');
    });

    it('applies secondary variant styles', () => {
      const { container } = render(<Badge variant="secondary">Secondary</Badge>);
      const badge = container.firstChild as HTMLElement;
      expect(badge.className).toContain('bg-[var(--bg-secondary)]');
    });

    it('applies destructive variant styles', () => {
      const { container } = render(<Badge variant="destructive">Destructive</Badge>);
      const badge = container.firstChild as HTMLElement;
      expect(badge.className).toContain('bg-[var(--bg-destructive)]');
    });

    it('applies outline variant styles', () => {
      const { container } = render(<Badge variant="outline">Outline</Badge>);
      const badge = container.firstChild as HTMLElement;
      expect(badge.className).toContain('text-[var(--bg-foreground)]');
    });
  });

  // 3. Interactive Tests
  describe('Interactive Behavior', () => {
    it('supports click events', () => {
      const handleClick = vi.fn();
      render(<Badge onClick={handleClick}>Clickable</Badge>);

      const badge = screen.getByText('Clickable');
      badge.click();
      expect(handleClick).toHaveBeenCalledTimes(1);
    });

    it('supports focus events', () => {
      const { container } = render(<Badge>Focusable</Badge>);
      const badge = container.firstChild as HTMLElement;

      // Badge uses focus:ring styling
      expect(badge.className).toContain('focus:ring-2');
    });

    it('can be used as a link', () => {
      render(
        <a href="/test">
          <Badge>Link Badge</Badge>
        </a>
      );

      const link = screen.getByRole('link');
      expect(link).toBeInTheDocument();
      expect(link).toHaveTextContent('Link Badge');
    });
  });

  // 4. Accessibility Tests
  describe('Accessibility', () => {
    it('passes axe accessibility checks', async () => {
      const { container } = render(<Badge>Accessible Badge</Badge>);
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it('supports aria-label for icon badges', () => {
      render(<Badge aria-label="Notification count">5</Badge>);
      expect(screen.getByLabelText('Notification count')).toBeInTheDocument();
    });

    it('supports role attribute', () => {
      render(
        <Badge role="status" aria-live="polite">
          New
        </Badge>
      );
      const badge = screen.getByRole('status');
      expect(badge).toBeInTheDocument();
      expect(badge).toHaveAttribute('aria-live', 'polite');
    });
  });

  // 5. Token Compliance Tests
  describe('Token Compliance', () => {
    it('applies Tekton token-based styles', () => {
      const { container } = render(<Badge>Tokenized</Badge>);
      const badge = container.firstChild as HTMLElement;
      expect(badge.className).toMatch(/var\(--/);
    });

    it('uses Tekton spacing tokens', () => {
      const { container } = render(<Badge>Spacing</Badge>);
      const badge = container.firstChild as HTMLElement;
      expect(badge.className).toContain('px-[var(--spacing-3)]');
      expect(badge.className).toContain('py-[var(--spacing-1)]');
    });

    it('uses Tekton radius tokens', () => {
      const { container } = render(<Badge>Radius</Badge>);
      const badge = container.firstChild as HTMLElement;
      expect(badge.className).toContain('rounded-[var(--radius-full)]');
    });

    it('uses Tekton color tokens for variants', () => {
      const { container } = render(<Badge variant="destructive">Destructive</Badge>);
      const badge = container.firstChild as HTMLElement;
      expect(badge.className).toContain('bg-[var(--bg-destructive)]');
    });

    it('uses Tekton border ring tokens', () => {
      const { container } = render(<Badge>Ring</Badge>);
      const badge = container.firstChild as HTMLElement;
      expect(badge.className).toContain('focus:ring-[var(--border-ring)]');
    });
  });

  // Additional Edge Cases
  describe('Edge Cases', () => {
    it('handles custom className', () => {
      const { container } = render(<Badge className="custom-badge">Custom</Badge>);
      const badge = container.firstChild as HTMLElement;
      expect(badge.className).toContain('custom-badge');
    });

    it('renders with complex children', () => {
      render(
        <Badge>
          <span>Icon</span> Label
        </Badge>
      );
      expect(screen.getByText('Icon')).toBeInTheDocument();
      expect(screen.getByText(/Label/)).toBeInTheDocument();
    });

    it('handles data attributes', () => {
      render(<Badge data-testid="test-badge">Test</Badge>);
      expect(screen.getByTestId('test-badge')).toBeInTheDocument();
    });

    it('applies consistent typography styles', () => {
      const { container } = render(<Badge>Typography</Badge>);
      const badge = container.firstChild as HTMLElement;
      expect(badge.className).toContain('text-xs');
      expect(badge.className).toContain('font-semibold');
    });
  });
});
