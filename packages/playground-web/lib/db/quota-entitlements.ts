import { createClient } from '@/lib/supabase/server';
import type { DatabaseError, QuotaEntitlement, UpsertQuotaEntitlementData } from './types';
import { createDatabaseError, toDatabaseError } from './error';

type UpsertSingleResult = PromiseLike<{
  data: unknown;
  error: { message: string; code?: string } | null;
}>;

type SupabaseUpsertClient = {
  from: (table: string) => {
    upsert: (
      values: Record<string, unknown>,
      options: { onConflict: string }
    ) => {
      select: () => {
        single: () => UpsertSingleResult;
      };
    };
  };
};

type SupabaseUpdateClient = {
  from: (table: string) => {
    update: (values: Record<string, unknown>) => {
      eq: (
        column: string,
        value: string
      ) => {
        select: () => {
          single: () => UpsertSingleResult;
        };
      };
    };
  };
};

export async function upsertQuotaEntitlementWithClient(
  supabase: SupabaseUpsertClient,
  entitlement: UpsertQuotaEntitlementData
): Promise<QuotaEntitlement> {
  try {
    const { data, error } = await supabase
      .from('quota_entitlements')
      .upsert(
        {
          user_id: entitlement.user_id,
          plan_id: entitlement.plan_id,
          status: entitlement.status,
          included_units: entitlement.included_units,
          current_period_start: entitlement.current_period_start ?? null,
          current_period_end: entitlement.current_period_end ?? null,
          paddle_subscription_id: entitlement.paddle_subscription_id ?? null,
        },
        { onConflict: 'user_id' }
      )
      .select()
      .single();

    if (error) {
      console.error('Failed to upsert quota entitlement:', error.message);
      throw toDatabaseError('Failed to upsert quota entitlement', error.message, error.code);
    }

    if (!data) {
      throw createDatabaseError(
        'No data returned after quota entitlement upsert',
        undefined,
        'Upsert operation succeeded but no data returned'
      );
    }

    return data as QuotaEntitlement;
  } catch (error) {
    if ((error as DatabaseError).code !== undefined) {
      throw error;
    }

    if ((error as Error).message?.startsWith('No data returned')) {
      throw error;
    }

    console.error('Unexpected error upserting quota entitlement:', error);
    const details = error instanceof Error ? error.message : 'Unknown error';
    throw toDatabaseError('Unexpected error upserting quota entitlement', details);
  }
}

export async function upsertQuotaEntitlement(
  entitlement: UpsertQuotaEntitlementData
): Promise<QuotaEntitlement> {
  const supabase = await createClient();
  return upsertQuotaEntitlementWithClient(supabase, entitlement);
}

export async function updateQuotaEntitlementStatusBySubscriptionIdWithClient(
  supabase: SupabaseUpdateClient,
  subscriptionId: string,
  status: 'active' | 'canceled' | 'past_due'
): Promise<QuotaEntitlement> {
  try {
    const { data, error } = await supabase
      .from('quota_entitlements')
      .update({
        status,
        updated_at: new Date().toISOString(),
      })
      .eq('paddle_subscription_id', subscriptionId)
      .select()
      .single();

    if (error) {
      console.error('Failed to update quota entitlement status:', error.message);
      throw toDatabaseError('Failed to update quota entitlement status', error.message, error.code);
    }

    if (!data) {
      throw createDatabaseError(
        'No data returned after quota entitlement status update',
        undefined,
        'Update operation succeeded but no data returned'
      );
    }

    return data as QuotaEntitlement;
  } catch (error) {
    if ((error as DatabaseError).code !== undefined) {
      throw error;
    }

    if ((error as Error).message?.startsWith('No data returned')) {
      throw error;
    }

    console.error('Unexpected error updating quota entitlement status:', error);
    const details = error instanceof Error ? error.message : 'Unknown error';
    throw toDatabaseError('Unexpected error updating quota entitlement status', details);
  }
}
