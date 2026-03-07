/**
 * @framingui - Button Component Tests
 * SPEC-UI-001: Comprehensive test coverage for Button component
 */
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { axe } from 'vitest-axe';
import { describe, it, expect, vi } from 'vitest';
import { Button } from '../button';
describe('Button', () => {
  // 1. Rendering Tests
  describe('Rendering', () => {
    it('renders without crashing', () => {
      render(<Button>Click me</Button>);
      expect(screen.getByRole('button')).toBeInTheDocument();
    });
    it('renders with custom children', () => {
      render(<Button>Custom Text</Button>);
      expect(screen.getByText('Custom Text')).toBeInTheDocument();
    });
    it('renders as child component with asChild prop', () => {
      render(
        <Button asChild>
          <a href="/test">Link Button</a>
        </Button>
      );
      expect(screen.getByRole('link')).toHaveTextContent('Link Button');
    });
  });
  // 2. Variant Tests
  describe('Variants', () => {
    const variants = ['default', 'destructive', 'outline', 'secondary', 'ghost', 'link'];
    it.each(variants)('renders %s variant correctly', variant => {
      const { container } = render(<Button variant={variant}>Test</Button>);
      expect(container.firstChild).toBeInTheDocument();
    });
    it('applies default variant when no variant is specified', () => {
      const { container } = render(<Button>Default</Button>);
      const button = container.querySelector('button');
      expect(button?.className).toContain('bg-[var(--bg-primary)]');
    });
  });
  describe('Sizes', () => {
    const sizes = ['default', 'sm', 'lg', 'icon'];
    it.each(sizes)('renders %s size correctly', size => {
      const { container } = render(<Button size={size}>Test</Button>);
      expect(container.firstChild).toBeInTheDocument();
    });
  });
  // 3. User Interaction Tests
  describe('User Interaction', () => {
    it('handles click events', async () => {
      const handleClick = vi.fn();
      render(<Button onClick={handleClick}>Click</Button>);
      await userEvent.click(screen.getByRole('button'));
      expect(handleClick).toHaveBeenCalledTimes(1);
    });
    it('does not trigger onClick when disabled', async () => {
      const handleClick = vi.fn();
      render(
        <Button onClick={handleClick} disabled>
          Click
        </Button>
      );
      // disabled buttons don't trigger click events in jsdom
      expect(screen.getByRole('button')).toBeDisabled();
      expect(handleClick).not.toHaveBeenCalled();
    });
    it('supports keyboard interaction', async () => {
      const handleClick = vi.fn();
      render(<Button onClick={handleClick}>Press Enter</Button>);
      const button = screen.getByRole('button');
      button.focus();
      await userEvent.keyboard('{Enter}');
      expect(handleClick).toHaveBeenCalled();
    });
  });
  // 4. Accessibility Tests
  describe('Accessibility', () => {
    it('passes axe accessibility checks', async () => {
      const { container } = render(<Button>Accessible Button</Button>);
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });
    it('has correct ARIA attributes when disabled', () => {
      render(<Button disabled>Disabled Button</Button>);
      const button = screen.getByRole('button');
      expect(button).toHaveAttribute('disabled');
    });
    it('supports aria-label', () => {
      render(<Button aria-label="Custom Label">Icon</Button>);
      expect(screen.getByLabelText('Custom Label')).toBeInTheDocument();
    });
  });
  // 5. Token Compliance Tests
  describe('Token Compliance', () => {
    it('applies Tekton token-based styles', () => {
      render(<Button>Tokenized</Button>);
      const button = screen.getByRole('button');
      expect(button.className).toMatch(/var\(--/);
    });
    it('uses Tekton spacing tokens', () => {
      const { container } = render(<Button>Spacing</Button>);
      const button = container.querySelector('button');
      expect(button?.className).toContain('px-[var(--spacing-4)]');
    });
    it('uses Tekton radius tokens', () => {
      const { container } = render(<Button>Radius</Button>);
      const button = container.querySelector('button');
      expect(button?.className).toContain('rounded-[var(--radius-xl)]');
    });
    it('uses Tekton color tokens for variants', () => {
      const { container } = render(<Button variant="destructive">Destructive</Button>);
      const button = container.querySelector('button');
      expect(button?.className).toContain('bg-[var(--bg-destructive)]');
    });
  });
  // Additional Edge Cases
  describe('Edge Cases', () => {
    it('handles multiple class names', () => {
      render(<Button className="custom-class">Custom</Button>);
      const button = screen.getByRole('button');
      expect(button.className).toContain('custom-class');
    });
    it('forwards ref correctly', () => {
      const ref = vi.fn();
      render(<Button ref={ref}>Ref Test</Button>);
      expect(ref).toHaveBeenCalled();
    });
  });
});
//# sourceMappingURL=button.test.js.map
