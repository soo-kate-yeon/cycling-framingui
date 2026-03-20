/**
 * PricingSection Component Tests
 * SPEC-STUDIO-001: 2 pricing tiers section
 */

import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { PricingSection } from '../PricingSection';

describe('PricingSection', () => {
  describe('Content Rendering', () => {
    it('should render section heading', () => {
      render(<PricingSection />);
      expect(screen.getByRole('heading', { name: /plans/i })).toBeInTheDocument();
    });

    it('should render the available pricing tiers', () => {
      render(<PricingSection />);
      expect(screen.getByText('Free')).toBeInTheDocument();
      expect(screen.getByText('Developer')).toBeInTheDocument();
      expect(screen.queryByText('Team')).not.toBeInTheDocument();
    });

    it('should display correct prices', () => {
      render(<PricingSection />);
      expect(screen.getByText('$0')).toBeInTheDocument();
      expect(screen.getByText('$39')).toBeInTheDocument();
      expect(screen.queryByText('$149')).not.toBeInTheDocument();
    });
  });

  describe('Responsive Layout', () => {
    it('should have responsive grid layout', () => {
      const { container } = render(<PricingSection />);
      const grid = container.querySelector('[class*="grid"]');
      expect(grid).toHaveClass('grid-cols-1', 'md:grid-cols-2');
    });

    it('should have section id for anchor navigation', () => {
      const { container } = render(<PricingSection />);
      const section = container.querySelector('#pricing');
      expect(section).toBeInTheDocument();
    });
  });
});
