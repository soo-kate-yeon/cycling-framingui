/**
 * @framingui/ui - Skeleton Component Tests
 * SPEC-UI-001: Comprehensive test coverage for Skeleton component
 */

import { render } from '@testing-library/react';
import { axe } from 'vitest-axe';
import { describe, it, expect, vi } from 'vitest';
import { Skeleton } from '../skeleton';

describe('Skeleton', () => {
  // 1. Rendering Tests
  describe('Rendering', () => {
    it('renders without crashing', () => {
      const { container } = render(<Skeleton />);
      expect(container.firstChild).toBeInTheDocument();
    });

    it('renders as a div element', () => {
      const { container } = render(<Skeleton data-testid="skeleton" />);
      const skeleton = container.querySelector('[data-testid="skeleton"]');
      expect(skeleton?.tagName).toBe('DIV');
    });

    it('renders with custom children', () => {
      const { container } = render(<Skeleton>Loading...</Skeleton>);
      expect(container.firstChild).toHaveTextContent('Loading...');
    });
  });

  // 2. Styling Tests
  describe('Styling', () => {
    it('applies animate-pulse class', () => {
      const { container } = render(<Skeleton />);
      const skeleton = container.firstChild as HTMLElement;
      expect(skeleton.className).toContain('animate-pulse');
    });

    it('applies custom width and height', () => {
      const { container } = render(<Skeleton className="w-20 h-20" />);
      const skeleton = container.firstChild as HTMLElement;
      expect(skeleton.className).toContain('w-20');
      expect(skeleton.className).toContain('h-20');
    });

    it('applies custom className', () => {
      const { container } = render(<Skeleton className="custom-skeleton" />);
      const skeleton = container.firstChild as HTMLElement;
      expect(skeleton.className).toContain('custom-skeleton');
    });

    it('supports different shapes via className', () => {
      const { container: circle } = render(<Skeleton className="rounded-full" />);
      const { container: square } = render(<Skeleton className="rounded-none" />);

      expect(circle.firstChild).toHaveClass('rounded-full');
      expect(square.firstChild).toHaveClass('rounded-none');
    });
  });

  // 3. Use Case Tests
  describe('Use Cases', () => {
    it('renders as text skeleton', () => {
      const { container } = render(<Skeleton className="h-4 w-full" />);
      const skeleton = container.firstChild as HTMLElement;
      expect(skeleton.className).toContain('h-4');
      expect(skeleton.className).toContain('w-full');
    });

    it('renders as avatar skeleton', () => {
      const { container } = render(<Skeleton className="h-12 w-12 rounded-full" />);
      const skeleton = container.firstChild as HTMLElement;
      expect(skeleton.className).toContain('h-12');
      expect(skeleton.className).toContain('w-12');
      expect(skeleton.className).toContain('rounded-full');
    });

    it('renders as card skeleton', () => {
      const { container } = render(<Skeleton className="h-40 w-full rounded-lg" />);
      const skeleton = container.firstChild as HTMLElement;
      expect(skeleton.className).toContain('h-40');
      expect(skeleton.className).toContain('rounded-lg');
    });

    it('renders multiple skeletons', () => {
      const { container } = render(
        <div>
          <Skeleton className="h-4 w-full mb-2" />
          <Skeleton className="h-4 w-3/4" />
        </div>
      );
      const skeletons = container.querySelectorAll('.animate-pulse');
      expect(skeletons.length).toBe(2);
    });
  });

  // 4. Accessibility Tests
  describe('Accessibility', () => {
    it('passes axe accessibility checks', async () => {
      const { container } = render(<Skeleton />);
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it('can have aria-label for loading state', () => {
      const { container } = render(<Skeleton aria-label="Loading content" />);
      const skeleton = container.firstChild as HTMLElement;
      expect(skeleton).toHaveAttribute('aria-label', 'Loading content');
    });

    it('can have aria-busy attribute', () => {
      const { container } = render(<Skeleton aria-busy="true" />);
      const skeleton = container.firstChild as HTMLElement;
      expect(skeleton).toHaveAttribute('aria-busy', 'true');
    });

    it('can have role="status"', () => {
      const { container } = render(<Skeleton role="status" />);
      const skeleton = container.firstChild as HTMLElement;
      expect(skeleton).toHaveAttribute('role', 'status');
    });
  });

  // 5. Token Compliance Tests
  describe('Token Compliance', () => {
    it('applies Tekton token-based styles', () => {
      const { container } = render(<Skeleton />);
      const skeleton = container.firstChild as HTMLElement;
      expect(skeleton.className).toMatch(/var\(--/);
    });

    it('uses Tekton background tokens', () => {
      const { container } = render(<Skeleton />);
      const skeleton = container.firstChild as HTMLElement;
      expect(skeleton.className).toContain('bg-[var(--bg-muted)]');
    });

    it('uses Tekton radius tokens by default', () => {
      const { container } = render(<Skeleton />);
      const skeleton = container.firstChild as HTMLElement;
      expect(skeleton.className).toContain('rounded-[var(--radius-md)]');
    });

    it('maintains consistent animation', () => {
      const { container } = render(<Skeleton />);
      const skeleton = container.firstChild as HTMLElement;
      expect(skeleton.className).toContain('animate-pulse');
    });
  });

  // Additional Edge Cases
  describe('Edge Cases', () => {
    it('handles data attributes', () => {
      const { container } = render(<Skeleton data-testid="test-skeleton" />);
      expect(container.querySelector('[data-testid="test-skeleton"]')).toBeInTheDocument();
    });

    it('supports event handlers', () => {
      const handleClick = vi.fn();
      const { container } = render(<Skeleton onClick={handleClick} />);
      const skeleton = container.firstChild as HTMLElement;
      skeleton.click();
      expect(handleClick).toHaveBeenCalledTimes(1);
    });

    it('can be nested in other components', () => {
      const { container } = render(
        <div className="card">
          <Skeleton className="h-40 w-full" />
          <div className="content">
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-4 w-1/2" />
          </div>
        </div>
      );
      const skeletons = container.querySelectorAll('.animate-pulse');
      expect(skeletons.length).toBe(3);
    });

    it('works with responsive utilities', () => {
      const { container } = render(<Skeleton className="h-4 w-full sm:w-1/2 md:w-1/3" />);
      const skeleton = container.firstChild as HTMLElement;
      expect(skeleton.className).toContain('w-full');
      expect(skeleton.className).toContain('sm:w-1/2');
      expect(skeleton.className).toContain('md:w-1/3');
    });
  });
});
