ALTER TABLE public.quota_allocations
  DROP CONSTRAINT IF EXISTS quota_allocations_units_check;

ALTER TABLE public.quota_allocations
  ADD CONSTRAINT quota_allocations_units_nonzero_check CHECK (units <> 0);
