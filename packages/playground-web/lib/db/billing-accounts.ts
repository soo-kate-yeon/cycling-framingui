import { createClient } from '@/lib/supabase/server';
import type { BillingAccount, DatabaseError, UpsertBillingAccountData } from './types';
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

export async function upsertBillingAccountWithClient(
  supabase: SupabaseUpsertClient,
  account: UpsertBillingAccountData
): Promise<BillingAccount> {
  try {
    const { data, error } = await supabase
      .from('billing_accounts')
      .upsert(
        {
          user_id: account.user_id,
          paddle_customer_id: account.paddle_customer_id,
        },
        { onConflict: 'user_id' }
      )
      .select()
      .single();

    if (error) {
      console.error('Failed to upsert billing account:', error.message);
      throw toDatabaseError('Failed to upsert billing account', error.message, error.code);
    }

    if (!data) {
      throw createDatabaseError(
        'No data returned after billing account upsert',
        undefined,
        'Upsert operation succeeded but no data returned'
      );
    }

    return data as BillingAccount;
  } catch (error) {
    if ((error as DatabaseError).code !== undefined) {
      throw error;
    }

    if ((error as Error).message?.startsWith('No data returned')) {
      throw error;
    }

    console.error('Unexpected error upserting billing account:', error);
    const details = error instanceof Error ? error.message : 'Unknown error';
    throw toDatabaseError('Unexpected error upserting billing account', details);
  }
}

export async function upsertBillingAccount(
  account: UpsertBillingAccountData
): Promise<BillingAccount> {
  const supabase = await createClient();
  return upsertBillingAccountWithClient(supabase, account);
}
