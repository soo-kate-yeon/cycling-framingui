/**
 * @framingui - Textarea Component Tests
 * SPEC-UI-001: Comprehensive test coverage for Textarea component
 */
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { axe } from 'vitest-axe';
import { describe, it, expect, vi } from 'vitest';
import { Textarea } from '../textarea';
describe('Textarea', () => {
  // 1. Rendering Tests
  describe('Rendering', () => {
    it('renders without crashing', () => {
      render(<Textarea />);
      expect(screen.getByRole('textbox')).toBeInTheDocument();
    });
    it('renders with placeholder', () => {
      render(<Textarea placeholder="Enter description" />);
      expect(screen.getByPlaceholderText('Enter description')).toBeInTheDocument();
    });
    it('renders with default value', () => {
      render(<Textarea defaultValue="Initial text" />);
      expect(screen.getByRole('textbox')).toHaveValue('Initial text');
    });
  });
  // 2. Props Tests
  describe('Props', () => {
    it('applies custom rows', () => {
      render(<Textarea rows={10} />);
      const textarea = screen.getByRole('textbox');
      expect(textarea).toHaveAttribute('rows', '10');
    });
    it('applies custom cols', () => {
      render(<Textarea cols={50} />);
      const textarea = screen.getByRole('textbox');
      expect(textarea).toHaveAttribute('cols', '50');
    });
    it('respects disabled state', () => {
      render(<Textarea disabled />);
      expect(screen.getByRole('textbox')).toBeDisabled();
    });
    it('respects readOnly state', () => {
      render(<Textarea readOnly value="Read only text" />);
      const textarea = screen.getByRole('textbox');
      expect(textarea).toHaveAttribute('readonly');
    });
  });
  // 3. User Interaction Tests
  describe('User Interaction', () => {
    it('handles text input correctly', async () => {
      render(<Textarea />);
      const textarea = screen.getByRole('textbox');
      await userEvent.type(textarea, 'Hello\nWorld');
      expect(textarea).toHaveValue('Hello\nWorld');
    });
    it('triggers onChange event', async () => {
      const handleChange = vi.fn();
      render(<Textarea onChange={handleChange} />);
      const textarea = screen.getByRole('textbox');
      await userEvent.type(textarea, 'Test');
      expect(handleChange).toHaveBeenCalled();
    });
    it('does not accept input when disabled', async () => {
      render(<Textarea disabled />);
      const textarea = screen.getByRole('textbox');
      expect(textarea).toBeDisabled();
    });
    it('supports focus and blur events', async () => {
      const handleFocus = vi.fn();
      const handleBlur = vi.fn();
      render(<Textarea onFocus={handleFocus} onBlur={handleBlur} />);
      const textarea = screen.getByRole('textbox');
      await userEvent.click(textarea);
      expect(handleFocus).toHaveBeenCalled();
      await userEvent.tab();
      expect(handleBlur).toHaveBeenCalled();
    });
  });
  // 4. Accessibility Tests
  describe('Accessibility', () => {
    it('passes axe accessibility checks', async () => {
      const { container } = render(<Textarea aria-label="Description" />);
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });
    it('supports aria-label', () => {
      render(<Textarea aria-label="Comment" />);
      expect(screen.getByLabelText('Comment')).toBeInTheDocument();
    });
    it('supports aria-describedby', () => {
      render(
        <>
          <Textarea aria-describedby="help-text" />
          <span id="help-text">Enter your message</span>
        </>
      );
      const textarea = screen.getByRole('textbox');
      expect(textarea).toHaveAttribute('aria-describedby', 'help-text');
    });
    it('indicates required state', () => {
      render(<Textarea required aria-label="Required field" />);
      const textarea = screen.getByLabelText('Required field');
      expect(textarea).toBeRequired();
    });
  });
  // 5. Token Compliance Tests
  describe('Token Compliance', () => {
    it('applies Tekton token-based styles', () => {
      render(<Textarea />);
      const textarea = screen.getByRole('textbox');
      expect(textarea.className).toMatch(/var\(--/);
    });
    it('uses Tekton spacing tokens', () => {
      render(<Textarea />);
      const textarea = screen.getByRole('textbox');
      expect(textarea.className).toContain('px-[var(--spacing-3)]');
    });
    it('uses Tekton radius tokens', () => {
      render(<Textarea />);
      const textarea = screen.getByRole('textbox');
      expect(textarea.className).toContain('rounded-[var(--radius-md)]');
    });
    it('uses Tekton border tokens', () => {
      render(<Textarea />);
      const textarea = screen.getByRole('textbox');
      expect(textarea.className).toContain('border-[var(--border-input)]');
    });
    it('has consistent min-height', () => {
      render(<Textarea />);
      const textarea = screen.getByRole('textbox');
      expect(textarea.className).toContain('min-h-[80px]');
    });
  });
  // Additional Edge Cases
  describe('Edge Cases', () => {
    it('handles custom className', () => {
      render(<Textarea className="custom-textarea" />);
      const textarea = screen.getByRole('textbox');
      expect(textarea.className).toContain('custom-textarea');
    });
    it('forwards ref correctly', () => {
      const ref = vi.fn();
      render(<Textarea ref={ref} />);
      expect(ref).toHaveBeenCalled();
    });
    it('handles maxLength attribute', () => {
      render(<Textarea maxLength={100} />);
      const textarea = screen.getByRole('textbox');
      expect(textarea).toHaveAttribute('maxLength', '100');
    });
    it('supports multiline text', async () => {
      render(<Textarea />);
      const textarea = screen.getByRole('textbox');
      await userEvent.type(textarea, 'Line 1{Enter}Line 2{Enter}Line 3');
      expect(textarea.value).toContain('Line 1\nLine 2\nLine 3');
    });
  });
});
//# sourceMappingURL=textarea.test.js.map
