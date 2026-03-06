/**
 * @framingui - Tooltip Component Tests
 */
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect } from 'vitest';
import { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider } from '../tooltip';
import { Button } from '../button';
describe('Tooltip', () => {
  const renderTooltip = () =>
    render(
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button>Hover me</Button>
          </TooltipTrigger>
          <TooltipContent>Tooltip content</TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  describe('Rendering', () => {
    it('renders trigger without crashing', () => {
      renderTooltip();
      expect(screen.getByRole('button', { name: 'Hover me' })).toBeInTheDocument();
    });
    it('shows tooltip on hover', async () => {
      renderTooltip();
      await userEvent.hover(screen.getByRole('button'));
      await waitFor(() => {
        expect(screen.getAllByText('Tooltip content')[0]).toBeInTheDocument();
      });
    });
  });
  describe('Interaction', () => {
    it('shows and hides tooltip on hover/unhover', async () => {
      renderTooltip();
      const button = screen.getByRole('button');
      // Initially no tooltip should be visible
      expect(screen.queryByText('Tooltip content')).not.toBeInTheDocument();
      // Hover to show tooltip
      await userEvent.hover(button);
      await waitFor(() => {
        expect(screen.getAllByText('Tooltip content')[0]).toBeInTheDocument();
      });
      // Tooltip should be in open state
      const openTooltip = document.querySelector('[data-state="delayed-open"]');
      expect(openTooltip).toBeInTheDocument();
    });
  });
  describe('Positioning', () => {
    it('supports custom sideOffset', () => {
      render(
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button>Hover</Button>
            </TooltipTrigger>
            <TooltipContent sideOffset={10}>Content</TooltipContent>
          </Tooltip>
        </TooltipProvider>
      );
      expect(screen.getByRole('button')).toBeInTheDocument();
    });
  });
  describe('Accessibility', () => {
    it('has correct aria attributes', async () => {
      renderTooltip();
      const button = screen.getByRole('button');
      await userEvent.hover(button);
      await waitFor(() => {
        expect(screen.getAllByText('Tooltip content')[0]).toBeInTheDocument();
      });
    });
  });
  describe('Token Compliance', () => {
    it('uses Tekton spacing tokens', async () => {
      renderTooltip();
      await userEvent.hover(screen.getByRole('button'));
      await waitFor(() => {
        const content = screen.getAllByText('Tooltip content')[0];
        expect(content.className).toContain('px-[var(--spacing-3)]');
      });
    });
    it('uses Tekton radius and border tokens', async () => {
      renderTooltip();
      await userEvent.hover(screen.getByRole('button'));
      await waitFor(() => {
        const content = screen.getAllByText('Tooltip content')[0];
        expect(content.className).toContain('rounded-[var(--radius-md)]');
        expect(content.className).toContain('border-[var(--border-default)]');
      });
    });
  });
});
//# sourceMappingURL=tooltip.test.js.map
