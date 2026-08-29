-- Operator's Guide — Supabase schema
--
-- Run this once in your project's SQL editor
-- (Supabase dashboard → SQL Editor → New query → paste → Run).
--
-- ---------------------------------------------------------------------------
-- A HONEST NOTE ON SECURITY — PLEASE READ
-- ---------------------------------------------------------------------------
-- This is a single-user, low-sensitivity app, so access is scoped by a shared
-- secret (VITE_OWNER_KEY) rather than by real authentication.
--
-- Be clear-eyed about what that does and does not buy you:
--
--   * The anon key and the owner key both ship inside the JavaScript bundle.
--     Anyone who opens devtools on your deployed site can read both.
--   * RLS is enabled below, but the policies can only allow the anon role to
--     work with these two tables. A policy cannot verify a secret that the
--     client itself supplies — so owner_key is a FILTER that separates your
--     rows, not a PERMISSION BOUNDARY that protects them.
--   * Practical effect: someone who has your site URL could read or modify
--     these two tables. Nothing else in your project is exposed, because the
--     policies below grant nothing beyond them.
--
-- That is an acceptable trade for a personal habit tracker holding reading
-- notes. It would NOT be acceptable for anything private or valuable.
--
-- THE UPGRADE PATH, when you want real protection: turn on Supabase Auth
-- (magic link is enough for one user), add a `user_id uuid references
-- auth.users` column, and replace the policies below with
-- `using (auth.uid() = user_id)`. At that point the data is genuinely
-- protected per-user and the owner-key scheme can be dropped entirely. The
-- app's storage layer is the only code that would change.
-- ---------------------------------------------------------------------------

-- Daily tracker entries: one row per day, per owner.
create table if not exists daily_entries (
  date          text not null,
  owner_key     text not null,
  read          boolean     default false,
  input         boolean     default false,
  applied       boolean     default false,
  applied_where text        default '',
  updated_at    timestamptz default now(),
  primary key (date, owner_key)
);

-- Settings: one row per owner. Currently just the focus-track override.
create table if not exists settings (
  owner_key      text primary key,
  month_override int
);

-- Look-ups are always "everything for this owner".
create index if not exists daily_entries_owner_key_idx on daily_entries (owner_key);

alter table daily_entries enable row level security;
alter table settings      enable row level security;

-- Recreate policies idempotently so this file can be re-run safely.
drop policy if exists "anon can use daily_entries" on daily_entries;
drop policy if exists "anon can use settings"      on settings;

-- See the security note above: these scope the anon role to these two tables
-- and nothing else. They do not isolate one owner_key from another.
create policy "anon can use daily_entries"
  on daily_entries
  for all
  to anon
  using (true)
  with check (true);

create policy "anon can use settings"
  on settings
  for all
  to anon
  using (true)
  with check (true);
