-- Adds settlement tracking so "Settle Up" can mark expenses through a date as paid.
-- Run this in the Supabase SQL editor after schema.sql.

create table if not exists public.settlements (
  id uuid primary key default gen_random_uuid(),
  settled_up_to date not null,
  total_amount numeric(12, 2) not null,
  created_at timestamptz not null default now()
);

alter table public.settlements enable row level security;

create policy "Authenticated users can read settlements"
  on public.settlements for select
  to authenticated
  using (true);

create policy "Authenticated users can insert settlements"
  on public.settlements for insert
  to authenticated
  with check (true);
