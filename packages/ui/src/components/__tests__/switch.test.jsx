/**
 * @framingui - Switch Component Tests
 * SPEC-UI-001: Comprehensive test coverage for Switch component
 */
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { axe } from 'vitest-axe';
import { describe, it, expect, vi } from 'vitest';
import { Switch } from '../switch';
describe('Switch', () => {
  // 1. Rendering Tests
  describe('Rendering', () => {
    it('renders without crashing', () => {
      render(<Switch />);
      expect(screen.getByRole('switch')).toBeInTheDocument();
    });
    it('renders with label', () => {
      render(
        <div>
          <Switch id="notifications" />
          <label htmlFor="notifications">Enable notifications</label>
        </div>
      );
      expect(screen.getByText('Enable notifications')).toBeInTheDocument();
    });
    it('renders with aria-label', () => {
      render(<Switch aria-label="Toggle notifications" />);
      expect(screen.getByRole('switch', { name: 'Toggle notifications' })).toBeInTheDocument();
    });
  });
  // 2. State Tests
  describe('Switch States', () => {
    it('is unchecked by default', () => {
      render(<Switch />);
      const switchElement = screen.getByRole('switch');
      expect(switchElement).not.toBeChecked();
    });
    it('can be toggled on', async () => {
      render(<Switch />);
      const switchElement = screen.getByRole('switch');
      await userEvent.click(switchElement);
      expect(switchElement).toBeChecked();
    });
    it('supports defaultChecked prop', () => {
      render(<Switch defaultChecked />);
      const switchElement = screen.getByRole('switch');
      expect(switchElement).toBeChecked();
    });
    it('supports controlled checked prop', () => {
      const { rerender } = render(<Switch checked={false} onCheckedChange={vi.fn()} />);
      let switchElement = screen.getByRole('switch');
      expect(switchElement).not.toBeChecked();
      rerender(<Switch checked={true} onCheckedChange={vi.fn()} />);
      switchElement = screen.getByRole('switch');
      expect(switchElement).toBeChecked();
    });
    it('handles disabled state', () => {
      render(<Switch disabled />);
      const switchElement = screen.getByRole('switch');
      expect(switchElement).toBeDisabled();
    });
  });
  // 3. User Interaction Tests
  describe('User Interaction', () => {
    it('toggles on click', async () => {
      render(<Switch />);
      const switchElement = screen.getByRole('switch');
      await userEvent.click(switchElement);
      expect(switchElement).toBeChecked();
      await userEvent.click(switchElement);
      expect(switchElement).not.toBeChecked();
    });
    it('triggers onCheckedChange callback', async () => {
      const handleChange = vi.fn();
      render(<Switch onCheckedChange={handleChange} />);
      const switchElement = screen.getByRole('switch');
      await userEvent.click(switchElement);
      expect(handleChange).toHaveBeenCalledWith(true);
      await userEvent.click(switchElement);
      expect(handleChange).toHaveBeenCalledWith(false);
    });
    it('does not toggle when disabled', async () => {
      const handleChange = vi.fn();
      render(<Switch disabled onCheckedChange={handleChange} />);
      const switchElement = screen.getByRole('switch');
      await userEvent.click(switchElement);
      expect(handleChange).not.toHaveBeenCalled();
      expect(switchElement).not.toBeChecked();
    });
    it('supports keyboard interaction (Space)', async () => {
      render(<Switch />);
      const switchElement = screen.getByRole('switch');
      switchElement.focus();
      await userEvent.keyboard(' ');
      expect(switchElement).toBeChecked();
    });
    it('supports keyboard interaction (Enter)', async () => {
      render(<Switch />);
      const switchElement = screen.getByRole('switch');
      switchElement.focus();
      await userEvent.keyboard('{Enter}');
      expect(switchElement).toBeChecked();
    });
  });
  // 4. Accessibility Tests
  describe('Accessibility', () => {
    it('passes axe accessibility checks', async () => {
      const { container } = render(
        <div>
          <Switch id="test-switch" />
          <label htmlFor="test-switch">Test Switch</label>
        </div>
      );
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });
    it('has correct switch role', () => {
      render(<Switch aria-label="Toggle" />);
      expect(screen.getByRole('switch')).toBeInTheDocument();
    });
    it('supports aria-label', () => {
      render(<Switch aria-label="Enable dark mode" />);
      expect(screen.getByLabelText('Enable dark mode')).toBeInTheDocument();
    });
    it('supports aria-describedby', () => {
      render(
        <>
          <Switch aria-describedby="help-text" aria-label="Switch" />
          <span id="help-text">Toggle this setting</span>
        </>
      );
      const switchElement = screen.getByRole('switch');
      expect(switchElement).toHaveAttribute('aria-describedby', 'help-text');
    });
    it('indicates checked state with aria-checked', async () => {
      render(<Switch />);
      const switchElement = screen.getByRole('switch');
      expect(switchElement).toHaveAttribute('aria-checked', 'false');
      await userEvent.click(switchElement);
      expect(switchElement).toHaveAttribute('aria-checked', 'true');
    });
    it('indicates disabled state correctly', () => {
      render(<Switch disabled aria-label="Disabled switch" />);
      const switchElement = screen.getByLabelText('Disabled switch');
      expect(switchElement).toBeDisabled();
    });
  });
  // 5. Token Compliance Tests
  describe('Token Compliance', () => {
    it('applies Tekton token-based styles', () => {
      const { container } = render(<Switch />);
      const switchElement = container.firstChild;
      expect(switchElement.className).toMatch(/var\(--/);
    });
    it('uses Tekton radius tokens', () => {
      const { container } = render(<Switch />);
      const switchElement = container.firstChild;
      expect(switchElement.className).toContain('rounded-[var(--radius-full)]');
    });
    it('uses Tekton color tokens for checked state', () => {
      const { container } = render(<Switch />);
      const switchElement = container.firstChild;
      expect(switchElement.className).toContain(
        'data-[state=checked]:bg-[var(--bg-primary)]'
      );
    });
    it('uses Tekton color tokens for unchecked state', () => {
      const { container } = render(<Switch />);
      const switchElement = container.firstChild;
      expect(switchElement.className).toContain(
        'data-[state=unchecked]:bg-[var(--bg-muted)]'
      );
    });
    it('uses Tekton background tokens for thumb', () => {
      const { container } = render(<Switch />);
      const thumb = container.querySelector('[class*="bg-[var(--bg-background)]"]');
      expect(thumb).toBeInTheDocument();
    });
    it('uses Tekton ring tokens for focus state', () => {
      const { container } = render(<Switch />);
      const switchElement = container.firstChild;
      expect(switchElement.className).toContain('focus-visible:ring-[var(--border-ring)]');
    });
  });
  // Additional Edge Cases
  describe('Edge Cases', () => {
    it('handles custom className', () => {
      const { container } = render(<Switch className="custom-switch" />);
      const switchElement = container.firstChild;
      expect(switchElement.className).toContain('custom-switch');
    });
    it('forwards ref correctly', () => {
      const ref = vi.fn();
      render(<Switch ref={ref} />);
      expect(ref).toHaveBeenCalled();
    });
    it('supports required attribute', () => {
      render(<Switch required aria-label="Required switch" />);
      const switchElement = screen.getByLabelText('Required switch');
      expect(switchElement).toHaveAttribute('aria-required', 'true');
    });
    it('shows transition animation on state change', async () => {
      const { container } = render(<Switch />);
      const thumb = container.querySelector('[class*="transition-transform"]');
      expect(thumb).toBeInTheDocument();
    });
    it('handles data attributes', () => {
      render(<Switch data-testid="test-switch" />);
      expect(screen.getByTestId('test-switch')).toBeInTheDocument();
    });
    it('applies correct cursor styling', () => {
      const { container } = render(<Switch />);
      const switchElement = container.firstChild;
      expect(switchElement.className).toContain('cursor-pointer');
    });
    it('applies disabled cursor styling when disabled', () => {
      const { container } = render(<Switch disabled />);
      const switchElement = container.firstChild;
      expect(switchElement.className).toContain('disabled:cursor-not-allowed');
    });
  });
});
//# sourceMappingURL=switch.test.js.map
