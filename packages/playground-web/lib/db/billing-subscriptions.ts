import { createClient } from '@/lib/supabase/server';
import type { BillingSubscription, DatabaseError, UpsertBillingSubscriptionData } from './types';
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

export async function upsertBillingSubscriptionWithClient(
  supabase: SupabaseUpsertClient,
  subscription: UpsertBillingSubscriptionData
): Promise<BillingSubscription> {
  try {
    const { data, error } = await supabase
      .from('billing_subscriptions')
      .upsert(
        {
          user_id: subscription.user_id,
          paddle_subscription_id: subscription.paddle_subscription_id,
          plan_id: subscription.plan_id,
          status: subscription.status,
          current_period_start: subscription.current_period_start ?? null,
          current_period_end: subscription.current_period_end ?? null,
        },
        { onConflict: 'paddle_subscription_id' }
      )
      .select()
      .single();

    if (error) {
      console.error('Failed to upsert billing subscription:', error.message);
      throw toDatabaseError('Failed to upsert billing subscription', error.message, error.code);
    }

    if (!data) {
      throw createDatabaseError(
        'No data returned after billing subscription upsert',
        undefined,
        'Upsert operation succeeded but no data returned'
      );
    }

    return data as BillingSubscription;
  } catch (error) {
    if ((error as DatabaseError).code !== undefined) {
      throw error;
    }

    if ((error as Error).message?.startsWith('No data returned')) {
      throw error;
    }

    console.error('Unexpected error upserting billing subscription:', error);
    const details = error instanceof Error ? error.message : 'Unknown error';
    throw toDatabaseError('Unexpected error upserting billing subscription', details);
  }
}

export async function upsertBillingSubscription(
  subscription: UpsertBillingSubscriptionData
): Promise<BillingSubscription> {
  const supabase = await createClient();
  return upsertBillingSubscriptionWithClient(supabase, subscription);
}
