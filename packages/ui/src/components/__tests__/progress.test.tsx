/**
 * @framingui/ui - Progress Component Tests
 * SPEC-UI-001: Comprehensive test coverage for Progress component
 */

import { render, screen } from '@testing-library/react';
import { axe } from 'vitest-axe';
import { describe, it, expect, vi } from 'vitest';
import { Progress } from '../progress';

describe('Progress', () => {
  // 1. Rendering Tests
  describe('Rendering', () => {
    it('renders without crashing', () => {
      const { container } = render(<Progress value={50} />);
      expect(container.firstChild).toBeInTheDocument();
    });

    it('renders with aria-label', () => {
      render(<Progress value={50} aria-label="Loading progress" />);
      expect(screen.getByRole('progressbar', { name: 'Loading progress' })).toBeInTheDocument();
    });

    it('renders without value (indeterminate)', () => {
      const { container } = render(<Progress />);
      expect(container.firstChild).toBeInTheDocument();
    });
  });

  // 2. Value Tests
  describe('Value Handling', () => {
    it('displays correct value via aria-valuenow', () => {
      render(<Progress value={75} />);
      const progress = screen.getByRole('progressbar');
      expect(progress).toHaveAttribute('aria-valuenow', '75');
    });

    it('handles 0% value', () => {
      render(<Progress value={0} />);
      const progress = screen.getByRole('progressbar');
      expect(progress).toHaveAttribute('aria-valuenow', '0');
    });

    it('handles 100% value', () => {
      render(<Progress value={100} />);
      const progress = screen.getByRole('progressbar');
      expect(progress).toHaveAttribute('aria-valuenow', '100');
    });

    it('handles intermediate values', () => {
      const values = [25, 50, 75];
      values.forEach(value => {
        const { unmount } = render(<Progress value={value} />);
        const progress = screen.getByRole('progressbar');
        expect(progress).toHaveAttribute('aria-valuenow', String(value));
        unmount();
      });
    });

    it('renders indicator with correct transform', () => {
      const { container } = render(<Progress value={50} />);
      const indicator = container.querySelector('[class*="transition-all"]');
      expect(indicator).toHaveStyle({ transform: 'translateX(-50%)' });
    });
  });

  // 3. State Tests
  describe('State Changes', () => {
    it('updates when value changes', () => {
      const { rerender } = render(<Progress value={30} />);
      let progress = screen.getByRole('progressbar');
      expect(progress).toHaveAttribute('aria-valuenow', '30');

      rerender(<Progress value={70} />);
      progress = screen.getByRole('progressbar');
      expect(progress).toHaveAttribute('aria-valuenow', '70');
    });

    it('handles value prop changes smoothly', () => {
      const { container, rerender } = render(<Progress value={0} />);

      rerender(<Progress value={50} />);
      const indicator = container.querySelector('[class*="transition-all"]');
      expect(indicator).toHaveStyle({ transform: 'translateX(-50%)' });

      rerender(<Progress value={100} />);
      expect(indicator).toHaveStyle({ transform: 'translateX(-0%)' });
    });
  });

  // 4. Accessibility Tests
  describe('Accessibility', () => {
    it('passes axe accessibility checks', async () => {
      const { container } = render(<Progress value={50} aria-label="Progress" />);
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it('has correct progressbar role', () => {
      render(<Progress value={50} />);
      expect(screen.getByRole('progressbar')).toBeInTheDocument();
    });

    it('has aria-valuemax attribute', () => {
      render(<Progress value={50} />);
      const progress = screen.getByRole('progressbar');
      expect(progress).toHaveAttribute('aria-valuemax', '100');
    });

    it('has aria-valuemin attribute', () => {
      render(<Progress value={50} />);
      const progress = screen.getByRole('progressbar');
      expect(progress).toHaveAttribute('aria-valuemin', '0');
    });

    it('supports aria-label', () => {
      render(<Progress value={50} aria-label="Upload progress" />);
      expect(screen.getByLabelText('Upload progress')).toBeInTheDocument();
    });

    it('supports aria-describedby', () => {
      render(
        <>
          <Progress value={50} aria-describedby="progress-desc" />
          <span id="progress-desc">Uploading file</span>
        </>
      );
      const progress = screen.getByRole('progressbar');
      expect(progress).toHaveAttribute('aria-describedby', 'progress-desc');
    });
  });

  // 5. Token Compliance Tests
  describe('Token Compliance', () => {
    it('applies Tekton token-based styles', () => {
      const { container } = render(<Progress value={50} />);
      const progress = container.firstChild as HTMLElement;
      expect(progress.className).toMatch(/var\(--/);
    });

    it('uses Tekton radius tokens', () => {
      const { container } = render(<Progress value={50} />);
      const progress = container.firstChild as HTMLElement;
      expect(progress.className).toContain('rounded-[var(--radius-full)]');
    });

    it('uses Tekton background tokens for track', () => {
      const { container } = render(<Progress value={50} />);
      const progress = container.firstChild as HTMLElement;
      expect(progress.className).toContain('bg-[var(--bg-secondary)]');
    });

    it('uses Tekton background tokens for indicator', () => {
      const { container } = render(<Progress value={50} />);
      const indicator = container.querySelector('[class*="bg-[var(--bg-primary)]"]');
      expect(indicator).toBeInTheDocument();
    });

    it('has consistent sizing', () => {
      const { container } = render(<Progress value={50} />);
      const progress = container.firstChild as HTMLElement;
      expect(progress.className).toContain('h-4');
      expect(progress.className).toContain('w-full');
    });
  });

  // Additional Edge Cases
  describe('Edge Cases', () => {
    it('handles custom className', () => {
      const { container } = render(<Progress value={50} className="custom-progress" />);
      const progress = container.firstChild as HTMLElement;
      expect(progress.className).toContain('custom-progress');
    });

    it('forwards ref correctly', () => {
      const ref = vi.fn();
      render(<Progress value={50} ref={ref} />);
      expect(ref).toHaveBeenCalled();
    });

    it('handles edge case values', () => {
      // Test minimum value
      const { unmount: unmount1 } = render(<Progress value={0} />);
      let progress = screen.getByRole('progressbar');
      expect(progress).toHaveAttribute('aria-valuenow', '0');
      unmount1();

      // Test maximum value
      const { unmount: unmount2 } = render(<Progress value={100} />);
      progress = screen.getByRole('progressbar');
      expect(progress).toHaveAttribute('aria-valuenow', '100');
      unmount2();

      // Test mid-range value
      render(<Progress value={50} />);
      progress = screen.getByRole('progressbar');
      expect(progress).toHaveAttribute('aria-valuenow', '50');
    });

    it('applies overflow-hidden for indicator containment', () => {
      const { container } = render(<Progress value={50} />);
      const progress = container.firstChild as HTMLElement;
      expect(progress.className).toContain('overflow-hidden');
    });

    it('supports data attributes', () => {
      const { container } = render(<Progress value={50} data-testid="test-progress" />);
      expect(container.querySelector('[data-testid="test-progress"]')).toBeInTheDocument();
    });
  });
});
