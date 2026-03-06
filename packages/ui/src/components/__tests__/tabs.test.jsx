/**
 * @framingui - Tabs Component Tests
 * SPEC-UI-001: Comprehensive test coverage for Tabs component
 */
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { axe } from 'vitest-axe';
import { describe, it, expect, vi } from 'vitest';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '../tabs';
describe('Tabs', () => {
  const renderTabs = () =>
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
  // 1. Rendering Tests
  describe('Rendering', () => {
    it('renders without crashing', () => {
      renderTabs();
      expect(screen.getByText('Tab 1')).toBeInTheDocument();
    });
    it('renders all tabs', () => {
      renderTabs();
      expect(screen.getByText('Tab 1')).toBeInTheDocument();
      expect(screen.getByText('Tab 2')).toBeInTheDocument();
    });
    it('renders default active content', () => {
      renderTabs();
      expect(screen.getByText('Content 1')).toBeInTheDocument();
    });
  });
  // 2. Tab Switching Tests
  describe('Tab Switching', () => {
    it('switches tabs on click', async () => {
      renderTabs();
      await userEvent.click(screen.getByText('Tab 2'));
      expect(screen.getByText('Content 2')).toBeInTheDocument();
    });
    it('triggers onValueChange callback', async () => {
      const handleValueChange = vi.fn();
      render(
        <Tabs defaultValue="tab1" onValueChange={handleValueChange}>
          <TabsList>
            <TabsTrigger value="tab1">Tab 1</TabsTrigger>
            <TabsTrigger value="tab2">Tab 2</TabsTrigger>
          </TabsList>
        </Tabs>
      );
      await userEvent.click(screen.getByText('Tab 2'));
      expect(handleValueChange).toHaveBeenCalledWith('tab2');
    });
    it('supports controlled value', () => {
      const { rerender } = render(
        <Tabs value="tab1" onValueChange={vi.fn()}>
          <TabsList>
            <TabsTrigger value="tab1">Tab 1</TabsTrigger>
            <TabsTrigger value="tab2">Tab 2</TabsTrigger>
          </TabsList>
          <TabsContent value="tab1">Content 1</TabsContent>
          <TabsContent value="tab2">Content 2</TabsContent>
        </Tabs>
      );
      expect(screen.getByText('Content 1')).toBeInTheDocument();
      rerender(
        <Tabs value="tab2" onValueChange={vi.fn()}>
          <TabsList>
            <TabsTrigger value="tab1">Tab 1</TabsTrigger>
            <TabsTrigger value="tab2">Tab 2</TabsTrigger>
          </TabsList>
          <TabsContent value="tab1">Content 1</TabsContent>
          <TabsContent value="tab2">Content 2</TabsContent>
        </Tabs>
      );
      expect(screen.getByText('Content 2')).toBeInTheDocument();
    });
  });
  // 3. Keyboard Navigation Tests
  describe('Keyboard Navigation', () => {
    it('supports arrow key navigation', async () => {
      renderTabs();
      const tab1 = screen.getByText('Tab 1');
      tab1.focus();
      await userEvent.keyboard('{ArrowRight}');
      expect(screen.getByText('Tab 2')).toHaveFocus();
    });
    it('handles disabled tabs', () => {
      render(
        <Tabs defaultValue="tab1">
          <TabsList>
            <TabsTrigger value="tab1">Tab 1</TabsTrigger>
            <TabsTrigger value="tab2" disabled>
              Tab 2
            </TabsTrigger>
          </TabsList>
        </Tabs>
      );
      expect(screen.getByText('Tab 2')).toBeDisabled();
    });
  });
  // 4. Accessibility Tests
  describe('Accessibility', () => {
    it('passes axe accessibility checks', async () => {
      const { container } = render(
        <Tabs defaultValue="tab1">
          <TabsList aria-label="Main navigation">
            <TabsTrigger value="tab1">Tab 1</TabsTrigger>
            <TabsTrigger value="tab2">Tab 2</TabsTrigger>
          </TabsList>
          <TabsContent value="tab1">Content 1</TabsContent>
          <TabsContent value="tab2">Content 2</TabsContent>
        </Tabs>
      );
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });
    it('has correct tablist role', () => {
      renderTabs();
      expect(screen.getByRole('tablist')).toBeInTheDocument();
    });
    it('has correct tab roles', () => {
      renderTabs();
      const tabs = screen.getAllByRole('tab');
      expect(tabs).toHaveLength(2);
    });
    it('marks active tab with aria-selected', async () => {
      renderTabs();
      const tab1 = screen.getByText('Tab 1');
      expect(tab1).toHaveAttribute('aria-selected', 'true');
      await userEvent.click(screen.getByText('Tab 2'));
      const tab2 = screen.getByText('Tab 2');
      expect(tab2).toHaveAttribute('aria-selected', 'true');
    });
  });
  // 5. Token Compliance Tests
  describe('Token Compliance', () => {
    it('applies Tekton token-based styles to TabsList', () => {
      const { container } = renderTabs();
      const tabsList = container.querySelector('[role="tablist"]');
      expect(tabsList?.className).toContain('bg-[var(--bg-muted)]');
    });
    it('uses Tekton spacing tokens in TabsTrigger', () => {
      renderTabs();
      const tab = screen.getByText('Tab 1');
      expect(tab.className).toContain('px-[var(--spacing-3)]');
    });
    it('uses Tekton radius tokens', () => {
      const { container } = renderTabs();
      const tabsList = container.querySelector('[role="tablist"]');
      expect(tabsList?.className).toContain('rounded-[var(--radius-xl)]');
    });
    it('uses Tekton color tokens for active state', () => {
      renderTabs();
      const activeTab = screen.getByText('Tab 1');
      expect(activeTab.className).toContain('data-[state=active]:bg-[var(--bg-background)]');
    });
  });
});
//# sourceMappingURL=tabs.test.js.map
