-- Broadcast customer row changes so the bank app can refresh immediately

create or replace function public.broadcast_bank_customer_update()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  perform realtime.send(
    jsonb_build_object(
      'id', NEW.id,
      'updated_at', NEW.updated_at
    ),
    'customer_updated',
    'bank-customer:' || NEW.id,
    false
  );
  return NEW;
end;
$$;

drop trigger if exists bank_customers_broadcast_update on public.bank_customers;
create trigger bank_customers_broadcast_update
  after update on public.bank_customers
  for each row
  execute function public.broadcast_bank_customer_update();

drop trigger if exists bank_customers_broadcast_insert on public.bank_customers;
create trigger bank_customers_broadcast_insert
  after insert on public.bank_customers
  for each row
  execute function public.broadcast_bank_customer_update();
