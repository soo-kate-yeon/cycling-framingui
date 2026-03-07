/**
 * @framingui/ui - Select Component Tests
 */

import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { axe } from 'vitest-axe';
import { describe, it, expect, vi } from 'vitest';
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from '../select';

describe('Select', () => {
  const renderSelect = () =>
    render(
      <Select>
        <SelectTrigger aria-label="Select an option">
          <SelectValue placeholder="Select option" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="option1">Option 1</SelectItem>
          <SelectItem value="option2">Option 2</SelectItem>
        </SelectContent>
      </Select>
    );

  describe('Rendering', () => {
    it('renders without crashing', () => {
      renderSelect();
      expect(screen.getByRole('combobox')).toBeInTheDocument();
    });

    it('shows placeholder', () => {
      renderSelect();
      expect(screen.getByText('Select option')).toBeInTheDocument();
    });

    it('opens on click', async () => {
      renderSelect();
      await userEvent.click(screen.getByRole('combobox'));
      await waitFor(() => {
        expect(screen.getByText('Option 1')).toBeInTheDocument();
      });
    });
  });

  describe('Selection', () => {
    it('allows selecting an option', async () => {
      renderSelect();
      await userEvent.click(screen.getByRole('combobox'));
      await waitFor(() => expect(screen.getByText('Option 1')).toBeInTheDocument());

      await userEvent.click(screen.getByText('Option 1'));
      await waitFor(() => {
        expect(screen.getByRole('combobox')).toHaveTextContent('Option 1');
      });
    });

    it('triggers onValueChange', async () => {
      const handleChange = vi.fn();
      render(
        <Select onValueChange={handleChange}>
          <SelectTrigger>
            <SelectValue placeholder="Select" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="test">Test</SelectItem>
          </SelectContent>
        </Select>
      );

      await userEvent.click(screen.getByRole('combobox'));
      await waitFor(() => expect(screen.getByText('Test')).toBeInTheDocument());
      await userEvent.click(screen.getByText('Test'));

      expect(handleChange).toHaveBeenCalledWith('test');
    });
  });

  describe('States', () => {
    it('handles disabled state', () => {
      render(
        <Select disabled>
          <SelectTrigger>
            <SelectValue placeholder="Disabled" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="test">Test</SelectItem>
          </SelectContent>
        </Select>
      );

      expect(screen.getByRole('combobox')).toBeDisabled();
    });
  });

  describe('Accessibility', () => {
    it('passes axe accessibility checks', async () => {
      const { container } = renderSelect();
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });
  });

  describe('Token Compliance', () => {
    it('uses Tekton tokens', () => {
      renderSelect();
      const trigger = screen.getByRole('combobox');
      expect(trigger.className).toMatch(/var\(--/);
    });
  });
});
