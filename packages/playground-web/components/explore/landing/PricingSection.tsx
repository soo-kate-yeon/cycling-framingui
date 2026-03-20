/**
 * PricingSection Component
 * SPEC-STUDIO-001: 2 pricing tiers display
 */

'use client';

import { PricingCard } from './PricingCard';

const PRICING_TIERS = [
  {
    tier: 'Free' as const,
    price: 0,
    features: ['Explore MCP tools', 'Preview components and themes', 'Check usage visibility'],
  },
  {
    tier: 'Developer' as const,
    price: 39,
    features: ['2,000 weighted units', 'Screen generation context', 'Environment checks'],
    featured: true,
  },
];

export interface PricingSectionProps {
  /** User's active access */
  ownedLicenses?: string[];
  /** Purchase callback */
  onPurchase?: (tier: string) => void;
  /** Manage callback */
  onManage?: () => void;
}

export function PricingSection({ ownedLicenses = [], onPurchase, onManage }: PricingSectionProps) {
  return (
    <section id="pricing" className="py-16 px-6 bg-white">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-3xl font-bold uppercase tracking-wider text-neutral-900 text-center mb-12">
          Plans
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {PRICING_TIERS.map((tier) => (
            <PricingCard
              key={tier.tier}
              {...tier}
              hasLicense={ownedLicenses.includes(tier.tier)}
              onPurchase={onPurchase}
              onManage={onManage}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
