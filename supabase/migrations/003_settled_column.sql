-- Replaces fuzzy timestamp-based settlement with a per-expense settled flag.
-- Settle Up now marks exact expenses as settled instead of guessing from dates/timestamps.
-- Run this in the Supabase SQL editor after 002_settlements.sql.

alter table public.expenses add column if not exists settled boolean not null default false;

-- The old settlements table is no longer used for determining settled status.
-- Safe to drop since settlement status now lives on each expense row.
drop table if exists public.settlements;
