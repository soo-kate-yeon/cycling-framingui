/**
 * @framingui/ui - Input Component Tests
 * SPEC-UI-001: Comprehensive test coverage for Input component
 */

import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { axe } from 'vitest-axe';
import { describe, it, expect, vi } from 'vitest';
import { Input } from '../input';

describe('Input', () => {
  // 1. Rendering Tests
  describe('Rendering', () => {
    it('renders without crashing', () => {
      render(<Input />);
      expect(screen.getByRole('textbox')).toBeInTheDocument();
    });

    it('renders with placeholder', () => {
      render(<Input placeholder="Enter text" />);
      expect(screen.getByPlaceholderText('Enter text')).toBeInTheDocument();
    });

    it('renders with default value', () => {
      render(<Input defaultValue="Initial value" />);
      expect(screen.getByRole('textbox')).toHaveValue('Initial value');
    });
  });

  // 2. Input Types Tests
  describe('Input Types', () => {
    it('renders text type correctly', () => {
      render(<Input type="text" data-testid="text-input" />);
      const input = screen.getByRole('textbox');
      expect(input).toBeInTheDocument();
    });

    it('renders email type correctly', () => {
      render(<Input type="email" data-testid="email-input" />);
      const input = screen.getByRole('textbox');
      expect(input).toBeInTheDocument();
    });

    it('renders password type correctly', () => {
      render(<Input type="password" data-testid="password-input" />);
      const input = screen.getByTestId('password-input');
      expect(input).toBeInTheDocument();
      expect(input).toHaveAttribute('type', 'password');
    });

    it('renders number type correctly', () => {
      render(<Input type="number" data-testid="number-input" />);
      const input = screen.getByRole('spinbutton');
      expect(input).toBeInTheDocument();
      expect(input).toHaveAttribute('type', 'number');
    });

    it('renders tel type correctly', () => {
      render(<Input type="tel" data-testid="tel-input" />);
      const input = screen.getByRole('textbox');
      expect(input).toBeInTheDocument();
    });

    it('renders email input with correct type', () => {
      render(<Input type="email" data-testid="email-input" />);
      const input = screen.getByTestId('email-input');
      expect(input).toHaveAttribute('type', 'email');
    });

    it('renders password input with correct type', () => {
      render(<Input type="password" data-testid="password-input" />);
      const input = screen.getByTestId('password-input');
      expect(input).toHaveAttribute('type', 'password');
    });
  });

  // 3. User Interaction Tests
  describe('User Interaction', () => {
    it('handles text input correctly', async () => {
      render(<Input />);
      const input = screen.getByRole('textbox');

      await userEvent.type(input, 'Hello World');
      expect(input).toHaveValue('Hello World');
    });

    it('triggers onChange event', async () => {
      const handleChange = vi.fn();
      render(<Input onChange={handleChange} />);
      const input = screen.getByRole('textbox');

      await userEvent.type(input, 'Test');
      expect(handleChange).toHaveBeenCalled();
    });

    it('does not accept input when disabled', async () => {
      render(<Input disabled />);
      const input = screen.getByRole('textbox');

      expect(input).toBeDisabled();
      await userEvent.type(input, 'Should not work');
      expect(input).toHaveValue('');
    });

    it('supports focus and blur events', async () => {
      const handleFocus = vi.fn();
      const handleBlur = vi.fn();
      render(<Input onFocus={handleFocus} onBlur={handleBlur} />);
      const input = screen.getByRole('textbox');

      await userEvent.click(input);
      expect(handleFocus).toHaveBeenCalled();

      await userEvent.tab();
      expect(handleBlur).toHaveBeenCalled();
    });
  });

  // 4. Accessibility Tests
  describe('Accessibility', () => {
    it('passes axe accessibility checks', async () => {
      const { container } = render(<Input aria-label="Test input" />);
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it('supports aria-label', () => {
      render(<Input aria-label="Username" />);
      expect(screen.getByLabelText('Username')).toBeInTheDocument();
    });

    it('supports aria-describedby', () => {
      render(
        <>
          <Input aria-describedby="help-text" />
          <span id="help-text">Helper text</span>
        </>
      );
      const input = screen.getByRole('textbox');
      expect(input).toHaveAttribute('aria-describedby', 'help-text');
    });

    it('indicates required state', () => {
      render(<Input required aria-label="Required input" />);
      const input = screen.getByLabelText('Required input');
      expect(input).toBeRequired();
    });
  });

  // 5. Token Compliance Tests
  describe('Token Compliance', () => {
    it('applies Tekton token-based styles', () => {
      render(<Input />);
      const input = screen.getByRole('textbox');
      expect(input.className).toMatch(/var\(--/);
    });

    it('uses Tekton spacing tokens', () => {
      render(<Input />);
      const input = screen.getByRole('textbox');
      expect(input.className).toContain('px-[var(--spacing-3)]');
    });

    it('uses Tekton radius tokens', () => {
      render(<Input />);
      const input = screen.getByRole('textbox');
      expect(input.className).toContain('rounded-[var(--radius-md)]');
    });

    it('uses Tekton border tokens', () => {
      render(<Input />);
      const input = screen.getByRole('textbox');
      expect(input.className).toContain('border-[var(--border-input)]');
    });
  });

  // Additional Edge Cases
  describe('Edge Cases', () => {
    it('handles custom className', () => {
      render(<Input className="custom-input" />);
      const input = screen.getByRole('textbox');
      expect(input.className).toContain('custom-input');
    });

    it('forwards ref correctly', () => {
      const ref = vi.fn();
      render(<Input ref={ref} />);
      expect(ref).toHaveBeenCalled();
    });

    it('handles maxLength attribute', () => {
      render(<Input maxLength={10} />);
      const input = screen.getByRole('textbox');
      expect(input).toHaveAttribute('maxLength', '10');
    });
  });
});
