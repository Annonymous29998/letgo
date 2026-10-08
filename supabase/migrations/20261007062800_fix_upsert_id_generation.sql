-- Fix ID generation to avoid gen_random_bytes search_path issues
create or replace function public.admin_upsert_customer(p_token uuid, p_payload jsonb)
returns public.bank_customers
language plpgsql
security definer
set search_path = public, extensions
as $$
declare
  row public.bank_customers%rowtype;
  cid text;
begin
  if not public.admin_session_valid(p_token) then
    raise exception 'Unauthorized';
  end if;

  cid := coalesce(nullif(p_payload->>'id', ''), replace(gen_random_uuid()::text, '-', ''));

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

grant execute on function public.admin_upsert_customer(uuid, jsonb) to anon, authenticated;
