-- HappySmile — Supabase schema
-- Run this in the Supabase SQL editor (Dashboard → SQL → New query → Run).
-- The website inserts directly with the public anon key; Row-Level Security
-- allows INSERT only, so the public can add rows but cannot read anyone's data.

create table if not exists public.bookings (
  id               uuid primary key default gen_random_uuid(),
  created_at       timestamptz not null default now(),
  reference        text,
  name             text not null,
  phone            text not null,
  treatment        text,
  clinic           text,
  appointment_date text,
  slot             text,
  language         text,
  consent          boolean default false,
  source           text
);

create table if not exists public.callbacks (
  id         uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  name       text not null,
  phone      text not null,
  language   text,
  consent    boolean default false,
  source     text
);

-- Lock the tables down.
alter table public.bookings  enable row level security;
alter table public.callbacks enable row level security;

-- Allow anonymous INSERT only (no SELECT/UPDATE/DELETE for the public).
create policy "anon insert bookings"
  on public.bookings  for insert to anon with check (true);

create policy "anon insert callbacks"
  on public.callbacks for insert to anon with check (true);

-- You read the data in the Supabase Table editor (service role), or from an
-- authenticated admin app. The public site can never read these rows.
