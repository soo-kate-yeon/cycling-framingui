-- Migration: Add quota_entitlements table for current paid-plan state
-- Description: current quota-bearing entitlement should be queryable without replaying the full allocation log

CREATE TABLE IF NOT EXISTS public.quota_entitlements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  plan_id TEXT NOT NULL CHECK (plan_id IN ('developer', 'team', 'enterprise')),
  status TEXT NOT NULL CHECK (status IN ('active', 'inactive', 'canceled', 'past_due')),
  included_units INTEGER NOT NULL CHECK (included_units >= 0),
  current_period_start TIMESTAMPTZ,
  current_period_end TIMESTAMPTZ,
  paddle_subscription_id TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE UNIQUE INDEX IF NOT EXISTS idx_quota_entitlements_user_unique
  ON public.quota_entitlements(user_id);

CREATE UNIQUE INDEX IF NOT EXISTS idx_quota_entitlements_subscription_unique
  ON public.quota_entitlements(paddle_subscription_id)
  WHERE paddle_subscription_id IS NOT NULL;

COMMENT ON TABLE public.quota_entitlements IS 'Current paid-plan quota entitlement state for an account';
COMMENT ON COLUMN public.quota_entitlements.status IS 'Lifecycle state of the paid quota entitlement';

ALTER TABLE public.quota_entitlements ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can read own quota entitlements" ON public.quota_entitlements;
CREATE POLICY "Users can read own quota entitlements" ON public.quota_entitlements
  FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Service role can manage all quota entitlements" ON public.quota_entitlements;
CREATE POLICY "Service role can manage all quota entitlements" ON public.quota_entitlements
  USING (auth.role() = 'service_role');
