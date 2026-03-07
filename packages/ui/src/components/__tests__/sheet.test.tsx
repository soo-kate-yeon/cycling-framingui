/**
 * @framingui/ui - Sheet Component Tests
 */

import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect } from 'vitest';
import {
  Sheet,
  SheetTrigger,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from '../sheet';
import { Button } from '../button';

describe('Sheet', () => {
  const renderSheet = (side: 'top' | 'bottom' | 'left' | 'right' = 'right') =>
    render(
      <Sheet>
        <SheetTrigger asChild>
          <Button>Open</Button>
        </SheetTrigger>
        <SheetContent side={side}>
          <SheetHeader>
            <SheetTitle>Sheet Title</SheetTitle>
            <SheetDescription>Sheet description</SheetDescription>
          </SheetHeader>
        </SheetContent>
      </Sheet>
    );

  describe('Rendering', () => {
    it('renders trigger', () => {
      renderSheet();
      expect(screen.getByRole('button', { name: 'Open' })).toBeInTheDocument();
    });

    it('opens on trigger click', async () => {
      renderSheet();
      await userEvent.click(screen.getByRole('button'));
      await waitFor(() => {
        expect(screen.getByText('Sheet Title')).toBeInTheDocument();
      });
    });
  });

  describe('Variants', () => {
    const sides: Array<'top' | 'bottom' | 'left' | 'right'> = ['top', 'bottom', 'left', 'right'];
    it.each(sides)('renders %s side correctly', async side => {
      renderSheet(side);
      await userEvent.click(screen.getByRole('button'));
      await waitFor(() => {
        expect(screen.getByText('Sheet Title')).toBeInTheDocument();
      });
    });
  });

  describe('Interaction', () => {
    it('closes with close button', async () => {
      renderSheet();
      await userEvent.click(screen.getByRole('button', { name: 'Open' }));
      await waitFor(() => expect(screen.getByText('Sheet Title')).toBeInTheDocument());

      const closeButton = screen.getByRole('button', { name: 'Close' });
      await userEvent.click(closeButton);
      await waitFor(() => expect(screen.queryByText('Sheet Title')).not.toBeInTheDocument());
    });
  });

  describe('Accessibility', () => {
    it('has dialog role', async () => {
      renderSheet();
      await userEvent.click(screen.getByRole('button', { name: 'Open' }));
      await waitFor(() => {
        expect(screen.getByRole('dialog')).toBeInTheDocument();
      });
    });
  });

  describe('Token Compliance', () => {
    it('uses Tekton tokens', async () => {
      renderSheet();
      await userEvent.click(screen.getByRole('button'));
      await waitFor(() => {
        const sheet = screen.getByRole('dialog');
        expect(sheet.className).toMatch(/var\(--/);
      });
    });
  });
});
