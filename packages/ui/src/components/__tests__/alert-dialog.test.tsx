/**
 * @framingui/ui - AlertDialog Component Tests
 */

import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect } from 'vitest';
import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogAction,
  AlertDialogCancel,
} from '../alert-dialog';
import { Button } from '../button';

describe('AlertDialog', () => {
  const renderAlertDialog = () =>
    render(
      <AlertDialog>
        <AlertDialogTrigger asChild>
          <Button>Delete</Button>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>This action cannot be undone.</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction>Confirm</AlertDialogAction>
        </AlertDialogContent>
      </AlertDialog>
    );

  describe('Rendering', () => {
    it('renders trigger', () => {
      renderAlertDialog();
      expect(screen.getByRole('button', { name: 'Delete' })).toBeInTheDocument();
    });

    it('opens on trigger click', async () => {
      renderAlertDialog();
      await userEvent.click(screen.getByRole('button', { name: 'Delete' }));
      await waitFor(() => {
        expect(screen.getByText('Are you sure?')).toBeInTheDocument();
      });
    });
  });

  describe('Interaction', () => {
    it('closes on cancel', async () => {
      renderAlertDialog();
      await userEvent.click(screen.getByRole('button', { name: 'Delete' }));
      await waitFor(() => expect(screen.getByText('Cancel')).toBeInTheDocument());

      await userEvent.click(screen.getByRole('button', { name: 'Cancel' }));
      await waitFor(() => expect(screen.queryByText('Are you sure?')).not.toBeInTheDocument());
    });

    it('closes on confirm', async () => {
      renderAlertDialog();
      await userEvent.click(screen.getByRole('button', { name: 'Delete' }));
      await waitFor(() => expect(screen.getByText('Confirm')).toBeInTheDocument());

      await userEvent.click(screen.getByRole('button', { name: 'Confirm' }));
      await waitFor(() => expect(screen.queryByText('Are you sure?')).not.toBeInTheDocument());
    });
  });

  describe('Structure', () => {
    it('renders all sub-components', async () => {
      renderAlertDialog();
      await userEvent.click(screen.getByRole('button', { name: 'Delete' }));
      await waitFor(() => {
        expect(screen.getByText('Are you sure?')).toBeInTheDocument();
        expect(screen.getByText('This action cannot be undone.')).toBeInTheDocument();
        expect(screen.getByText('Cancel')).toBeInTheDocument();
        expect(screen.getByText('Confirm')).toBeInTheDocument();
      });
    });
  });

  describe('Accessibility', () => {
    it('has alertdialog role', async () => {
      renderAlertDialog();
      await userEvent.click(screen.getByRole('button', { name: 'Delete' }));
      await waitFor(() => {
        expect(screen.getByRole('alertdialog')).toBeInTheDocument();
      });
    });
  });

  describe('Token Compliance', () => {
    it('uses Tekton tokens', async () => {
      renderAlertDialog();
      await userEvent.click(screen.getByRole('button', { name: 'Delete' }));
      await waitFor(() => {
        const dialog = screen.getByRole('alertdialog');
        expect(dialog.className).toMatch(/var\(--/);
      });
    });
  });
});
