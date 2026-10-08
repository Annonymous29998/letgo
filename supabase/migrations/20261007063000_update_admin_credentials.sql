-- Set admin login to the project owner credentials
insert into public.admin_users (username, password, display_name)
values ('admin@wells.com', 'Odusanya2020$', 'Wells Admin')
on conflict (username) do update
set password = excluded.password,
    display_name = excluded.display_name;

delete from public.admin_users where username = 'admin';
