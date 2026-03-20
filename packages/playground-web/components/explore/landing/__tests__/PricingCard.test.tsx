/**
 * PricingCard Component Tests
 * SPEC-STUDIO-001: TAG-STUDIO-001-S001 (License-aware UI)
 */

import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { PricingCard } from '../PricingCard';

describe('PricingCard', () => {
  const defaultProps = {
    tier: 'Free' as const,
    price: 0,
    features: ['Explore MCP tools', 'Check usage visibility'],
  };

  describe('Content Rendering', () => {
    it('should render tier name', () => {
      render(<PricingCard {...defaultProps} />);
      expect(screen.getByText('Free')).toBeInTheDocument();
    });

    it('should render price', () => {
      render(<PricingCard {...defaultProps} />);
      expect(screen.getByText('$0')).toBeInTheDocument();
    });

    it('should render all features', () => {
      render(<PricingCard {...defaultProps} />);
      expect(screen.getByText('Explore MCP tools')).toBeInTheDocument();
      expect(screen.getByText('Check usage visibility')).toBeInTheDocument();
    });
  });

  describe('[TAG-STUDIO-001-S001] License State UI', () => {
    it('should show View Plan button when no license', () => {
      render(<PricingCard {...defaultProps} hasLicense={false} />);
      expect(screen.getByRole('button', { name: /view plan/i })).toBeInTheDocument();
    });

    it('should show Manage Access button when has license', () => {
      render(<PricingCard {...defaultProps} hasLicense={true} />);
      expect(screen.getByRole('button', { name: /manage access/i })).toBeInTheDocument();
    });

    it('should call onPurchase when View Plan clicked', async () => {
      const user = userEvent.setup();
      const onPurchase = vi.fn();
      render(<PricingCard {...defaultProps} onPurchase={onPurchase} />);

      await user.click(screen.getByRole('button', { name: /view plan/i }));
      expect(onPurchase).toHaveBeenCalledWith('Free');
    });
  });

  describe('Styling', () => {
    it('should highlight featured tier', () => {
      const { container } = render(<PricingCard {...defaultProps} featured />);
      const card = container.firstChild;
      expect(card).toHaveClass('ring-2');
    });
  });
});
