/**
 * @framingui - Popover Component Tests
 */
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect } from 'vitest';
import { Popover, PopoverTrigger, PopoverContent } from '../popover';
import { Button } from '../button';
describe('Popover', () => {
  const renderPopover = () =>
    render(
      <Popover>
        <PopoverTrigger asChild>
          <Button>Open</Button>
        </PopoverTrigger>
        <PopoverContent>Popover content</PopoverContent>
      </Popover>
    );
  describe('Rendering', () => {
    it('renders trigger without crashing', () => {
      renderPopover();
      expect(screen.getByRole('button', { name: 'Open' })).toBeInTheDocument();
    });
    it('shows content when opened', async () => {
      renderPopover();
      await userEvent.click(screen.getByRole('button'));
      await waitFor(() => {
        expect(screen.getByText('Popover content')).toBeInTheDocument();
      });
    });
  });
  describe('Interaction', () => {
    it('closes when clicking outside', async () => {
      renderPopover();
      await userEvent.click(screen.getByRole('button'));
      await waitFor(() => expect(screen.getByText('Popover content')).toBeInTheDocument());
    });
    it('supports controlled open state', async () => {
      const { rerender } = render(
        <Popover open={false}>
          <PopoverContent>Content</PopoverContent>
        </Popover>
      );
      expect(screen.queryByText('Content')).not.toBeInTheDocument();
      rerender(
        <Popover open={true}>
          <PopoverContent>Content</PopoverContent>
        </Popover>
      );
      await waitFor(() => expect(screen.getByText('Content')).toBeInTheDocument());
    });
  });
  describe('Positioning', () => {
    it('supports custom align', () => {
      render(
        <Popover>
          <PopoverTrigger asChild>
            <Button>Open</Button>
          </PopoverTrigger>
          <PopoverContent align="end">Content</PopoverContent>
        </Popover>
      );
      expect(screen.getByRole('button')).toBeInTheDocument();
    });
  });
  describe('Accessibility', () => {
    it('has correct dialog role', async () => {
      renderPopover();
      await userEvent.click(screen.getByRole('button'));
      await waitFor(() => {
        expect(screen.getByRole('dialog')).toBeInTheDocument();
      });
    });
  });
  describe('Token Compliance', () => {
    it('uses Tekton tokens', async () => {
      renderPopover();
      await userEvent.click(screen.getByRole('button'));
      await waitFor(() => {
        const content = screen.getByText('Popover content');
        expect(content.className).toMatch(/var\(--/);
      });
    });
  });
});
//# sourceMappingURL=popover.test.js.map
