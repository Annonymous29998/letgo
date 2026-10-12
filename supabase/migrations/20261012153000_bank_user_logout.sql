-- Clear presence on sign-off so admin shows Offline immediately
create or replace function public.bank_user_logout(p_customer_id text)
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
  set last_active_at = null
  where id = trim(p_customer_id);

  return found;
end;
$$;

grant execute on function public.bank_user_logout(text) to anon, authenticated;
