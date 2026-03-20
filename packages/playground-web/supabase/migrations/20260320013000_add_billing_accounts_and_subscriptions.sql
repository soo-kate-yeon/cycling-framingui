CREATE TABLE IF NOT EXISTS public.billing_accounts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  paddle_customer_id TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc', now()),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc', now())
);

CREATE TABLE IF NOT EXISTS public.billing_subscriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  paddle_subscription_id TEXT NOT NULL UNIQUE,
  plan_id TEXT NOT NULL,
  status TEXT NOT NULL,
  current_period_start TIMESTAMPTZ NULL,
  current_period_end TIMESTAMPTZ NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc', now()),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc', now())
);

CREATE INDEX IF NOT EXISTS idx_billing_subscriptions_user_id
  ON public.billing_subscriptions(user_id);

ALTER TABLE public.billing_accounts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.billing_subscriptions ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can read own billing accounts" ON public.billing_accounts;
CREATE POLICY "Users can read own billing accounts" ON public.billing_accounts
  FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Service role can manage all billing accounts" ON public.billing_accounts;
CREATE POLICY "Service role can manage all billing accounts" ON public.billing_accounts
  FOR ALL USING (auth.role() = 'service_role');

DROP POLICY IF EXISTS "Users can read own billing subscriptions" ON public.billing_subscriptions;
CREATE POLICY "Users can read own billing subscriptions" ON public.billing_subscriptions
  FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Service role can manage all billing subscriptions" ON public.billing_subscriptions;
CREATE POLICY "Service role can manage all billing subscriptions" ON public.billing_subscriptions
  FOR ALL USING (auth.role() = 'service_role');
