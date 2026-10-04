-- Wordtrail Supabase schema. Run in the Supabase SQL editor.
-- Browser requests use the anon/publishable key; RLS below is mandatory. Never expose service_role.

create extension if not exists pgcrypto;

create table if not exists public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  username text not null default '' check (char_length(username) <= 40),
  streak_count integer not null default 0 check (streak_count >= 0),
  last_active_date date,
  english_level text check (english_level is null or english_level in ('beginner', 'intermediate', 'advanced', 'unsure')),
  ui_language text not null default 'en' check (ui_language in ('en', 'es', 'hi', 'bn', 'fr')),
  gloss_language text not null default 'es' check (gloss_language in ('en', 'es', 'hi', 'bn', 'fr')),
  show_gloss boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);


-- Bring earlier profiles forward without replacing user data.
alter table public.profiles add column if not exists english_level text check (english_level is null or english_level in ('beginner', 'intermediate', 'advanced', 'unsure'));
alter table public.profiles add column if not exists ui_language text not null default 'en' check (ui_language in ('en', 'es', 'hi', 'bn', 'fr'));
alter table public.profiles add column if not exists gloss_language text not null default 'es' check (gloss_language in ('en', 'es', 'hi', 'bn', 'fr'));
alter table public.profiles add column if not exists show_gloss boolean not null default false;

create table if not exists public.user_wordbook (
  user_id uuid not null references auth.users (id) on delete cascade,
  word_id text not null check (word_id ~ '^[a-z0-9-]{1,64}$'),
  mastery_level text not null default 'Medium' check (mastery_level in ('Easy', 'Medium', 'Hard')),
  notes text not null default '' check (char_length(notes) <= 500),
  saved_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  primary key (user_id, word_id)
);

create table if not exists public.quiz_results (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  game_type text not null check (game_type ~ '^[a-z0-9_-]{1,40}$'),
  score integer not null check (score >= 0),
  total integer not null check (total > 0 and score <= total),
  idempotency_key text not null check (char_length(idempotency_key) between 1 and 100),
  created_at timestamptz not null default now(),
  unique (user_id, idempotency_key)
);

create index if not exists quiz_results_user_created_idx
  on public.quiz_results (user_id, created_at desc);

-- Create the profile on email/password sign-up; the client can upsert it later as well.
create or replace function public.handle_new_wordtrail_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, username)
  values (
    new.id,
    left(coalesce(new.raw_user_meta_data ->> 'username', ''), 40)
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created_wordtrail on auth.users;
create trigger on_auth_user_created_wordtrail
after insert on auth.users
for each row execute procedure public.handle_new_wordtrail_user();

alter table public.profiles enable row level security;
alter table public.user_wordbook enable row level security;
alter table public.quiz_results enable row level security;

grant select, insert, update on public.profiles to authenticated;
grant select, insert, update, delete on public.user_wordbook to authenticated;
grant select, insert, update on public.quiz_results to authenticated;

drop policy if exists "profiles_select_own" on public.profiles;
create policy "profiles_select_own" on public.profiles
  for select to authenticated using (auth.uid() = id);
drop policy if exists "profiles_insert_own" on public.profiles;
create policy "profiles_insert_own" on public.profiles
  for insert to authenticated with check (auth.uid() = id);
drop policy if exists "profiles_update_own" on public.profiles;
create policy "profiles_update_own" on public.profiles
  for update to authenticated using (auth.uid() = id) with check (auth.uid() = id);

drop policy if exists "wordbook_select_own" on public.user_wordbook;
create policy "wordbook_select_own" on public.user_wordbook
  for select to authenticated using (auth.uid() = user_id);
drop policy if exists "wordbook_insert_own" on public.user_wordbook;
create policy "wordbook_insert_own" on public.user_wordbook
  for insert to authenticated with check (auth.uid() = user_id);
drop policy if exists "wordbook_update_own" on public.user_wordbook;
create policy "wordbook_update_own" on public.user_wordbook
  for update to authenticated using (auth.uid() = user_id) with check (auth.uid() = user_id);
drop policy if exists "wordbook_delete_own" on public.user_wordbook;
create policy "wordbook_delete_own" on public.user_wordbook
  for delete to authenticated using (auth.uid() = user_id);

drop policy if exists "quiz_results_select_own" on public.quiz_results;
create policy "quiz_results_select_own" on public.quiz_results
  for select to authenticated using (auth.uid() = user_id);
drop policy if exists "quiz_results_insert_own" on public.quiz_results;
create policy "quiz_results_insert_own" on public.quiz_results
  for insert to authenticated with check (auth.uid() = user_id);
drop policy if exists "quiz_results_update_own" on public.quiz_results;
create policy "quiz_results_update_own" on public.quiz_results
  for update to authenticated using (auth.uid() = user_id) with check (auth.uid() = user_id);
