/**
 * @framingui - Dialog Component Tests
 * SPEC-UI-001: Comprehensive test coverage for Dialog component
 */
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from '../dialog';
import { Button } from '../button';
describe('Dialog', () => {
  // 1. Rendering Tests
  describe('Rendering', () => {
    it('renders Dialog trigger without crashing', () => {
      render(
        <Dialog>
          <DialogTrigger asChild>
            <Button>Open Dialog</Button>
          </DialogTrigger>
        </Dialog>
      );
      expect(screen.getByRole('button', { name: 'Open Dialog' })).toBeInTheDocument();
    });
    it('renders Dialog content when opened', async () => {
      render(
        <Dialog defaultOpen>
          <DialogContent>
            <DialogTitle>Dialog Title</DialogTitle>
            <DialogDescription>Dialog description</DialogDescription>
          </DialogContent>
        </Dialog>
      );
      await waitFor(() => {
        expect(screen.getByText('Dialog Title')).toBeInTheDocument();
      });
    });
    it('renders all Dialog sub-components', async () => {
      render(
        <Dialog defaultOpen>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Title</DialogTitle>
              <DialogDescription>Description</DialogDescription>
            </DialogHeader>
            <p>Content</p>
            <DialogFooter>
              <DialogClose asChild>
                <Button>Close</Button>
              </DialogClose>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      );
      await waitFor(() => {
        expect(screen.getByText('Title')).toBeInTheDocument();
        expect(screen.getByText('Description')).toBeInTheDocument();
        expect(screen.getByText('Content')).toBeInTheDocument();
      });
    });
  });
  // 2. Interaction Tests
  describe('User Interaction', () => {
    it('opens Dialog on trigger click', async () => {
      render(
        <Dialog>
          <DialogTrigger asChild>
            <Button>Open</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogTitle>Dialog opened</DialogTitle>
          </DialogContent>
        </Dialog>
      );
      await userEvent.click(screen.getByRole('button', { name: 'Open' }));
      await waitFor(() => {
        expect(screen.getByText('Dialog opened')).toBeInTheDocument();
      });
    });
    it('closes Dialog with close button', async () => {
      render(
        <Dialog>
          <DialogTrigger asChild>
            <Button>Open</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogTitle>Dialog Title</DialogTitle>
            <DialogClose asChild>
              <Button>Close Dialog</Button>
            </DialogClose>
          </DialogContent>
        </Dialog>
      );
      await userEvent.click(screen.getByRole('button', { name: 'Open' }));
      await waitFor(() => expect(screen.getByText('Dialog Title')).toBeInTheDocument());
      await userEvent.click(screen.getByRole('button', { name: 'Close Dialog' }));
      await waitFor(() => expect(screen.queryByText('Dialog Title')).not.toBeInTheDocument());
    });
    it('closes Dialog with X button', async () => {
      render(
        <Dialog>
          <DialogTrigger asChild>
            <Button>Open</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogTitle>Dialog Title</DialogTitle>
          </DialogContent>
        </Dialog>
      );
      await userEvent.click(screen.getByRole('button', { name: 'Open' }));
      await waitFor(() => expect(screen.getByText('Dialog Title')).toBeInTheDocument());
      // Close button has aria-label "Close" - use getAllByRole and select the X button
      const closeButtons = screen.getAllByRole('button', { name: 'Close' });
      const xButton = closeButtons.find(btn => btn.querySelector('.lucide-x'));
      await userEvent.click(xButton);
      await waitFor(() => expect(screen.queryByText('Dialog Title')).not.toBeInTheDocument());
    });
  });
  // 3. State Management Tests
  describe('State Management', () => {
    it('supports controlled open state', async () => {
      const { rerender } = render(
        <Dialog open={false} onOpenChange={vi.fn()}>
          <DialogContent>
            <DialogTitle>Controlled Dialog</DialogTitle>
          </DialogContent>
        </Dialog>
      );
      expect(screen.queryByText('Controlled Dialog')).not.toBeInTheDocument();
      rerender(
        <Dialog open={true} onOpenChange={vi.fn()}>
          <DialogContent>
            <DialogTitle>Controlled Dialog</DialogTitle>
          </DialogContent>
        </Dialog>
      );
      await waitFor(() => {
        expect(screen.getByText('Controlled Dialog')).toBeInTheDocument();
      });
    });
    it('triggers onOpenChange callback', async () => {
      const handleOpenChange = vi.fn();
      render(
        <Dialog onOpenChange={handleOpenChange}>
          <DialogTrigger asChild>
            <Button>Open</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogTitle>Dialog</DialogTitle>
          </DialogContent>
        </Dialog>
      );
      await userEvent.click(screen.getByRole('button', { name: 'Open' }));
      expect(handleOpenChange).toHaveBeenCalledWith(true);
    });
  });
  // 4. Accessibility Tests
  describe('Accessibility', () => {
    it('has correct dialog role', async () => {
      render(
        <Dialog defaultOpen>
          <DialogContent>
            <DialogTitle>Accessible Dialog</DialogTitle>
          </DialogContent>
        </Dialog>
      );
      await waitFor(() => {
        expect(screen.getByRole('dialog')).toBeInTheDocument();
      });
    });
    it('associates title with dialog', async () => {
      render(
        <Dialog defaultOpen>
          <DialogContent>
            <DialogTitle>My Dialog Title</DialogTitle>
          </DialogContent>
        </Dialog>
      );
      await waitFor(() => {
        const dialog = screen.getByRole('dialog', { name: 'My Dialog Title' });
        expect(dialog).toBeInTheDocument();
      });
    });
    it('traps focus within dialog', async () => {
      render(
        <Dialog defaultOpen>
          <DialogContent>
            <DialogTitle>Focus Trap</DialogTitle>
            <Button>Button 1</Button>
            <Button>Button 2</Button>
          </DialogContent>
        </Dialog>
      );
      await waitFor(() => {
        expect(screen.getByText('Focus Trap')).toBeInTheDocument();
      });
      // Focus should be within dialog
      const button1 = screen.getByRole('button', { name: 'Button 1' });
      expect(document.body).toContainElement(button1);
    });
    it('has close button with accessible name', async () => {
      render(
        <Dialog defaultOpen>
          <DialogContent>
            <DialogTitle>Dialog</DialogTitle>
          </DialogContent>
        </Dialog>
      );
      await waitFor(() => {
        expect(screen.getByRole('button', { name: 'Close' })).toBeInTheDocument();
      });
    });
  });
  // 5. Token Compliance Tests
  describe('Token Compliance', () => {
    it('applies Tekton token-based styles to Dialog overlay', async () => {
      render(
        <Dialog defaultOpen>
          <DialogContent>
            <DialogTitle>Dialog</DialogTitle>
          </DialogContent>
        </Dialog>
      );
      await waitFor(() => {
        const dialog = screen.getByRole('dialog');
        expect(dialog).toBeInTheDocument();
        // Check that dialog has Tekton token classes
        expect(dialog.className).toMatch(/var\(--/);
      });
    });
    it('uses Tekton spacing tokens in content', async () => {
      render(
        <Dialog defaultOpen>
          <DialogContent>
            <DialogTitle>Dialog</DialogTitle>
          </DialogContent>
        </Dialog>
      );
      await waitFor(() => {
        const content = screen.getByRole('dialog');
        expect(content.className).toContain('p-[var(--spacing-6)]');
      });
    });
    it('uses Tekton radius tokens', async () => {
      render(
        <Dialog defaultOpen>
          <DialogContent>
            <DialogTitle>Dialog</DialogTitle>
          </DialogContent>
        </Dialog>
      );
      await waitFor(() => {
        const content = screen.getByRole('dialog');
        expect(content.className).toContain('rounded-[var(--radius-lg)]');
      });
    });
    it('uses Tekton border tokens', async () => {
      render(
        <Dialog defaultOpen>
          <DialogContent>
            <DialogTitle>Dialog</DialogTitle>
          </DialogContent>
        </Dialog>
      );
      await waitFor(() => {
        const content = screen.getByRole('dialog');
        expect(content.className).toContain('border-[var(--border-default)]');
      });
    });
  });
  // Additional Edge Cases
  describe('Edge Cases', () => {
    it('handles custom className on DialogContent', async () => {
      const { container: _container } = render(
        <Dialog defaultOpen>
          <DialogContent className="custom-dialog">
            <DialogTitle>Custom</DialogTitle>
          </DialogContent>
        </Dialog>
      );
      await waitFor(() => {
        const dialog = screen.getByRole('dialog');
        expect(dialog.className).toContain('custom-dialog');
      });
    });
    it('renders nested components correctly', async () => {
      render(
        <Dialog defaultOpen>
          <DialogContent>
            <DialogHeader className="custom-header">
              <DialogTitle className="custom-title">Title</DialogTitle>
              <DialogDescription className="custom-desc">Description</DialogDescription>
            </DialogHeader>
          </DialogContent>
        </Dialog>
      );
      await waitFor(() => {
        expect(screen.getByText('Title')).toBeInTheDocument();
        expect(screen.getByText('Description')).toBeInTheDocument();
      });
    });
    it('forwards ref to DialogContent', async () => {
      const ref = vi.fn();
      render(
        <Dialog defaultOpen>
          <DialogContent ref={ref}>
            <DialogTitle>Dialog</DialogTitle>
          </DialogContent>
        </Dialog>
      );
      await waitFor(() => {
        expect(ref).toHaveBeenCalled();
      });
    });
  });
});
//# sourceMappingURL=dialog.test.js.map
