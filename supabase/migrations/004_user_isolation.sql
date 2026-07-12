-- Isolates data per account. Previously every authenticated user shared one
-- global expenses/settings table (fine for one shared login, broken once
-- multiple separate accounts exist). Now each account has its own private
-- expenses and settings, enforced by RLS using auth.uid().
--
-- This wipes existing expenses/settings data (agreed with user) since old
-- rows have no owner to assign them to under the new model.
-- Run this in the Supabase SQL editor after 003_settled_column.sql.

delete from public.expenses;
delete from public.settings;

alter table public.expenses add column if not exists user_id uuid references auth.users(id) on delete cascade;
alter table public.expenses alter column user_id set not null;

-- settings becomes one row per user instead of a single global row.
alter table public.settings drop constraint if exists settings_pkey;
alter table public.settings drop column if exists id;
alter table public.settings add column if not exists user_id uuid references auth.users(id) on delete cascade;
alter table public.settings add primary key (user_id);

drop policy if exists "Authenticated users can read expenses" on public.expenses;
drop policy if exists "Authenticated users can insert expenses" on public.expenses;
drop policy if exists "Authenticated users can update expenses" on public.expenses;
drop policy if exists "Authenticated users can delete expenses" on public.expenses;
drop policy if exists "Authenticated users can read settings" on public.settings;
drop policy if exists "Authenticated users can update settings" on public.settings;

create policy "Users can read their own expenses"
  on public.expenses for select
  to authenticated
  using (auth.uid() = user_id);

create policy "Users can insert their own expenses"
  on public.expenses for insert
  to authenticated
  with check (auth.uid() = user_id);

create policy "Users can update their own expenses"
  on public.expenses for update
  to authenticated
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create policy "Users can delete their own expenses"
  on public.expenses for delete
  to authenticated
  using (auth.uid() = user_id);

create policy "Users can read their own settings"
  on public.settings for select
  to authenticated
  using (auth.uid() = user_id);

create policy "Users can insert their own settings"
  on public.settings for insert
  to authenticated
  with check (auth.uid() = user_id);

create policy "Users can update their own settings"
  on public.settings for update
  to authenticated
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);
