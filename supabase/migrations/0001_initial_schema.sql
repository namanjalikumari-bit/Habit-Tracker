-- ============================================================================
-- Smart Habit Tracker — initial schema (A6)
-- ============================================================================
-- Paste this whole file into the Supabase SQL Editor and run it once.
-- It creates the schema, enables Row Level Security, and adds policies so that
-- every user can only read/write their own rows (enforced via auth.uid()).
--
-- Model mapping (see data/supabase-habit-repository.ts):
--   habit_months  → one row per user per sheet ('example' | 'empty-template')
--   habits        → one row per habit, ordered by `position`
--   habit_entries → one row per COMPLETED day (presence = checked)
-- ============================================================================

-- ----------------------------------------------------------------------------
-- profiles: one row per auth user (created automatically by a trigger below).
-- ----------------------------------------------------------------------------
create table if not exists public.profiles (
  id         uuid primary key references auth.users (id) on delete cascade,
  email      text,
  created_at timestamptz not null default now()
);

-- ----------------------------------------------------------------------------
-- habit_months: the two sheets for a user, each with its current year/month.
-- ----------------------------------------------------------------------------
create table if not exists public.habit_months (
  id         uuid primary key default gen_random_uuid(),
  user_id    uuid not null references auth.users (id) on delete cascade,
  sheet_id   text not null check (sheet_id in ('example', 'empty-template')),
  year       integer not null,
  month      integer not null check (month between 1 and 12),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (user_id, sheet_id)
);

create index if not exists habit_months_user_idx on public.habit_months (user_id);

-- ----------------------------------------------------------------------------
-- habits: habit rows belonging to a habit_month.
-- ----------------------------------------------------------------------------
create table if not exists public.habits (
  id              uuid primary key default gen_random_uuid(),
  habit_month_id  uuid not null references public.habit_months (id) on delete cascade,
  user_id         uuid not null references auth.users (id) on delete cascade,
  name            text not null default '',
  position        integer not null default 0,
  created_at      timestamptz not null default now()
);

create index if not exists habits_user_idx on public.habits (user_id);
create index if not exists habits_month_idx on public.habits (habit_month_id);

-- ----------------------------------------------------------------------------
-- habit_entries: one row per completed day for a habit (presence = checked).
-- ----------------------------------------------------------------------------
create table if not exists public.habit_entries (
  id         uuid primary key default gen_random_uuid(),
  habit_id   uuid not null references public.habits (id) on delete cascade,
  user_id    uuid not null references auth.users (id) on delete cascade,
  day_index  integer not null check (day_index between 0 and 30),
  created_at timestamptz not null default now(),
  unique (habit_id, day_index)
);

create index if not exists habit_entries_user_idx on public.habit_entries (user_id);
create index if not exists habit_entries_habit_idx on public.habit_entries (habit_id);

-- ============================================================================
-- Row Level Security
-- ============================================================================
alter table public.profiles       enable row level security;
alter table public.habit_months   enable row level security;
alter table public.habits         enable row level security;
alter table public.habit_entries  enable row level security;

-- profiles: a user may only see/modify their own profile row.
drop policy if exists "profiles_own" on public.profiles;
create policy "profiles_own" on public.profiles
  for all
  using (auth.uid() = id)
  with check (auth.uid() = id);

-- habit_months / habits / habit_entries: scoped by user_id = auth.uid().
drop policy if exists "habit_months_own" on public.habit_months;
create policy "habit_months_own" on public.habit_months
  for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

drop policy if exists "habits_own" on public.habits;
create policy "habits_own" on public.habits
  for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

drop policy if exists "habit_entries_own" on public.habit_entries;
create policy "habit_entries_own" on public.habit_entries
  for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- ============================================================================
-- Auto-create a profile row when a new auth user signs up.
-- ============================================================================
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, email)
  values (new.id, new.email)
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();
