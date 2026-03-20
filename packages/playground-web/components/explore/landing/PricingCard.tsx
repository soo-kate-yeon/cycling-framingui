/**
 * PricingCard Component
 * SPEC-STUDIO-001: TAG-STUDIO-001-S001 (Access-aware UI)
 */

'use client';

import { clsx } from 'clsx';
import { Check } from 'lucide-react';
import { trackPricingPurchaseClick, trackPricingManageClick } from '@/lib/analytics';

export type PricingTier = 'Free' | 'Developer' | 'Team';

export interface PricingCardProps {
  tier: PricingTier;
  price: number;
  features: string[];
  hasLicense?: boolean;
  featured?: boolean;
  onPurchase?: (tier: PricingTier) => void;
  onManage?: () => void;
}

/**
 * PricingCard - Pricing tier card with access state
 * [TAG-STUDIO-001-S001] Shows "Manage Access" when user already has entitlement
 */
export function PricingCard({
  tier,
  price,
  features,
  hasLicense = false,
  featured = false,
  onPurchase,
  onManage,
}: PricingCardProps) {
  return (
    <div
      className={clsx(
        'p-6 bg-white border rounded-lg',
        featured ? 'ring-2 ring-neutral-900 border-neutral-900' : 'border-neutral-200'
      )}
    >
      {/* Tier Name */}
      <h3 className="text-xl font-bold uppercase tracking-wider text-neutral-900 mb-2">{tier}</h3>

      {/* Price */}
      <div className="mb-6">
        <span className="text-4xl font-bold text-neutral-900">${price}</span>
        {tier !== 'Free' && <span className="text-neutral-600">/month</span>}
      </div>

      {/* Features */}
      <ul className="space-y-3 mb-6">
        {features.map((feature, index) => (
          <li key={index} className="flex items-start space-x-3">
            <Check size={20} className="text-neutral-900 flex-shrink-0 mt-0.5" />
            <span className="text-sm text-neutral-600">{feature}</span>
          </li>
        ))}
      </ul>

      {/* CTA Button [TAG-STUDIO-001-S001] */}
      {hasLicense ? (
        <button
          type="button"
          onClick={() => {
            trackPricingManageClick({ tier });
            onManage?.();
          }}
          className="w-full px-6 py-3 text-sm font-bold uppercase tracking-wider text-neutral-900 bg-neutral-100 hover:bg-neutral-200 transition-colors rounded"
        >
          Manage Access
        </button>
      ) : (
        <button
          type="button"
          onClick={() => {
            trackPricingPurchaseClick({ tier, price, is_featured: featured });
            onPurchase?.(tier);
          }}
          className={clsx(
            'w-full px-6 py-3 text-sm font-bold uppercase tracking-wider transition-colors rounded',
            featured
              ? 'text-white bg-neutral-900 hover:bg-neutral-800'
              : 'text-neutral-900 bg-neutral-100 hover:bg-neutral-200'
          )}
        >
          View Plan
        </button>
      )}
    </div>
  );
}
