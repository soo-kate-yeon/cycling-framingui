/**
 * Legacy Trial License API
 *
 * Compatibility wrapper for the old route. New clients should use:
 * POST /api/access/transition
 */

import { createTransitionAccessResponse } from '@/lib/access/transition-access';

export async function POST() {
  return createTransitionAccessResponse();
}
