-- Customer online presence: last login + last active heartbeat

alter table public.bank_customers
  add column if not exists last_login_at timestamptz,
  add column if not exists last_active_at timestamptz;

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

  update public.bank_customers
  set last_login_at = now(),
      last_active_at = now()
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
    'lastActiveAt', row.last_active_at
  );
end;
$$;

create or replace function public.bank_user_heartbeat(p_customer_id text)
returns boolean
language plpgsql
security definer
set search_path = public
as $$
begin
  if p_customer_id is null or trim(p_customer_id) = '' then
    return false;
  end if;

  update public.bank_customers
  set last_active_at = now()
  where id = trim(p_customer_id);

  return found;
end;
$$;

grant execute on function public.authenticate_bank_user(text, text) to anon, authenticated;
grant execute on function public.bank_user_heartbeat(text) to anon, authenticated;
