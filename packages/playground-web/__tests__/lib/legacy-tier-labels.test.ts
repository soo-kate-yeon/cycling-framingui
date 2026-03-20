import { describe, expect, it } from 'vitest';
import { formatLegacyTierLabel } from '@/lib/billing/legacy-tier-labels';

describe('legacy tier labels', () => {
  it('formats legacy billing tiers without template-era product names', () => {
    expect(formatLegacyTierLabel('single')).toBe('Legacy Single Access');
    expect(formatLegacyTierLabel('double')).toBe('Legacy Double Access');
    expect(formatLegacyTierLabel('creator')).toBe('Legacy All Access');
    expect(formatLegacyTierLabel('custom')).toBe('custom');
  });
});
