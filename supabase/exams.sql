-- Permanent exam catalog table.
-- AI-discovered exams land here after any successful /api/search-suggest call so
-- future searches find them instantly via DB lookup rather than calling Gemini again.
-- Seeded (static catalog) exams can be pre-populated with source='catalog'.

create table if not exists public.exams (
  id            text primary key,                         -- kebab-case slug, e.g. "norcet-nursing"
  name          text not null,                            -- human-readable name
  description   text,                                     -- one-line: what it is + who takes it
  category      text,                                     -- Government | Banking | Engineering | etc.
  emoji         text not null default '📝',
  source        text not null default 'ai',               -- 'catalog' | 'ai'
  times_picked  integer not null default 0,              -- incremented on exam_selected events
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);

comment on table public.exams is
  'Growing exam catalog. AI-discovered exams are upserted here so repeat searches skip Gemini.';

-- ── Indexes ──────────────────────────────────────────────────────────────────

-- Substring search on name (used by ilike '%query%')
create index if not exists exams_name_lower
  on public.exams (lower(name) text_pattern_ops);

-- Full-text search on name + description
create index if not exists exams_fts
  on public.exams using gin(
    to_tsvector('english', name || ' ' || coalesce(description, ''))
  );

-- Popularity ordering (e.g. for trending page)
create index if not exists exams_times_picked
  on public.exams (times_picked desc);

-- ── Row Level Security ────────────────────────────────────────────────────────

alter table public.exams enable row level security;

-- All authenticated users can browse the catalog
create policy "exams_select"
  on public.exams for select
  to authenticated
  using (true);

-- Authenticated users can insert new exams (AI discovery via API routes)
create policy "exams_insert"
  on public.exams for insert
  to authenticated
  with check (true);

-- Authenticated users can update existing exams (e.g. bump times_picked, fix metadata)
create policy "exams_update"
  on public.exams for update
  to authenticated
  using (true)
  with check (true);

-- Only service_role can delete (admin operations only)
-- (No explicit delete policy = authenticated users cannot delete)
