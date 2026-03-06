/**
 * @framingui - Tabs Component Tests
 * [SPEC-COMPONENT-001-C]
 */

import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { axe } from 'vitest-axe';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '../../src/components/tabs';

describe('Tabs', () => {
  describe('Rendering', () => {
    it('renders successfully', () => {
      render(
        <Tabs defaultValue="tab1" data-testid="tabs">
          <TabsList>
            <TabsTrigger value="tab1">Tab 1</TabsTrigger>
            <TabsTrigger value="tab2">Tab 2</TabsTrigger>
          </TabsList>
          <TabsContent value="tab1">Content 1</TabsContent>
          <TabsContent value="tab2">Content 2</TabsContent>
        </Tabs>
      );
      expect(screen.getByTestId('tabs')).toBeInTheDocument();
    });

    it('renders all tab triggers', () => {
      render(
        <Tabs defaultValue="tab1">
          <TabsList>
            <TabsTrigger value="tab1">First Tab</TabsTrigger>
            <TabsTrigger value="tab2">Second Tab</TabsTrigger>
            <TabsTrigger value="tab3">Third Tab</TabsTrigger>
          </TabsList>
          <TabsContent value="tab1">Content 1</TabsContent>
          <TabsContent value="tab2">Content 2</TabsContent>
          <TabsContent value="tab3">Content 3</TabsContent>
        </Tabs>
      );

      expect(screen.getByRole('tab', { name: 'First Tab' })).toBeInTheDocument();
      expect(screen.getByRole('tab', { name: 'Second Tab' })).toBeInTheDocument();
      expect(screen.getByRole('tab', { name: 'Third Tab' })).toBeInTheDocument();
    });

    it('displays default tab content', () => {
      render(
        <Tabs defaultValue="tab1">
          <TabsList>
            <TabsTrigger value="tab1">Tab 1</TabsTrigger>
            <TabsTrigger value="tab2">Tab 2</TabsTrigger>
          </TabsList>
          <TabsContent value="tab1">First Content</TabsContent>
          <TabsContent value="tab2">Second Content</TabsContent>
        </Tabs>
      );

      expect(screen.getByText('First Content')).toBeInTheDocument();
      expect(screen.queryByText('Second Content')).not.toBeInTheDocument();
    });
  });

  describe('Tab Switching', () => {
    it('switches content when tab is clicked', async () => {
      const user = userEvent.setup();
      render(
        <Tabs defaultValue="tab1">
          <TabsList>
            <TabsTrigger value="tab1">Tab 1</TabsTrigger>
            <TabsTrigger value="tab2">Tab 2</TabsTrigger>
          </TabsList>
          <TabsContent value="tab1">Content 1</TabsContent>
          <TabsContent value="tab2">Content 2</TabsContent>
        </Tabs>
      );

      expect(screen.getByText('Content 1')).toBeInTheDocument();
      expect(screen.queryByText('Content 2')).not.toBeInTheDocument();

      await user.click(screen.getByRole('tab', { name: 'Tab 2' }));

      expect(screen.queryByText('Content 1')).not.toBeInTheDocument();
      expect(screen.getByText('Content 2')).toBeInTheDocument();
    });

    it('updates active state on tab triggers', async () => {
      const user = userEvent.setup();
      render(
        <Tabs defaultValue="tab1">
          <TabsList>
            <TabsTrigger value="tab1">Tab 1</TabsTrigger>
            <TabsTrigger value="tab2">Tab 2</TabsTrigger>
          </TabsList>
          <TabsContent value="tab1">Content 1</TabsContent>
          <TabsContent value="tab2">Content 2</TabsContent>
        </Tabs>
      );

      const tab1 = screen.getByRole('tab', { name: 'Tab 1' });
      const tab2 = screen.getByRole('tab', { name: 'Tab 2' });

      expect(tab1).toHaveAttribute('data-state', 'active');
      expect(tab2).toHaveAttribute('data-state', 'inactive');

      await user.click(tab2);

      expect(tab1).toHaveAttribute('data-state', 'inactive');
      expect(tab2).toHaveAttribute('data-state', 'active');
    });
  });

  describe('Controlled Tabs', () => {
    it('accepts controlled value prop', () => {
      const { rerender } = render(
        <Tabs value="tab1">
          <TabsList>
            <TabsTrigger value="tab1">Tab 1</TabsTrigger>
            <TabsTrigger value="tab2">Tab 2</TabsTrigger>
          </TabsList>
          <TabsContent value="tab1">Content 1</TabsContent>
          <TabsContent value="tab2">Content 2</TabsContent>
        </Tabs>
      );

      expect(screen.getByText('Content 1')).toBeInTheDocument();
      expect(screen.queryByText('Content 2')).not.toBeInTheDocument();

      rerender(
        <Tabs value="tab2">
          <TabsList>
            <TabsTrigger value="tab1">Tab 1</TabsTrigger>
            <TabsTrigger value="tab2">Tab 2</TabsTrigger>
          </TabsList>
          <TabsContent value="tab1">Content 1</TabsContent>
          <TabsContent value="tab2">Content 2</TabsContent>
        </Tabs>
      );

      expect(screen.queryByText('Content 1')).not.toBeInTheDocument();
      expect(screen.getByText('Content 2')).toBeInTheDocument();
    });
  });

  describe('CSS Variables', () => {
    it('uses CSS Variables for theming', () => {
      render(
        <Tabs defaultValue="tab1">
          <TabsList data-testid="list">
            <TabsTrigger value="tab1" data-testid="trigger">
              Tab 1
            </TabsTrigger>
          </TabsList>
          <TabsContent value="tab1" data-testid="content">
            Content
          </TabsContent>
        </Tabs>
      );

      expect(screen.getByTestId('list')).toHaveClass('bg-[var(--bg-muted)]');
      expect(screen.getByTestId('list')).toHaveClass('text-[var(--bg-muted-foreground)]');
    });
  });

  describe('Accessibility', () => {
    it('has no axe violations', async () => {
      const { container } = render(
        <Tabs defaultValue="account">
          <TabsList aria-label="Account settings">
            <TabsTrigger value="account">Account</TabsTrigger>
            <TabsTrigger value="password">Password</TabsTrigger>
            <TabsTrigger value="notifications">Notifications</TabsTrigger>
          </TabsList>
          <TabsContent value="account">
            <h2>Account Settings</h2>
            <p>Manage your account settings</p>
          </TabsContent>
          <TabsContent value="password">
            <h2>Password</h2>
            <p>Change your password</p>
          </TabsContent>
          <TabsContent value="notifications">
            <h2>Notifications</h2>
            <p>Manage your notifications</p>
          </TabsContent>
        </Tabs>
      );
      const results = await axe(container);
      expect(results.violations).toHaveLength(0);
    });

    it('has role="tablist" on TabsList', () => {
      render(
        <Tabs defaultValue="tab1">
          <TabsList data-testid="tablist">
            <TabsTrigger value="tab1">Tab 1</TabsTrigger>
          </TabsList>
          <TabsContent value="tab1">Content</TabsContent>
        </Tabs>
      );
      expect(screen.getByTestId('tablist')).toHaveAttribute('role', 'tablist');
    });

    it('has role="tab" on TabsTrigger', () => {
      render(
        <Tabs defaultValue="tab1">
          <TabsList>
            <TabsTrigger value="tab1">Tab 1</TabsTrigger>
          </TabsList>
          <TabsContent value="tab1">Content</TabsContent>
        </Tabs>
      );
      expect(screen.getByRole('tab', { name: 'Tab 1' })).toBeInTheDocument();
    });

    it('supports keyboard navigation (Arrow keys)', async () => {
      const user = userEvent.setup();
      render(
        <Tabs defaultValue="tab1">
          <TabsList>
            <TabsTrigger value="tab1">Tab 1</TabsTrigger>
            <TabsTrigger value="tab2">Tab 2</TabsTrigger>
            <TabsTrigger value="tab3">Tab 3</TabsTrigger>
          </TabsList>
          <TabsContent value="tab1">Content 1</TabsContent>
          <TabsContent value="tab2">Content 2</TabsContent>
          <TabsContent value="tab3">Content 3</TabsContent>
        </Tabs>
      );

      const tab1 = screen.getByRole('tab', { name: 'Tab 1' });
      tab1.focus();

      await user.keyboard('{ArrowRight}');
      expect(screen.getByRole('tab', { name: 'Tab 2' })).toHaveFocus();

      await user.keyboard('{ArrowRight}');
      expect(screen.getByRole('tab', { name: 'Tab 3' })).toHaveFocus();

      await user.keyboard('{ArrowLeft}');
      expect(screen.getByRole('tab', { name: 'Tab 2' })).toHaveFocus();
    });

    it('supports disabled tabs', () => {
      render(
        <Tabs defaultValue="tab1">
          <TabsList>
            <TabsTrigger value="tab1">Tab 1</TabsTrigger>
            <TabsTrigger value="tab2" disabled>
              Tab 2 (Disabled)
            </TabsTrigger>
          </TabsList>
          <TabsContent value="tab1">Content 1</TabsContent>
          <TabsContent value="tab2">Content 2</TabsContent>
        </Tabs>
      );

      expect(screen.getByRole('tab', { name: 'Tab 2 (Disabled)' })).toBeDisabled();
    });
  });
});
