import { createClient } from '@/lib/supabase/server';
import type {
  CreateQuotaUsageEventData,
  DatabaseError,
  QuotaUsageEvent,
  QuotaUsageSummary,
} from './types';
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

export async function createQuotaUsageEventWithClient(
  supabase: SupabaseInsertClient,
  event: CreateQuotaUsageEventData
): Promise<QuotaUsageEvent> {
  try {
    const { data, error } = await supabase
      .from('quota_usage_events')
      .insert({
        user_id: event.user_id,
        tool_name: event.tool_name,
        tool_class: event.tool_class,
        units: event.units,
        outcome: event.outcome,
        created_at: event.created_at ?? new Date().toISOString(),
      })
      .select()
      .single();

    if (error) {
      console.error('Failed to create quota usage event:', error.message);
      throw toDatabaseError('Failed to create quota usage event', error.message, error.code);
    }

    if (!data) {
      throw createDatabaseError(
        'No data returned after quota usage event creation',
        undefined,
        'Insert operation succeeded but no data returned'
      );
    }

    return data as QuotaUsageEvent;
  } catch (error) {
    if ((error as DatabaseError).code !== undefined) {
      throw error;
    }

    if ((error as Error).message?.startsWith('No data returned')) {
      throw error;
    }

    console.error('Unexpected error creating quota usage event:', error);
    const details = error instanceof Error ? error.message : 'Unknown error';
    throw toDatabaseError('Unexpected error creating quota usage event', details);
  }
}

export async function createQuotaUsageEvent(
  event: CreateQuotaUsageEventData
): Promise<QuotaUsageEvent> {
  const supabase = await createClient();
  return createQuotaUsageEventWithClient(supabase, event);
}

type QuotaUsageEventRow = Pick<QuotaUsageEvent, 'tool_class' | 'units' | 'created_at'>;

export async function getUserUsageSummary(userId: string): Promise<QuotaUsageSummary> {
  try {
    const supabase = await createClient();
    const periodStart = new Date();
    periodStart.setUTCDate(1);
    periodStart.setUTCHours(0, 0, 0, 0);

    const { data, error } = await supabase
      .from('quota_usage_events')
      .select('tool_class, units, created_at')
      .eq('user_id', userId)
      .gte('created_at', periodStart.toISOString())
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Failed to fetch quota usage events:', error.message);
      throw toDatabaseError('Failed to fetch quota usage events', error.message, error.code);
    }

    const rows = (data as QuotaUsageEventRow[] | null) ?? [];
    const grouped = new Map<string, { used_units: number; calls: number }>();

    for (const row of rows) {
      const current = grouped.get(row.tool_class) ?? { used_units: 0, calls: 0 };
      current.used_units += row.units;
      current.calls += 1;
      grouped.set(row.tool_class, current);
    }

    return {
      total_used_units: rows.reduce((sum, row) => sum + row.units, 0),
      total_calls: rows.length,
      by_tool_class: Array.from(grouped.entries()).map(([tool_class, value]) => ({
        tool_class: tool_class as QuotaUsageEvent['tool_class'],
        used_units: value.used_units,
        calls: value.calls,
      })),
      latest_event_at: rows[0]?.created_at ?? null,
    };
  } catch (error) {
    if ((error as DatabaseError).code !== undefined) {
      throw error;
    }

    console.error('Unexpected error getting usage summary:', error);
    const details = error instanceof Error ? error.message : 'Unknown error';
    throw toDatabaseError('Unexpected error getting usage summary', details);
  }
}
