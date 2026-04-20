-- Athlon core schema for auth + agency operations
create extension if not exists pgcrypto;

create type public.app_role as enum ('agent', 'staff');

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  role public.app_role,
  full_name text,
  avatar_url text,
  onboarding_completed boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.agencies (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  created_by uuid references public.profiles(id),
  created_at timestamptz not null default now()
);

create table if not exists public.athletes (
  id uuid primary key default gen_random_uuid(),
  profile_id uuid references public.profiles(id) on delete set null,
  agency_id uuid references public.agencies(id) on delete set null,
  sport text,
  status text,
  created_at timestamptz not null default now()
);

create table if not exists public.conversations (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  agency_id uuid references public.agencies(id) on delete cascade,
  created_by uuid references public.profiles(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.messages (
  id uuid primary key default gen_random_uuid(),
  conversation_id uuid not null references public.conversations(id) on delete cascade,
  sender_id uuid references public.profiles(id) on delete set null,
  body text not null,
  is_system_note boolean not null default false,
  created_at timestamptz not null default now()
);

create table if not exists public.tasks (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text,
  due_at timestamptz,
  assignee_id uuid references public.profiles(id) on delete set null,
  athlete_id uuid references public.athletes(id) on delete set null,
  conversation_id uuid references public.conversations(id) on delete set null,
  status text not null default 'todo',
  created_at timestamptz not null default now()
);

create table if not exists public.deals (
  id uuid primary key default gen_random_uuid(),
  athlete_id uuid references public.athletes(id) on delete set null,
  agency_id uuid references public.agencies(id) on delete set null,
  title text not null,
  stage text not null default 'lead',
  value numeric,
  deadline_at timestamptz,
  created_at timestamptz not null default now()
);

alter publication supabase_realtime add table public.conversations;
alter publication supabase_realtime add table public.messages;

alter table public.profiles enable row level security;
alter table public.conversations enable row level security;
alter table public.messages enable row level security;

create policy "Users can read their profile" on public.profiles for select using (auth.uid() = id);
create policy "Users can upsert own profile" on public.profiles for insert with check (auth.uid() = id);
create policy "Users can update own profile" on public.profiles for update using (auth.uid() = id);

create policy "Authenticated users can read conversations" on public.conversations for select to authenticated using (true);
create policy "Authenticated users can read messages" on public.messages for select to authenticated using (true);
create policy "Authenticated users can post messages" on public.messages for insert to authenticated with check (auth.uid() = sender_id or sender_id is null);
