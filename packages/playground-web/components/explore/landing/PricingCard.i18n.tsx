/**
 * TAG: TAG-STUDIO-001-E006 (Pricing Display)
 * TAG: TAG-STUDIO-001-S001 (License Management)
 * TAG: TAG-STUDIO-001-U003 (Internationalization Support)
 *
 * Pricing card component with license awareness and i18n support
 */

'use client';

import { useTranslations } from 'next-intl';
import { Check } from 'lucide-react';
import clsx from 'clsx';

export type PricingTier = 'Free' | 'Developer' | 'Team';

export interface PricingCardI18nProps {
  tier: PricingTier;
  price: number;
  hasLicense?: boolean;
  featured?: boolean;
  onPurchase?: (tier: PricingTier) => void;
  onManage?: () => void;
}

export function PricingCardI18n({
  tier,
  price,
  hasLicense = false,
  featured = false,
  onPurchase,
  onManage,
}: PricingCardI18nProps) {
  const t = useTranslations('studio.landing.pricing');

  // Get tier-specific translations
  const tierKey = tier.toLowerCase() as 'free' | 'developer' | 'team';
  const tierName = t(`${tierKey}.tier`);
  const features = t.raw(`${tierKey}.features`) as string[];

  return (
    <div
      className={clsx(
        'p-6 bg-white border rounded-lg transition-shadow hover:shadow-lg',
        featured ? 'ring-2 ring-neutral-900' : 'border-neutral-200'
      )}
    >
      <h3 className="text-2xl font-bold uppercase tracking-wider text-neutral-900 mb-4">
        {tierName}
      </h3>
      <div className="mb-6">
        <span className="text-4xl font-bold text-neutral-900">${price}</span>
      </div>
      <ul className="space-y-3 mb-6">
        {features.map((feature, index) => (
          <li key={index} className="flex items-start gap-2">
            <Check size={20} className="text-neutral-900 mt-0.5 flex-shrink-0" />
            <span className="text-neutral-600">{feature}</span>
          </li>
        ))}
      </ul>
      {hasLicense ? (
        <button
          type="button"
          onClick={onManage}
          className="w-full px-4 py-3 text-sm font-bold uppercase tracking-wider text-neutral-900 bg-neutral-100 hover:bg-neutral-200 transition-colors"
        >
          {t('manageAccess')}
        </button>
      ) : (
        <button
          type="button"
          onClick={() => onPurchase?.(tier)}
          className="w-full px-4 py-3 text-sm font-bold uppercase tracking-wider text-white bg-neutral-900 hover:bg-neutral-800 transition-colors"
        >
          {t('viewPlan')}
        </button>
      )}
    </div>
  );
}
