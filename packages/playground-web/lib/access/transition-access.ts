import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import {
  TRANSITION_ACCESS_DURATION_DAYS,
  TRANSITION_ACCESS_LICENSE_TYPE,
  TRANSITION_ACCESS_THEME_ID,
} from '@/lib/access/constants';

export async function createTransitionAccessResponse() {
  try {
    const includeDebugDetails = process.env.NODE_ENV !== 'production';
    const supabase = await createClient();

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: 'unauthorized' }, { status: 401 });
    }

    const { data: existingAccess, error: checkError } = await supabase
      .from('user_licenses')
      .select('id, type, expires_at')
      .eq('user_id', user.id)
      .eq('type', 'trial')
      .maybeSingle();

    if (checkError) {
      console.error('[Transition Access API] existing access lookup failed:', checkError);
      return NextResponse.json({ error: 'database_error' }, { status: 500 });
    }

    if (existingAccess) {
      return NextResponse.json(
        {
          error: 'transition_access_already_exists',
          legacy_error: 'trial_already_exists',
          message: 'You have already used your transition access.',
          existing_access: {
            expires_at: existingAccess.expires_at,
          },
          existing_trial: {
            expires_at: existingAccess.expires_at,
          },
        },
        { status: 409 }
      );
    }

    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + TRANSITION_ACCESS_DURATION_DAYS);

    const { data: newAccess, error: createError } = await supabase
      .from('user_licenses')
      .insert({
        user_id: user.id,
        theme_id: TRANSITION_ACCESS_THEME_ID,
        tier: 'creator',
        type: TRANSITION_ACCESS_LICENSE_TYPE,
        expires_at: expiresAt.toISOString(),
        is_active: true,
      })
      .select()
      .single();

    if (createError) {
      console.error('[Transition Access API] create failed:', {
        message: createError.message,
        code: createError.code,
        details: createError.details,
        hint: createError.hint,
      });

      const errorResponse: Record<string, unknown> = {
        error: 'creation_failed',
      };

      if (createError.code === '42501') {
        errorResponse.reason = 'rls_denied';
      }

      if (includeDebugDetails) {
        errorResponse.message = createError.message;
        errorResponse.debug = {
          code: createError.code,
          details: createError.details,
          hint: createError.hint,
        };
      }

      return NextResponse.json(errorResponse, { status: 500 });
    }

    return NextResponse.json(
      {
        success: true,
        access: {
          id: newAccess.id,
          type: newAccess.type,
          expires_at: newAccess.expires_at,
          days_left: TRANSITION_ACCESS_DURATION_DAYS,
        },
        trial: {
          id: newAccess.id,
          type: newAccess.type,
          expires_at: newAccess.expires_at,
          days_left: TRANSITION_ACCESS_DURATION_DAYS,
        },
        message: 'Transition access activated. You now have temporary full theme visibility.',
      },
      { status: 201 }
    );
  } catch (err) {
    console.error('[Transition Access API] unexpected error:', err);
    return NextResponse.json({ error: 'internal_error' }, { status: 500 });
  }
}
