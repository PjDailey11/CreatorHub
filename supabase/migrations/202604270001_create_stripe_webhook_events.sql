create table if not exists public.stripe_webhook_events (
  id uuid primary key default gen_random_uuid(),
  stripe_event_id text not null unique,
  event_type text not null,
  status text not null check (status in ('processing', 'succeeded', 'failed')),
  attempts integer not null default 1,
  last_error text,
  processed_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists idx_stripe_webhook_events_status
  on public.stripe_webhook_events (status);

create index if not exists idx_stripe_webhook_events_created_at
  on public.stripe_webhook_events (created_at desc);

alter table public.stripe_webhook_events enable row level security;

create policy "Service role can manage webhook events"
  on public.stripe_webhook_events
  for all
  using (auth.role() = 'service_role')
  with check (auth.role() = 'service_role');
