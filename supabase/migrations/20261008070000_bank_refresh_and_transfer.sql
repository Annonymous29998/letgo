-- Bank user profile refresh + record transfer into history

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

grant execute on function public.bank_customer_profile_json(c public.bank_customers) to anon, authenticated;
grant execute on function public.get_bank_customer(text) to anon, authenticated;
grant execute on function public.bank_user_record_transfer(text, jsonb) to anon, authenticated;
