import { describe, expect, it } from 'vitest';
import {
  getLegacyTransitionAllowance,
  LEGACY_CREATOR_TRANSITION_ALLOWANCE_UNITS,
} from '@/lib/billing/legacy-transition-allowance';

describe('getLegacyTransitionAllowance', () => {
  it('returns a grandfathered allowance for active creator-all-access licenses', () => {
    const allowance = getLegacyTransitionAllowance(
      [
        {
          theme_id: 'creator-all-access',
          tier: 'creator',
          is_active: true,
          expires_at: '2026-12-31T00:00:00.000Z',
        },
      ],
      new Date('2026-03-20T00:00:00.000Z')
    );

    expect(allowance).toEqual({
      source: 'creator_all_access',
      units: LEGACY_CREATOR_TRANSITION_ALLOWANCE_UNITS,
      description:
        'Grandfathered transition allowance for legacy all-access customers while quota plans roll out.',
    });
  });

  it('returns null for inactive or expired legacy licenses', () => {
    const allowance = getLegacyTransitionAllowance(
      [
        {
          theme_id: 'creator-all-access',
          tier: 'creator',
          is_active: false,
          expires_at: '2026-02-01T00:00:00.000Z',
        },
      ],
      new Date('2026-03-20T00:00:00.000Z')
    );

    expect(allowance).toBeNull();
  });
});
