/**
 * @framingui - Checkbox Component Tests
 * SPEC-UI-001: Comprehensive test coverage for Checkbox component
 */
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { axe } from 'vitest-axe';
import { describe, it, expect, vi } from 'vitest';
import { Checkbox } from '../checkbox';
describe('Checkbox', () => {
  // 1. Rendering Tests
  describe('Rendering', () => {
    it('renders without crashing', () => {
      const { container } = render(<Checkbox />);
      expect(container.firstChild).toBeInTheDocument();
    });
    it('renders with label', () => {
      render(
        <div>
          <Checkbox id="terms" />
          <label htmlFor="terms">Accept terms</label>
        </div>
      );
      expect(screen.getByText('Accept terms')).toBeInTheDocument();
    });
    it('renders with aria-label', () => {
      render(<Checkbox aria-label="Accept terms" />);
      expect(screen.getByRole('checkbox', { name: 'Accept terms' })).toBeInTheDocument();
    });
  });
  // 2. State Tests
  describe('Checkbox States', () => {
    it('is unchecked by default', () => {
      render(<Checkbox />);
      const checkbox = screen.getByRole('checkbox');
      expect(checkbox).not.toBeChecked();
    });
    it('can be checked', async () => {
      render(<Checkbox />);
      const checkbox = screen.getByRole('checkbox');
      await userEvent.click(checkbox);
      expect(checkbox).toBeChecked();
    });
    it('supports defaultChecked prop', () => {
      render(<Checkbox defaultChecked />);
      const checkbox = screen.getByRole('checkbox');
      expect(checkbox).toBeChecked();
    });
    it('supports controlled checked prop', () => {
      const { rerender } = render(<Checkbox checked={false} onCheckedChange={vi.fn()} />);
      let checkbox = screen.getByRole('checkbox');
      expect(checkbox).not.toBeChecked();
      rerender(<Checkbox checked={true} onCheckedChange={vi.fn()} />);
      checkbox = screen.getByRole('checkbox');
      expect(checkbox).toBeChecked();
    });
    it('handles disabled state', () => {
      render(<Checkbox disabled />);
      const checkbox = screen.getByRole('checkbox');
      expect(checkbox).toBeDisabled();
    });
  });
  // 3. User Interaction Tests
  describe('User Interaction', () => {
    it('toggles on click', async () => {
      render(<Checkbox />);
      const checkbox = screen.getByRole('checkbox');
      await userEvent.click(checkbox);
      expect(checkbox).toBeChecked();
      await userEvent.click(checkbox);
      expect(checkbox).not.toBeChecked();
    });
    it('triggers onCheckedChange callback', async () => {
      const handleChange = vi.fn();
      render(<Checkbox onCheckedChange={handleChange} />);
      const checkbox = screen.getByRole('checkbox');
      await userEvent.click(checkbox);
      expect(handleChange).toHaveBeenCalledWith(true);
      await userEvent.click(checkbox);
      expect(handleChange).toHaveBeenCalledWith(false);
    });
    it('does not toggle when disabled', async () => {
      const handleChange = vi.fn();
      render(<Checkbox disabled onCheckedChange={handleChange} />);
      const checkbox = screen.getByRole('checkbox');
      await userEvent.click(checkbox);
      expect(handleChange).not.toHaveBeenCalled();
      expect(checkbox).not.toBeChecked();
    });
    it('supports keyboard interaction (Space)', async () => {
      render(<Checkbox />);
      const checkbox = screen.getByRole('checkbox');
      checkbox.focus();
      await userEvent.keyboard(' ');
      expect(checkbox).toBeChecked();
    });
  });
  // 4. Accessibility Tests
  describe('Accessibility', () => {
    it('passes axe accessibility checks', async () => {
      const { container } = render(
        <div>
          <Checkbox id="test" />
          <label htmlFor="test">Test checkbox</label>
        </div>
      );
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });
    it('has correct role', () => {
      render(<Checkbox />);
      expect(screen.getByRole('checkbox')).toBeInTheDocument();
    });
    it('supports aria-label', () => {
      render(<Checkbox aria-label="Subscribe to newsletter" />);
      expect(screen.getByLabelText('Subscribe to newsletter')).toBeInTheDocument();
    });
    it('supports aria-describedby', () => {
      render(
        <>
          <Checkbox aria-describedby="help-text" />
          <span id="help-text">Check this box</span>
        </>
      );
      const checkbox = screen.getByRole('checkbox');
      expect(checkbox).toHaveAttribute('aria-describedby', 'help-text');
    });
    it('indicates disabled state correctly', () => {
      render(<Checkbox disabled aria-label="Disabled checkbox" />);
      const checkbox = screen.getByLabelText('Disabled checkbox');
      expect(checkbox).toBeDisabled();
    });
  });
  // 5. Token Compliance Tests
  describe('Token Compliance', () => {
    it('applies Tekton token-based styles', () => {
      const { container } = render(<Checkbox />);
      const checkbox = container.firstChild;
      expect(checkbox.className).toMatch(/var\(--/);
    });
    it('uses Tekton radius tokens', () => {
      const { container } = render(<Checkbox />);
      const checkbox = container.firstChild;
      expect(checkbox.className).toContain('rounded-[var(--radius-sm)]');
    });
    it('uses Tekton border tokens', () => {
      const { container } = render(<Checkbox />);
      const checkbox = container.firstChild;
      expect(checkbox.className).toContain('border-[var(--border-input)]');
    });
    it('uses Tekton color tokens for checked state', () => {
      const { container } = render(<Checkbox />);
      const checkbox = container.firstChild;
      expect(checkbox.className).toContain('data-[state=checked]:bg-[var(--bg-primary)]');
    });
    it('uses Tekton background tokens', () => {
      const { container } = render(<Checkbox />);
      const checkbox = container.firstChild;
      expect(checkbox.className).toContain('ring-offset-[var(--bg-background)]');
    });
  });
  // Additional Edge Cases
  describe('Edge Cases', () => {
    it('handles custom className', () => {
      const { container } = render(<Checkbox className="custom-checkbox" />);
      const checkbox = container.firstChild;
      expect(checkbox.className).toContain('custom-checkbox');
    });
    it('forwards ref correctly', () => {
      const ref = vi.fn();
      render(<Checkbox ref={ref} />);
      expect(ref).toHaveBeenCalled();
    });
    it('supports required attribute', () => {
      render(<Checkbox required aria-label="Required field" />);
      const checkbox = screen.getByLabelText('Required field');
      expect(checkbox).toBeRequired();
    });
    it('renders checkmark indicator when checked', async () => {
      const { container } = render(<Checkbox />);
      const checkbox = screen.getByRole('checkbox');
      await userEvent.click(checkbox);
      // Check icon should be present (lucide-react Check component)
      const svg = container.querySelector('svg');
      expect(svg).toBeInTheDocument();
    });
  });
});
//# sourceMappingURL=checkbox.test.js.map
