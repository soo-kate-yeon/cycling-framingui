CREATE TABLE IF NOT EXISTS public.quota_usage_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  tool_name TEXT NOT NULL,
  tool_class TEXT NOT NULL,
  units INTEGER NOT NULL DEFAULT 0 CHECK (units >= 0),
  outcome TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc', now())
);

CREATE INDEX IF NOT EXISTS idx_quota_usage_events_user_created
  ON public.quota_usage_events(user_id, created_at DESC);

CREATE INDEX IF NOT EXISTS idx_quota_usage_events_user_tool_class
  ON public.quota_usage_events(user_id, tool_class);

ALTER TABLE public.quota_usage_events ENABLE ROW LEVEL SECURITY;

COMMENT ON TABLE public.quota_usage_events IS 'Durable usage-event ledger for MCP quota reporting and billing visibility';

DROP POLICY IF EXISTS "Users can read own quota usage events" ON public.quota_usage_events;
CREATE POLICY "Users can read own quota usage events" ON public.quota_usage_events
  FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Service role can manage all quota usage events" ON public.quota_usage_events;
CREATE POLICY "Service role can manage all quota usage events" ON public.quota_usage_events
  FOR ALL USING (auth.role() = 'service_role');
