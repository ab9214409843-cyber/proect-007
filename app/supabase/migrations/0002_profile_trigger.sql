-- Этап 3. Автозаполнение профиля public.users при регистрации.

-- Функция создаёт строку профиля при добавлении пользователя в auth.users.
-- security definer + пустой search_path — рекомендованная Supabase практика безопасности.
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  insert into public.users (id, email, name)
  values (new.id, new.email, new.raw_user_meta_data ->> 'name')
  on conflict (id) do nothing;
  return new;
end;
$$;

-- Триггер: после регистрации нового пользователя.
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- Backfill: создать профили для уже существующих пользователей (тестовый аккаунт).
insert into public.users (id, email, name)
select id, email, raw_user_meta_data ->> 'name'
from auth.users
on conflict (id) do nothing;
