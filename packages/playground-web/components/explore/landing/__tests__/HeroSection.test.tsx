/**
 * HeroSection Component Tests
 * SPEC-STUDIO-001: TAG-STUDIO-001-E003
 *
 * Tests for hero section with title, subtitle, and CTA buttons
 */

import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { HeroSection } from '../HeroSection';

describe('HeroSection', () => {
  const defaultProps = {
    title: 'Test Template',
    subtitle: 'A modern design system',
  };

  describe('Content Rendering', () => {
    it('should render title', () => {
      render(<HeroSection {...defaultProps} />);
      expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('Test Template');
    });

    it('should render subtitle', () => {
      render(<HeroSection {...defaultProps} />);
      expect(screen.getByText('A modern design system')).toBeInTheDocument();
    });

    it('should render with custom className', () => {
      const { container } = render(<HeroSection {...defaultProps} className="custom-class" />);
      const section = container.firstChild;
      expect(section).toHaveClass('custom-class');
    });
  });

  describe('[TAG-STUDIO-001-E003] Open Full Demo Button', () => {
    it('should render Open Full Demo button', () => {
      render(<HeroSection {...defaultProps} />);
      const demoButton = screen.getByRole('button', { name: /open full demo/i });
      expect(demoButton).toBeInTheDocument();
    });

    it('should call onOpenDemoClick when clicked', async () => {
      const user = userEvent.setup();
      const onOpenDemoClick = vi.fn();
      render(<HeroSection {...defaultProps} onOpenDemoClick={onOpenDemoClick} />);

      const demoButton = screen.getByRole('button', { name: /open full demo/i });
      await user.click(demoButton);

      expect(onOpenDemoClick).toHaveBeenCalledOnce();
    });
  });

  describe('Pricing CTA', () => {
    it('should render View Pricing button', () => {
      render(<HeroSection {...defaultProps} />);
      const buyButton = screen.getByRole('button', { name: /view pricing/i });
      expect(buyButton).toBeInTheDocument();
    });

    it('should call onBuyClick when clicked', async () => {
      const user = userEvent.setup();
      const onBuyClick = vi.fn();
      render(<HeroSection {...defaultProps} onBuyClick={onBuyClick} />);

      const buyButton = screen.getByRole('button', { name: /view pricing/i });
      await user.click(buyButton);

      expect(onBuyClick).toHaveBeenCalledOnce();
    });
  });

  describe('Responsive Design', () => {
    it('should have responsive container styles', () => {
      const { container } = render(<HeroSection {...defaultProps} />);
      const section = container.firstChild;
      expect(section).toHaveClass('py-12', 'px-6');
    });

    it('should render with centered text layout', () => {
      const { container } = render(<HeroSection {...defaultProps} />);
      const contentDiv = container.querySelector('.text-center');
      expect(contentDiv).toBeInTheDocument();
    });
  });

  describe('Accessibility', () => {
    it('should use semantic HTML structure', () => {
      render(<HeroSection {...defaultProps} />);
      const heading = screen.getByRole('heading', { level: 1 });
      expect(heading).toBeInTheDocument();
    });

    it('should have proper heading hierarchy', () => {
      render(<HeroSection {...defaultProps} />);
      const h1 = screen.getByRole('heading', { level: 1 });
      expect(h1).toHaveTextContent('Test Template');
    });
  });
});
