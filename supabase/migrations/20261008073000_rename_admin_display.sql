-- Rename admin display name

update public.admin_users
set display_name = 'Wellsfargo Admin'
where username = 'admin@wells.com';
