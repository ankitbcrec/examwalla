-- ============================================================
-- ExamWalla Database Schema
-- Run this in Supabase → SQL Editor
-- ============================================================

-- 1. PROFILES (extends auth.users — auto-created on signup)
create table if not exists public.profiles (
  id          uuid references auth.users(id) on delete cascade primary key,
  name        text,
  email       text,
  avatar_url  text,
  created_at  timestamptz default now() not null
);

alter table public.profiles enable row level security;

create policy "Users can read own profile"
  on public.profiles for select
  using (auth.uid() = id);

create policy "Users can update own profile"
  on public.profiles for update
  using (auth.uid() = id);

-- Auto-create profile row when a new user signs up via Google
create or replace function public.handle_new_user()
returns trigger
language plpgsql security definer set search_path = ''
as $$
begin
  insert into public.profiles (id, name, email, avatar_url)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'full_name', new.email),
    new.email,
    new.raw_user_meta_data->>'avatar_url'
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();


-- 2. CACHED QUESTIONS
-- Gemini generates once per exam_id → stored here → 10K users all hit cache
create table if not exists public.cached_questions (
  id          uuid primary key default gen_random_uuid(),
  exam_id     text not null unique,
  exam_name   text not null,
  questions   jsonb not null,
  created_at  timestamptz default now() not null,
  expires_at  timestamptz default (now() + interval '7 days') not null
);

alter table public.cached_questions enable row level security;

-- Any authenticated user can read cached questions
create policy "Authenticated users can read questions"
  on public.cached_questions for select
  to authenticated
  using (true);

-- Only server (service role) can insert/update questions
-- API routes use the anon key with RLS, so we use a policy for inserts too
create policy "Service can upsert questions"
  on public.cached_questions for all
  to service_role
  using (true);

-- Allow anon insert so the first user who hits an exam triggers generation
-- (API route checks auth before calling Gemini)
create policy "Authenticated can insert questions"
  on public.cached_questions for insert
  to authenticated
  with check (true);

create policy "Authenticated can update questions"
  on public.cached_questions for update
  to authenticated
  using (true);


-- 3. TEST ATTEMPTS
-- One row per test session. Created when user starts, updated on submit.
create table if not exists public.test_attempts (
  id                 uuid primary key default gen_random_uuid(),
  user_id            uuid references auth.users(id) on delete cascade not null,
  exam_id            text not null,
  exam_name          text not null,
  -- Saved when test STARTS
  questions          jsonb,                            -- AI-generated questions served to this user
  started_at         timestamptz default now() not null,
  -- Saved when test COMPLETES
  answers            jsonb,                            -- { "0": "A", "1": "C", ... }
  section_scores     jsonb,                            -- [{ section, correct, wrong, total, score, max_score }]
  score              integer not null default 0,
  total_marks        integer not null default 0,
  correct_answers    integer not null default 0,
  wrong_answers      integer not null default 0,
  skipped_answers    integer not null default 0,
  accuracy           integer not null default 0,
  percentile         integer default 0,
  time_taken_seconds integer not null default 0,
  status             text not null default 'in_progress', -- 'in_progress' | 'completed' | 'abandoned'
  created_at         timestamptz default now() not null
);

-- Indexes for fast user-scoped queries (critical for 10K users)
create index if not exists idx_test_attempts_user_id
  on public.test_attempts(user_id);
create index if not exists idx_test_attempts_user_created
  on public.test_attempts(user_id, created_at desc);
create index if not exists idx_test_attempts_exam
  on public.test_attempts(exam_id);
create index if not exists idx_test_attempts_status
  on public.test_attempts(user_id, status);

alter table public.test_attempts enable row level security;

create policy "Users can read own attempts"
  on public.test_attempts for select
  using (auth.uid() = user_id);

create policy "Users can insert own attempts"
  on public.test_attempts for insert
  with check (auth.uid() = user_id);

-- Users can update their own in-progress attempts (to complete them)
create policy "Users can update own attempts"
  on public.test_attempts for update
  using (auth.uid() = user_id);
