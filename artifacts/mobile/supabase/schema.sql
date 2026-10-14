-- Run this script once in the Supabase SQL Editor for the project configured
-- with EXPO_PUBLIC_SUPABASE_URL.

create table if not exists public.student_app_state (
  user_id uuid primary key references auth.users (id) on delete cascade,
  state jsonb not null default '{}'::jsonb
    check (jsonb_typeof(state) = 'object'),
  updated_at timestamptz not null default now()
);

alter table public.student_app_state enable row level security;

revoke all on table public.student_app_state from public, anon;
grant select, insert, update on table public.student_app_state to authenticated;

drop policy if exists "Learners read their own app state"
  on public.student_app_state;
create policy "Learners read their own app state"
  on public.student_app_state
  for select
  to authenticated
  using ((select auth.uid()) = user_id);

drop policy if exists "Learners create their own app state"
  on public.student_app_state;
create policy "Learners create their own app state"
  on public.student_app_state
  for insert
  to authenticated
  with check ((select auth.uid()) = user_id);

drop policy if exists "Learners update their own app state"
  on public.student_app_state;
create policy "Learners update their own app state"
  on public.student_app_state
  for update
  to authenticated
  using ((select auth.uid()) = user_id)
  with check ((select auth.uid()) = user_id);
