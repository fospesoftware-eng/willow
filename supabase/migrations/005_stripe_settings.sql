-- 005: Admin-managed Stripe settings (Settings → Stripe payments in /admin).
-- Secrets live in a dedicated table with RLS enabled and NO public policies —
-- readable only through the service-role key, never from the browser.
-- `enabled = NULL` means "fall back to the environment (STRIPE_SECRET_KEY)".

create table if not exists public.stripe_settings (
  id boolean primary key default true check (id),
  enabled boolean,
  test_mode boolean not null default true,
  live_secret_key text,
  live_publishable_key text,
  live_webhook_secret text,
  test_secret_key text,
  test_publishable_key text,
  test_webhook_secret text,
  updated_at timestamptz not null default now()
);

alter table public.stripe_settings enable row level security;

-- NOTE: intentionally no policies. Like sauna_bookings, this table can only
-- be touched server-side with the service-role key, so secret keys are never
-- exposed through the public REST API.

insert into public.stripe_settings (id, enabled, test_mode)
values (true, null, true)
on conflict (id) do nothing;
