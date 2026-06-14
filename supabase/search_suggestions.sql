-- ============================================================
-- ExamWalla Search Suggestion Cache
-- Run in Supabase → SQL Editor
-- ============================================================
-- Stores AI-generated exam suggestions keyed by search query.
-- First user to search a keyword pays the Gemini cost (~1-2s).
-- Every subsequent user gets the result instantly from this table.
-- ============================================================

create table if not exists public.search_suggestions (
  query       text primary key,           -- normalized: lowercase, trimmed, collapsed whitespace
  suggestions jsonb not null,             -- array of {id, name, description, category, emoji}
  hit_count   integer not null default 1, -- how many times this query has been searched
  created_at  timestamptz default now() not null,
  expires_at  timestamptz default (now() + interval '30 days') not null
);

comment on table public.search_suggestions is
  'AI exam suggestion cache. PK = normalized query string. Shared across all users.';

-- Fast expiry check
create index if not exists search_suggestions_expires
  on public.search_suggestions (expires_at);

-- Popular queries (for analytics / pre-warming)
create index if not exists search_suggestions_hit_count
  on public.search_suggestions (hit_count desc);

alter table public.search_suggestions enable row level security;

-- Any authenticated user can read the shared cache
create policy "Authenticated users read suggestions"
  on public.search_suggestions for select
  to authenticated
  using (true);

-- Any authenticated user can populate the cache (first writer wins)
create policy "Authenticated users insert suggestions"
  on public.search_suggestions for insert
  to authenticated
  with check (true);

-- Allow hit_count increment and expiry refresh on cache hit
create policy "Authenticated users update suggestions"
  on public.search_suggestions for update
  to authenticated
  using (true);
