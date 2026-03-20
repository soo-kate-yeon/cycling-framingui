import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { getUserUsageSummary } from '@/lib/db/quota-usage-events';

export async function GET() {
  try {
    const supabase = await createClient();
    const {
      data: { user },
      error,
    } = await supabase.auth.getUser();

    if (error || !user) {
      return NextResponse.json({ error: 'unauthorized' }, { status: 401 });
    }

    const usage = await getUserUsageSummary(user.id);
    return NextResponse.json({ usage });
  } catch (error) {
    console.error('[Usage API] 오류:', error);
    return NextResponse.json({ error: 'internal_error' }, { status: 500 });
  }
}
