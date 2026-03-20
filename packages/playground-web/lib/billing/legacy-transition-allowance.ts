import type { UserLicense } from '@/lib/db/types';
import { CREATOR_ALL_ACCESS_THEME_ID } from '@/lib/access/constants';

export const LEGACY_CREATOR_TRANSITION_ALLOWANCE_UNITS = 2_000;

export interface LegacyTransitionAllowance {
  source: 'creator_all_access';
  units: number;
  description: string;
}

export function getLegacyTransitionAllowance(
  licenses: Pick<UserLicense, 'theme_id' | 'tier' | 'is_active' | 'expires_at'>[],
  now: Date = new Date()
): LegacyTransitionAllowance | null {
  const hasEligibleLegacyAllAccess = licenses.some((license) => {
    if (!license.is_active) {
      return false;
    }

    if (license.expires_at && new Date(license.expires_at) <= now) {
      return false;
    }

    return license.tier === 'creator' || license.theme_id === CREATOR_ALL_ACCESS_THEME_ID;
  });

  if (!hasEligibleLegacyAllAccess) {
    return null;
  }

  return {
    source: 'creator_all_access',
    units: LEGACY_CREATOR_TRANSITION_ALLOWANCE_UNITS,
    description:
      'Grandfathered transition allowance for legacy all-access customers while quota plans roll out.',
  };
}
