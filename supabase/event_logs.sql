-- ============================================================
-- ExamWalla Event Log
-- Run in Supabase → SQL Editor (after schema.sql)
-- ============================================================
-- PK format: {user_id}-{occurred_at}-{exam_id}
-- The three components (user_id, occurred_at, exam_id) together
-- form the composite key; log_key materialises that as a single
-- readable string for external tools and audit exports.
-- ============================================================

create table if not exists public.event_logs (
  -- Composite natural key
  user_id      uuid        not null references auth.users(id) on delete cascade,
  occurred_at  timestamptz not null default clock_timestamp(),   -- microsecond precision
  exam_id      text        not null default 'global',            -- 'global' for non-exam events

  -- Event fields
  event_type   text        not null,  -- see EventType in src/lib/event-logger.ts
  payload      jsonb       default '{}'::jsonb,

  -- Human-readable PK alias: {user_id}-{occurred_at}-{exam_id}
  log_key text generated always as (
    user_id::text
    || '-'
    || to_char(occurred_at at time zone 'UTC', 'YYYY-MM-DD"T"HH24:MI:SS.US"Z"')
    || '-'
    || exam_id
  ) stored,

  primary key (user_id, occurred_at, exam_id)
);

comment on table  public.event_logs is 'Audit log: one row per user action. PK = (user_id, occurred_at, exam_id). log_key surfaces that as a single readable string.';
comment on column public.event_logs.log_key is 'Read-only alias: {user_id}-{UTC timestamp}-{exam_id}. Useful for exports and external systems.';

-- ── Indexes ───────────────────────────────────────────────────
-- Most queries filter by user, then time-descending
create index if not exists event_logs_user_time
  on public.event_logs (user_id, occurred_at desc);

-- Analytics: all events for a given exam across all users
create index if not exists event_logs_exam_time
  on public.event_logs (exam_id, occurred_at desc);

-- Filter by event type (e.g. all exam_submitted events)
create index if not exists event_logs_event_type
  on public.event_logs (event_type, occurred_at desc);

-- ── Row Level Security ────────────────────────────────────────
alter table public.event_logs enable row level security;

-- Users may only insert their own events
create policy "Users insert own events"
  on public.event_logs for insert
  to authenticated
  with check (auth.uid() = user_id);

-- Users may only read their own events
create policy "Users read own events"
  on public.event_logs for select
  to authenticated
  using (auth.uid() = user_id);

-- Allow server-side triggers (run as postgres/service_role) to bypass RLS
create policy "Service role bypasses RLS"
  on public.event_logs for all
  to service_role
  using (true)
  with check (true);

-- ── Signup trigger ────────────────────────────────────────────
-- Fires once when a new user is created in auth.users.
-- Runs server-side so it can never be spoofed by the client.
create or replace function public.log_user_signup()
returns trigger
language plpgsql
security definer                -- runs as postgres, bypasses RLS
set search_path = ''
as $$
begin
  insert into public.event_logs (user_id, exam_id, event_type, payload)
  values (
    new.id,
    'global',
    'user_signed_up',
    jsonb_build_object(
      'email',    new.email,
      'provider', new.raw_app_meta_data->>'provider'
    )
  );
  return new;
end;
$$;

drop trigger if exists on_user_signed_up on auth.users;
create trigger on_user_signed_up
  after insert on auth.users
  for each row execute function public.log_user_signup();

-- ── Convenience view ──────────────────────────────────────────
create or replace view public.event_log_view as
  select
    log_key,
    user_id,
    occurred_at,
    exam_id,
    event_type,
    payload
  from public.event_logs
  order by occurred_at desc;
