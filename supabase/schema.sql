-- Hostel Hisab schema
-- Run this in the Supabase SQL editor (Project → SQL Editor → New query).

create table if not exists public.expenses (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  amount numeric(12, 2) not null,
  paid_by text not null check (paid_by in ('personA', 'personB')),
  date date not null,
  category text not null check (category in ('Food', 'Drinks', 'Grocery', 'Hostel', 'Transport', 'Other')),
  notes text,
  created_at timestamptz not null default now()
);

create table if not exists public.settings (
  id boolean primary key default true check (id = true), -- enforces a single row
  person_a_name text not null default 'Junaid',
  person_b_name text not null default 'Husnain'
);

insert into public.settings (id) values (true) on conflict (id) do nothing;

alter table public.expenses enable row level security;
alter table public.settings enable row level security;

-- Single shared account: any authenticated user has full access.
create policy "Authenticated users can read expenses"
  on public.expenses for select
  to authenticated
  using (true);

create policy "Authenticated users can insert expenses"
  on public.expenses for insert
  to authenticated
  with check (true);

create policy "Authenticated users can update expenses"
  on public.expenses for update
  to authenticated
  using (true)
  with check (true);

create policy "Authenticated users can delete expenses"
  on public.expenses for delete
  to authenticated
  using (true);

create policy "Authenticated users can read settings"
  on public.settings for select
  to authenticated
  using (true);

create policy "Authenticated users can update settings"
  on public.settings for update
  to authenticated
  using (true)
  with check (true);
