-- Migration: Add quota_allocations table for quota-bearing entitlements
-- Description: plan, top-up, migration, and adjustment allocations must be stored durably

CREATE TABLE IF NOT EXISTS public.quota_allocations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  allocation_type TEXT NOT NULL
    CHECK (allocation_type IN ('plan', 'top_up', 'migration', 'adjustment')),
  units INTEGER NOT NULL CHECK (units > 0),
  source TEXT NOT NULL,
  billing_period_start TIMESTAMPTZ,
  billing_period_end TIMESTAMPTZ,
  paddle_transaction_id TEXT,
  paddle_subscription_id TEXT,
  metadata JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_quota_allocations_user_id
  ON public.quota_allocations(user_id, created_at DESC);

CREATE UNIQUE INDEX IF NOT EXISTS idx_quota_allocations_transaction_unique
  ON public.quota_allocations(paddle_transaction_id)
  WHERE paddle_transaction_id IS NOT NULL;

COMMENT ON TABLE public.quota_allocations IS 'Durable quota allocation ledger for plans, top-ups, migration grants, and adjustments';
COMMENT ON COLUMN public.quota_allocations.allocation_type IS 'Allocation kind: plan, top_up, migration, adjustment';
COMMENT ON COLUMN public.quota_allocations.units IS 'Positive unit grant added to the account balance';

ALTER TABLE public.quota_allocations ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can read own quota allocations" ON public.quota_allocations;
CREATE POLICY "Users can read own quota allocations" ON public.quota_allocations
  FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Service role can manage all quota allocations" ON public.quota_allocations;
CREATE POLICY "Service role can manage all quota allocations" ON public.quota_allocations
  USING (auth.role() = 'service_role');
