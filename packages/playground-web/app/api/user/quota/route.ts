import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { getUserQuotaSummary } from '@/lib/db/quota-summary';

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

    const quota = await getUserQuotaSummary(user.id);
    return NextResponse.json({ quota });
  } catch (error) {
    console.error('[Quota API] 오류:', error);
    return NextResponse.json({ error: 'internal_error' }, { status: 500 });
  }
}
