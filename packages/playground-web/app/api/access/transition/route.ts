/**
 * Transition Access API
 *
 * POST /api/access/transition
 * - grants temporary transition access for quota onboarding
 * - keeps compatibility with legacy trial-backed entitlements in storage
 */

import { createTransitionAccessResponse } from '@/lib/access/transition-access';

export async function POST() {
  return createTransitionAccessResponse();
}
