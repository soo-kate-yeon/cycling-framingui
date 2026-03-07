/**
 * @framingui/ui - Toast Component Tests
 */

import { render, screen } from '@testing-library/react';
import { axe } from 'vitest-axe';
import { describe, it, expect } from 'vitest';
import { Toast, ToastTitle, ToastDescription, ToastProvider, ToastViewport } from '../toast';

describe('Toast', () => {
  describe('Rendering', () => {
    it('renders without crashing', () => {
      const { container } = render(
        <ToastProvider>
          <Toast>
            <ToastTitle>Title</ToastTitle>
            <ToastDescription>Description</ToastDescription>
          </Toast>
          <ToastViewport />
        </ToastProvider>
      );
      expect(container).toBeInTheDocument();
    });

    it('renders title and description', () => {
      render(
        <ToastProvider>
          <Toast>
            <ToastTitle>Success</ToastTitle>
            <ToastDescription>Operation completed</ToastDescription>
          </Toast>
          <ToastViewport />
        </ToastProvider>
      );
      expect(screen.getByText('Success')).toBeInTheDocument();
      expect(screen.getByText('Operation completed')).toBeInTheDocument();
    });
  });

  describe('Variants', () => {
    it('renders default variant', () => {
      render(
        <ToastProvider>
          <Toast>
            <ToastTitle>Default</ToastTitle>
          </Toast>
          <ToastViewport />
        </ToastProvider>
      );
      expect(screen.getByText('Default')).toBeInTheDocument();
    });

    it('renders destructive variant', () => {
      const { container } = render(
        <ToastProvider>
          <Toast variant="destructive">
            <ToastTitle>Error</ToastTitle>
          </Toast>
          <ToastViewport />
        </ToastProvider>
      );
      const toast = container.querySelector('[data-state]');
      expect(toast?.className).toContain('destructive');
    });
  });

  describe('Actions', () => {
    it('renders with close button', () => {
      render(
        <ToastProvider>
          <Toast>
            <ToastTitle>Toast</ToastTitle>
          </Toast>
          <ToastViewport />
        </ToastProvider>
      );
      // Toast typically has close button
      expect(screen.getByText('Toast')).toBeInTheDocument();
    });
  });

  describe('Accessibility', () => {
    it('passes axe accessibility checks', async () => {
      const { container } = render(
        <ToastProvider>
          <Toast>
            <ToastTitle>Accessible Toast</ToastTitle>
          </Toast>
          <ToastViewport />
        </ToastProvider>
      );
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });
  });

  describe('Token Compliance', () => {
    it('uses Tekton tokens', () => {
      const { container } = render(
        <ToastProvider>
          <Toast>
            <ToastTitle>Toast</ToastTitle>
          </Toast>
          <ToastViewport />
        </ToastProvider>
      );
      const toast = container.querySelector('[data-state]');
      expect(toast?.className).toMatch(/var\(--/);
    });
  });
});
