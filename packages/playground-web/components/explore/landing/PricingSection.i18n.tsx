/**
 * TAG: TAG-STUDIO-001-E006 (Pricing Display)
 * TAG: TAG-STUDIO-001-U003 (Internationalization Support)
 *
 * Pricing section with all pricing tiers and i18n support
 */

'use client';

import { useTranslations } from 'next-intl';
import { PricingCardI18n, PricingTier } from './PricingCard.i18n';

const PRICING_TIERS = [
  { tier: 'Free' as const, price: 0 },
  { tier: 'Developer' as const, price: 39, featured: true },
  { tier: 'Team' as const, price: 149 },
];

export interface PricingSectionI18nProps {
  ownedLicenses?: PricingTier[];
  onPurchase?: (tier: PricingTier) => void;
  onManage?: () => void;
}

export function PricingSectionI18n({
  ownedLicenses = [],
  onPurchase,
  onManage,
}: PricingSectionI18nProps) {
  const t = useTranslations('studio.landing.pricing');

  return (
    <section id="pricing" className="py-16 px-6 bg-white">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-3xl font-bold uppercase tracking-wider text-neutral-900 text-center mb-12">
          {t('title')}
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {PRICING_TIERS.map((tier) => (
            <PricingCardI18n
              key={tier.tier}
              tier={tier.tier}
              price={tier.price}
              featured={tier.featured}
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
