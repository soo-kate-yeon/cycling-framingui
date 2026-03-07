/**
 * @framingui/ui - Separator Component Tests
 * SPEC-UI-001: Comprehensive test coverage for Separator component
 */

import { render } from '@testing-library/react';
import { axe } from 'vitest-axe';
import { describe, it, expect } from 'vitest';
import { Separator } from '../separator';

describe('Separator', () => {
  // 1. Rendering Tests
  describe('Rendering', () => {
    it('renders without crashing', () => {
      const { container } = render(<Separator />);
      expect(container.firstChild).toBeInTheDocument();
    });

    it('renders as horizontal by default', () => {
      const { container } = render(<Separator />);
      const separator = container.firstChild as HTMLElement;
      expect(separator).toHaveAttribute('data-orientation', 'horizontal');
    });

    it('renders as vertical when specified', () => {
      const { container } = render(<Separator orientation="vertical" />);
      const separator = container.firstChild as HTMLElement;
      expect(separator).toHaveAttribute('data-orientation', 'vertical');
    });

    it('is decorative by default', () => {
      const { container } = render(<Separator />);
      const separator = container.firstChild as HTMLElement;
      expect(separator).toHaveAttribute('role', 'none');
    });
  });

  // 2. Orientation Tests
  describe('Orientation', () => {
    it('applies horizontal styles correctly', () => {
      const { container } = render(<Separator orientation="horizontal" />);
      const separator = container.firstChild as HTMLElement;
      expect(separator.className).toContain('h-[1px]');
      expect(separator.className).toContain('w-full');
    });

    it('applies vertical styles correctly', () => {
      const { container } = render(<Separator orientation="vertical" />);
      const separator = container.firstChild as HTMLElement;
      expect(separator.className).toContain('h-full');
      expect(separator.className).toContain('w-[1px]');
    });

    it('handles orientation prop changes', () => {
      const { container, rerender } = render(<Separator orientation="horizontal" />);
      let separator = container.firstChild as HTMLElement;
      expect(separator).toHaveAttribute('data-orientation', 'horizontal');

      rerender(<Separator orientation="vertical" />);
      separator = container.firstChild as HTMLElement;
      expect(separator).toHaveAttribute('data-orientation', 'vertical');
    });
  });

  // 3. Semantic Role Tests
  describe('Semantic Role', () => {
    it('is decorative when decorative=true', () => {
      const { container } = render(<Separator decorative={true} />);
      const separator = container.firstChild as HTMLElement;
      expect(separator).toHaveAttribute('role', 'none');
    });

    it('has separator role when decorative=false', () => {
      const { container } = render(<Separator decorative={false} />);
      const separator = container.firstChild as HTMLElement;
      expect(separator).toHaveAttribute('role', 'separator');
    });

    it('respects custom aria-orientation', () => {
      const { container } = render(<Separator orientation="vertical" decorative={false} />);
      const separator = container.firstChild as HTMLElement;
      expect(separator).toHaveAttribute('aria-orientation', 'vertical');
    });
  });

  // 4. Accessibility Tests
  describe('Accessibility', () => {
    it('passes axe accessibility checks', async () => {
      const { container } = render(
        <div>
          <p>Content above</p>
          <Separator />
          <p>Content below</p>
        </div>
      );
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it('passes axe checks with semantic separator', async () => {
      const { container } = render(
        <div>
          <p>Section 1</p>
          <Separator decorative={false} />
          <p>Section 2</p>
        </div>
      );
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it('provides proper semantics for screen readers', () => {
      const { container } = render(<Separator decorative={false} />);
      const separator = container.firstChild as HTMLElement;
      expect(separator).toHaveAttribute('role', 'separator');
    });
  });

  // 5. Token Compliance Tests
  describe('Token Compliance', () => {
    it('applies Tekton token-based styles', () => {
      const { container } = render(<Separator />);
      const separator = container.firstChild as HTMLElement;
      expect(separator.className).toContain('bg-[var(--border-default)]');
    });

    it('uses Tekton border color tokens', () => {
      const { container } = render(<Separator />);
      const separator = container.firstChild as HTMLElement;
      expect(separator.className).toMatch(/var\(--border-default\)/);
    });

    it('maintains consistent styling across orientations', () => {
      const { container: horizontal } = render(<Separator orientation="horizontal" />);
      const { container: vertical } = render(<Separator orientation="vertical" />);

      const hSep = horizontal.firstChild as HTMLElement;
      const vSep = vertical.firstChild as HTMLElement;

      expect(hSep.className).toContain('bg-[var(--border-default)]');
      expect(vSep.className).toContain('bg-[var(--border-default)]');
    });
  });

  // Additional Edge Cases
  describe('Edge Cases', () => {
    it('handles custom className', () => {
      const { container } = render(<Separator className="custom-separator" />);
      const separator = container.firstChild as HTMLElement;
      expect(separator.className).toContain('custom-separator');
    });

    it('forwards ref correctly', () => {
      const ref = { current: null as HTMLDivElement | null };
      render(<Separator ref={ref} />);
      expect(ref.current).toBeInstanceOf(HTMLElement);
    });

    it('handles data attributes', () => {
      const { container } = render(<Separator data-testid="test-separator" />);
      const separator = container.firstChild as HTMLElement;
      expect(separator).toHaveAttribute('data-testid', 'test-separator');
    });

    it('applies shrink-0 to prevent flex shrinking', () => {
      const { container } = render(<Separator />);
      const separator = container.firstChild as HTMLElement;
      expect(separator.className).toContain('shrink-0');
    });

    it('works within flex containers', () => {
      const { container } = render(
        <div style={{ display: 'flex' }}>
          <div>Item 1</div>
          <Separator orientation="vertical" />
          <div>Item 2</div>
        </div>
      );
      expect(container.querySelector('[data-orientation="vertical"]')).toBeInTheDocument();
    });
  });
});
