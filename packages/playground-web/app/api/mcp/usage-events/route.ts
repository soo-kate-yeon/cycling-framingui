import { createClient as createServerClient } from '@supabase/supabase-js';
import { NextRequest, NextResponse } from 'next/server';
import * as bcrypt from 'bcryptjs';
import { createQuotaUsageEventWithClient } from '@/lib/db/quota-usage-events';
import type { QuotaUsageOutcome, QuotaUsageToolClass } from '@/lib/db/types';

interface ApiKeyRow {
  id: string;
  user_id: string;
  key_hash: string;
  revoked_at: string | null;
  expires_at: string | null;
}

export async function POST(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization');

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'unauthorized' }, { status: 401 });
    }

    const apiKey = authHeader.substring(7);
    if (!apiKey.startsWith('tk_live_') || apiKey.length !== 72) {
      return NextResponse.json({ error: 'unauthorized' }, { status: 401 });
    }

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!supabaseUrl || !supabaseServiceRoleKey) {
      return NextResponse.json({ error: 'server_configuration_error' }, { status: 500 });
    }

    const supabase = createServerClient(supabaseUrl, supabaseServiceRoleKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    });

    const { data: apiKeys, error: apiKeysError } = await supabase
      .from('api_keys')
      .select('id, user_id, key_hash, revoked_at, expires_at')
      .is('revoked_at', null)
      .returns<ApiKeyRow[]>();

    if (apiKeysError || !apiKeys) {
      return NextResponse.json({ error: 'internal_error' }, { status: 500 });
    }

    let matchedKey: ApiKeyRow | null = null;
    for (const candidate of apiKeys) {
      const isMatch = await bcrypt.compare(apiKey, candidate.key_hash);
      if (isMatch) {
        matchedKey = candidate;
        break;
      }
    }

    if (!matchedKey) {
      return NextResponse.json({ error: 'unauthorized' }, { status: 401 });
    }

    if (matchedKey.expires_at && new Date(matchedKey.expires_at) < new Date()) {
      return NextResponse.json({ error: 'unauthorized' }, { status: 401 });
    }

    const body = (await request.json()) as {
      toolName?: string;
      toolClass?: QuotaUsageToolClass;
      units?: number;
      outcome?: QuotaUsageOutcome;
      createdAt?: string;
    };

    if (!body.toolName || !body.toolClass || typeof body.units !== 'number' || !body.outcome) {
      return NextResponse.json({ error: 'invalid_payload' }, { status: 400 });
    }

    await createQuotaUsageEventWithClient(supabase, {
      user_id: matchedKey.user_id,
      tool_name: body.toolName,
      tool_class: body.toolClass,
      units: body.units,
      outcome: body.outcome,
      created_at: body.createdAt,
    });

    return NextResponse.json({ status: 'recorded' }, { status: 202 });
  } catch (error) {
    console.error('[MCP Usage Events] Unexpected error:', error);
    return NextResponse.json({ error: 'internal_error' }, { status: 500 });
  }
}
