import { createClient } from '@/lib/supabase/server';
import { getLegacyTransitionAllowance } from '@/lib/billing/legacy-transition-allowance';
import type {
  DatabaseError,
  QuotaAllocation,
  QuotaEntitlement,
  QuotaSummary,
  UserLicense,
} from './types';
import { toDatabaseError } from './error';

type QuotaAllocationRow = Pick<QuotaAllocation, 'units' | 'allocation_type' | 'created_at'>;

type UserLicenseAllowanceRow = Pick<UserLicense, 'theme_id' | 'tier' | 'is_active' | 'expires_at'>;

export async function getUserQuotaSummary(userId: string): Promise<QuotaSummary> {
  try {
    const supabase = await createClient();

    const entitlementQuery = supabase
      .from('quota_entitlements')
      .select('*')
      .eq('user_id', userId)
      .maybeSingle<QuotaEntitlement>();

    const allocationsQuery = supabase
      .from('quota_allocations')
      .select('units, allocation_type, created_at')
      .eq('user_id', userId)
      .order('created_at', { ascending: false }) as PromiseLike<{
      data: QuotaAllocationRow[] | null;
      error: { message: string; code?: string } | null;
    }>;

    const licensesQuery = supabase
      .from('user_licenses')
      .select('theme_id, tier, is_active, expires_at')
      .eq('user_id', userId) as PromiseLike<{
      data: UserLicenseAllowanceRow[] | null;
      error: { message: string; code?: string } | null;
    }>;

    const [
      { data: entitlement, error: entitlementError },
      { data: allocations, error: allocationsError },
      { data: licenses, error: licensesError },
    ] = await Promise.all([entitlementQuery, allocationsQuery, licensesQuery]);

    if (entitlementError) {
      console.error('Failed to fetch quota entitlement:', entitlementError.message);
      throw toDatabaseError(
        'Failed to fetch quota entitlement',
        entitlementError.message,
        entitlementError.code
      );
    }

    if (allocationsError) {
      console.error('Failed to fetch quota allocations:', allocationsError.message);
      throw toDatabaseError(
        'Failed to fetch quota allocations',
        allocationsError.message,
        allocationsError.code
      );
    }

    if (licensesError) {
      console.error('Failed to fetch legacy licenses for quota summary:', licensesError.message);
      throw toDatabaseError(
        'Failed to fetch legacy licenses for quota summary',
        licensesError.message,
        licensesError.code
      );
    }

    const rows = allocations ?? [];
    const legacyTransitionAllowance = getLegacyTransitionAllowance(licenses ?? []);
    const totalAllocatedUnits = rows.reduce((sum, row) => sum + row.units, 0);
    const planAllocatedUnits = rows
      .filter((row) => row.allocation_type === 'plan')
      .reduce((sum, row) => sum + row.units, 0);
    const topUpAllocatedUnits = rows
      .filter((row) => row.allocation_type === 'top_up')
      .reduce((sum, row) => sum + row.units, 0);

    return {
      entitlement: entitlement ?? null,
      total_allocated_units: totalAllocatedUnits,
      plan_allocated_units: planAllocatedUnits,
      top_up_allocated_units: topUpAllocatedUnits,
      latest_allocation_at: rows[0]?.created_at ?? null,
      legacy_transition_allowance: legacyTransitionAllowance,
    };
  } catch (error) {
    if ((error as DatabaseError).code !== undefined) {
      throw error;
    }

    console.error('Unexpected error getting quota summary:', error);
    const details = error instanceof Error ? error.message : 'Unknown error';
    throw toDatabaseError('Unexpected error getting quota summary', details);
  }
}
