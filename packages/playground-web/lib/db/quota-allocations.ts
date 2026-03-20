import { createClient } from '@/lib/supabase/server';
import type { QuotaAllocation, CreateQuotaAllocationData, DatabaseError } from './types';
import { createDatabaseError, toDatabaseError } from './error';

type InsertSingleResult = PromiseLike<{
  data: unknown;
  error: { message: string; code?: string } | null;
}>;

type SupabaseInsertClient = {
  from: (table: string) => {
    insert: (values: Record<string, unknown>) => {
      select: () => {
        single: () => InsertSingleResult;
      };
    };
  };
};

export async function insertQuotaAllocationWithClient(
  supabase: SupabaseInsertClient,
  allocation: CreateQuotaAllocationData
): Promise<QuotaAllocation> {
  try {
    const { data, error } = await supabase
      .from('quota_allocations')
      .insert({
        user_id: allocation.user_id,
        allocation_type: allocation.allocation_type,
        units: allocation.units,
        source: allocation.source,
        billing_period_start: allocation.billing_period_start ?? null,
        billing_period_end: allocation.billing_period_end ?? null,
        paddle_transaction_id: allocation.paddle_transaction_id ?? null,
        paddle_subscription_id: allocation.paddle_subscription_id ?? null,
        metadata: allocation.metadata ?? null,
      })
      .select()
      .single();

    if (error) {
      console.error('Failed to create quota allocation:', error.message);

      if (error.code === '23505') {
        throw createDatabaseError(
          'Quota allocation already exists for this transaction',
          '23505',
          'UNIQUE constraint violation'
        );
      }

      throw toDatabaseError('Failed to create quota allocation', error.message, error.code);
    }

    if (!data) {
      throw createDatabaseError(
        'No data returned after quota allocation creation',
        undefined,
        'Insert operation succeeded but no data returned'
      );
    }

    return data as QuotaAllocation;
  } catch (error) {
    if ((error as DatabaseError).code !== undefined) {
      throw error;
    }

    if ((error as Error).message?.startsWith('No data returned')) {
      throw error;
    }

    console.error('Unexpected error creating quota allocation:', error);
    const details = error instanceof Error ? error.message : 'Unknown error';
    throw toDatabaseError('Unexpected error creating quota allocation', details);
  }
}

export async function createQuotaAllocation(
  allocation: CreateQuotaAllocationData
): Promise<QuotaAllocation> {
  const supabase = await createClient();
  return insertQuotaAllocationWithClient(supabase, allocation);
}
