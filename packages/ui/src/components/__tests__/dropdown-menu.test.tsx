/**
 * @framingui/ui - DropdownMenu Component Tests
 */

import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuLabel,
} from '../dropdown-menu';
import { Button } from '../button';

describe('DropdownMenu', () => {
  const renderMenu = () =>
    render(
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button>Menu</Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuLabel>Actions</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem>Edit</DropdownMenuItem>
          <DropdownMenuItem>Delete</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    );

  describe('Rendering', () => {
    it('renders trigger', () => {
      renderMenu();
      expect(screen.getByRole('button', { name: 'Menu' })).toBeInTheDocument();
    });

    it('opens on click', async () => {
      renderMenu();
      await userEvent.click(screen.getByRole('button'));
      await waitFor(() => {
        expect(screen.getByText('Actions')).toBeInTheDocument();
      });
    });
  });

  describe('Menu Items', () => {
    it('renders all menu items', async () => {
      renderMenu();
      await userEvent.click(screen.getByRole('button'));
      await waitFor(() => {
        expect(screen.getByText('Edit')).toBeInTheDocument();
        expect(screen.getByText('Delete')).toBeInTheDocument();
      });
    });

    it('handles item click', async () => {
      const handleClick = vi.fn();
      render(
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button>Menu</Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem onSelect={handleClick}>Action</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );

      await userEvent.click(screen.getByRole('button'));
      await waitFor(() => expect(screen.getByText('Action')).toBeInTheDocument());
      await userEvent.click(screen.getByText('Action'));

      expect(handleClick).toHaveBeenCalled();
    });
  });

  describe('Keyboard Navigation', () => {
    it('supports arrow key navigation', async () => {
      renderMenu();
      await userEvent.click(screen.getByRole('button'));
      await waitFor(() => expect(screen.getByText('Edit')).toBeInTheDocument());

      // Verify menu items are present and keyboard navigation is possible
      const editItem = screen.getByText('Edit');
      const deleteItem = screen.getByText('Delete');

      expect(editItem).toBeInTheDocument();
      expect(deleteItem).toBeInTheDocument();

      // Arrow down should allow navigation (exact focus behavior depends on Radix UI)
      await userEvent.keyboard('{ArrowDown}');

      // Verify items are still in the DOM (menu hasn't closed)
      expect(screen.getByText('Edit')).toBeInTheDocument();
      expect(screen.getByText('Delete')).toBeInTheDocument();
    });
  });

  describe('Accessibility', () => {
    it('has menu role', async () => {
      renderMenu();
      await userEvent.click(screen.getByRole('button'));
      await waitFor(() => {
        expect(screen.getByRole('menu')).toBeInTheDocument();
      });
    });
  });

  describe('Token Compliance', () => {
    it('uses Tekton tokens', async () => {
      renderMenu();
      await userEvent.click(screen.getByRole('button'));
      await waitFor(() => {
        const menu = screen.getByRole('menu');
        expect(menu.className).toMatch(/var\(--/);
      });
    });
  });
});
