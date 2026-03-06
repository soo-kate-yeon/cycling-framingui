/**
 * @framingui/ui - Dashboard Template Tests
 * SPEC-UI-001 Phase 3: Dashboard Template Unit Tests
 */

import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { DashboardTemplate, DashboardTemplateComponent } from '../dashboard/overview';

describe('DashboardTemplate', () => {
  describe('Template Definition', () => {
    it('has correct metadata', () => {
      expect(DashboardTemplate.id).toBe('dashboard.overview');
      expect(DashboardTemplate.name).toBe('Dashboard Overview');
      expect(DashboardTemplate.category).toBe('dashboard');
    });

    it('has correct layout type', () => {
      expect(DashboardTemplate.layout.type).toBe('sidebar');
    });

    it('specifies required components', () => {
      expect(DashboardTemplate.requiredComponents).toContain('Card');
      expect(DashboardTemplate.requiredComponents).toContain('Separator');
    });

    it('defines customizable texts', () => {
      expect(DashboardTemplate.customizable.texts).toContain('title');
      expect(DashboardTemplate.customizable.texts).toContain('subtitle');
      expect(DashboardTemplate.customizable.texts).toContain('texts.secondary_title');
      expect(DashboardTemplate.customizable.texts).toContain('texts.secondary_description');
    });

    it('defines optional features', () => {
      expect(DashboardTemplate.customizable.optional).toContain('metrics');
      expect(DashboardTemplate.customizable.optional).toContain('additionalSections');
    });

    it('defines customizable slots', () => {
      expect(DashboardTemplate.customizable.slots).toContain('sidebar');
      expect(DashboardTemplate.customizable.slots).toContain('headerActions');
      expect(DashboardTemplate.customizable.slots).toContain('metrics');
      expect(DashboardTemplate.customizable.slots).toContain('primaryContent');
      expect(DashboardTemplate.customizable.slots).toContain('secondaryContent');
    });
  });

  describe('Component Rendering', () => {
    it('renders without crashing', () => {
      const { container } = render(<DashboardTemplateComponent />);
      expect(container.firstChild).toBeInTheDocument();
    });

    it('renders with default texts', () => {
      render(<DashboardTemplateComponent />);
      expect(screen.getByText('Dashboard')).toBeInTheDocument();
      expect(screen.getByText('Welcome to your dashboard')).toBeInTheDocument();
    });

    it('renders with custom texts', () => {
      render(
        <DashboardTemplateComponent
          texts={{
            title: 'Custom Dashboard',
            subtitle: 'Custom subtitle',
          }}
        />
      );

      expect(screen.getByText('Custom Dashboard')).toBeInTheDocument();
      expect(screen.getByText('Custom subtitle')).toBeInTheDocument();
    });

    it('renders sidebar when provided', () => {
      render(
        <DashboardTemplateComponent
          slots={{
            sidebar: <nav>Sidebar Navigation</nav>,
          }}
        />
      );

      expect(screen.getByText('Sidebar Navigation')).toBeInTheDocument();
    });

    it('renders header actions slot', () => {
      render(
        <DashboardTemplateComponent
          slots={{
            headerActions: <button>Action</button>,
          }}
        />
      );

      expect(screen.getByRole('button', { name: 'Action' })).toBeInTheDocument();
    });

    it('renders metrics slot', () => {
      render(
        <DashboardTemplateComponent
          slots={{
            metrics: (
              <>
                <div>Metric 1</div>
                <div>Metric 2</div>
              </>
            ),
          }}
        />
      );

      expect(screen.getByText('Metric 1')).toBeInTheDocument();
      expect(screen.getByText('Metric 2')).toBeInTheDocument();
    });

    it('renders primary content section', () => {
      render(
        <DashboardTemplateComponent
          slots={{
            primaryContent: <div>Primary Content</div>,
          }}
        />
      );

      // Primary content is rendered directly without Card wrapper
      expect(screen.getByText('Primary Content')).toBeInTheDocument();
    });

    it('renders secondary content section', () => {
      render(
        <DashboardTemplateComponent
          slots={{
            secondaryContent: <div>Secondary Content</div>,
          }}
          texts={{
            secondary_title: 'Side Section',
            secondary_description: 'Side description',
          }}
        />
      );

      expect(screen.getByText('Side Section')).toBeInTheDocument();
      expect(screen.getByText('Side description')).toBeInTheDocument();
      expect(screen.getByText('Secondary Content')).toBeInTheDocument();
    });

    it('renders additional sections slot', () => {
      render(
        <DashboardTemplateComponent
          slots={{
            additionalSections: <div>Additional Section</div>,
          }}
        />
      );

      expect(screen.getByText('Additional Section')).toBeInTheDocument();
    });

    it('uses default texts for primary section when not provided', () => {
      render(
        <DashboardTemplateComponent
          slots={{
            primaryContent: <div>Content</div>,
          }}
        />
      );

      // Primary content is rendered directly without Card wrapper (no title/description)
      expect(screen.getByText('Content')).toBeInTheDocument();
    });

    it('uses default texts for secondary section when not provided', () => {
      render(
        <DashboardTemplateComponent
          slots={{
            secondaryContent: <div>Content</div>,
          }}
        />
      );

      expect(screen.getByText('Activity')).toBeInTheDocument();
      expect(screen.getByText('Recent updates')).toBeInTheDocument();
    });
  });

  describe('Layout Structure', () => {
    it('has sidebar and main content structure', () => {
      const { container } = render(
        <DashboardTemplateComponent
          slots={{
            sidebar: <nav>Nav</nav>,
          }}
        />
      );

      const aside = container.querySelector('aside');
      const main = container.querySelector('main');

      expect(aside).toBeInTheDocument();
      expect(main).toBeInTheDocument();
    });

    it('has sticky header', () => {
      const { container } = render(<DashboardTemplateComponent />);
      const header = container.querySelector('header');

      expect(header).toBeInTheDocument();
      expect(header?.className).toMatch(/sticky/);
    });
  });

  describe('Token Usage', () => {
    it('uses Tekton spacing tokens', () => {
      const { container } = render(<DashboardTemplateComponent />);
      const html = container.innerHTML;
      expect(html).toMatch(/var\(--spacing-/);
    });

    it('uses Tekton border tokens', () => {
      const { container } = render(<DashboardTemplateComponent />);
      const html = container.innerHTML;
      expect(html).toMatch(/var\(--border-/);
    });

    it('uses Tekton background tokens', () => {
      const { container } = render(<DashboardTemplateComponent />);
      const html = container.innerHTML;
      expect(html).toMatch(/var\(--bg-/);
    });
  });
});
